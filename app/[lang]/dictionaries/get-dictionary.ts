import 'server-only'

const dictionaries = {
    en: () => import('./en.json').then((module) => module.default),
    no: () => import('./no.json').then((module) => module.default),
    se: () => import('./se.json').then((module) => module.default),
    da: () => import('./da.json').then((module) => module.default),
    fi: () => import('./fi.json').then((module) => module.default),
    is: () => import('./is.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
    // defaults to 'en' if locale is not found
    return dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en()
}
