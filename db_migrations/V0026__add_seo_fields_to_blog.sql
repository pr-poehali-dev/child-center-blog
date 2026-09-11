ALTER TABLE t_p99892216_child_center_blog.blog_posts
  ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
  ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS seo_description VARCHAR(500) NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON t_p99892216_child_center_blog.blog_posts(slug);

ALTER TABLE t_p99892216_child_center_blog.category_stickers
  ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';