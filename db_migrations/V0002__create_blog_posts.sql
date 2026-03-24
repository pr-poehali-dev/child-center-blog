CREATE TABLE t_p99892216_child_center_blog.blog_posts (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  media JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_category ON t_p99892216_child_center_blog.blog_posts(category);
CREATE INDEX idx_blog_posts_created_at ON t_p99892216_child_center_blog.blog_posts(created_at DESC);
