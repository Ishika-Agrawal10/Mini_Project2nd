"""
OAuth Configuration for Social Login Providers
Handles Google, GitHub, and Microsoft OAuth 2.0 flows
"""

import os
from authlib.integrations.flask_client import OAuth
from flask import session, url_for

# OAuth Configuration
OAUTH_CONFIG = {
    'google': {
        'client_id': os.getenv('GOOGLE_CLIENT_ID'),
        'client_secret': os.getenv('GOOGLE_CLIENT_SECRET'),
        'server_metadata_url': 'https://accounts.google.com/.well-known/openid-configuration',
        'client_kwargs': {
            'scope': 'openid email profile'
        }
    },
    'github': {
        'client_id': os.getenv('GITHUB_CLIENT_ID'),
        'client_secret': os.getenv('GITHUB_CLIENT_SECRET'),
        'authorize_url': 'https://github.com/login/oauth/authorize',
        'access_token_url': 'https://github.com/login/oauth/access_token',
        'api_base_url': 'https://api.github.com/',
        'client_kwargs': {
            'scope': 'user:email'
        }
    },
    'microsoft': {
        'client_id': os.getenv('MICROSOFT_CLIENT_ID'),
        'client_secret': os.getenv('MICROSOFT_CLIENT_SECRET'),
        'authorize_url': 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        'access_token_url': 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        'api_base_url': 'https://graph.microsoft.com/v1.0/',
        'client_kwargs': {
            'scope': 'openid email profile'
        }
    }
}

def init_oauth(app):
    """Initialize OAuth with Flask app"""
    oauth = OAuth(app)
    
    # Register Google
    if OAUTH_CONFIG['google']['client_id']:
        oauth.register(
            name='google',
            server_metadata_url=OAUTH_CONFIG['google']['server_metadata_url'],
            client_id=OAUTH_CONFIG['google']['client_id'],
            client_secret=OAUTH_CONFIG['google']['client_secret'],
            client_kwargs=OAUTH_CONFIG['google']['client_kwargs']
        )
    
    # Register GitHub
    if OAUTH_CONFIG['github']['client_id']:
        oauth.register(
            name='github',
            client_id=OAUTH_CONFIG['github']['client_id'],
            client_secret=OAUTH_CONFIG['github']['client_secret'],
            authorize_url=OAUTH_CONFIG['github']['authorize_url'],
            access_token_url=OAUTH_CONFIG['github']['access_token_url'],
            api_base_url=OAUTH_CONFIG['github']['api_base_url'],
            client_kwargs=OAUTH_CONFIG['github']['client_kwargs']
        )
    
    # Register Microsoft
    if OAUTH_CONFIG['microsoft']['client_id']:
        oauth.register(
            name='microsoft',
            client_id=OAUTH_CONFIG['microsoft']['client_id'],
            client_secret=OAUTH_CONFIG['microsoft']['client_secret'],
            authorize_url=OAUTH_CONFIG['microsoft']['authorize_url'],
            access_token_url=OAUTH_CONFIG['microsoft']['access_token_url'],
            api_base_url=OAUTH_CONFIG['microsoft']['api_base_url'],
            client_kwargs=OAUTH_CONFIG['microsoft']['client_kwargs']
        )
    
    return oauth

def get_user_info(provider, token):
    """Extract user information from OAuth provider response"""
    if provider == 'google':
        user_info = token.get('userinfo')
        return {
            'provider': 'google',
            'provider_id': user_info.get('sub'),
            'email': user_info.get('email'),
            'name': user_info.get('name'),
            'picture': user_info.get('picture')
        }
    
    elif provider == 'github':
        # GitHub requires separate API calls for email if not public
        return {
            'provider': 'github',
            'provider_id': str(token.get('id')),
            'email': token.get('email'),
            'name': token.get('name') or token.get('login'),
            'picture': token.get('avatar_url')
        }
    
    elif provider == 'microsoft':
        return {
            'provider': 'microsoft',
            'provider_id': token.get('id'),
            'email': token.get('mail') or token.get('userPrincipalName'),
            'name': token.get('displayName'),
            'picture': None  # Microsoft Graph API requires separate call
        }
    
    return None
