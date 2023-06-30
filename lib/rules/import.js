/**
 * @fileoverview -
 * @author Birzhan
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const groupOrder = [
  'scope',
  'package',
  'relativeUp',
  'relativeLocal'
];

module.exports = {
  meta: {
    fixable: 'code'
  },

  create(context) {
    const sourceCode = context.sourceCode;
    const imports = [];
    const dynamicImports = [];

    return {
      ImportDeclaration: (node) => imports.push(node),
      ImportExpression: (node) => dynamicImports.push(node),

      'Program:exit': (root) => {
        const groups = new Map();

        for (const node of imports) {
          const src = node.source.value;
          const type = getImportType(src);
          const group = groups.get(type);

          if (!group) {
            groups.set(type, [{node, src}]);
            continue;
          }

          group.push({node, src});
        }

        groups.forEach((group) => group.sort((a, b) => a.src.localeCompare(b.src)));

        const code = groupOrder
          .map((groupName) => groups.get(groupName))
          .filter(Boolean)
          .map((group) => group
            .map(({node}) => {
              const comments = sourceCode.getCommentsBefore(node);
              let from;

              if (comments.length > 0) {
                from = comments[0].range[0];
              } else {
                from = node.range[0];
              }

              return context.sourceCode.getText().slice(from, node.range[1]);
            })
            .join('\n')
          ).join('\n\n');

        if (sourceCode.getText().startsWith(code)) {
          return;
        }

        context.report({
          message: 'Import fix',
          node: root,

          fix(fixer) {
            const removes = imports.map((node) => {
              const tokenBefore = sourceCode.getTokenBefore(node);
              const comments = sourceCode.getCommentsBefore(node);

              let from;

              if (comments.length > 0) {
                from = comments[0].range[0];
              } else {
                from = node.range[0];
              }

              return fixer.removeRange([
                tokenBefore ? tokenBefore.range[1] : from,
                node.range[1]
              ]);
            });

            const dynamicFixes = dynamicImports.map((node) => {
              let ancestor = node;

              while (ancestor.parent.type !== 'Program') {
                ancestor = ancestor.parent;
              }

              const tokenBefore = sourceCode.getTokenBefore(ancestor);
              const comments = sourceCode.getCommentsBefore(ancestor);

              let to;

              if (comments.length > 0) {
                to = comments[0].range[0];
              } else {
                to = ancestor.range[0];
              }

              const from = tokenBefore ? tokenBefore.range[1] : to;
              const between = sourceCode.getText().slice(from, to);

              if (!between.includes('\n\n')) {
                return fixer.replaceTextRange([from, to], '\n\n');
              }

            }).filter(Boolean);

            return [
              fixer.insertTextAfterRange([0, 0], code),
              ...removes,
              ...dynamicFixes
            ];
          }
        })
      }

    };
  },
};

function getImportType(src) {
  if (src.startsWith('@')) {
    return 'scope';
  }

  if (src.startsWith('../')) {
    return 'relativeUp';
  }

  if (src.startsWith('./') || src.startsWith('.')) {
    return 'relativeLocal';
  }

  return 'package';
}

