import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#fffdf8] font-nunito">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-orange-500 font-bold mb-8 hover:text-orange-600 transition-colors">
          <Icon name="ArrowLeft" size={16} />
          На главную
        </Link>

        <h1 className="font-black text-3xl text-gray-800 mb-2">Политика конфиденциальности</h1>
        <p className="text-gray-400 text-sm mb-10">Последнее обновление: 3 мая 2026 г.</p>

        <div className="prose prose-sm max-w-none space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="font-black text-xl text-gray-800 mb-3">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности (далее — «Политика») регулирует порядок обработки
              персональных данных пользователей сайта <strong>blogribkadolli.ru</strong> (далее — «Сайт»),
              принадлежащего индивидуальному предпринимателю <strong>Савченко Ирине Игоревне</strong>,
              ИНН <strong>911116164829</strong> (далее — «Оператор»).
            </p>
            <p className="mt-3">
              Используя Сайт и заполняя формы, вы выражаете согласие с настоящей Политикой и условиями
              обработки ваших персональных данных. Если вы не согласны с Политикой — пожалуйста,
              не используйте Сайт.
            </p>
          </section>

          <section>
            <h2 className="font-black text-xl text-gray-800 mb-3">2. Оператор персональных данных</h2>
            <ul className="space-y-1">
              <li><strong>Наименование:</strong> ИП Савченко Ирина Игоревна</li>
              <li><strong>ИНН:</strong> 911116164829</li>
              <li><strong>Сайт:</strong> blogribkadolli.ru</li>
            </ul>
          </section>

          <section>
            <h2 className="font-black text-xl text-gray-800 mb-3">3. Какие данные мы собираем</h2>
            <p>При использовании форм на Сайте мы можем собирать следующие данные:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li>Имя (родителя или ребёнка)</li>
              <li>Номер телефона</li>
              <li>Адрес электронной почты</li>
              <li>Информация о ребёнке (имя, возраст)</li>
              <li>Отзывы и комментарии, которые вы оставляете добровольно</li>
            </ul>
          </section>

          <section>
            <h2 className="font-black text-xl text-gray-800 mb-3">4. Цели обработки данных</h2>
            <p>Ваши данные используются исключительно для:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li>Записи на занятия и консультации в детском центре «Рыбка Долли»</li>
              <li>Обратной связи по вашей заявке (звонок или сообщение)</li>
              <li>Отправки новостей и статей блога на указанный email (только при подписке)</li>
              <li>Публикации отзывов на Сайте (только с вашего явного согласия)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-black text-xl text-gray-800 mb-3">5. Правовое основание</h2>
            <p>
              Обработка персональных данных осуществляется на основании Федерального закона
              от 27.07.2006 № 152-ФЗ «О персональных данных». Основание для обработки —
              ваше добровольное согласие, выраженное при заполнении форм на Сайте.
            </p>
          </section>

          <section>
            <h2 className="font-black text-xl text-gray-800 mb-3">6. Хранение и защита данных</h2>
            <p>
              Мы принимаем организационные и технические меры для защиты ваших данных от
              несанкционированного доступа, изменения, раскрытия или уничтожения.
              Данные хранятся на серверах, расположенных на территории Российской Федерации.
            </p>
            <p className="mt-3">
              Данные хранятся не дольше, чем это необходимо для достижения целей обработки,
              либо до момента отзыва вашего согласия.
            </p>
          </section>

          <section>
            <h2 className="font-black text-xl text-gray-800 mb-3">7. Передача данных третьим лицам</h2>
            <p>
              Мы не продаём и не передаём ваши персональные данные третьим лицам без вашего согласия,
              за исключением случаев, предусмотренных законодательством РФ.
            </p>
          </section>

          <section>
            <h2 className="font-black text-xl text-gray-800 mb-3">8. Файлы cookie</h2>
            <p>
              Сайт использует файлы cookie — небольшие текстовые файлы, сохраняемые в вашем браузере.
              Они помогают нам улучшать работу Сайта и анализировать посещаемость.
            </p>
            <p className="mt-3">Мы используем следующие виды cookie:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>
                <strong>Технические (обязательные)</strong> — необходимы для работы Сайта
                (например, сохранение сессии администратора). Без них Сайт не функционирует корректно.
              </li>
              <li>
                <strong>Аналитические</strong> — используются сервисом Яндекс.Метрика для анализа
                посещаемости и поведения пользователей в анонимизированном виде.
              </li>
            </ul>
            <p className="mt-3">
              Вы можете отключить cookie в настройках браузера, однако это может повлиять на
              работу некоторых функций Сайта.
            </p>
          </section>

          <section>
            <h2 className="font-black text-xl text-gray-800 mb-3">9. Ваши права</h2>
            <p>В соответствии с законодательством РФ вы вправе:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li>Получить информацию об обработке ваших персональных данных</li>
              <li>Требовать уточнения, блокирования или уничтожения ваших данных</li>
              <li>Отозвать своё согласие на обработку данных в любой момент</li>
              <li>Отписаться от рассылки по ссылке в письме</li>
            </ul>
            <p className="mt-3">
              Для реализации своих прав напишите нам или обратитесь лично в детский центр «Рыбка Долли».
            </p>
          </section>

          <section>
            <h2 className="font-black text-xl text-gray-800 mb-3">10. Изменения в Политике</h2>
            <p>
              Мы оставляем за собой право вносить изменения в настоящую Политику. Актуальная версия
              всегда размещена на этой странице. Продолжая использовать Сайт после публикации изменений,
              вы принимаете новую редакцию Политики.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-orange-100 text-center">
          <Link to="/" className="inline-flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white font-black px-6 py-3 rounded-2xl transition-colors text-sm">
            <Icon name="ArrowLeft" size={16} />
            Вернуться на сайт
          </Link>
        </div>
      </div>
    </div>
  );
}
