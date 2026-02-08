import requests
import logging
from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

logger = logging.getLogger(__name__)

class GatewayProxyView(APIView):
    """
    Gateway Proxy View to forward requests to microservices
    """
    # Verify user identity via JWT
    permission_classes = [IsAuthenticated]

    def _proxy_request(self, request, service, path):
        """
        Helper method to proxy requests to microservices
        """
        # Determine target service
        if service == 'planner':
            base_url = settings.TRAVEL_PLANNER_URL
            # Map external 'planner' to internal 'perencanaan'
            internal_path = f"perencanaan/{path.lstrip('/')}"
        else:
            return HttpResponse("Service not found", status=404)

        # Construct target URL
        url = f"{base_url}/api/{internal_path}"
        
        # Log request details
        logger.info(f"Gateway proxying {request.method} to: {url}")
        logger.info(f"User ID: {request.user.id}, Role: {request.user.role}")
        
        # Forward the request
        try:
            # Forward headers, but strip security-sensitive ones
            excluded_headers = ['host', 'content-length', 'x-user-id', 'x-user-role']
            headers = {
                key: value for key, value in request.headers.items() 
                if key.lower() not in excluded_headers
            }
            
            # Always set user identity from authenticated server-side context
            headers['X-User-ID'] = str(request.user.id)
            headers['X-User-Role'] = request.user.role
            
            # Log headers being sent
            logger.info(f"Headers sent to microservice: X-User-ID={headers['X-User-ID']}, X-User-Role={headers['X-User-Role']}")
            
            # Explicitly set Content-Type if provided
            if request.content_type:
                headers['Content-Type'] = request.content_type

            response = requests.request(
                method=request.method,
                url=url,
                headers=headers,
                data=request.body,
                params=request.GET.dict(),
                timeout=10
            )

            # Log response
            logger.info(f"Microservice response status: {response.status_code}")
            logger.info(f"Response content: {response.text[:200]}...")  # First 200 chars

            # Return microservice response to frontend
            return HttpResponse(
                response.content,
                status=response.status_code,
                content_type=response.headers.get('Content-Type')
            )

        except requests.exceptions.RequestException as e:
            logger.error(f"Gateway Error: {str(e)}")
            return HttpResponse(f"Gateway Error: {str(e)}", status=503)

    def get(self, request, service, path='', *args, **kwargs):
        """Handle GET requests"""
        return self._proxy_request(request, service, path)

    def post(self, request, service, path='', *args, **kwargs):
        """Handle POST requests"""
        return self._proxy_request(request, service, path)

    def put(self, request, service, path='', *args, **kwargs):
        """Handle PUT requests"""
        return self._proxy_request(request, service, path)

    def patch(self, request, service, path='', *args, **kwargs):
        """Handle PATCH requests"""
        return self._proxy_request(request, service, path)

    def delete(self, request, service, path='', *args, **kwargs):
        """Handle DELETE requests"""
        return self._proxy_request(request, service, path)