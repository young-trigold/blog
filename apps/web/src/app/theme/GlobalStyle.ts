import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    outline: none;
    touch-action: manipulation;
  }

  body {
    margin: 0;
    max-height: 100vh;
    word-break: break-word;
    font-family: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    color: ${(props) => props.theme.textColor};
    background-color: ${(props) => props.theme.backgroundColor};
    position: relative;
  }

  // ====================================链接==================================================
  a {
    transition: ${(props) => props.theme.transition};
    color: ${(props) => props.theme.hoverColor};
    text-decoration: none;
  }

  a:hover, a:active {
    color: ${(props) => props.theme.activeColor};
  }

  // =============================================滚动条===========================================
  ::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
  }

  ::-webkit-scrollbar:horizontal {
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 6.4px;
    background-color: ${(props) => props.theme.borderColor};
    transition: ${(props) => props.theme.transition};

    &:hover,
    &:active {
      background-color: ${(props) => props.theme.activeColor};
    }
  }

  // ===============================================选择文字========================================
  ::selection {
    transition: ${(props) => props.theme.transition};
    color: ${(props) => props.theme.foregroundColor};
    background-color: ${(props) => props.theme.primaryColor};
  }
`;

export default GlobalStyle;
