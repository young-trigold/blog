import 'styled-components';

export type State = 'dange' | 'warn' | 'success';
export type Size = 'middle' | 'large' | 'small';

declare module 'styled-components' {
  export interface DefaultTheme {
    primaryColor: string;
    hoverColor: string;
    activeColor: string;
    backgroundColor: string;
    foregroundColor: string;
    surfaceColor: string;
    borderColor: string;
    textColor: string;
    successColor: string;
    warnColor: string;
    dangeColor: string;
    shadowColor: string;
    transition: string;
  }
}
