from app.models import User
from app.extensions import db

def create_admin(email: str, password: str, photo_url: str = None):
    """Create an admin user if it doesn't exist"""
    admin = User(
        email=email,
        role="admin",
        photo_url=photo_url
    )
    admin.set_password(password)
    db.session.add(admin)
    db.session.commit()
    print(f"Admin user created: {email}")