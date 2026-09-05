ALTER TABLE t_p99892216_child_center_blog.blog_posts
  ADD COLUMN recipe_time text NOT NULL DEFAULT '',
  ADD COLUMN recipe_servings text NOT NULL DEFAULT '',
  ADD COLUMN recipe_calories text NOT NULL DEFAULT '',
  ADD COLUMN recipe_proteins text NOT NULL DEFAULT '',
  ADD COLUMN recipe_fats text NOT NULL DEFAULT '',
  ADD COLUMN recipe_carbs text NOT NULL DEFAULT '',
  ADD COLUMN recipe_ingredients text NOT NULL DEFAULT '',
  ADD COLUMN recipe_steps text NOT NULL DEFAULT '';