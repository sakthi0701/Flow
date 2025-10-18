export type ColorScheme = {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  card: string;
  border: string;
  primary: string;
  subtle: string;
  accent: {
    blue: string;
    mint: string;
    lavender: string;
  };
};

export type AppTheme = {
  light: ColorScheme;
  dark: ColorScheme;
};