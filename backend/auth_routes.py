"""
OAuth Authentication Routes
Handles social login callbacks and user authentication
"""

from flask import Blueprint, redirect, url_for, session, request, jsonify
from oauth_config import get_user_info
import secrets

# Try to import database functions
try:
    from db_supabase import create_user, get_user_by_email, update_user_oauth
except ImportError:
    from db import create_user, get_user_by_email, update_user_oauth

# Initialize blueprint
auth_bp = Blueprint('auth', __name__)

# This will be set by init_auth_routes
oauth_instance = None

@auth_bp.route('/auth/<provider>/login')
def oauth_login(provider):
    """Initiate OAuth login flow"""
    if provider not in ['google', 'github', 'microsoft']:
        return jsonify({'error': 'Invalid provider'}), 400
    
    try:
        client = getattr(oauth_instance, provider)
        # Store frontend URL in session for redirect after auth
        session['auth_redirect'] = request.args.get('redirect', 'http://localhost:3000')
        redirect_uri = url_for('auth.oauth_callback', provider=provider, _external=True)
        return client.authorize_redirect(redirect_uri)
    except Exception as e:
        return jsonify({'error': f'OAuth initialization failed: {str(e)}'}), 500

@auth_bp.route('/auth/<provider>/callback')
def oauth_callback(provider):
    """Handle OAuth callback from provider"""
    if provider not in ['google', 'github', 'microsoft']:
        return jsonify({'error': 'Invalid provider'}), 400
    
    try:
        client = getattr(oauth_instance, provider)
        token = client.authorize_access_token()
        
        # Get user info from provider
        if provider == 'google':
            user_info = get_user_info(provider, token)
        elif provider == 'github':
            resp = client.get('user')
            github_user = resp.json()
            # Try to get email if not public
            if not github_user.get('email'):
                emails_resp = client.get('user/emails')
                emails = emails_resp.json()
                primary_email = next((e['email'] for e in emails if e['primary']), None)
                github_user['email'] = primary_email
            user_info = get_user_info(provider, github_user)
        elif provider == 'microsoft':
            resp = client.get('me')
            ms_user = resp.json()
            user_info = get_user_info(provider, ms_user)
        
        if not user_info or not user_info.get('email'):
            return redirect(f"{session.get('auth_redirect', 'http://localhost:3000')}?error=no_email")
        
        # Check if user exists
        existing_user = get_user_by_email(user_info['email'])
        
        if existing_user:
            # Update OAuth info if needed
            user_id = existing_user['id']
            update_user_oauth(user_id, provider, user_info['provider_id'])
        else:
            # Create new user
            user_id = create_user(
                name=user_info['name'],
                email=user_info['email'],
                password=None,  # OAuth users don't need password
                oauth_provider=provider,
                oauth_id=user_info['provider_id']
            )
        
        # Store user session
        session['user_id'] = user_id
        session['user_email'] = user_info['email']
        session['user_name'] = user_info['name']
        session['auth_provider'] = provider
        
        # Create auth token for frontend
        auth_token = secrets.token_urlsafe(32)
        session['auth_token'] = auth_token
        
        # Redirect to frontend with success
        frontend_url = session.get('auth_redirect', 'http://localhost:3000')
        return redirect(f"{frontend_url}?auth_success=true&token={auth_token}&name={user_info['name']}&email={user_info['email']}")
    
    except Exception as e:
        print(f"OAuth callback error: {str(e)}")
        frontend_url = session.get('auth_redirect', 'http://localhost:3000')
        return redirect(f"{frontend_url}?error=auth_failed&message={str(e)}")

@auth_bp.route('/auth/verify', methods=['POST'])
def verify_auth():
    """Verify authentication token from frontend"""
    data = request.json
    token = data.get('token')
    
    if not token or token != session.get('auth_token'):
        return jsonify({'error': 'Invalid or expired token'}), 401
    
    return jsonify({
        'user': {
            'id': session.get('user_id'),
            'name': session.get('user_name'),
            'email': session.get('user_email'),
            'provider': session.get('auth_provider')
        }
    })

@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'message': 'Logged out successfully'})

def init_auth_routes(app, oauth):
    """Initialize authentication routes with OAuth instance"""
    global oauth_instance
    oauth_instance = oauth
    return auth_bp
