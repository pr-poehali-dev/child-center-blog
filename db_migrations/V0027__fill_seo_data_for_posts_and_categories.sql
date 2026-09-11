UPDATE t_p99892216_child_center_blog.blog_posts SET
  slug = 'adaptaciya',
  seo_title = 'Адаптация к садику без слёз: как она устроена в «Рыбке Долли» в Керчи',
  seo_description = 'Как проходит адаптация к садику в «Рыбке Долли» в Керчи: короткие дни, ритуалы и «якоря спокойствия». Опыт наших педагогов — без единой лишней слёзки.'
WHERE id = 65;

UPDATE t_p99892216_child_center_blog.blog_posts SET
  slug = 'ne-hochu-v-sadik',
  seo_title = '«Не хочу в садик!» Что отвечать и как помочь ребёнку — советы психолога',
  seo_description = 'Ребёнок отказывается идти в садик по утрам? Психолог объясняет причины и подсказывает слова, которые помогают. Три шага к спокойному утру всей семьи.'
WHERE id = 66;

UPDATE t_p99892216_child_center_blog.blog_posts SET
  slug = 'morkovnye-maffiny-bgbk',
  seo_title = 'Морковные маффины без сахара (БГБК): рецепт для детей с аллергией',
  seo_description = 'Рецепт морковных маффинов без глютена, казеина и лактозы: рисовая мука, банан и кокосовое масло. Пошагово, с КБЖУ — для детей с пищевыми особенностями.'
WHERE id = 67;

UPDATE t_p99892216_child_center_blog.blog_posts SET
  slug = 'rebenok-i-emocii',
  seo_title = '«Мама, я не хочу!» Как научить ребёнка справляться с эмоциями',
  seo_description = 'Как помочь ребёнку справляться с эмоциями: приёмы психолога при истериках, обидах и «не хочу». Простые шаги для родителей детей 2-7 лет.'
WHERE id = 54;

UPDATE t_p99892216_child_center_blog.blog_posts SET
  slug = 'schet-v-ume',
  seo_title = 'Как научить ребёнка считать в уме: пошаговая инструкция для родителей',
  seo_description = 'Пошаговая инструкция для родителей: учим ребёнка считать в уме — от счёта предметов до хитростей с десятками. Упражнения и игры для дошкольников и младших школьников.'
WHERE id = 50;

INSERT INTO t_p99892216_child_center_blog.category_stickers (category_id, sticker_text, description, updated_at)
VALUES ('yasli', '', 'Ясельная группа в Керчи для малышей от 1,5 до 3 лет: мягкая адаптация без слёз, мини-группы до 12 детей, четырёхразовое питание и внимательные няни. Здесь мы собираем статьи об адаптации, раннем развитии и жизни нашей самой младшей группы.', NOW())
ON CONFLICT (category_id) DO UPDATE SET description = EXCLUDED.description, updated_at = NOW();

INSERT INTO t_p99892216_child_center_blog.category_stickers (category_id, sticker_text, description, updated_at)
VALUES ('school', '', 'Подготовка к школе в Керчи для детей 4-7 лет: чтение по слогам, счёт, письмо и развитие речи в мини-группах. Статьи педагогов «Рыбки Долли» о том, как подготовить дошкольника к первому классу без стресса.', NOW())
ON CONFLICT (category_id) DO UPDATE SET description = EXCLUDED.description, updated_at = NOW();