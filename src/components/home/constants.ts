export const MAX_LINK = "https://max.ru/u/f9LHodD0cOIKcG0itfDWIZMQp22OCCCC7iCwIUARylW6FIn7W2H3IZ-imyY";

export const NAV_LINKS = [
  { label: "Главная", id: "home" },
  { label: "О центре", id: "team" },
  { label: "Блог", id: "blog-link" },
  { label: "Команда", id: "team" },
  { label: "Отзывы", id: "reviews" },
  { label: "Контакты", id: "contacts-link" },
];

export interface TeamPerson {
  name: string;
  role: string;
}

export interface TeamCard {
  photo: string;
  people: TeamPerson[];
  desc: string;
}

export const TEAM: TeamCard[] = [
  {
    photo: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/14551404-08d8-4dc2-b5ec-7be906d1b84b.png",
    people: [{ name: "Ирина Павловна", role: "управляющая центром" }],
    desc: "Начинала воспитателем — теперь ведёт весь центр",
  },
  {
    photo: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/817a5fe5-63d6-4f4a-b833-d301f6714a53.png",
    people: [
      { name: "Ирина Васильевна", role: "воспитатель" },
      { name: "Марина Анатольевна", role: "няня" },
    ],
    desc: "Две, с которыми малышу не страшно ничего",
  },
  {
    photo: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/751c35c5-bbe1-46e0-9c7c-110026e0a378.png",
    people: [{ name: "Наталья Петровна", role: "педагог продлёнки и английский" }],
    desc: "Превращает занятия в игру, а игру — в английский",
  },
  {
    photo: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/8000ca8a-f15f-42e5-b15b-d9b5ada35511.png",
    people: [{ name: "Светлана Владимировна", role: "воспитатель старшей группы" }],
    desc: "Готовит к школе без давления — через игру и ласку",
  },
  {
    photo: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/fb433919-1b6b-429a-8451-8defe84fe904.png",
    people: [{ name: "Виктория Анатольевна", role: "логопед" }],
    desc: "Ставит непослушные звуки на место — мягко и через игру",
  },
];

export const REVIEWS = [
  { name: "Ольга М.", text: "Наш сын ходит уже год — просто расцвёл! Педагоги внимательные, атмосфера тёплая. Рекомендую всем!", stars: 5, child: "Сын, 5 лет", color: "bg-rose-50" },
  { name: "Сергей и Ирина Н.", text: "Дочка каждое утро бежит в центр сама — это лучший показатель. Статьи в блоге очень помогают.", stars: 5, child: "Дочь, 4 года", color: "bg-amber-50" },
  { name: "Татьяна К.", text: "Записались через сайт — очень удобно! Первое занятие пробное и бесплатное. Остались навсегда 😊", stars: 5, child: "Сын, 6 лет", color: "bg-violet-50" },
];