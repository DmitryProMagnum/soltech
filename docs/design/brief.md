# SolTech — структура сайта

Сайт solar-компании в Дубае. Продаём финансовый результат: клиент заменяет киловатт-часы DEWA по 0.38–0.46 AED на собственные по ~0.10–0.13. Тон — финансовая платформа, не эко-каталог.

## Карта сайта

```
HOME
├── Savings Calculator
├── Solar for Villas        ← посадочная Ads (версия без навигации)
├── Solar for Business      ← посадочная Ads (версия без навигации)
├── How It Works
├── Why [Brand]
├── Shams Dubai Guide
├── Equipment We Install
├── Calculator Methodology
└── Contact
```

Фаза 2: Case Studies · Knowledge Center · Maintenance · Energy Storage · EV Charging · Financing.

## HOME

1. **Hero** — signature-элемент: два «ценника кВт·ч» рядом, крупно: `DEWA: 0.46 AED/kWh` vs `Your solar: ~0.11 AED/kWh`. H1: *"Stop paying 0.46 AED per kilowatt-hour."* Sub: *"Generate your own power at a fraction of the cost — and cut your DEWA bill for the next 25 years."* CTA: **Calculate My Savings** / **Get a Free Assessment** (WhatsApp).
2. **Мини-калькулятор**: слайдер месячного счёта → мгновенный предрасчёт → Get full report.
3. **Три карточки**: своя цена кВт·ч · экономия в год · окупаемость.
4. **Compare** — график 25 лет: Keep paying DEWA vs Go solar.
5. **Trust**: работаем по Shams Dubai · оборудование только из реестра DEWA · инженерная команда · прозрачный процесс.
6. **Journey**: Calculate → Engineering Assessment → Financial Proposal → DEWA Approval → Installation → Monitoring → 25 Years of Savings.
7. **Два модельных примера**: Villa 12 kWp / Warehouse 300 kWp (пометка illustrative model).
8. **FAQ**: продажа дома · работает ли при отключении сети (без ESS — нет) · сроки · гарантия · обслуживание.
9. **Финальный CTA**. WhatsApp-кнопка персистентна на всех страницах.

## SAVINGS CALCULATOR

Вход: месячный счёт DEWA (слайдер/поле) **или** загрузка PDF-счёта · тип объекта (Villa / Townhouse / Commercial / Warehouse) · опционально: площадь крыши, горизонт владения.

Выход, по порядку:
1. Ваша цена кВт·ч vs DEWA — главная визуализация
2. Экономия, AED/год
3. Окупаемость, лет
4. Покрытие потребления, %
5. C&I-тумблер: IRR / NPV
6. CO₂ — последним, мелко

Счёт < 1 500 AED/мес → отдельный экран: честное «экономика для вас слабее» + захват контакта.
Захват лида: сводка на экране, полный отчёт — **"Get My Full Report on WhatsApp"** (телефон — единственное обязательное поле).
Под результатами: ссылка на Methodology + «финальные цифры — после инженерного обследования».

## SOLAR FOR VILLAS

Hero с ценником верхнего слэба → мини-калькулятор → «почему большие счета выигрывают больше всех» (слэбы DEWA) → что при продаже дома (система переходит покупателю, кредиты — нет) → Journey → модельный пример → FAQ → CTA.

## SOLAR FOR BUSINESS

То же ядро. Отличия: IRR/NPV вместо простой окупаемости · этапы и сроки C&I-проекта · ESG-аргумент для арендаторов и брендов · CTA: **Book an Engineering Assessment**.

## HOW IT WORKS

Этапы с целевыми сроками: предрасчёт 24 ч · выезд инженера ≤ 3 дня · подача в DEWA ≤ 5 дней после договора · монтаж 2–7 дней · типовой запуск виллы 45–60 дней. Блок «что может удлинить срок».

## WHY [BRAND]

Подбираем оборудование под ROI, климат и бюджет из реестра DEWA · инженерный процесс · один ответственный за проект, деньги и гарантию · мониторинг после запуска. Фото команды, если будут.

## SHAMS DUBAI GUIDE

Простые схемы: днём излишки → кредит → гасит вечернее потребление · кредиты переносятся между периодами · DEWA деньгами не платит. SEO-страница.

## EQUIPMENT WE INSTALL

Panels: Jinko, LONGi, Trina, JA Solar, AIKO, Canadian Solar. Inverters: Huawei, Sungrow, GoodWe, Solis, SMA, SolarEdge, Fronius. Пометка: устанавливаем только модели из онлайн-реестра DEWA Eligible Equipment. Без цен и корзины. CTA: *Which equipment fits your roof? → Get assessment.*

## CALCULATOR METHODOLOGY

Все допущения открыто: тарифные слэбы + топливная надбавка + VAT · выработка и деградация · эскалация тарифа 0% · O&M. Тон: «считаем консервативно».

## CONTACT

WhatsApp-first. Форма: имя, WhatsApp, месячный счёт — всё.

## Дизайн

- Референс-класс: финансовые/wealth-платформы — цифры, графики, воздух, спокойная уверенность.
- Запрещено: эко-градиенты, листья, панели на закате, глобусы, CO₂ в hero, шаблонный solar-orange.
- Signature: пересчёт ценника кВт·ч при движении слайдера — единственный оркестрованный motion-момент, остальное тихо.
- Типографика: характерный display + чистый body, tabular figures для всех чисел. Латиница + арабский (RTL), позже кириллица.
- Data-viz единым стилем: слэбы счёта, помесячный неттинг, кумулятив 25 лет.
- Палитра — из логотипа (пришлю), 4–6 цветов, один акцент.
- Mobile-first.

## Тексты — запреты

Не писать: «DEWA платит вам» / «продайте энергию» · рост тарифов DEWA · «резервное питание» без ESS · проценты роста стоимости недвижимости · выдуманные кейсы как реальные. Все цифры примеров — с пометкой illustrative model.
