import requests
from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from django.core.cache import cache

class GatewayProxyView(APIView):
    """
    Gateway Proxy View to forward requests to microservices
    """
    # Verify user identity via JWT
    permission_classes = [IsAuthenticated]

    # Rate limit per user
    throttle_classes = [UserRateThrottle]

    def dispatch(self, request, *args, **kwargs):
        # Trigger DRF's Auth & Permission checks
        try:
            self.initial(request, *args, **kwargs)
        except Exception as exc:
            return self.handle_exception(exc)

        # Determine target service
        service_name = kwargs.get('service')
        path = kwargs.get('path')

        # Cache Key
        # If User A and User B see the same trip list, serve the same cached response to both
        cache_key = f"gateway:{service_name}:{path}:{request.META['QUERY_STRING']}"
        
        # Only cache safe GET requests
        should_cache = (request.method == 'GET' and service_name == 'opentrip')

        if should_cache:
            cached_response = cache.get(cache_key)
            if cached_response:
                return HttpResponse(
                    cached_response['content'],
                    status=cached_response['status'],
                    content_type=cached_response['content_type']
                )
        
        if service_name == 'planner':
            base_url = settings.TRAVEL_PLANNER_URL
        elif service_name == 'opentrip':
            base_url = settings.OPEN_TRIP_URL
        else:
            return HttpResponse("Service not found", status=404)

        # Construct target URL
        # Strip the leading slash from path to avoid double slashes
        target_url = f"{base_url}/{path.lstrip('/')}"
        
        # Forward the request
        try:
            # Forward JWT Authorization header
            headers = {key: value for key, value in request.headers.items() 
                      if key.lower() not in ['host', 'content-length']}
            
            # Explicitly set Content-Type if provided
            if request.content_type:
                headers['Content-Type'] = request.content_type

            response = requests.request(
                method=request.method,
                url=target_url,
                headers=headers,
                data=request.body,
                params=request.GET,
                timeout=10
            )

            if should_cache and response.status_code == 200:
                cache_data = {
                    'content': response.content,
                    'status': response.status_code,
                    'content_type': response.headers.get('Content-Type')
                }
                cache.set(cache_key, cache_data, timeout=60) # 60s cache

            # Return microservice response to frontend
            return HttpResponse(
                response.content,
                status=response.status_code,
                content_type=response.headers.get('Content-Type')
            )

        except requests.exceptions.RequestException as e:
            # Handle connection errors (Service Down)
            return HttpResponse(f"Gateway Error: {str(e)}", status=503)