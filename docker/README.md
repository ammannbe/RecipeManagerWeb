# Quick reference

- Issues: https://github.com/ammannbe/RecipeManagerWeb
- Supported architectures: amd64

# Available tags

- 8.x.x, 8.x, 8, latest

# Installation

It's recommended to install this application with docker.
Consult https://github.com/ammannbe/RecipeManagerDocker for installation

# Environement Variables

See also: [Laravel Configuration](https://laravel.com/docs/8.x/configuration)

## App specific

- **APP_NAME:** Name of the App. _Default: RecipeManager_
- **API_URL** The full api URL. _Default: http://127.0.0.1:8000_

## App versions

-   **APP_VERSION:** Docker image version.

## Locales

- **LOCALE:** The default app locale _Default: en_
- **LOCALES:** Possible locales. Leave empty to hide the language switcher in the UI. _Default: en,de_

## Default Images

- **PLACEHOLDER_IMAGE** Optional: Full URL of a fallback recipe image.
- **NOT_FOUND_IMAGE** Fallback image, if the original one returns a HTTP 404 error. _Default: http://127.0.0.1:8000/img/not-found.jpg_

## Optional features

- **DISABLE_REGISTRATION** Disable user registrations _Default: false_
- **DISABLE_COOKBOOKS** Disable the cookbooks feature _Default: false_
- **DISABLE_TAGS** Disable the tags feature _Default: false_
- **DISABLE_RATINGS** Disable the ratings feature _Default: false_
- **DISABLE_FOOD_CREATION** Disable the food creation by normal users feature _Default: false_
- **DISABLE_INGREDIENT_ATTRIBUTE_CREATION** Disable the ingredient attribute creation by normal users _Default: false_
- **MAX_RATING_STARS** Tha amount of possible rating stars _Default: 5_
