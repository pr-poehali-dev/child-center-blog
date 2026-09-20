# Справочная таблица ссылок и якорей — сеть сайтов «Рыбка Долли»

Источник истины для кода: `src/content/links.ts`. Этот файл — читаемая версия для людей,
код обязан брать ссылки только из `links.ts`, а не дублировать их в компонентах.

## Константы (разделы сайтов сети)

| Раздел | Ссылка |
|---|---|
| Главная (дошколята) | https://ribkadollilend.ru/ |
| Экскурсия (модалка открывается по хэшу) | https://ribkadollilend.ru/#tour |
| Ясли | https://ribkadollilend.ru/yasli/ |
| 4-5 лет, фундамент | https://ribkadollilend.ru/podgotovka-k-shkole/#4-5 |
| 5-7 лет, предшкольная | https://ribkadollilend.ru/podgotovka-k-shkole/#5-7 |
| Английский, группа 2 класса | https://schooldolli.ru/#anglyaz |
| Продлёнка | https://schooldolli.ru/ |
| Летний клуб | https://dolliklub.ru/ |

## Живой раздел (блог, обновляется в день публикации)

| Материал | Ссылка |
|---|---|
| Статья «Диагностика готовности...» | https://blogribkadolli.ru/blog/diagnostika-gotovnosti-k-shkole |
| Статья «Не может усидеть пять минут...» | https://blogribkadolli.ru/blog/rebenok-ne-mozhet-usidet |
| Статья «Месяц аудирования...» (английский) | https://blogribkadolli.ru/blog/angliyskiy-vo-vtorom-klasse |
| Рубрика «Советы педагога» | https://blogribkadolli.ru/blog?category=tips |
| Рубрика «Наша жизнь на ладони» | https://blogribkadolli.ru/blog?category=life |
| Рубрика английского | https://blogribkadolli.ru/blog?category=english |
| Рубрика «Тарелка для всех» | https://blogribkadolli.ru/blog?category=plate |

Старые числовые адреса `/blog/69`, `/blog/70`, `/blog/71` настроены как настоящие серверные
редиректы 301 на новые slug-адреса (файл `public/_redirects`, правило хостинга — такое же, как
уже использовалось для других статей). Быстрые ссылки в Директе, где уже стоят `/blog/69` и т.п.,
можно не трогать — они сами уйдут на новый адрес с кодом 301; Ирина при желании поменяет их
на прямые slug-ссылки после публикации.

## Правила UTM

- **Мостики пикера** (виджет «Выберите направление» в блоге):
  `utm_source=blog&utm_medium=bridge&utm_content=<direction>`, якорь страницы — в самом конце
  ссылки (после UTM-параметров).
- **Ссылки внутри статей** (когда в тексте статьи стоит ссылка на страницу услуги):
  `utm_source=blog&utm_medium=article&utm_content=blog<id статьи>`, якорь — тоже в конце.
  Собираются функцией `withArticleUtm()` из `src/content/links.ts`.
- **Реклама (Яндекс.Директ):** `utm_source=yandex&utm_medium=cpc` со своими метками кампаний —
  задаёт Ирина в интерфейсе Директа, в коде проекта эти ссылки не хранятся.

## Ссылки мостика (BlogDirectionPicker) — как есть в коде

| Пункт | Ссылка | direction |
|---|---|---|
| Пробное занятие и экскурсия | `https://ribkadollilend.ru/?utm_source=blog&utm_medium=bridge&utm_content=tour#tour` | tour |
| Ясли | `https://ribkadollilend.ru/yasli/?utm_source=blog&utm_medium=bridge&utm_content=yasli` | yasli |
| 4-5 лет: Фундамент | `https://ribkadollilend.ru/podgotovka-k-shkole/?utm_source=blog&utm_medium=bridge&utm_content=foundation#4-5` | school |
| 5-7 лет: Предшкольная | `https://ribkadollilend.ru/podgotovka-k-shkole/?utm_source=blog&utm_medium=bridge&utm_content=school#5-7` | school |
| Английский: группа 2 класса | `https://schooldolli.ru/?utm_source=blog&utm_medium=bridge&utm_content=english#anglyaz` | english |
| Продлёнка | `https://schooldolli.ru/?utm_source=blog&utm_medium=bridge&utm_content=prodlenka` | prodlenka |
| Летний клуб | `https://dolliklub.ru/?utm_source=blog&utm_medium=bridge&utm_content=letniy` | letniy |

## Уточнения (пункт 3 задачи)

