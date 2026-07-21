import { Link } from '@/i18n/navigation'

type LocaleText = Record<string, string>

const EYEBROW: LocaleText = {
    ka: 'aiTAXI ადრეული წვდომა',
    en: 'aiTAXI early access',
    ru: 'Ранний доступ aiTAXI',
}

const HEADING: LocaleText = {
    ka: 'ამზადებთ თქვენს ტაქსოპარკს ავტონომიური მომავლისთვის?',
    en: 'Preparing your taxi fleet for autonomy?',
    ru: 'Готовите свой таксопарк к автономности?',
}

const BLURB: LocaleText = {
    ka: 'aiTAXI არის რობოტაქსის ფლოტის მართვის პლატფორმა aiNOW-სგან: დისპეტჩერიზაცია, ტელემეტრია, დისტანციური დახმარება და დეპოს ოპერაციები. საპილოტე პროგრამა ღიაა ქართული ტაქსოკომპანიებისთვის.',
    en: 'aiTAXI is a robotaxi fleet management platform by aiNOW: dispatch, telemetry, remote assistance and depot operations. The pilot program is open for Georgian taxi companies.',
    ru: 'aiTAXI, платформа управления флотом роботакси от aiNOW: диспетчеризация, телеметрия, удалённая помощь и операции депо. Пилотная программа открыта для грузинских таксокомпаний.',
}

const CTA: LocaleText = {
    ka: 'მოითხოვე წვდომა',
    en: 'Request access',
    ru: 'Запросить доступ',
}

type Props = {
    tags: string[]
    locale: string
}

// One early-access card under every article: routes link equity and readers
// from the blog to the conversion page. Tags are accepted for API parity but
// every article funnels to the same pilot CTA (single-product site).
export function ServiceCrossLink({ locale }: Props) {
    const loc = HEADING[locale] ? locale : 'en'

    return (
        <aside className="my-10 rounded-2xl border border-[#e5e5e5] bg-white p-6 md:p-8">
            <p className="eyebrow mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#525252]">
                {EYEBROW[loc]}
            </p>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                    <h2 className="mb-1.5 font-display text-lg font-bold tracking-tight text-neutral-900 md:text-xl">{HEADING[loc]}</h2>
                    <p className="text-sm leading-relaxed text-[#525252]">{BLURB[loc]}</p>
                </div>
                <Link
                    href="/contact"
                    className="bg-linear-to-r from-[#ffc400] to-[#ffdf5a] shrink-0 self-start rounded-full px-5 py-2.5 text-sm font-semibold text-neutral-950 shadow-md shadow-[#ffc400]/20 transition-[transform,box-shadow,opacity] duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-[#ffc400]/20 active:scale-[0.96] md:self-auto"
                >
                    {CTA[loc]} →
                </Link>
            </div>
        </aside>
    )
}
