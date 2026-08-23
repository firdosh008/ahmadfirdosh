import ElmsSansVariable from '~/assets/fonts/elms-sans-variable.woff2';
import ElmsSansVariableItalic from '~/assets/fonts/elms-sans-variable-italic.woff2';
import InstrumentSerifRegular from '~/assets/fonts/instrument-serif-regular.woff2';
import InstrumentSerifItalic from '~/assets/fonts/instrument-serif-italic.woff2';
import IPAGothic from '~/assets/fonts/ipa-gothic.woff2';
import { createContext, useContext } from 'react';
import { classes, media } from '~/utils/style';
import { themes, tokens } from './theme';

export const ThemeContext = createContext({});

export const ThemeProvider = ({
  theme = 'dark',
  children,
  className,
  as: Component = 'div',
  toggleTheme,
  ...rest
}) => {
  const parentTheme = useTheme();
  const isRootProvider = !parentTheme.theme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: toggleTheme || parentTheme.toggleTheme,
      }}
    >
      {isRootProvider && children}
      {/* Nested providers need a div to override theme tokens */}
      {!isRootProvider && (
        <Component className={classes(className)} data-theme={theme} {...rest}>
          {children}
        </Component>
      )}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const currentTheme = useContext(ThemeContext);
  return currentTheme;
}

/**
 * Squeeze out spaces and newlines
 */
export function squish(styles) {
  return styles.replace(/\s\s+/g, ' ');
}

/**
 * Transform theme token objects into CSS custom property strings
 */
export function createThemeProperties(theme) {
  return squish(
    Object.keys(theme)
      .map(key => `--${key}: ${theme[key]};`)
      .join('\n\n')
  );
}

/**
 * Transform theme tokens into a React CSSProperties object
 */
export function createThemeStyleObject(theme) {
  let style = {};

  for (const key of Object.keys(theme)) {
    style[`--${key}`] = theme[key];
  }

  return style;
}

/**
 * Generate media queries for tokens
 */
export function createMediaTokenProperties() {
  return squish(
    Object.keys(media)
      .map(key => {
        return `
        @media (max-width: ${media[key]}px) {
          :root {
            ${createThemeProperties(tokens[key])}
          }
        }
      `;
      })
      .join('\n')
  );
}

const layerStyles = squish(`
  @layer theme, base, components, layout;
`);

const tokenStyles = squish(`
  :root {
    ${createThemeProperties(tokens.base)}
  }

  ${createMediaTokenProperties()}

  [data-theme='dark'] {
    ${createThemeProperties(themes.dark)}
  }

  [data-theme='light'] {
    ${createThemeProperties(themes.light)}
  }
`);

const fontStyles = squish(`
  @font-face {
    font-family: 'Elms Sans';
    font-weight: 100 900;
    src: url(${ElmsSansVariable}) format('woff2');
    font-display: swap;
    font-style: normal;
  }

  @font-face {
    font-family: 'Elms Sans';
    font-weight: 100 900;
    src: url(${ElmsSansVariableItalic}) format('woff2');
    font-display: swap;
    font-style: italic;
  }

  @font-face {
    font-family: 'Instrument Serif';
    font-weight: 400;
    src: url(${InstrumentSerifRegular}) format('woff2');
    font-display: swap;
    font-style: normal;
  }

  @font-face {
    font-family: 'Instrument Serif';
    font-weight: 400;
    src: url(${InstrumentSerifItalic}) format('woff2');
    font-display: swap;
    font-style: italic;
  }

  @font-face {
    font-family: IPA Gothic;
    font-weight: 400;
    src: url(${IPAGothic}) format('woff2');
    font-display: swap;
    font-style: normal;
  }
`);

export const themeStyles = squish(`
  ${layerStyles}

  @layer theme {
    ${tokenStyles}
    ${fontStyles}
  }
`);