**а) Якорь продлёнки на schooldolli.ru.**
`#glavnaya` **не существует**. Решение Ирины: оставить в пикере ссылку на корень сайта без якоря
(`https://schooldolli.ru/?utm_source=blog&utm_medium=bridge&utm_content=prodlenka`), подразделы
`#utro` и `#dentekct` в пикер не выносим — весь сайт schooldolli.ru и так посвящён продлёнке.

**б) Параметр URL рубрики «Наша жизнь на ладони».**
Категория в базе называется `life`, параметр: `?category=life`.
Итоговая ссылка: `https://blogribkadolli.ru/blog?category=life`.

**в) Https у schooldolli.ru и dolliklub.ru.**
Оба домена **отдают https с валидным сертификатом** (проверил напрямую: `schooldolli.ru` —
сертификат действителен до 12.11.2026, `dolliklub.ru` — тоже отвечает по https). Файл переведён
на https для обоих доменов. Ссылка на английский `http://schooldolli.ru/#anglyaz` из задачи
заменена на `https://schooldolli.ru/?utm_source=blog&utm_medium=bridge&utm_content=english#anglyaz`.

## Реальные якоря schooldolli.ru (проверено напрямую по HTML, 20.09.2026)

Полный список секций сайта — пригодится при написании будущих статей и ссылок на schooldolli.ru:

| Якорь | Раздел |
|---|---|
| `#cena` | Цены |
| `#otzivi` | Отзывы |
| `#pedagog` | Педагоги |
| `#semeinoe` | Сопровождение семейного обучения |
| `#utro` | Утренняя продлёнка |
| `#dentekct` | Дневная продлёнка |
| `#anglyaz` | Группа английского языка |
| `#vopros` | Вопрос-ответ |
| `#contakts` | Контакты |

Якоря `#glavnaya` и любого «общего» раздела продлёнки на сайте нет — весь сайт посвящён продлёнке,
поэтому ссылка на продлёнку в пикере ведёт на корень без якоря (см. пункт «а» выше).

## Технические уточнения (важно для дальнейшей работы)

- **Редирект 301 настроен.** Старые числовые адреса `/blog/69`, `/blog/70`, `/blog/71`
  прописаны как правила `301` в `public/_redirects` (тот же механизм, что уже применялся для
  постов 50, 54, 65, 66, 67) — это настоящий серверный редирект с HTTP-статусом 301, не
  клиентский JS-переход.
- **Canonical и og:url** страницы статьи (`src/pages/useBlogPostData.ts`) уже строятся по формуле
  `d.post.slug || d.post.id` — как только у поста появляется slug, canonical и og:url
  автоматически начинают указывать на новый человеко-читаемый адрес. Отдельно ничего доделывать
  не пришлось, для трёх новых статей это уже так.
- **Sitemap.xml** генерируется динамически cloud-функцией `backend/sitemap/index.py` при каждом
  запросе (запрос к БД `SELECT id, created_at, slug ...`, использует `slug if slug else id`).
  Проверено вживую: `https://blogribkadolli.ru/sitemap.xml` уже отдаёт все три новых адреса
  (`/blog/diagnostika-gotovnosti-k-shkole`, `/blog/rebenok-ne-mozhet-usidet`,
  `/blog/angliyskiy-vo-vtorom-klasse`). Статический файл `public/sitemap.xml` в репозитории —
  не используется на проде (запрос уходит на cloud-функцию через правило в `_redirects`), его
  не обновлял, чтобы не создавать путаницу с двумя источниками.
- **Слаги трём статьям присвоены** через прямое обновление БД (миграция
  `db_migrations/V0030__set_slugs_for_posts_69_70_71.sql`):
  - id=69 → `diagnostika-gotovnosti-k-shkole`
  - id=70 → `rebenok-ne-mozhet-usidet`
  - id=71 → `angliyskiy-vo-vtorom-klasse`
- **Внутренняя перелинковка** в текстах статей проверена по всей таблице `blog_posts` (поля
  content, seo_description, checklist_url, media). Найдена и заменена одна ссылка: в статье
  id=70 упоминание статьи id=69 заменено на
  `https://blogribkadolli.ru/blog/diagnostika-gotovnosti-k-shkole?utm_source=blog&utm_medium=article&utm_content=blog70`
  (миграция `db_migrations/V0031__fix_internal_link_post70_to_slug.sql`). Других ссылок на
  `/blog/69`, `/blog/70`, `/blog/71` в текстах статей не найдено.