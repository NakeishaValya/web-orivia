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
    
    def post(self, request):
        code = request.data.get('code')
        
        if not code:
            return Response(
                {'error': 'Authorization code is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Exchange authorization code for access token
            token_url = 'https://oauth2.googleapis.com/token'
            token_data = {
                'code': code,
                'client_id': settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id'],
                'client_secret': settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['secret'],
                'redirect_uri': settings.GOOGLE_CALLBACK_URL,
                'grant_type': 'authorization_code',
            }
            
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


            if 'error' in token_json:
                self.logger.warning('Token exchange error: %s', token_json)
                return Response(
                    {'error': token_json.get('error_description', 'Failed to exchange code for token')},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get user info from Google
            access_token = token_json.get('access_token')
            userinfo_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
            headers = {'Authorization': f'Bearer {access_token}'}
            userinfo_response = http_requests.get(userinfo_url, headers=headers)
            try:
                userinfo = userinfo_response.json()
            except ValueError:
                self.logger.error('Userinfo endpoint returned non-JSON: %s', userinfo_response.text)
                return Response({'error': 'Failed to parse userinfo response'}, status=status.HTTP_400_BAD_REQUEST)
            
            email = userinfo.get('email')
            given_name = userinfo.get('given_name', '')
            family_name = userinfo.get('family_name', '')
            name = userinfo.get('name', f"{given_name} {family_name}".strip())
            google_id = userinfo.get('id', '')
            
            if not email:
                return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user exists
            try:
                user = User.objects.get(email=email)
                has_social = SocialAccount.objects.filter(user=user, provider='google').exists()
                
                if not has_social:
                    return Response({'error': 'Email already registered. Please use manual login.'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Existing Google user - log them in
                from rest_framework_simplejwt.tokens import RefreshToken
                refresh = RefreshToken.for_user(user)
                
                return Response({
                    'action': 'login',
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                    'user': {'id': str(user.id), 'email': user.email, 'role': user.role, 'full_name': user.first_name}
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                # New user - return Google data for role selection
                return Response({
                    'action': 'register',
                    'google_data': {'email': email, 'name': name, 'given_name': given_name, 'family_name': family_name, 'google_id': google_id, 'picture': userinfo.get('picture', '')}
                }, status=status.HTTP_200_OK)
            
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
            self.logger.exception('Exception during Google auth: %s', e)
            return Response({'error': f'Authentication failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


class GoogleRegisterComplete(APIView):
    """Step 2: Complete Google registration with role"""
    permission_classes = []
    authentication_classes = []
    logger = logging.getLogger(__name__)
    
    def post(self, request):
        google_data = request.data.get('google_data')
        role = request.data.get('role')
        
        if not google_data or not role:
            return Response({'error': 'Google data and role are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            email = google_data.get('email')
            name = google_data.get('name', '')
            google_id = google_data.get('google_id')
            
            if role not in [UserRole.CUSTOMER, UserRole.TRAVEL_AGENT]:
                return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(email=email).exists():
                return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate unique username
            username_base = email.split('@')[0] if email else google_id
            username = username_base
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{username_base}{counter}"
                counter += 1
            
            # Create user
            user = User.objects.create(username=username, email=email, first_name=name, role=role)
            
            # Create social account
            if google_id:
                SocialAccount.objects.create(user=user, provider='google', uid=google_id, extra_data=google_data)
            
            # Generate JWT token
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {'id': str(user.id), 'email': user.email, 'role': user.role, 'full_name': user.first_name}
            }, status=status.HTTP_201_CREATED)
            
            return response
            
        except ValidationError as e:
            logger.warning(f"Google OAuth login failed - Reason: Validation error")
            logger.debug(f"Google OAuth validation error details: {str(e.detail)}")
            raise
            
        except Exception as e:
            self.logger.exception('Exception during Google registration: %s', e)
            return Response({'error': f'Registration failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_profile(self, user):
        profile, _created = Profile.objects.get_or_create(user=user)
        return profile

    def get(self, request):
        profile = self._get_profile(request.user)
        serializer = ProfileDetailSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        profile = self._get_profile(request.user)
        serializer = ProfileUpdateSerializer(
            profile, data=request.data, partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            ProfileDetailSerializer(profile).data,
            status=status.HTTP_200_OK,
        )

    def put(self, request):
        profile = self._get_profile(request.user)
        serializer = ProfileUpdateSerializer(profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            ProfileDetailSerializer(profile).data,
            status=status.HTTP_200_OK,
        )
