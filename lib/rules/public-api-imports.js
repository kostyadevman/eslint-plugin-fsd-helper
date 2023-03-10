const {isPathRelative} = require("../helpers");
const micromatch = require("micromatch");
const path = require("path");

module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "check imports from public API (index.ts)",
      category: "Fill me in",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: `code`, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          testFilesPatterns: {
            type: 'array'
          }
        }
      }
    ],
    messages: {
      puclicApiImport: 'Абсолютный импорт разрешен только из Public API (index.ts)',
      testImport: 'Тестовые данные необходимо импортировать из publicApi/testing.ts',
    },
  },

  create(context) {
    const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {};

    const checkingLayers = {
      'entities': 'entities',
      'features': 'features',
      'pages': 'pages',
      'widgets': 'widgets',
    }

    return {
      ImportDeclaration(node) {
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if(isPathRelative(importTo)) {
          return;
        }

        // [entities, article, model, types]
        const segments = importTo.split('/')
        const layer = segments[0];
        const slice = segments[1];

        if(!checkingLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        // [entities, article, testing]
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4

        if(isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report(
            {
              node: node,
              messageId: 'puclicApiImport',
              fix: (fixer) => {
                return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`)
              }
            });
        }

        if(isTestingPublicApi) {
          const currentFilePath = context.getFilename();
          const normalizedPath = path.toNamespacedPath(currentFilePath);

          const isCurrentFileTesting = testFilesPatterns.some(
              pattern => micromatch.isMatch(normalizedPath, pattern)
          )

          if(!isCurrentFileTesting) {
            context.report({node: node, messageId: 'testImport'});
          }
        }
      }
    };
  },
};
