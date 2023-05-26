export interface AppConfig {
    name?: string
    debug?: boolean

    version?: string
    commit?: string

    yokaID?: number
    yokaName?: string

    appid?: string

    apiHost?: string
    resHost?: string

    nativeFiles?: string[]
    zipUrl?: string
    resVer?: string
}