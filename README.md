# relata-prototype

A prototype web application for the [Relata Project](https://culanth.org/engagements/relata). Built with [Feathers](https://feathersjs.com/) and [React](https://reactjs.org/).

## Table of contents

* [Quickstart](#quickstart)
  + [Enabling login via OAuth](#enabling-login-via-oauth)
* [Configuration](#configuration)
  + [Relata config](#relata-config)
* [Architecture](#architecture)
  + [Backend architecture](#backend-architecture)
    - [Database](#database)
  + [Frontend architecture](#frontend-architecture)
    - [React components](#react-components)
* [Production deployment](#production-deployment)
  + [Production checklist](#production-checklist)
* [Governance](#governance)
  + [Admin permissions](#admin-permissions)
* [Future work](#future-work)

## Quickstart

Here's how to get the app up and running in development mode:

1. Ensure that [Node](https://nodejs.org) and [npm](https://www.npmjs.com) are installed. Using Node 10.x is suggested.
2. Clone this repository.
3. Go to the project root folder (`cd path/to/relata-prototype`) and install dependencies by executing `npm install`.
4. Go to the `frontend` folder contained in the project root folder (`cd frontend`) and again execute `npm install`. (This is necessary because the frontend UI is a separate sub-package with its own dependencies.)
5. Return to the project root folder (`cd ..`).
6. To use the example database, create a `data` folder at the project root and copy the file `examples/sql_relata.sqlite` into it: `mkdir data && cp examples/sql_relata.sqlite data/sql_relata.sqlite`.
7. Execute `npm run dev` to start the app in development mode. This will start two processes: the backend application (on port 3030) and the frontend UI (on port 3000).
8. Go to <http://localhost:3000> in your browser to view the app.

Note that to enable user login, you must obtain OAuth keys from one or more OAuth providers. See the following section for details.

### Enabling login via OAuth

By default, relata-prototype is set up to support user login via the following OAuth providers:

* [GitHub](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)
* [Google](https://developers.google.com/identity/protocols/OAuth2)
* [Mendeley](https://dev.mendeley.com/reference/topics/application_registration.html)
* [Zotero](https://www.zotero.org/support/dev/web_api/v3/oauth)

Visit the above links to set up OAuth applications and obtain keys. (GitHub is an easy example to get started with.)

Once you've obtained one or more pairs of OAuth keys, you must set them as environment variables for the app to access them. For example, in a Mac or Linux environment, you can add these lines to your `.bash_profile` and then `source ~/.bash_profile` to load them into your terminal session:

```bash
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

In addition, you must set an app-wide secret using the environment variable `RELATA_SECRET`:

```bash
# This value is used to sign/encrypt cookies and keep user login sessions
# secure. It can be anything, but needs to remain secret, especially in a
# production environment
export RELATA_SECRET='XXXXXXXXXXXXXXXX'
```

Environment variables are used here for the security of the application. Your OAuth keys and Relata secret should remain private — do not include them in this repository or share them publicly!

## Configuration

The configuration files in the `config` folder should be used for non-sensitive configuration settings such as production URL and port, database filepath, etc. The different config files correspond to different environments (development and production); you can use one or the other by setting the environment variable `NODE_ENV`:

```bash
# App will use config/production.json
export NODE_ENV='production'

# Or...

# App will use config/development.json (default when calling npm run dev)
export NODE_ENV='development'
```

The app uses `default.json` as its base configuration regardless of the environment you choose, but will prioritize any settings from the environment configuration you specify. In other words, if you set `NODE_ENV='production'`, the app will first look in `production.json` and then fall back to `default.json`.

See the [Feathers configuration docs](https://docs.feathersjs.com/api/configuration.html) for more info on this.

### Relata config

See the `relata` section of `default.json` to change the following Relata-specific settings:

* `aboutUrl`: URL to be used for the "About" link on top navbar. Default: `https://culanth.org/engagements/relata`.
* `duplicateWorkThreshold`: The app uses a simple fuzzy text comparison of Chicago author-date citations to prevent the creation of duplicate works. (See the function `rejectDuplicateWork` in `src/services/works/works.hooks.js`.) This setting should be a fractional number between 0 and 1 representing the text similarity threshold at which two works are considered duplicates. Default: `0.67`.
* `oauthProviders`: Use this to define which OAuth providers are shown to the user, and in what order. Defaults: `zotero`, `mendeley`, `github`, and `google`.
  + Note: Adding further OAuth providers is complex, and requires additions to the backend code and database. This config setting is mostly a convenient way to hide or re-order the default providers.
* `types`: Relation types to make available for user selection. Each type should include the following properties:
  + `color`: A hex color code such as `#ff0000` used to represent this relation type in the user interface. and `preposition`. (The "catch-all" type named `*` is used to set the color for additional relation types outside of the controlled list in `types`.)
  + `preposition`: A preposition used in association with this relation type, such as the word `of` in the sentence "Work 1 represents an extension of Work 2."
  + `definition`: A full definition for this relation type, to be shown in the user interface's Glossary view and tooltips.

## Architecture

relata-prototype is composed of two main parts: a backend [Feathers](https://feathersjs.com) web app and a frontend [React](https://reactjs.org) user interface.

In __development mode__, these two parts are run concurrently on hot-reloading development servers via the magic of [npm-run-all](https://www.npmjs.com/package/npm-run-all). In __production mode__, the frontend is first compiled, and then served up along with the backend in a single united application.

The following sections describe the app architecture in much greater depth.

### Backend architecture

The relata-prototype backend is a [Feathers](https://feathersjs.com) web app that uses a lightweight [SQLite](https://www.sqlite.org/index.html) database. (see below for more info on the database structure). The Feathers web app exposes the following REST API services:

* `/users`: User accounts for logging in via OAuth and contributing relations
* `/works`: Bibliographic works, stored in CSL JSON format
* `/relations`: Relations between bibliographic works
* `/graphs`: Convenient endpoint for viewing citations, relations, and GraphViz DOT descriptions for a given work all in one place

In addition to the SQLite database, the backend uses [FlexSearch](https://github.com/nextapps-de/flexsearch) for a fast, lightweight in-memory search index. This search index is accessible via the `/graphs` service and can be accessed via the parameter `searchQuery`, e.g. `/graphs?searchQuery=cultural+anthropology`.

The invaluable [Citation.js](https://citation.js.org) package is used throughout the backend app to generate Chicago-style citations from CSL JSON records.

#### Database

The SQLite database, whose location is indicated in the `sqlite` property of `default.json` (default: `data/sql_relata.sqlite`), contains the following tables:

* `users`
* `works`
* `relations`

To query or edit the database directly, you can use either the `sqlite3` command line client or a tool such as [DB Browser for SQLite](https://sqlitebrowser.org/). While some degree of administration is available through the relata-prototype user interface, more complex changes (i.e. making a user an administrator, editing a work's CSL JSON) needs to be done by editing the database directly.

relata-prototype comes with an example database in the file `examples/sql_relata.sqlite`. As mentioned in the [Quickstart](#quickstart), you should use this example database as a basis for getting started with the app.

### Frontend architecture

relata-prototype's frontend user interface is built using [React Bootstrap](https://react-bootstrap.github.io) components and contained in a [create-react-app](https://create-react-app.dev) package, which makes developing and compiling the frontend much easier.

To render and animate the GraphViz graphs, the frontend uses [d3-graphviz](https://github.com/magjac/d3-graphviz). [React Bootstrap Typeahead](http://ericgio.github.io/react-bootstrap-typeahead) is used for the search boxes.

As in the backend, [Citation.js](https://citation.js.org) is used for parsing and formatting CSL JSON metadata. It is also used to fetch DOI metadata.

The [CrossRef API](https://github.com/scienceai/crossref) is used for the (currently somewhat limited) bibliographic metadata search.

#### React components

The frontend is broken up into many [React components](https://reactjs.org/docs/components-and-props.html). These can be found in `frontend/src/components`.

The main frontend components are as follows:

* `App`: The root-level web app component. Contains methods and state that apply to the entire frontend interface.
* `Navigation`: Contains the navbar at the top of the web interface. Includes subcomponents for various modals and a search bar.
* `RelationsPane`: Pane displaying citations on the left side of the user interface. Includes subcomponents for cards representing the currently selected work and related works.
* `GraphPane`: Pane displaying the visualization on the right side of the user interface.
* `EditRelationModal`: Modal that is displayed when adding a new relation or editing an existing one. Includes subcomponents for selecting works, relation type, etc.

## Production deployment

Here are a few pointers to keep in mind when deploying relata-prototype in production:

* relata-prototype has been tested using Node 10, which was the Active LTS version of Node in use during its development.
* While relata-prototype requires little overhead, building the frontend interface requires at least 4 GB of memory due to [an issue with d3-graphviz](https://github.com/magjac/d3-graphviz/issues/94). Setting `NODE_OPTIONS=--max_old_space_size=4096` ensures that the build will work (note: `npm run build` will do this for you!).
* relata-prototype should be deployed using a service with auto-restart, such as [PM2](https://pm2.keymetrics.io/). That way, the app can be quickly reloaded whenever it goes down. Ideally, this setup would also include a production-grade server like Nginx for routing traffic and managing SSL. Here is an [example Nginx configuration for a Node.js app managed by PM2](https://pm2.keymetrics.io/docs/tutorials/pm2-nginx-production-setup).
* In addition to auto-restart on failure, it's a good idea to schedule regular restarts to refresh the app's search cache. Nightly restarts might be a good place to begin. Again, a process manager like PM2 is a great tool for this (see PM2's `--cron` option for scheduling forced restarts).

### Production checklist

* Set up your production server to allow connections via HTTPS on port 443. (The backend Feathers app expects HTTPS for OAuth callbacks when `NODE_ENV=production` is set, so you will run into problems if you try to use HTTP in production.)
* Follow steps 1-6 from the [Quickstart](#quickstart) above to install relata-prototype and its dependencies and get yourself started with the example database.
* Configure your OAuth environment variables, along with `RELATA_SECRET`, as described in [Enabling login via OAuth](#enabling-login-via-oauth) above.
* Edit `config/production.json` to include the appropriate values for your production environment (hostname, port 443, etc.).
* Build the frontend code by executing `npm run build` from the relata-prototype root directory. (The compiled frontend code will be dropped into `frontend/build`, which is the default `public` path set in `config/default.json`.)
* Set up a process manager and server for the Node app (PM2 and Nginx are good options), with SSL configured. (See tutorials like [this one](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04) for a full overview of the Node + PM2 + Nginx stack.)
* Serve the Feathers app from the project root directory using `node src/`. (As discussed above, this should be executed by a process manager like PM2, not directly by the user.)
* If all the above has been configured properly, relata-prototype should be ready to go!

## Governance

Once OAuth is set up and the app is deployed, users can sign in via OAuth to add their own works, relations, and annotations.

Users can view all their relations in one place using the Contributions modal (accessible from the top navigation bar when signed in). They may edit and/or remove their own relations at any time by clicking the Edit button on a given relation.

A user can also use the Account modal (accessible from the top navigation bar when signed in) to edit her account's display name (to be displayed publicly in relation annotations) and email address (optional; only included for admin purposes, and only viewable by admins).

### Admin permissions

Users can be granted administrator permissions via the `isAdmin` field in the `users` database table. For purposes of security, this can only be set by editing the SQLite database directly. By default, `isAdmin` is set to `0` (false) for all users, and must be set to `1` (true) to enable administrator permissions. For example, to give admin rights to user 1, we would execute `UPDATE users SET isAdmin = 1 WHERE id = 1;`.

Users with admin permissions can use the Users modal (accessible from the top navigation bar when signed in) to review and delete other users. Please note that this results in permanent removal of not only the user account in question, but also all the relations they've created! It goes without saying that admin permissions should be used judiciously.

## Future work

As a prototype, the app leaves future developers many opportunities for improvement. Here are some directions one might keep in mind for future work and improvements:

* The backend could benefit from some refactoring and consolidation of redundant code (e.g., `makeCitations` is called in many places, when it might more simply be a single hook on the `/works` service) and inefficient database queries (e.g., for loops that call the database repeatedly).
* SQLite is a handy database solution for a prototype, but is less optimal for a production-grade application with lots of users writing to the database concurrently. A more robust solution like [PostgreSQL](https://www.postgresql.org/) could be adopted without much change to the app's data models.
* Likewise, the FlexSearch in-memory search index is a nice lightweight solution for a prototype. Production-grade search tools like [Elasticsearch](https://www.elastic.co/elasticsearch/) are more powerful but also more complex to set up and administer.
* The React frontend is fairly complex/verbose, and an able frontend developer could streamline it significantly by incorporating a state management tool like [MobX](https://mobx.js.org/README.html) or [Redux](https://redux.js.org/).
* The app should provide more informative handling of errors such as failing to create a work or relation, perhaps displaying an error banner or some obvious feedback to the user.
* Currently, the app does not include many safeguards for outlier conditions: for example, what should it do when a work has hundreds of relations and they can't all be coherently displayed in one graph? A developer might add sanity checks throughout the codebase to handle such circumstances more gracefully.
* The function `rejectDuplicateWork` (discussed above in [Configuration](#configuration)) identifies duplicate works based on a simple fuzzy comparison between Chicago-style citations. A more refined duplicate resolution algorithm might, e.g., perform a smart comparison between two CSL JSON objects, boosting the value of such fields as title, author, and publication date.
* While CrossRef's Search API is limited in the precision and recall of its results, it also provides (mostly) clean metadata in CSL JSON format, which is a huge benefit. A future version of the app might benefit from a library partnership that permitted access to a more flexible search API (e.g., Boolean search) but provided similarly high-quality metadata.
* In a similar vein, the app might permit users to add arbitrary works via free text fields such as Title and Author, instead of forcing them to look up works via DOI or CrossRef search. Note that there are many caveats in play here: How do you handle all the different bibliographic work types? How to exclude duplicates when users can submit works whose metadata may vary wildly in quality?
