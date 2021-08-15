# RecipeManagerWeb

Web frontend to manage your recipes. Written with the PHP Framework [Laravel](https://laravel.com/).

A tool to manage your families and friends recipes like a chef.

![Recipes Overview](https://klaud.narrenhaus.ch/s/tSxqkHMpPgtPAGr/preview)

## Why is this so awesome?

- **Manage your recipes** - You and your friends can save, edit and delete recipes.
- **Share recipes** - You can share recipes by one click via Telegram or E-Mail.
- **Calculate servings** - Calculate servings directly in the recipe on the fly.
- **Exactly define recipe properties** - ..like author, category, tags, ingredients, units and more.
- **Disable/Enable functionalities** - Disable or enable dynamically cookbooks, tags, registration and more.
- **Great and easy API** - Access the easy-to-use REST-API.
- **Strict or flexible item creation** - Disable/Enable the possibility for users to create own foods and ingredient attributes.

## What features are planned?

- Unit and feature tests
- Improve and add advanced searching and filtering
- An advanced User-Role-System
- Import & more export types of recipes
- Nutrition informations
- Rating system (the API code is already written ;-) )
- Social login with Socialite
- A feature you think is missing...

## Getting Started

Get the latest [release](https://github.com/ammannbe/RecipeManagerWeb) or clone the repo with

```bash
git clone https://github.com/ammannbe/RecipeManagerWeb.git
```

### Prerequisites

- Node
- NPM

### Installation

It's recommended to install and update this software with docker/docker-compose.
See [here](docker/README.md) for more information.

Alternatively or for development purposes you can make a manual installation on any linux/unix machine:

#### Manual installation

- Install NPM packages `npm install`
- Copy .env.example to .env and modify it to your needs

#### Manual development deployment

- If not already done, [install](#installation) everything
- Run the server `npm run dev`

#### Manual production deployment

- If not already done, [install](#installation) everything
- Run the server

```bash
npm run build
npm run start
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Update

- Get the latest source (see [Getting Started](#getting-started))
- Check `.env.example` for changes
- Install NPM packages `npm install`
- Follow [Development deployment](#development-deployment) or [Production deployment](#production-deployment)

## Translations

You can find all translations and translation files in [./locales](./locales).
If you add a new file, remember to include it in [./locales/index.js](./locales/index.js).

## Built With

- [nuxt/http](https://github.com/nuxt/http) - Universal HTTP Module for Nuxt.js
- [nuxt-community/auth-module](https://github.com/nuxt-community/auth-module) - Zero-boilerplate authentication support for Nuxt.js!
- [nuxt-community/axios-module](https://github.com/nuxt-community/axios-module) - Secure and easy axios integration with Nuxt.js
- [nuxt-community/pwa-module](https://github.com/nuxt-community/pwa-module) - Zero config PWA solution for Nuxt.js
- [zloirock/core-js](https://github.com/zloirock/core-js) - Standard Library
- [nuxt/nuxt.js](https://github.com/nuxt/nuxt.js) - The Intuitive Vue Framework
- [nuxt-community/i18n-module](https://github.com/nuxt-community/i18n-module) - i18n for Nuxt
- [SortableJS/Vue.Draggable](https://github.com/SortableJS/Vue.Draggable) - Vue drag-and-drop component based on Sortable.js
- [timtnleeProject/vuejs-clipper](https://github.com/timtnleeProject/vuejs-clipper) - Vue.js image clipping components using Vue-Rx.
- [jonschlinkert/remarkable](https://github.com/jonschlinkert/remarkable) - Markdown parser, done right.
- [nuxt-community/vuetify-module](https://github.com/nuxt-community/vuetify-module) - Vuetify Module for Nuxt.js
- [babel/babel-eslint](https://github.com/babel/babel-eslint) - A wrapper for Babel's parser used for ESLint
- [eslint](https://eslint.org/) - Find and fix problems in your JavaScript code
- [prettier](https://prettier.io/) - Prettier is an opinionated code formatter
