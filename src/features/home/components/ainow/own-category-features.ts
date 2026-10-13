type Locale = "ka" | "en" | "ru";
type Feature = { name: string; description: string };

const copy: Record<Locale, Record<string, Feature>> = {
  ka: {
    request: { name: "მოთხოვნის პროცესი", description: "მომავალი მოთხოვნისა და პიკაპის წესები წინასწარ იწერება." },
    intake: { name: "მოთხოვნის მიღება", description: "პილოტის ფარგლებში განისაზღვრება, რა ინფორმაცია მიიღება." },
    fleet: { name: "ფლოტისა და დეპოს პროცესი", description: "ფლოტისა და დეპოს სამუშაო ფარგლები წერილობით თანხმდება." },
    dispatch: { name: "დისპეტჩერიზაციის წესი", description: "გადანაწილების ნაბიჯები მხოლოდ შეთანხმებულ პროცესს მიჰყვება." },
    route: { name: "მარშრუტის შემოწმება", description: "მარშრუტისა და ქალაქის მონაცემები შემოწმების წესით განიხილება." },
    operator: { name: "ოპერატორის თანხმობა", description: "ოპერატორის ჩართვის წერტილი წინასწარ განისაზღვრება." },
    partner: { name: "პარტნიორის ზღვარი", description: "პარტნიორისა და პროვაიდერის პასუხისმგებლობა ცალკე იწერება." },
    safety: { name: "უსაფრთხოების შემოწმება", description: "უსაფრთხოების საკითხები ადამიანურ შემოწმებას საჭიროებს." },
    status: { name: "ფლოტის სტატუსი", description: "სტატუსის ველები პილოტის წერილობით ფარგლებს მიჰყვება." },
    pilot: { name: "პილოტის მასშტაბი", description: "პილოტის მოცულობა და ვადები დაწყებამდე თანხმდება." },
    boundary: { name: "ინტეგრაციის ზღვარი", description: "ინტეგრაცია აქტიურ ფლოტად არ ითვლება დადასტურების გარეშე." },
    capacity: { name: "სიმძლავრის ფარგლები", description: "მოთხოვნისა და არხის სიმძლავრე წერილობით დასტურდება." },
  },
  en: {
    request: { name: "Ride-request workflow", description: "Define incoming request and pickup rules first." },
    intake: { name: "Request intake", description: "Agree which request information the pilot receives." },
    fleet: { name: "Fleet and depot workflow", description: "Fleet and depot scope is agreed in writing." },
    dispatch: { name: "Dispatch rule", description: "Assignment follows only the agreed operating process." },
    route: { name: "Route review", description: "Review route and city data within the agreed scope." },
    operator: { name: "Operator approval", description: "Define where an operator must be involved." },
    partner: { name: "Partner boundary", description: "Separate partner and provider responsibility." },
    safety: { name: "Safety review", description: "Safety questions stay with human review." },
    status: { name: "Fleet status", description: "Status fields follow the written pilot scope." },
    pilot: { name: "Pilot scope", description: "Agree pilot volume and timing before starting." },
    boundary: { name: "Integration boundary", description: "Do not treat integration as an active fleet without confirmation." },
    capacity: { name: "Capacity scope", description: "Confirm request and channel capacity in writing." },
  },
  ru: {
    request: { name: "Процесс запроса", description: "Сначала определяются правила запроса и подачи машины." },
    intake: { name: "Приём запроса", description: "Согласуйте, какие данные получает пилот." },
    fleet: { name: "Процесс автопарка и депо", description: "Объём работы автопарка и депо согласуют письменно." },
    dispatch: { name: "Правило распределения", description: "Распределение следует только согласованному процессу." },
    route: { name: "Проверка маршрута", description: "Данные маршрута и города проверяются в заданных рамках." },
    operator: { name: "Подтверждение оператора", description: "Заранее определяется момент участия оператора." },
    partner: { name: "Граница партнёра", description: "Ответственность партнёра и провайдера разделяется." },
    safety: { name: "Проверка безопасности", description: "Вопросы безопасности остаются на проверке человеком." },
    status: { name: "Статус автопарка", description: "Поля статуса следуют письменному объёму пилота." },
    pilot: { name: "Объём пилота", description: "Объём и сроки пилота согласуются до старта." },
    boundary: { name: "Граница интеграции", description: "Интеграция не считается действующим автопарком без подтверждения." },
    capacity: { name: "Границы ёмкости", description: "Ёмкость запросов и каналов подтверждают письменно." },
  },
};

export function getOwnCategoryFeatures(locale: string): Record<string, Feature> {
  return copy[locale === "ka" || locale === "ru" ? locale : "en"];
}
