# relata-prototype

Prototype web application for the [Relata Project](https://culanth.org/engagements/relata). Integrates the following components:

## Table of contents

* [Quickstart](#quickstart)
  + [Enabling login via OAuth](#enabling-login-via-oauth)
* [Configuration](#configuration)
  + [Relata config](#relata-config)
* [Architecture](#architecture)
  + [Backend architecture](#backend-architecture)
  + [Frontend architecture](#frontend-architecture)

## Quickstart

Here's how to get the app up and running in development mode:

1. Ensure that [Node](https://nodejs.org) and [npm](https://www.npmjs.com) are installed. Using Node 10.x is suggested.
2. Clone this repository.
3. Go to the project root folder (`cd path/to/relata-prototype`) and install dependencies by executing `npm install`.
4. Go to the `frontend` folder contained in the project root folder (`cd frontend`) and again execute `npm install`. (This is necessary because the frontend UI is a separate sub-package with its own dependencies.)
5. Return to the project root folder (`cd ..`).
6. Execute `npm run dev` to start the app in development mode. This will start two processes: the backend application (on port 3030) and the frontend UI (on port 3000).
7. Go to <http://localhost:3000> in your browser to view the app.

Note that to enable user login, you must obtain OAuth keys from one or more OAuth providers. See the following section for details.

### Enabling login via OAuth

By default, relata-prototype is set up to allow user login via the following OAuth providers:

* [GitHub](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)
* [Google](https://developers.google.com/identity/protocols/OAuth2)
* [Mendeley](https://dev.mendeley.com/reference/topics/application_registration.html)
* [Zotero](https://www.zotero.org/support/dev/web_api/v3/oauth)

Visit the above links to set up OAuth applications and obtain keys. (GitHub is an easy example to start with.) Once you've obtained one or more pairs of keys, you can set them as environment variables. For example, in a Mac or Linux environment, you can add these lines to your `.bash_profile`:

```bash
# This value is used to sign/encrypt cookies and keep user login sessions
# secure. It can be anything, but needs to remain secret, especially in a
# production environment. Do not commit the RELATA_SECRET to Git or share it
# publicly
export RELATA_SECRET='XXXXXXXXXXXXXXXX'

# OAuth provider keys from the above websites
export RELATA_OAUTH_GITHUB_KEY='XXXXXXXXXXXXXXXX'
export RELATA_OAUTH_GITHUB_SECRET='XXXXXXXXXXXXXXXX'
export RELATA_OAUTH_GOOGLE_KEY='XXXXXXXXXXXXXXXX'
export RELATA_OAUTH_GOOGLE_SECRET='XXXXXXXXXXXXXXXX'
export RELATA_OAUTH_MENDELEY_KEY='XXXXXXXXXXXXXXXX'  # App ID number
export RELATA_OAUTH_MENDELEY_SECRET='XXXXXXXXXXXXXXXX'
export RELATA_OAUTH_ZOTERO_KEY='XXXXXXXXXXXXXXXX'
export RELATA_OAUTH_ZOTERO_SECRET='XXXXXXXXXXXXXXXX'
```

## Configuration

The configuration files in the `config` folder should be used for non-sensitive configuration settings such as production URL and port, database filepath, etc. The different config files correspond to different environments (dev and prod); you can use one or the other by setting the environment variable `NODE_ENV`:

```bash
# App will use config/production.json
export NODE_ENV='production'

# App will use config/development.json (default when calling npm run dev)
export NODE_ENV='development'
```

### Relata config

See the `relata` section of `default.json` to change the following Relata-specific settings:

* `aboutUrl`: URL to be used for the "About" link on top navbar. Default: `https://culanth.org/engagements/relata`.
* `duplicateWorkThreshold`: relata-prototype uses fuzzy text comparison of author-date citations to prevent creation of duplicate works. This setting should be a fractional number between 0 and 1 representing the similarity threshold at which two works are considered duplicates. Default: `0.67`.
* `oauthProviders`: Use this to define which OAuth providers are shown to the user, and in what order. Defaults: `zotero`, `mendeley`, `github`, and `google`.
  + Note: Adding further OAuth providers is complex, and requires additions to the the backend code. This config setting is mostly a convenient way to hide or re-order the default providers.
* `types`: Relation types to make available for user selection. Each type may include the properties `color` and `preposition`.
  + The "catch-all" type `*` is used to set the color for additional relation types outside this controlled list.

## Architecture

relata-prototype is composed of two main parts: a backend [Feathers](https://feathersjs.com) web app and a frontend [React](https://reactjs.org) user interface. In __development mode__, these two parts are run concurrently on auto-reloading development servers. In __production mode__, the frontend is compiled and served up on top of the backend, making for a single united application.

### Backend architecture

The relata-prototype backend is a [Feathers](https://feathersjs.com) web app that uses a lightweight [SQLite](https://www.sqlite.org/index.html) database. The Feathers web app exposes the following REST API services:

* `/users`: User data to support OAuth login
* `/works`: Bibliographic works, stored in CSL JSON format
* `/relations`: Relations between bibliographic works
* `/graphs`: Convenient endpoint for viewing citations, relations, and GraphViz DOT descriptions for a given work all in one place

In addition to the SQLite database, the Feathers backend uses [FlexSearch](https://github.com/nextapps-de/flexsearch) for a fast, lightweight in-memory search index supporting the search components in the frontend.

The invaluable [Citation.js](https://citation.js.org) package is used throughout the backend app to generate Chicago-style citations from CSL JSON records.

### Frontend architecture

relata-prototype's frontend user interface is built using [React Bootstrap](https://react-bootstrap.github.io) components and contained in a [create-react-app](https://create-react-app.dev) package, which makes developing and compiling the frontend much easier.

To render and animate the GraphViz graphs, the frontend uses [d3-graphviz](https://github.com/magjac/d3-graphviz). [React Bootstrap Typeahead](http://ericgio.github.io/react-bootstrap-typeahead) is used for the search boxes.

As in the backend, [Citation.js](https://citation.js.org) is used for parsing and formatting CSL JSON metadata. It is also used to fetch DOI metadata.

The [CrossRef API](https://github.com/scienceai/crossref) is used for bibliographic metadata search.
