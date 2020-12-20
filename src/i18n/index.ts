import CN from './cn.json'
import EN from './en.json'

export const setupI18N = async () => {

}

interface LangSpec {
    [strId: string]: string|undefined
}

let currentLang = 'en'

export const setLang = async(lang: string) => {
    currentLang = lang
}

export const getLang = async(): Promise<string> => {
    return currentLang
}

export const getI18NStr = (strId: string): string|undefined => {

    if (currentLang === 'en') {
        return (EN as LangSpec)[strId]
    } else if (currentLang === 'cn') {
        return (CN as LangSpec)[strId]
    }
    return undefined
}
