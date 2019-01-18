# rei-cedar-tokens

> tokens for cedar design system

## Consuming

1. Install the package `npm i -D @rei/cdr-tokens` (may need to remove the '-D' depending on your use case).
2. Import/require the tokens in your needed format. Platforms specific formats are available in each directory with the same name -- i.e. `dist/scss/cdr-tokens.scss`.
    - JS: commonjs (default) and es module
    - SCSS: variable and mixins
    - LESS: variable and mixins
    - Android: (WIP)
    - iOS: (WIP)


## Contributing

### Initial set up

1. Clone repo
2. `npm install`
3. `npm run build` (output tokens)

Tokens are generated using [Style Dictionary](https://amzn.github.io/style-dictionary/#/).

### Project structure
The project is made of these files and folders:

* `tokens/` contains the design tokens input files (in JSON5 format)
* `style-dictionary/` contains the build script, configs, transforms,actions, and formats used to generate the output files
* `dist/` contains the generated output files (in different formats)

### Tokens

> In the `tokens/` directory. Files are in [JSON5](https://json5.org/).

#### Token Structure

See [style-dictionary properties docs](https://amzn.github.io/style-dictionary/#/properties).

We follow the basic structure of style-dictionary with the exception being that our tokens **don't** follow the implicit CTI structure and we abstract that into a separate "category" key.

##### Options

Found in `tokens/_options/`

Options are skipped and do not get exported for consumers. However they can be [referenced](#referencing-options-or-other-values) in creating tokens that will be exported. These are our "options".

**NOTE:** "options" needs to be the root key in the file.

```
{
  options: { <-- anything beneath this will be ignored in output
    color: {
      'easily-excited': {
        value: '#3278ae',
        category: 'color',
      },
      'heart-of-darkness': {
        value: '#292929',
        category: 'color',
      },
      ...
    },
  }
}
```

Output **won't** have a token named `options-color-easily-excited`.

##### Naming

Token names are defined by the hierarchy of the object:

```
{
  text: {
    body: {
      default: {
        size: {
          value: '23',
          category: 'font-size',
        },
        height: {
          value: '25',
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

- size
    - Anything that would have a value in px. With the exception of...
- font-size
    - Anything that defines a text size
- color
    - Anything that defines a color

#### Referencing Options (or other values)

See [attribute referencing](https://amzn.github.io/style-dictionary/#/properties?id=attribute-reference-alias)

```
{
  color: {
    text: {
      primary: {
        'on-dark': {
          value: '{options.color.heart-of-darkness}',
          category: 'color',
        }
      }
    }
  }
}
```

### Style Dictionary

#### Build

Main build script that is executed with `npm run dict` is at `style-dictionary/build.js`. Logic to only build certain platforms or extending brands/themes will likely be done here.

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
