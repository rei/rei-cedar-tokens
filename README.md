# rei-cedar-tokens

> tokens for cedar design system

## Consuming

1. Install the package `npm i -D @rei/cdr-tokens` (may need to remove the '-D' depending on your use case).
2. Import/require the tokens in your needed format. Platforms specific formats are available in each directory with the same name -- i.e. `dist/scss/cdr-tokens.scss`.
    - JS: commonjs (default) and es module
    - SCSS: variable and mixins
    - LESS: variable and mixins
    - Android: XML style sheets for Colors and Dimensions
    - iOS: Objective C classes for Color and Size

    ** REI Internal teams should use the internal [iOS](https://git.rei.com/projects/CDR2/repos/rei-cedar-ios/) and [Android](https://git.rei.com/projects/CDR2/repos/rei-cedar-android/) packages.

## Updating

If you are consuming tokens in SCSS, there are deprecation warnings for variables, mixins, etc. that will appear in the console during your build. These can be silenced by adding a variable to your code called `cdr-warn` and setting it to false like this: `$cdr-warn: false;`

All other formats should consult the changelog for a migration path.

## Contributing

### Initial set up

1. Clone repo
2. `npm install`
3. `npm run build` (output tokens)

Tokens are generated using [Style Dictionary](https://amzn.github.io/style-dictionary/#/).

### Project structure
The project is made of these files and folders:

* `tokens/` contains the design tokens input files (in JSON5 format)
    * `tokens/_options/` contains "option" tokens [see below](#options)
    * `tokens/global/` contains design tokens that are output for all platforms
    * `tokens/<platform>/` contains design tokens specific to a platform (like mixins for scss/less that others can't use)
* `style-dictionary/` contains the build script, configs, transforms,actions, and formats used to generate the output files
* `dist/` contains the generated output files (in different formats)
* `docs/` contains app that is generated for [gh-pages examples](https://rei.github.io/rei-cedar-tokens/)

### Tokens

> In the `tokens/` directory. Files are in [JSON5](https://json5.org/).

#### Token Structure

See [style-dictionary properties docs](https://amzn.github.io/style-dictionary/#/properties).

We follow the basic structure of style-dictionary with the exception being that our tokens **don't** follow the implicit [CTI](https://amzn.github.io/style-dictionary/#/properties?id=category-type-item) structure and we abstract that into a separate "category" key (see [Categories](#categories) below).

##### Token Properties

The following properties can be added to tokens to support different options

```
value           # *required* The token value (most token values should be referenced from options)
category        # *required* The tokens category (used to transform values for their specific platform)
docs            # Object to define meta data for docs
  category      # The category tokens are grouped in on the examples page
  type          # The sub category tokens are grouped in on the examples page
  example       # Defines how the token should be presented on the examples page -- Current example types are: color, spacing, sizing, radius, prominence, text, inset, and breakpoint
mixin           # The name of the generated SCSS/LESS mixin (must be used with property)
property        # Used with mixin -- the css property the value is applied to within the mixin
'utility-class' # Boolean -- Used to create scss maps of properties to more easily generate utility classes in cedar
```

#### Options

Found in `tokens/_options/`

Options are skipped and do not get exported for consumers. However they can be [referenced](#referencing-options-or-other-values) in creating tokens that will be exported.

**NOTE:** "options" needs to be the root key in the file.

```js
{
  options: { // <-- anything beneath this will be ignored in output
    color: {
      'easily-excited': {
        value: '#3278ae',
        category: 'color',
      },
      'heart-of-darkness': {
        value: '#292929',
        category: 'color',
      },
      // ...
    },
  }
}
```

Output **won't** have a token named `options-color-easily-excited`.

#### Naming

Token names are defined by the hierarchy of the object:

```js
{
  text: {
    body: {
      default: {
        size: {
          value: '23px',
          category: 'font-size',
        },
        height: {
          value: '25px',
          category: 'size',
        },
      },
    },
  }
}
```

Token output of above:

`text-body-default-size: 23px;`

`text-body-default-height: 25px;`

#### Categories

> Categories need to be attached to **both** options and tokens (due to limitations of style-dictionary resolve order. [This may change in the future](https://github.com/amzn/style-dictionary/issues/208))

Categories define how style-dictionary should transform values between platforms.

For example, a category of "size" will transform to 'rem' for SCSS/LESS but 'dp' for Android. A category of "font-size" will still transform values to 'rem' for SCSS/LESS but 'sp' for Android.

Categories are one of the following:

- `size`: Anything that would have a value in px. With the exception of font-size
- `font-size`: Anything that defines a text size
- `letter-spacing`: exists too?
- `color`: Anything that defines a color
- `time`: Anything the defines a timing
- Values without a category will not be transformed: Anything that is a string like `'normal'` or `'italic'`

#### Referencing Options (or other values)

See [attribute referencing](https://amzn.github.io/style-dictionary/#/properties?id=attribute-reference-alias)

```js
{
  color: {
    text: {
      primary: {
        'on-dark': {
          value: '{options.color.heart-of-darkness}',
          category: 'color',
          docs: {
            category: 'colors',
            type: 'text',
            example: 'color'
          }
        }
      }
    }
  }
}
```

### Documentation within tokens

Tokens also have data that can be added to them to help generate documentation & examples. To get an idea of how this data is used see [the tokens example page](https://rei.github.io/rei-cedar-tokens/). This data is mostly used to create groupings of tokens and is not used to do transforms on token values, only for display in docs.

The docs object looks like this:

```js
docs: {
  category: String,     // Large, broad groupings of things (i.e. color, spacing)
  type: String,         // Sub category (i.e. background (color) or inset (spacing))
  example: String,      // Used to determine how to display a visual representation of a token
                        // Current options (see docs/src/components/PropSorter.vue): color, spacing, sizing, radius, prominence, text, inset, breakpoint, timing, duration, an empty example defaults to 'token' which is just a string representation of the value.
  description: String,  // Short description of the token and/or suggested usage (displayed on the cedar docs site)
}
```

### Deprecating tokens

Deprecated tokens should be moved to a seprate file (or into the existing file) which corresponds to the release cycle in which they will be deprecated.

For example, if tokens will be considered deprecated in the "Winter 2019" release they would be moved into a file called `deprecated-2019-winter.json5` in whichever directory they currently reside. Structure for naming the file is : `deprecated-<year>-<release>`

Additionally, the contents will be wrapped inside an object with a key that corresponds to the release as well (so we can auto generate some deprecation warnings with the correct release). The key matches the naming of the file. See below for an example.

```js
{
  'deprecated-2019-winter`: {  // <-------- `deprecated-<year>-<release>`
      color: {
        text: {
          primary: {
            'on-dark': {
              value: '{options.color.heart-of-darkness}',
            category: 'color',
            docs: {
              category: 'colors',
              type: 'text',
              example: 'color'
            }
          }
        }
      }
    }
    // ...
  }
}
```

#### Providing a migration path

When tokens are deprecated they can also be provided a new token name or new mixin name to use instead which will be provided in the SASS deprecation warning:

```js
{
  'deprecated-2019-winter': {
    text: {
      header: {
        '1': {
          family: {
            value: '{options.font.family.serif.value}',
            mixin: 'textHeader1',
            property: 'font-family',
            newMixin: 'new-mixin-name',             //<--- a new mixin name to use instead of the deprecated one
            newToken: 'new-token-name',             //<--- a new token name to use instead of the deprecated one
            docs: {
              category: '{text.docCategory}',
              type: 'header',
              example: '{text.docExample}',
            },
          },
        }
      }
    }
  }
}
```

### Style Dictionary

#### Build

Main build script that is executed with `npm run build` is at `style-dictionary/build.js`. Logic to only build certain platforms or extending brands/themes will likely be done here.

All actions, configs, formats, etc are imported in this file and it [extends](https://amzn.github.io/style-dictionary/#/extending) the base style-dictionary functionality.

#### Actions

Found in `style-dictionary/actions`

See API for [creating an action](https://amzn.github.io/style-dictionary/#/api?id=registeraction)

See [actions docs](https://amzn.github.io/style-dictionary/#/actions)

#### Configs

Found in `style-dictionary/configs`

See [config docs](https://amzn.github.io/style-dictionary/#/config).

Configs follow standard config options. They are organized separately by platform and are required into the `_index.js` file where they all have a filter for options applied.

#### Formats

Found in `style-dictionary/formats`

See API for [creating a format](https://amzn.github.io/style-dictionary/#/api?id=registerformat)

See [format docs](https://amzn.github.io/style-dictionary/#/formats).

#### Transform Groups

Found in `style-dictionary/transformGroups`

See API for [creating a transform group](https://amzn.github.io/style-dictionary/#/api?id=registertransformgroup)

See [transform group docs](https://amzn.github.io/style-dictionary/#/transform_groups).

#### Transforms

Found in `style-dictionary/transforms`

See API for [creating a transform](https://amzn.github.io/style-dictionary/#/api?id=registertransform)

See [transform docs](https://amzn.github.io/style-dictionary/#/transforms).

### Validation

Because this library has many dependencies, there is a validation script that performs some checks. One of the tests is verifying the file structure has not changed. If a change is intentional, the `validate-structure.json` may be deleted, which will be automatically created on the next run. The `validate-structure.json` file should be commited.
