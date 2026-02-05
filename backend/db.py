"""
SQLite database helper for sustainable design projects.
"""

import sqlite3
import json
import hashlib
import secrets
from datetime import datetime
from typing import Any, Dict, List, Optional

DB_PATH = "database.db"


def _connect():
    return sqlite3.connect(DB_PATH)


def _ensure_column(conn, table: str, column: str, col_type: str):
    cur = conn.cursor()
    cur.execute(f"PRAGMA table_info({table})")
    columns = [row[1] for row in cur.fetchall()]
    if column not in columns:
        cur.execute(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}")
        conn.commit()


def _hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hash_bytes = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
    return f"{salt}${hash_bytes.hex()}"


def _verify_password(password: str, stored: str) -> bool:
    try:
        salt, hash_hex = stored.split("$")
        new_hash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000)
        return new_hash.hex() == hash_hex
    except Exception:
        return False


def initialize_db():
    with _connect() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password_hash TEXT,
                created_at TEXT
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                area INTEGER,
                budget INTEGER,
                climate TEXT,
                priority TEXT,
                designs_json TEXT,
                ml_json TEXT,
                created_at TEXT
            )
            """
        )
        _ensure_column(conn, "projects", "user_id", "INTEGER")
        conn.commit()


def save_project(constraints: Dict[str, Any], designs: List[Dict[str, Any]], ml_data: Optional[Dict[str, Any]] = None, user_id: Optional[int] = None) -> int:
    with _connect() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO projects (user_id, area, budget, climate, priority, designs_json, ml_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                constraints.get("area"),
                constraints.get("budget"),
                constraints.get("climate"),
                constraints.get("priority"),
                json.dumps(designs),
                json.dumps(ml_data or {}),
                datetime.now().isoformat(),
            ),
        )
        conn.commit()
        return cur.lastrowid


def list_projects(limit: int = 50, user_id: Optional[int] = None, guest: bool = False) -> List[Dict[str, Any]]:
    with _connect() as conn:
        cur = conn.cursor()
        if guest:
            cur.execute(
                """
                SELECT id, user_id, area, budget, climate, priority, created_at
                FROM projects
                WHERE user_id IS NULL
                ORDER BY id DESC
                LIMIT ?
                """,
                (limit,),
            )
        elif user_id is not None:
            cur.execute(
                """
                SELECT id, user_id, area, budget, climate, priority, created_at
                FROM projects
                WHERE user_id = ?
                ORDER BY id DESC
                LIMIT ?
                """,
                (user_id, limit),
            )
        else:
            cur.execute(
                """
                SELECT id, user_id, area, budget, climate, priority, created_at
                FROM projects
                ORDER BY id DESC
                LIMIT ?
                """,
                (limit,),
            )
        rows = cur.fetchall()
        return [
            {
                "id": r[0],
                "user_id": r[1],
                "area": r[2],
                "budget": r[3],
                "climate": r[4],
                "priority": r[5],
                "created_at": r[6],
            }
            for r in rows
        ]


def get_project(project_id: int) -> Optional[Dict[str, Any]]:
    with _connect() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, user_id, area, budget, climate, priority, designs_json, ml_json, created_at
            FROM projects
            WHERE id = ?
            """,
            (project_id,),
        )
        row = cur.fetchone()
        if not row:
            return None
        return {
            "id": row[0],
            "user_id": row[1],
            "area": row[2],
            "budget": row[3],
            "climate": row[4],
            "priority": row[5],
            "designs": json.loads(row[6] or "[]"),
            "ml": json.loads(row[7] or "{}"),
            "created_at": row[8],
        }


def clear_projects(user_id: Optional[int] = None, guest: bool = False) -> int:
    with _connect() as conn:
        cur = conn.cursor()
        if guest:
            cur.execute("DELETE FROM projects WHERE user_id IS NULL")
        elif user_id is None:
            cur.execute("DELETE FROM projects")
        else:
            cur.execute("DELETE FROM projects WHERE user_id = ?", (user_id,))
        conn.commit()
        return cur.rowcount


def create_user(name: str, email: str, password: str = None, oauth_provider: str = None, oauth_id: str = None) -> Dict[str, Any]:
    """Create a new user with optional OAuth credentials"""
    with _connect() as conn:
        cur = conn.cursor()
        # Add oauth columns if they don't exist (backward compatibility)
        try:
            cur.execute("ALTER TABLE users ADD COLUMN oauth_provider TEXT")
            cur.execute("ALTER TABLE users ADD COLUMN oauth_id TEXT")
        except:
            pass  # Columns already exist
        
        password_hash = _hash_password(password) if password else None
        cur.execute(
            """
            INSERT INTO users (name, email, password_hash, oauth_provider, oauth_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (name, email.lower(), password_hash, oauth_provider, oauth_id, datetime.now().isoformat()),
        )
        conn.commit()
        return {"id": cur.lastrowid, "name": name, "email": email.lower()}


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    with _connect() as conn:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, name, email, password_hash
            FROM users
            WHERE email = ?
            """,
            (email.lower(),),
        )
        row = cur.fetchone()
        if not row:
            return None
        return {"id": row[0], "name": row[1], "email": row[2], "password_hash": row[3]}


def verify_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    user = get_user_by_email(email)
    if not user:
        return None
    if _verify_password(password, user["password_hash"]):
        return {"id": user["id"], "name": user["name"], "email": user["email"]}
    return None


def update_user_oauth(user_id: int, provider: str, oauth_id: str) -> None:
    """Update user's OAuth information"""
    with _connect() as conn:
        cur = conn.cursor()
        # Add oauth columns if they don't exist (backward compatibility)
        try:
            cur.execute("ALTER TABLE users ADD COLUMN oauth_provider TEXT")
            cur.execute("ALTER TABLE users ADD COLUMN oauth_id TEXT")
        except:
            pass  # Columns already exist
        
        cur.execute(
            """
            UPDATE users
            SET oauth_provider = ?, oauth_id = ?
            WHERE id = ?
            """,
            (provider, oauth_id, user_id),
        )
        conn.commit()
