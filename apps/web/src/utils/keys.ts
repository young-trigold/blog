// 功能键
export enum FunctionKeys {
  Mod = 'Mod',
  Ctrl = 'Ctrl',
  Shift = 'Shift',
  Alt = 'Alt',
  Backspace = 'Backspace',
  Tab = 'Tab',
}

// 字母键
export enum LetterKeys {
  z = 'z',
  y = 'y',
  b = 'b',
  i = 'i',
  u = 'u',
  m = 'm',
  // =========== 大写 ============
  Z = 'Z',
  Y = 'Y',
  B = 'B',
  I = 'I',
  U = 'U',
  M = 'M',
}

// 符号键
export enum SymbolKeys {
  '`' = '`',
}

// 拼合各个键：快捷键
export const shortcutKeys = (...keys: (FunctionKeys | LetterKeys | SymbolKeys | number)[]) =>
  keys.join('-');