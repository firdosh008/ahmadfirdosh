import { pxToRem } from '~/utils/style';

// Full list of tokens
const baseTokens = {
  black: 'oklch(0% 0 0)',
  white: 'oklch(100% 0 0)',
  bezierFastoutSlowin: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  durationXS: '200ms',
  durationS: '300ms',
  durationM: '400ms',
  durationL: '600ms',
  durationXL: '800ms',
  systemFontStack:
    'system-ui, -apple-system, BlinkMacSystemFont, San Francisco, Roboto, Segoe UI, Ubuntu, Helvetica Neue, sans-serif',
  fontStack: `'Elms Sans', var(--systemFontStack)`,
  fontStackDisplay: `'Instrument Serif', Georgia, Cambria, 'Times New Roman', serif`,
  monoFontStack:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
  japaneseFontStack:
    'IPA Gothic, ヒラギノ角ゴ Pro W3, Hiragino Kaku Gothic Pro, Hiragino Sans, Osaka, メイリオ, Meiryo, Segoe UI, sans-serif',
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  fontSizeH0: pxToRem(140),
  fontSizeH1: pxToRem(100),
  fontSizeH2: pxToRem(58),
  fontSizeH3: pxToRem(38),
  fontSizeH4: pxToRem(28),
  fontSizeH5: pxToRem(24),
  fontSizeBodyXL: pxToRem(22),
  fontSizeBodyL: pxToRem(20),
  fontSizeBodyM: pxToRem(18),
  fontSizeBodyS: pxToRem(16),
  fontSizeBodyXS: pxToRem(14),
  lineHeightTitle: '1.1',
  lineHeightBody: '1.6',
  maxWidthS: '540px',
  maxWidthM: '720px',
  maxWidthL: '1096px',
  maxWidthXL: '1680px',
  spaceOuter: '255px',
  spaceXS: '4px',
  spaceS: '8px',
  spaceM: '16px',
  spaceL: '24px',
  spaceXL: '32px',
  space2XL: '48px',
  space3XL: '64px',
  space4XL: '96px',
  space5XL: '128px',
  radiusS: '6px',
  radiusM: '10px',
  radiusL: '16px',
  border: 'color-mix(in lab, var(--text) 12%, transparent)',
  borderStrong: 'color-mix(in lab, var(--text) 22%, transparent)',
  zIndex0: 0,
  zIndex1: 4,
  zIndex2: 8,
  zIndex3: 16,
  zIndex4: 32,
  zIndex5: 64,
};

// Tokens that change based on viewport size
const tokensDesktop = {
  fontSizeH0: pxToRem(120),
  fontSizeH1: pxToRem(80),
};

const tokensLaptop = {
  maxWidthS: '480px',
  maxWidthM: '640px',
  maxWidthL: '1000px',
  maxWidthXL: '1100px',
  spaceOuter: '255px',
  fontSizeH0: pxToRem(100),
  fontSizeH1: pxToRem(70),
  fontSizeH2: pxToRem(50),
  fontSizeH3: pxToRem(36),
  fontSizeH4: pxToRem(26),
  fontSizeH5: pxToRem(22),
};

const tokensTablet = {
  spaceOuter: '48px',
  fontSizeH0: pxToRem(80),
  fontSizeH1: pxToRem(60),
  fontSizeH2: pxToRem(48),
  fontSizeH3: pxToRem(32),
  fontSizeH4: pxToRem(24),
  fontSizeH5: pxToRem(20),
};

const tokensMobile = {
  spaceOuter: '24px',
  fontSizeH0: pxToRem(56),
  fontSizeH1: pxToRem(40),
  fontSizeH2: pxToRem(34),
  fontSizeH3: pxToRem(28),
  fontSizeH4: pxToRem(22),
  fontSizeH5: pxToRem(18),
  fontSizeBodyL: pxToRem(17),
  fontSizeBodyM: pxToRem(16),
  fontSizeBodyS: pxToRem(14),
};

const tokensMobileSmall = {
  spaceOuter: '16px',
  fontSizeH0: pxToRem(42),
  fontSizeH1: pxToRem(38),
  fontSizeH2: pxToRem(28),
  fontSizeH3: pxToRem(24),
  fontSizeH4: pxToRem(20),
};

// Tokens that change based on theme
// Canonical presentation is `light`: warm paper + one deliberate accent,
// restrained like a precision tool rather than a decorated editorial site
// (see docs/superpowers/specs/2026-08-23-product-redesign.md).
// `dark` is a derived variant so the existing theme toggle keeps working.
const dark = {
  background: 'oklch(17% 0.006 130)',
  backgroundLight: 'oklch(21% 0.008 130)',
  primary: 'oklch(60% 0.14 18)',
  accent: 'oklch(60% 0.14 18)',
  error: 'oklch(65.91% 0.249 13.76)',
  text: 'oklch(95% 0.006 95)',
  textTitle: 'var(--text)',
  textBody: 'color-mix(in lab, var(--text) 78%, transparent)',
  textLight: 'color-mix(in lab, var(--text) 56%, transparent)',
};

const light = {
  background: 'oklch(98% 0.004 90)',
  backgroundLight: 'oklch(95% 0.006 95)',
  primary: 'oklch(32% 0.11 18)',
  accent: 'oklch(32% 0.11 18)',
  error: 'oklch(63.17% 0.259 25.41)',
  text: 'oklch(15% 0.004 90)',
  textTitle: 'color-mix(in lab, var(--text) 94%, transparent)',
  textBody: 'color-mix(in lab, var(--text) 72%, transparent)',
  textLight: 'color-mix(in lab, var(--text) 52%, transparent)',
};

export const tokens = {
  base: baseTokens,
  desktop: tokensDesktop,
  laptop: tokensLaptop,
  tablet: tokensTablet,
  mobile: tokensMobile,
  mobileS: tokensMobileSmall,
};

export const themes = { dark, light };
