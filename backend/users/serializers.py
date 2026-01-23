from rest_framework import serializers
from .models import User, Profile
from dj_rest_auth.registration.serializers import RegisterSerializer

class ProfileSerializer(serializers.ModelSerializer):
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
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='customer')
    
    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
            'password1': self.validated_data.get('password1', ''),
            'full_name': self.validated_data.get('full_name', ''),
            'role': self.validated_data.get('role', 'customer'),
        }
    
    def save(self, request):
        user = super().save(request)
        user.role = self.validated_data.get('role', 'customer')
        user.profile.full_name = self.validated_data.get('full_name', '')
        user.save()
        user.profile.save()
        return user