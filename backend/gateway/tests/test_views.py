import pytest
from unittest.mock import patch, MagicMock
from django.core.cache import cache
from rest_framework.test import APIClient
from users.models import User
from django.test import override_settings
from rest_framework.throttling import UserRateThrottle

# 1. Setup Fixtures
@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user():
    return User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="password123",
        role="CUSTOMER"
    )

@pytest.fixture(autouse=True)
def clear_cache():
    """Ensure cache is empty before every test to prevent flaky tests."""
    cache.clear()
    yield
    cache.clear()

# 2. Mocking External Service Responses
@pytest.fixture
def mock_microservice_response():
    """Mocks the requests.request call to simulate a running microservice."""
    with patch('gateway.views.requests.request') as mock_req:
        # Default success response
        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.content = b'{"data": "fresh_data"}'
        mock_resp.headers = {'Content-Type': 'application/json'}
        mock_req.return_value = mock_resp
        yield mock_req

@pytest.mark.django_db
class TestGatewayCaching:
    
    def test_caching_happy_path(self, api_client, user, mock_microservice_response):
        """
        Scenario:
        1. User requests Trip List -> Cache MISS -> Forward to Service -> Cache SET.
        2. User requests Trip List again -> Cache HIT -> Return from Redis (No Service Call).
        """
        api_client.force_authenticate(user=user)
        url = '/api/opentrip/trips/' # Adjust based on your urls.py
        
        # Request 1: Should hit the microservice
        response1 = api_client.get(url)
        assert response1.status_code == 200
        assert response1.content == b'{"data": "fresh_data"}'
        assert mock_microservice_response.call_count == 1
        
        # Request 2: Should HIT THE CACHE (Microservice not called)
        response2 = api_client.get(url)
        assert response2.status_code == 200
        assert response2.content == b'{"data": "fresh_data"}'
        
        # CRITICAL ASSERTION: Call count should STILL be 1
        assert mock_microservice_response.call_count == 1

    def test_cache_key_differentiation(self, api_client, user, mock_microservice_response):
        """
        Scenario: Query parameters change the cache key.
        /trips?page=1 should NOT return cached data for /trips?page=2
        """
        api_client.force_authenticate(user=user)
        base_url = '/api/opentrip/trips/'
        
        # Request 1: Page 1
        api_client.get(f"{base_url}?page=1")
        assert mock_microservice_response.call_count == 1
        
        # Request 2: Page 2 (Should be treated as new request)
        api_client.get(f"{base_url}?page=2")
        assert mock_microservice_response.call_count == 2

    def test_do_not_cache_post_requests(self, api_client, user, mock_microservice_response):
        """
        Scenario: POST requests (Booking) should NEVER be cached.
        """
        api_client.force_authenticate(user=user)
        url = '/api/opentrip/bookings/'
        
        # Request 1: POST
        api_client.post(url, {"trip_id": 1})
        assert mock_microservice_response.call_count == 1
        
        # Request 2: POST again (Should hit service again)
        api_client.post(url, {"trip_id": 1})
        assert mock_microservice_response.call_count == 2

@pytest.mark.django_db
class TestGatewayRateLimiting:

    # override settings to make the limit very low for testing
    @override_settings(
            # real in-memory cache for testing
            CACHES={
            'default': {
                'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
                'LOCATION': 'gateway-throttle-test',
            }
        }
    )
    def test_rate_limiting_enforcement(self, api_client, user, mock_microservice_response):
        """
        Scenario: User exceeds 3 requests/minute and gets blocked (429)
        Uses DIFFERENT URLs for each request to avoid cache hits
        Ensure each request goes through the full flow including microservice call
        """
        # Ensure cache is clear before test
        cache.clear()

        api_client.force_authenticate(user=user)
        base_url = '/api/opentrip/trips/'

        with patch.object(UserRateThrottle, 'get_rate', return_value='3/m'):
            
            # Request 1 (Allowed) - Use unique query param to avoid cache
            resp = api_client.get(f'{base_url}?req=1')
            assert resp.status_code == 200

            # Request 2 (Allowed) - Different query param
            resp = api_client.get(f'{base_url}?req=2')
            assert resp.status_code == 200

            # Request 3 (Allowed) - Different query param
            resp = api_client.get(f'{base_url}?req=3')
            assert resp.status_code == 200

            # Request 4 (BLOCKED) - Different query param
            resp = api_client.get(f'{base_url}?req=4')
            assert resp.status_code == 429
            
            # Verify microservice was called 3 times (not for the throttled 4th request)
            assert mock_microservice_response.call_count == 3

    @override_settings(
        CACHES={
            'default': {
                'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
                'LOCATION': 'gateway-throttle-cache-test',
            }
        }
    )
    def test_rate_limiting_with_cache_hit(self, api_client, user, mock_microservice_response):
        """
        Scenario: Rate limiting still applies even when serving from cache
        This tests that cached responses ALSO count against the rate limit
        """
        cache.clear()

        api_client.force_authenticate(user=user)
        url = '/api/opentrip/trips/'  # Same URL for all requests

        with patch.object(UserRateThrottle, 'get_rate', return_value='3/m'):
            
            # Request 1 (Allowed, Cache MISS)
            resp = api_client.get(url)
            assert resp.status_code == 200
            assert mock_microservice_response.call_count == 1

            # Request 2 (Allowed, Cache HIT)
            resp = api_client.get(url)
            assert resp.status_code == 200
            assert mock_microservice_response.call_count == 1  # Still 1, from cache

            # Request 3 (Allowed, Cache HIT)
            resp = api_client.get(url)
            assert resp.status_code == 200
            assert mock_microservice_response.call_count == 1  # Still 1, from cache

            # Request 4 (BLOCKED, even though it would be cache hit)
            resp = api_client.get(url)
            assert resp.status_code == 429
            
            # Microservice was only called once (all others from cache or blocked)
            assert mock_microservice_response.call_count == 1