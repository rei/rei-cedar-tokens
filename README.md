# rei-cedar-tokens

> tokens for cedar design system

## Token structure

We are using [Theo](https://github.com/salesforce-ux/theo) for managing design tokens.

Tokens are stored in the `tokens/` directory. The rest of the files are for outputting a simple site to visually display the tokens.

Tokens are 1 of 3 types:
1. Foundational (`tokens/foundations/`)

Colors, spacing, etc. values that will be shared globally
  
2. Mixins (`tokens/m-*.yml`)

Groups of css declarations (for things like typography)

3. Variables (`tokens/v-*.yml`)

Component specific variables that are single value.

## Adding/updating tokens

If you are only updating an existing file, make changes and begin at step 3.

1. Create the new yml file.
2. Add the file to the appropriate index

`tokens/foundations/_index.yml` for foundations. `tokens/m_index.yml` for mixins. `tokens/v_index.yml` for variables.

3. `npm run theo` to test that the files are valid and can be processed.
4. `npm run dev` to start a dev server and verify the values generated are what are expected.
5. Start a PR

## Merging a PR/Releasing tokens

1. Review the PR
2. Update the static site

`npm run build` on the branch prior to merge (this will eventually be automated)

3. Merge PR
4. Create a new release tag (following semver)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
