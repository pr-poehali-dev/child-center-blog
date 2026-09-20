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

Старые числовые адреса `/blog/69`, `/blog/70`, `/blog/71` по-прежнему открывают те же статьи
(поиск по БД работает и по id, и по slug) — при заходе по числовому id страница сама переписывает
адрес в браузере на человеко-читаемый slug (client-side, без HTTP 301 — см. раздел «Технические
уточнения» ниже). Быстрые ссылки в Директе, где уже стоят `/blog/69` и т.п., Ирина обновит
на новые slug-адреса сама после публикации.

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
`#glavnaya` **не существует** — я проверил HTML-код страницы напрямую. На сайте есть только
такие якоря: `#cena` (Цены), `#otzivi` (Отзывы), `#pedagog` (Педагоги), `#semeinoe`
(Сопровождение семейного обучения), `#utro` (Утренняя продленка), `#dentekct` (Дневная продленка),
`#anglyaz` (Группа английского языка), `#vopros` (Вопрос-ответ), `#contakts` (Контакты).
Отдельного «главного» якоря нет — сам сайт целиком посвящён продлёнке (заголовок H1: «Группа
продленного дня»), поэтому в ссылке на продлёнку якорь не нужен, ссылка ведёт на корень сайта.
Если Ирина имела в виду конкретный подраздел (утреннюю или дневную продлёнку) — точный якорь
`#utro` или `#dentekct`, скажите какой нужен, поправлю.

**б) Параметр URL рубрики «Наша жизнь на ладони».**
Категория в базе называется `life`, параметр: `?category=life`.
Итоговая ссылка: `https://blogribkadolli.ru/blog?category=life`.

**в) Https у schooldolli.ru и dolliklub.ru.**
Оба домена **отдают https с валидным сертификатом** (проверил напрямую: `schooldolli.ru` —
сертификат действителен до 12.11.2026, `dolliklub.ru` — тоже отвечает по https). Файл переведён
на https для обоих доменов. Ссылка на английский `http://schooldolli.ru/#anglyaz` из задачи
заменена на `https://schooldolli.ru/?utm_source=blog&utm_medium=bridge&utm_content=english#anglyaz`.

## Технические уточнения (важно для дальнейшей работы)

- **Реальный 301-редирект не настроен.** У платформы нет механизма серверных 301 для SPA-роутов.
  Вместо него уже был (и остался) client-side редирект: если статья открыта по числовому id,
  а у поста уже есть slug — адрес в браузере переписывается на `/blog/<slug>` через
  `history.replaceState` (без полной перезагрузки, без HTTP-статуса 301). Для пользователей и
  для перехода по старым ссылкам это работает так же надёжно, но поисковики видят его не как
  классический 301 — статья доступна по обоим адресам, старый URL не выдаёт ошибку.
- **Слаги трём статьям присвоены** через прямое обновление БД (миграция
  `db_migrations/V0030__set_slugs_for_posts_69_70_71.sql`):
  - id=69 → `diagnostika-gotovnosti-k-shkole`
  - id=70 → `rebenok-ne-mozhet-usidet`
  - id=71 → `angliyskiy-vo-vtorom-klasse`
