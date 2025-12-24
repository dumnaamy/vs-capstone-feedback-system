#!/usr/bin/env python
"""
Script to fix admin user permissions by ensuring they have is_staff=True
"""

import os
import sys
import django

# Add the project directory to the Python path
sys.path.insert(0, os.path.abspath('.'))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_feedback.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def fix_admin_permissions():
    """Ensure admin users have is_staff=True"""
    print("🔧 Fixing admin user permissions...")
    
    # Get all superusers
    superusers = User.objects.filter(is_superuser=True)
    
    if not superusers.exists():
        print("❌ No superusers found. Please create a superuser first.")
        print("Run: python manage.py createsuperuser")
        return
    
    print(f"Found {superusers.count()} superuser(s):")
    
    updated_count = 0
    for user in superusers:
        print(f"  - {user.username} (is_staff: {user.is_staff}, is_superuser: {user.is_superuser})")
        
        if not user.is_staff:
            user.is_staff = True
            user.save()
            updated_count += 1
            print(f"    ✅ Updated {user.username} to have is_staff=True")
    
    if updated_count == 0:
        print("✅ All superusers already have is_staff=True")
    else:
        print(f"✅ Updated {updated_count} user(s) with is_staff=True")
    
    # Also check for any users with admin in username
    admin_users = User.objects.filter(username__icontains='admin')
    for user in admin_users:
        if not user.is_staff and not user.is_superuser:
            print(f"  - Found potential admin user: {user.username} (is_staff: {user.is_staff})")
            user.is_staff = True
            user.save()
            print(f"    ✅ Updated {user.username} to have is_staff=True")

if __name__ == "__main__":
    fix_admin_permissions()
