# sdk
Service SDK for getf1tickets

### What is this deposit for?

This repository expose all the required: methods, helpers, plugins, utils and models for all f1 tickets microservices.

## Installation

Make sure you have Node >12.X installed and yarn.

```bash
git clone https://github.com/getf1tickets/sdk
cd sdk
yarn
```

## Usage

### Build and release to local repository

Make sure yalc is installed globally.

```bash
yarn run build # This will create the dist folder with all the js files
yarn run local:publish # This will release the current package locally on your computer
```

#### Plugins

List of exported plugins :
- amqp

This plugin export two methods to fastify: `publish`, `createQueue` and one value: `channel`.

- authentification

This plugin export one method to fastify: `authorize`.

- avj

This plugin load all plugins and formats for avj (JSON schema validator).

- compress

This plugin load the `fastify-compress` plugin.

- cors

This plugin load the `fastify-cors` plugin.

- health

This plugin expose the `/health` route for health check by Kubernetes.

- hemlet

This plugin load the `faastify-helmet` plugin.

- middlewares

This plugin export three methods to fastify: `useUser`, `useProduct` and `useOrder`.

- sensible

This plugin load the `fastify-sensible` plugin.

- sequelize

This plugin start sequelize, load models and create pool to database. It export also the value `sequelize` to fastify.

- utils

This plugin export the utils: `to500`

### Models

Check the lib/models folder for the lsit.

### Utils

Check the lib/utils folder for the lsit.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to tests as appropriate.
