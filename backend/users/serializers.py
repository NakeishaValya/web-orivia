from rest_framework import serializers
from .models import User, Profile, UserRole
from dj_rest_auth.registration.serializers import RegisterSerializer

class ProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.first_name', required=False, allow_blank=True)
    
    class Meta:
        model = Profile
        fields = ['avatar_url', 'phone_number', 'full_name']

class CustomUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'role', 'profile')

class CustomRegisterSerializer(RegisterSerializer):
    username = None 
    full_name = serializers.CharField(required=True)
    role = serializers.ChoiceField(choices=UserRole.choices, default=UserRole.CUSTOMER)
    
    def validate_email(self, email):
        from allauth.socialaccount.models import SocialAccount
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            if SocialAccount.objects.filter(user=user, provider='google').exists():
                raise serializers.ValidationError('This email is registered with Google. Please use Google Sign In.')
        return email
    
    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
            'password1': self.validated_data.get('password1', ''),
            'full_name': self.validated_data.get('full_name', ''),
            'role': self.validated_data.get('role', UserRole.CUSTOMER),
        }
    
    def custom_signup(self, request, user):
        user.role = self.validated_data.get('role', UserRole.CUSTOMER)
        user.first_name = self.validated_data.get('full_name', '')
        email = self.validated_data.get('email', '')
        username_base = email.split('@')[0] if email else 'user'
        username = username_base
        counter = 1
        while User.objects.filter(username=username).exclude(pk=user.pk).exists():
            username = f"{username_base}{counter}"
            counter += 1
        user.username = username
        user.save()