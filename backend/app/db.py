from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./retailflow.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def _column_exists(conn, table_name: str, column_name: str) -> bool:
    rows = conn.execute(text(f"PRAGMA table_info({table_name})")).fetchall()
    return any(r[1] == column_name for r in rows)  # r[1] = column name


def init_db():
    # import models here so Base knows them before create_all
    from . import models  # noqa: F401

    # 1) Create any missing tables (e.g., inventory_stock)
    Base.metadata.create_all(bind=engine)

    # 2) Lightweight migration: add min_stock_level to item_master if missing
    with engine.begin() as conn:
        # Ensure item_master exists before checking columns
        table_exists = conn.execute(
            text(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='item_master'"
            )
        ).fetchone()

        if table_exists and not _column_exists(conn, "item_master", "min_stock_level"):
            conn.execute(
                text(
                    "ALTER TABLE item_master ADD COLUMN min_stock_level INTEGER DEFAULT 10"
                )
            )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
