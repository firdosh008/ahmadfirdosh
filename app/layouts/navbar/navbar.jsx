import { Icon } from '~/components/icon';
import { Monogram } from '~/components/monogram';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { useScrollToHash, useWindowSize } from '~/hooks';
import { Link as RouterLink, useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { cssProps, media, msToNum, numToMs } from '~/utils/style';
import { NavToggle } from './nav-toggle';
import { ThemeToggle } from './theme-toggle';
import { navLinks, socialLinks } from './nav-data';
import config from '~/config.json';
import styles from './navbar.module.css';

export const Navbar = () => {
  const [current, setCurrent] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [target, setTarget] = useState();
  const location = useLocation();
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= media.mobile || windowSize.height <= 696;
  const scrollToHash = useScrollToHash();

  useEffect(() => {
    // Prevent ssr mismatch by storing this in state
    setCurrent(`${location.pathname}${location.hash}`);
  }, [location]);

  // Handle smooth scroll nav items
  useEffect(() => {
    if (!target || location.pathname !== '/') return;
    setCurrent(`${location.pathname}${target}`);
    scrollToHash(target, () => setTarget(null));
  }, [location.pathname, scrollToHash, target]);

  // Check if a nav item should be active
  const getCurrent = (url = '') => {
    const nonTrailing = current?.endsWith('/') ? current?.slice(0, -1) : current;

    if (url === nonTrailing) {
      return 'page';
    }

    return '';
  };

  // Store the current hash to scroll to
  const handleNavItemClick = event => {
    const hash = event.currentTarget.href.split('#')[1];
    setTarget(null);

    if (hash && location.pathname === '/') {
      setTarget(`#${hash}`);
      event.preventDefault();
    }
  };

  const handleMobileNavClick = event => {
    handleNavItemClick(event);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <>
    <header className={styles.navbar}>
      <RouterLink
        unstable_viewTransition
        prefetch="intent"
        to="/"
        className={styles.logo}
        aria-label={`${config.name}, ${config.role}`}
        onClick={handleMobileNavClick}
      >
        <Monogram highlight />
      </RouterLink>
      <nav className={styles.nav}>
        <div className={styles.navList}>
          {navLinks.map(({ label, pathname }) => (
            <RouterLink
              unstable_viewTransition
              prefetch="intent"
              to={pathname}
              key={label}
              className={styles.navLink}
              aria-current={getCurrent(pathname)}
              onClick={handleNavItemClick}
            >
              {label}
            </RouterLink>
          ))}
        </div>
        {!!socialLinks.length && <NavbarIcons desktop />}
        {!isMobile && <ThemeToggle />}
      </nav>
    </header>
    {/* NavToggle and the mobile nav overlay are rendered as siblings of
        <header>, not children: the header's own backdrop-filter creates a
        containing block/stacking context for fixed-position descendants,
        which would otherwise trap them inside the header's own (much
        smaller, lower-stacked) box instead of the full viewport. */}
    <NavToggle onClick={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
    <Transition unmount in={menuOpen} timeout={msToNum(tokens.base.durationL)}>
      {({ visible, nodeRef }) => (
        <nav className={styles.mobileNav} data-visible={visible} ref={nodeRef}>
          {navLinks.map(({ label, pathname }, index) => (
            <RouterLink
              unstable_viewTransition
              prefetch="intent"
              to={pathname}
              key={label}
              className={styles.mobileNavLink}
              data-visible={visible}
              aria-current={getCurrent(pathname)}
              onClick={handleMobileNavClick}
              style={cssProps({
                transitionDelay: numToMs(
                  Number(msToNum(tokens.base.durationS)) + index * 50
                ),
              })}
            >
              {label}
            </RouterLink>
          ))}
          {!!socialLinks.length && <NavbarIcons />}
          <ThemeToggle isMobile />
        </nav>
      )}
    </Transition>
    </>
  );
};

const NavbarIcons = ({ desktop }) => (
  <div className={styles.navIcons}>
    {socialLinks.map(({ label, url, icon }) => (
      <a
        key={label}
        className={styles.navIconLink}
        aria-label={label}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon className={styles.navIcon} icon={icon} />
      </a>
    ))}
  </div>
);
