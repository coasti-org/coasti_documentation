# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

# Target Content

Schreibe Englisch, übersetze via LLM mit manueller Nachbearbeitung.
i18n support in Docusaurus

# TOC

- Overview 1️⃣ @ PS
  - _technical transition layer_ Absprung

- Core Concepts 2️⃣ @ FD
  - _Erklärung der Grafik_
  - Coasti Installer
  - Docker Container als Abstraktionsebene
  - Superset als Frontend
  - Content-Paket? "Coasti Produkt"?
    - _kombiniert viele Core Concepts_
    - Background / Parts eines Produktes
      - Ingestion
      - Data Storage
      - Backend
      - Frontend
    - Coasti Formalismus zum Instalieren via Copier

- Getting Started _everything very brief_ 1️⃣ @ JB
  - Stufe 1
    - _rumclicken im Demo Server_. Try before you buy.  Link auf ein Lukas Video. Das ist Superset.
  - Stufe 2 _"Installation auf eigener Hardware"_
    - Requirements
    - _Installation des Coast Installers_
    - _Superset Installieren_
    - _Demo Content Paket installieren_
      - öffentliche Pakete aus public Repos
      - Pakete aus geschlossenen Repos
  - Stufe 2.5 Benutzung
    - @Lukas Level Videos
  - Stufe 3 _"Content erstellen"_
    - Demo Content Paket im Detail

- Admin Guide 2️⃣
  - Coasti Installer in Details @ PS
  - Produkt updates via coasti installer 3️⃣
    - wie funktioniert Copier
    - was müssen Content Pakete mitbringen? (link zum dev guide)

- Developer Guide 3️⃣
  - Coasti Spec Demo Content Paket
  - Frontend (Content Paket Gedanke)
    - Our icons set
    - Darkmode detection
    - Themeing / Corporate Design
  - Superset IO und Frontend Dev Workflow

- Contributing 4️⃣
  - Github, create Issues, PRs
  - __How to write Doku @ JB__

- Roadmap 4️⃣
  - ggf. einfach git Projekt verlinken.

- FAQ 1️⃣
  - Fill as we go. Why X?
