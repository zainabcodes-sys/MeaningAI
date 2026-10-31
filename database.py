
import sqlite3
import json

DATABASE = "meaningai.db"


def init_db():
    with sqlite3.connect(DATABASE) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS analysis_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sentence TEXT NOT NULL,
                intent TEXT NOT NULL,
                entities TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)


def save_analysis(result):
    with sqlite3.connect(DATABASE) as conn:
        conn.execute("""
            INSERT INTO analysis_history
            (sentence, intent, entities)
            VALUES (?, ?, ?)
        """, (
            result["sentence"],
            result["intent"],
            json.dumps(result["entities"])
        ))


def get_history():
    with sqlite3.connect(DATABASE) as conn:
        conn.row_factory = sqlite3.Row

        rows = conn.execute("""
            SELECT * FROM analysis_history
            ORDER BY id DESC
            LIMIT 20
        """).fetchall()

    return [
        {
            "id": row["id"],
            "sentence": row["sentence"],
            "intent": row["intent"],
            "entities": json.loads(row["entities"]),
            "created_at": row["created_at"]
        }
        for row in rows
    ]
