# Node Project Initializer

[![License][license-image]][license-url] [![version][npm-image]][npm-url]

An [npm initializer][npm/init] to scaffold a node project and include basic tools like lint, testing, etc.

## Requirements

- `npm >= 6.x`
- `node >= 8.*`

## Usage

```bash
npm init node-project [params]
```

## How does this work?

> _`npm init <initializer>` can be used to set up a new or existing npm package._  
> _`initializer` in this case is an npm package named `create-<initializer>`, which will be installed by `npx`, and then have its main bin executed -- presumably creating or updating `package.json` and running any other initialization-related operations._  
> _[&mdash; Source: `docs.npmjs.com`][npm/init]_

## Params

- Project path

`npm init node-project path/to/project`

Will create a new folder for the project and use the forlder name as the project name.



[license-url]: LICENSE
[license-image]: https://img.shields.io/github/license/ahmadnassri/node-create.svg?style=for-the-badge&logo=circleci

[npm-url]: https://www.npmjs.com/package/@nmicht/create
[npm-image]: https://img.shields.io/npm/v/@nmicht/create.svg?style=for-the-badge&logo=npm

[npm/init]: https://docs.npmjs.com/cli/init#description