import os
import sys
import django

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_feedback.settings')

# Setup Django
django.setup()

from django.contrib.auth.models import User

def create_superuser():
    """Create a superuser with proper admin privileges."""
    username = 'Ayush'
    email = 'ayush7@shooliniuniversity.com'
    password = 'ayush12344'
    
    try:
        # Check if user already exists
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'is_superuser': True,
                'is_staff': True,
                'is_active': True
            }
        )
        
        if created:
            # New user - set password and superuser flags
            user.set_password(password)
            user.is_superuser = True
            user.is_staff = True
            user.save()
            print(f"✅ Superuser '{username}' created successfully!")
            print(f"   Username: {username}")
            print(f"   Email: {email}")
            print(f"   Password: {password}")
        else:
            # Existing user - update to superuser
            user.set_password(password)
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.save()
            print(f"✅ Existing user '{username}' updated to superuser!")
            print(f"   Username: {username}")
            print(f"   Password updated to: {password}")
            
        return True
        
    except Exception as e:
        print(f"❌ Error creating/updating superuser: {e}")
        return False

if __name__ == "__main__":
    create_superuser()
