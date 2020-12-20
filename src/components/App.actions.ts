import { setupI18N, getI18NStr, setLang } from '../i18n'

export const init = () => async (dispatch: any) => {
    dispatch({
        type: 'INIT_BEGIN',
    })
    // initialization
    await setupI18N()
    // done
    dispatch({
        type: 'INIT_DONE',
    })
}

export const setupLanguage = (lang: string) => async(dispatch: any) => {
    dispatch({
        type: 'SET_LANG_BEGIN',
        data: lang,
    })
    await setLang(lang)
    dispatch({
        type: 'SET_LANG_DONE',
        data: lang,
    })
}

export const welcome = () => async (dispatch:any) => {
    const sleep = async(): Promise<void> => {
        return new Promise((res, rej) => {
            setTimeout(()=>{
                res()
            }, 100)
        })
    }
    await sleep()

    dispatch({
        type: 'TITLE',
        data: getI18NStr('welcome'),
    })
}

