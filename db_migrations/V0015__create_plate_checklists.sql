CREATE TABLE IF NOT EXISTS plate_checklists (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    pdf_url TEXT NOT NULL,
    cover_emoji VARCHAR(10) DEFAULT '🥗',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);