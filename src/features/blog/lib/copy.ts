import { SITE } from '@/config/site';

const COPY = {
  ka: {
    eyebrow: 'aiTAXI-ის პრაქტიკული გზამკვლევები',
    title: 'ბლოგი',
    subtitle: 'მარტივი პასუხები, სამუშაო მაგალითები და გადაწყვეტილების მისაღებად საჭირო ფაქტები.',
    latest: 'ყველა მასალა',
    read: 'წაიკითხეთ',
    empty: 'მასალები მალე დაემატება.',
    fallback: 'ქართული მასალები რედაქტირდება. მანამდე აქ ხელმისაწვდომია ინგლისური ბიბლიოთეკა.',
    back: 'ყველა მასალა',
    contents: 'სარჩევი',
    related: 'შემდეგი საკითხავი',
    sources: 'წყაროები',
    updated: 'განახლდა',
    minRead: 'წაკითხვის დრო',
    nextStepEyebrow: 'შემდეგი ნაბიჯი',
    nextStepTitle: 'გადაიტანეთ იდეა პრაქტიკაში',
    nextStepBody: 'თუ გსურთ, ეს მიდგომა თქვენს ბიზნესშიც იმუშაოს, მოგვწერეთ. ერთად განვსაზღვრავთ ამოცანას, საჭირო მონაცემებს და რეალურ შემდეგ ნაბიჯს.',
    nextStepAction: 'დაგვიკავშირდით',
  },
  en: {
    eyebrow: 'Practical guides by aiTAXI',
    title: 'Blog',
    subtitle: 'Clear answers, working examples and the facts you need to make a decision.',
    latest: 'All guides',
    read: 'Read guide',
    empty: 'Guides are coming soon.',
    fallback: 'Localized guides are being edited. The English library is available in the meantime.',
    back: 'All guides',
    contents: 'On this page',
    related: 'Read next',
    sources: 'Sources',
    updated: 'Updated',
    minRead: 'Reading time',
    nextStepEyebrow: 'Next step',
    nextStepTitle: 'Turn the idea into a working process',
    nextStepBody: 'If you want this approach to work in your business, contact us. Together we will define the task, the information required, and the next practical step.',
    nextStepAction: 'Contact us',
  },
  ru: {
    eyebrow: 'Практические материалы aiTAXI',
    title: 'Блог',
    subtitle: 'Простые ответы, рабочие примеры и факты, которые помогают принять решение.',
    latest: 'Все материалы',
    read: 'Читать',
    empty: 'Материалы скоро появятся.',
    fallback: 'Локальные материалы проходят редактуру. Пока доступна английская библиотека.',
    back: 'Все материалы',
    contents: 'Содержание',
    related: 'Что читать дальше',
    sources: 'Источники',
    updated: 'Обновлено',
    minRead: 'Время чтения',
    nextStepEyebrow: 'Следующий шаг',
    nextStepTitle: 'Переведите идею в рабочий процесс',
    nextStepBody: 'Если хотите применить этот подход в своем бизнесе, свяжитесь с нами. Вместе определим задачу, нужные данные и следующий практический шаг.',
    nextStepAction: 'Связаться с нами',
  },
} as const;

export function getBlogCopy(locale: string) {
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en;
  return {
    ...copy,
    pageTitle: `${SITE.wordmark.prefix}${SITE.wordmark.mark} ${copy.title}`,
  };
}
