import config from '~/config.json';

export const navLinks = [
  {
    label: 'Projects',
    pathname: '/#project-1',
  },
  {
    label: 'Experience',
    pathname: '/articles',
  },
  {
    label: 'Contact',
    pathname: '/contact',
  },
  {
    label: 'Details',
    pathname: '/#details',
  },
];

export const socialLinks = [
  {
    label: 'Github',
    url: `https://github.com/${config.github}`,
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    url: `https://www.linkedin.com/in/ahmadfirdosh`,
    icon: 'linkedin',
  },
];
