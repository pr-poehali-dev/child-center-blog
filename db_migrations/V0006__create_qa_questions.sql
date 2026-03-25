CREATE TABLE t_p99892216_child_center_blog.qa_questions (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    author_name VARCHAR(200),
    is_anonymous BOOLEAN DEFAULT FALSE,
    answer TEXT,
    answered_at TIMESTAMP,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    rating_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);