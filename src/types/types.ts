export interface AccountPageComponentProps {
    profile: any,
    context: any
}

export type AccountPageComponentType = {
    title: string
    icon: string
    component: any
}

export type CollectionPropsType = {
    params: {
        id: string
    }
}

export type Cords = {
    lat: number
    long: number
}

export type TownType = {
    title: string
    cords: Cords
}

export type NavigatorWrapperPropsType = {
    children: any
    isRedirect: boolean
    id?: string
    url?: string
}

export interface RouteType {
    title: string
    access_value?: number
    url: string
    component?: any
    isVisible?: boolean
}

export interface ContextStateType {
    account_id: string
    username: string
    role: string
}

// UI&UX

export type ImageLookProps = {
    src: any
    className: string
    min?: number
    max?: number
    speed?: number
    onClick?: any
    alt?: string
}

export type BrowserImageProps = {
    url: string,
    alt?: string
}

export type SimpleTriggerProps = {
    onClick: any
}

export type DataPaginationProps = {
    initialItems: any[]
    setItems: any
    label?: string
}

export type FormPaginationProps = {
    children: any
    num: number
    setNum: any
    items: any[]
}

export type ImageLoaderProps = {
    setImage: any
    label?: string
}

export type CounterViewProps = {
    selector?: string
    num: number
    setNum: any
    part?: number
    min?: number
    max?: number
    children: any
}

export type PopupPropsType = {
    text: string
}

export type AlertPropsType = (text: string, time?: number) => any

export type ContextPropsType = {
    account_id: string
    username: string
}

// pieces

export interface JobCommonInfoType {
    dateUp: string
    time: string
}