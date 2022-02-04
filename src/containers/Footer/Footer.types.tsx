import { FooterProps as FooterComponentProps } from 'spacey-ui/dist/components/Footer/Footer'

export type FooterProps = FooterComponentProps & {
  hasTranslations?: boolean
}

export type MapStateProps = Pick<FooterProps, 'locale' | 'hasTranslations'>

export type MapDispatchProps = Pick<FooterProps, 'onChange'>
