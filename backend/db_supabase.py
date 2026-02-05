"""
Supabase PostgreSQL Database Module
Uses psycopg2 to connect to Supabase PostgreSQL
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import json

# Get connection string from environment
DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")

# Global connection test flag
_connection_tested = False
_connection_available = False


def test_connection():
    """Test if Supabase connection is available"""
    global _connection_tested, _connection_available
    
    if _connection_tested:
        return _connection_available
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.close()
        _connection_available = True
        _connection_tested = True
        return True
    except Exception as e:
        print(f"⚠ Supabase connection test failed: {e}")
        _connection_available = False
        _connection_tested = True
        return False


def get_connection():
    """Get database connection"""
    try:
        return psycopg2.connect(DATABASE_URL)
    except Exception as e:
        print(f"✗ Supabase connection failed: {e}")
        raise


def initialize_db():
    """Initialize database tables"""
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Add missing columns if they don't exist (for existing tables)
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255)")
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50)")
            cursor.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_id VARCHAR(255)")
        except Exception as e:
            # PostgreSQL versions before 9.6 don't support IF NOT EXISTS in ALTER TABLE
            # Try without IF NOT EXISTS
            try:
                cursor.execute("ALTER TABLE users ADD COLUMN name VARCHAR(255)")
            except:
                pass  # Column already exists
            try:
                cursor.execute("ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(50)")
            except:
                pass  # Column already exists
            try:
                cursor.execute("ALTER TABLE users ADD COLUMN oauth_id VARCHAR(255)")
            except:
                pass  # Column already exists
        
        # Create projects table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                constraints JSONB,
                designs JSONB,
                ml_data JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                guest BOOLEAN DEFAULT FALSE
            )
        """)
        
        # Create indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_projects_created ON projects(created_at DESC)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id)")
        
        conn.commit()
        print("✓ Supabase PostgreSQL connected and tables initialized")
        
    except Exception as e:
        conn.rollback()
        print(f"⚠ Database initialization warning: {e}")
    finally:
        cursor.close()
        conn.close()


def save_project(constraints, designs, ml_data=None, user_id=None):
    """Save a project to database"""
    import json
    
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO projects (user_id, constraints, designs, ml_data, guest)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (
            user_id,
            json.dumps(constraints),
            json.dumps(designs),
            json.dumps(ml_data or {}),
            user_id is None
        ))
        
        project_id = cursor.fetchone()[0]
        conn.commit()
        return str(project_id)
        
    except Exception as e:
        conn.rollback()
        print(f"Error saving project: {e}")
        raise
    finally:
        cursor.close()
        conn.close()


def list_projects(limit=50, user_id=None, guest=False):
    """List recent projects"""
    import json
    
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if guest:
            cursor.execute("""
                SELECT * FROM projects 
                WHERE guest = TRUE 
                ORDER BY created_at DESC 
                LIMIT %s
            """, (limit,))
        elif user_id:
            cursor.execute("""
                SELECT * FROM projects 
                WHERE user_id = %s 
                ORDER BY created_at DESC 
                LIMIT %s
            """, (user_id, limit))
        else:
            cursor.execute("""
                SELECT * FROM projects 
                ORDER BY created_at DESC 
                LIMIT %s
            """, (limit,))
        
        rows = cursor.fetchall()
        
        result = []
        for row in rows:
            project = dict(row)
            project['_id'] = project['id']
            # Parse JSON fields
            if isinstance(project['constraints'], str):
                project['constraints'] = json.loads(project['constraints'])
            if isinstance(project['designs'], str):
                project['designs'] = json.loads(project['designs'])
            if isinstance(project['ml_data'], str):
                project['ml_data'] = json.loads(project['ml_data'])
            result.append(project)
        
        return result
        
    finally:
        cursor.close()
        conn.close()


def get_project(project_id):
    """Get a specific project by ID"""
    import json
    
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute("SELECT * FROM projects WHERE id = %s", (project_id,))
        row = cursor.fetchone()
        
        if row:
            project = dict(row)
            project['_id'] = project['id']
            # Parse JSON fields
            if isinstance(project['constraints'], str):
                project['constraints'] = json.loads(project['constraints'])
            if isinstance(project['designs'], str):
                project['designs'] = json.loads(project['designs'])
            if isinstance(project['ml_data'], str):
                project['ml_data'] = json.loads(project['ml_data'])
            return project
        
        return None
        
    finally:
        cursor.close()
        conn.close()


def clear_projects(user_id=None, guest=False):
    """Clear project history"""
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        if guest:
            cursor.execute("DELETE FROM projects WHERE guest = TRUE")
        elif user_id:
            cursor.execute("DELETE FROM projects WHERE user_id = %s", (user_id,))
        else:
            cursor.execute("DELETE FROM projects")
        
        deleted_count = cursor.rowcount
        conn.commit()
        return deleted_count
        
    except Exception as e:
        conn.rollback()
        print(f"Error clearing projects: {e}")
        raise
    finally:
        cursor.close()
        conn.close()


def create_user(name, email, password=None, oauth_provider=None, oauth_id=None):
    """Create a new user with optional OAuth credentials"""
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute("""
            INSERT INTO users (name, username, password, oauth_provider, oauth_id)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, name, username as email
        """, (name, email, password, oauth_provider, oauth_id))
        
        user = dict(cursor.fetchone())
        conn.commit()
        return user
        
    except psycopg2.IntegrityError as e:
        conn.rollback()
        raise Exception("Email already exists")
    except Exception as e:
        conn.rollback()
        print(f"Error creating user: {e}")
        raise
    finally:
        cursor.close()
        conn.close()


def verify_user(email, password):
    """Verify user credentials"""
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute("""
            SELECT id, name, username as email FROM users 
            WHERE username = %s AND password = %s
        """, (email, password))
        
        user = cursor.fetchone()
        
        if user:
            return dict(user)
        
        return None
        
    finally:
        cursor.close()
        conn.close()


def get_user_by_email(email):
    """Get user by email"""
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute("""
            SELECT id, name, username as email, password, oauth_provider, oauth_id FROM users 
            WHERE username = %s
        """, (email,))
        
        user = cursor.fetchone()
        
        if user:
            return dict(user)
        
        return None
        
    finally:
        cursor.close()
        conn.close()


def update_user_oauth(user_id, provider, oauth_id):
    """Update user's OAuth information"""
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            UPDATE users
            SET oauth_provider = %s, oauth_id = %s
            WHERE id = %s
        """, (provider, oauth_id, user_id))
        
        conn.commit()
        
    finally:
        cursor.close()
        conn.close()
