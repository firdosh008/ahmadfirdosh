import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useNavigation,
  useRevalidator,
  useRouteError,
} from '@remix-run/react';
import { createCookieSessionStorage, json } from '@remix-run/node';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider, themeStyles } from '~/components/theme-provider';
import ElmsSansVariable from '~/assets/fonts/elms-sans-variable.woff2';
import InstrumentSerifRegular from '~/assets/fonts/instrument-serif-regular.woff2';
import { useEffect } from 'react';
import { Error } from '~/layouts/error';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Navbar } from '~/layouts/navbar';
import { Progress } from '~/components/progress';
import config from '~/config.json';
import styles from './root.module.css';
import './reset.module.css';
import './global.module.css';

export const links = () => [
  {
    rel: 'preload',
    href: ElmsSansVariable,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  {
    rel: 'preload',
    href: InstrumentSerifRegular,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  { rel: 'manifest', href: '/manifest.json' },
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'shortcut_icon', href: '/shortcut.png', type: 'image/png', sizes: '64x64' },
  { rel: 'apple-touch-icon', href: '/icon-256.png', sizes: '256x256' },
  { rel: 'author', href: '/humans.txt', type: 'text/plain' },
];

export const loader = async ({ request, context }) => {
  const { url } = request;
  const { pathname } = new URL(url);
  const pathnameSliced = pathname.endsWith('/') ? pathname.slice(0, -1) : url;
  const canonicalUrl = `${config.url}${pathnameSliced}`;

  const { getSession, commitSession } = createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 604_800,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.SESSION_SECRET || ' '],
      secure: true,
    },
  });

  const session = await getSession(request.headers.get('Cookie'));
  const theme = session.get('theme') || 'light';

  return json(
    { canonicalUrl, theme },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};

export default function App() {
  let { canonicalUrl, theme } = useLoaderData();
  const fetcher = useFetcher();
  const { state } = useNavigation();
  const revalidator = useRevalidator();

  if (fetcher.formData?.has('theme')) {
    theme = fetcher.formData.get('theme');
  }

  function toggleTheme(newTheme) {
    fetcher.submit(
      { theme: newTheme ? newTheme : theme === 'dark' ? 'light' : 'dark' },
      { action: '/api/set-theme', method: 'post', navigate: false }
    );
  }

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.status === 'success') {
      revalidator.revalidate();
    }
  }, [fetcher.state, fetcher.data, revalidator]);

  useEffect(() => {
    console.info(
      `Taking a peek huh? Check out the source code: ${config.repo}\n\n`
    );
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Theme color doesn't support oklch so I'm hard coding these hexes for now */}
        <meta name="theme-color" content={theme === 'dark' ? '#14150F' : '#F7F4EE'} />
        <meta
          name="color-scheme"
          content={theme === 'dark' ? 'dark light' : 'light dark'}
        />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
        <link rel="canonical" href={canonicalUrl} />
      </head>
      <body data-theme={theme}>
        <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
          <Progress />
          <VisuallyHidden showOnFocus as="a" className={styles.skip} href="#main-content">
            Skip to main content
          </VisuallyHidden>
          <Navbar />
          <main
            id="main-content"
            className={styles.container}
            tabIndex={-1}
            data-loading={state === 'loading'}
          >
            <MotionConfig reducedMotion="user">
              <Outlet />
            </MotionConfig>
          </main>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F7F4EE" />
        <meta name="color-scheme" content="light dark" />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
      </head>
      <body data-theme="light">
        <Error error={error} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
