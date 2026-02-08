import logging
import hashlib
from django.db import IntegrityError
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView, RegisterView
from dj_rest_auth.views import LoginView, LogoutView
from django.conf import settings
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger('users')


def mask_email(email):
    """
    Mask email address for logging purposes.
    Example: john.doe@example.com -> j*****e@e*****e.com
    """
    if not email or email == 'unknown':
        return email
    
    try:
        local, domain = email.split('@')
        # Mask local part
        if len(local) > 2:
            masked_local = local[0] + '*' * (len(local) - 2) + local[-1]
        elif len(local) == 2:
            masked_local = local[0] + '*'
        else:
            masked_local = local[0] + '*'
        
        # Mask domain
        domain_parts = domain.split('.')
        if len(domain_parts[0]) > 2:
            masked_domain = domain_parts[0][0] + '*' * (len(domain_parts[0]) - 2) + domain_parts[0][-1]
        elif len(domain_parts[0]) == 2:
            masked_domain = domain_parts[0][0] + '*'
        else:
            masked_domain = domain_parts[0][0] + '*'
        
        return f"{masked_local}@{masked_domain}.{'.'.join(domain_parts[1:])}"
    except Exception:
        return "***@***.***"


def hash_email(email):
    """
    Create a SHA256 hash of email for correlation in logs without exposing PII.
    """
    if not email or email == 'unknown':
        return email
    return hashlib.sha256(email.encode()).hexdigest()[:16]


class CustomLoginView(LoginView):
    """Custom login view with logging and proper HTTP status codes"""
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email', 'unknown')
        masked_email = mask_email(email)
        email_hash = hash_email(email)
        
        logger.info(f"Login attempt - User hash: {email_hash}")
        
        try:
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                # Extract email from response data
                user_email = response.data.get('user', {}).get('email', email)
                user_hash = hash_email(user_email)
                logger.info(f"Login successful - User hash: {user_hash}")
                logger.debug(f"Login successful for user: {mask_email(user_email)}")
            else:
                logger.warning(f"Login failed - User hash: {email_hash}, Status: {response.status_code}")
            
            return response
            
        except ValidationError as e:
            # Handle authentication failures - convert to 401 Unauthorized
            logger.warning(f"Login failed - User hash: {email_hash}, Reason: Invalid credentials")
            logger.debug(f"Login validation error details: {str(e.detail)}")
            
            # Check if it's an authentication error
            error_detail = e.detail
            if isinstance(error_detail, dict) and 'non_field_errors' in error_detail:
                # This is an authentication failure, return 401 with user-friendly message
                return Response(
                    {
                        'detail': 'Invalid email or password. Please check your credentials and try again',
                        'code': 'invalid_credentials'
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # For other validation errors (e.g., missing fields), return 400
            raise
            
        except Exception as e:
            logger.error(f"Login exception - User hash: {email_hash}, Error: {str(e)}", exc_info=True)
            raise


class CustomRegisterView(RegisterView):
    """Custom registration view with logging"""
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email', 'unknown')
        role = request.data.get('role', 'unknown')
        email_hash = hash_email(email)
        
        logger.info(f"Registration attempt - User hash: {email_hash}, Role: {role}")
        
        try:
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 201:
                user_email = response.data.get('user', {}).get('email', email)
                user_hash = hash_email(user_email)
                logger.info(f"Registration successful - User hash: {user_hash}, Role: {role}")
                logger.debug(f"Registration successful for user: {mask_email(user_email)}, Role: {role}")
            else:
                logger.warning(f"Registration failed - User hash: {email_hash}, Status: {response.status_code}")
            
            return response
            
        except IntegrityError as e:
            # Handle duplicate email (database constraint violation)
            logger.warning(f"Registration failed - User hash: {email_hash}, Reason: Duplicate email")
            logger.debug(f"IntegrityError details: {str(e)}")
            
            return Response(
                {
                    'detail': 'An account with this email address already exists. Please login or use a different email.',
                    'code': 'email_already_exists'
                },
                status=status.HTTP_409_CONFLICT
            )
            
        except ValidationError as e:
            # Handle registration validation errors
            logger.warning(f"Registration failed - User hash: {email_hash}, Reason: Validation error")
            logger.debug(f"Registration validation error details: {str(e.detail)}")
            raise
            
        except Exception as e:
            logger.error(f"Registration exception - User hash: {email_hash}, Error: {str(e)}", exc_info=True)
            raise


class CustomLogoutView(LogoutView):
    """Custom logout view with logging"""
    
    def post(self, request, *args, **kwargs):
        user_email = 'unknown'
        if hasattr(request, 'user') and request.user.is_authenticated:
            user_email = getattr(request.user, 'email', 'unknown')
        
        user_hash = hash_email(user_email)
        logger.info(f"Logout attempt - User hash: {user_hash}")
        
        try:
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                logger.info(f"Logout successful - User hash: {user_hash}")
                logger.debug(f"Logout successful for user: {mask_email(user_email)}")
            else:
                logger.warning(f"Logout failed - User hash: {user_hash}, Status: {response.status_code}")
            
            return response
        except Exception as e:
            logger.error(f"Logout exception - User hash: {user_hash}, Error: {str(e)}", exc_info=True)
            raise


class GoogleLogin(SocialLoginView):
    """Google OAuth login with logging"""
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_CALLBACK_URL
    client_class = OAuth2Client
    
    def post(self, request, *args, **kwargs):
        logger.info("Google OAuth login attempt")
        
        try:
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                user_email = 'unknown'
                if hasattr(response, 'data'):
                    user_email = response.data.get('user', {}).get('email', 'unknown')
                
                user_hash = hash_email(user_email)
                logger.info(f"Google OAuth login successful - User hash: {user_hash}")
                logger.debug(f"Google OAuth login successful for user: {mask_email(user_email)}")
            else:
                logger.warning(f"Google OAuth login failed - Status: {response.status_code}")
            
            return response
            
        except ValidationError as e:
            logger.warning(f"Google OAuth login failed - Reason: Validation error")
            logger.debug(f"Google OAuth validation error details: {str(e.detail)}")
            raise
            
        except Exception as e:
            logger.error(f"Google OAuth login exception - Error: {str(e)}", exc_info=True)
            raise