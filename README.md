# eslint-plugin-fsd-helper

checks imports for [FSD](https://feature-sliced.design/) architecture

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-fsd-helper`:

```sh
npm install eslint-plugin-fsd-helper --save-dev
```

## Usage

Add `fsd-helper` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "fsd-helper"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "fsd-helper/path-ckecker": ["error", { "alias": "@" }],
        "fsd-helper/public-api-imports": ["error", { "alias": "@" }],
        "fsd-helper/layer-imports": [
            "error",
            {
            "alias": "@",
            "ignoreImportPatterns": ["**/StoreProvider"]
            }
        ]
        
    }
}
```

## Supported Rules

* Fill in provided rules here


