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
          docCategory: 'colors',
          docExample: 'color'
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
