import 'styled-components'
import { defaultTheme } from '../styles/themes/default'

// Guardando as propriedades do defaultTheme dentro do tipo ThemeType
type ThemeType = typeof defaultTheme

// Cria uma tipagem para o módulo styled-components
declare module 'styled-components' {
  // Interface utilizada para setar as propriedades do nosso tema
  export interface DefaultTheme extends ThemeType {}
}
