// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const readTheDocsVersion = process.env.READTHEDOCS_VERSION || 'latest';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Coasti Documentation',
  tagline: 'The open source BI platform for digital sovereignty in BI',
  favicon: 'coasti-icons/Bildung_icon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    faster: false,
  },

  // Set the production url of your site here
  url: 'https://coasti.readthedocs.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // Required for compatibility with Read the Docs
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'coasti-org', // Usually your GitHub org/user name.
  projectName: 'coasti_documentation', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    localeConfigs: {
      en: {
        baseUrl: `/en/${readTheDocsVersion}/`,
      },
      de: {
        baseUrl: `/de/${readTheDocsVersion}/`,
      },
    },
  },

  // Enable Mermaid diagrams in Markdown
  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
      mermaid: true,
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/coasti-org/coasti_documentation/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/coasti-org/coasti_documentation/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    function rootRedirectPlugin() {
      return {
        name: 'root-redirect-plugin',
        getClientModules() {
          return ['./src/rootRedirect.js'];
        },
      };
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: ' ',
        logo: {
          alt: 'Coasti Logo',
          src: 'img/coasti-logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'documentationSidebar',
            position: 'left',
            label: 'Documentation',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/coasti-org/coasti_documentation',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              // {
              //   label: 'Stack Overflow',
              //   href: 'https://stackoverflow.com/questions/tagged/coasti',
              // },
              // {
              //   label: 'Discord',
              //   href: 'https://discordapp.com/invite/coasti',
              // },
              // {
              //   label: 'X',
              //   href: 'https://x.com/coasti',
              // },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/coasti-initiative/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Initiative Website',
                href: 'https://coasti.org',
              },
              {
                label: 'Produktseite',
                href: 'https://coasti.de',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/coasti-org/coasti_documentation',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Coasti GmbH. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['powershell', 'bash', 'python', 'sql', 'yaml', 'toml', 'json', 'shell-session'],
      },
    }),
};

export default config;
