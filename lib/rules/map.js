/**
 * @fileoverview eslint-plugin-lodash-to-native
 * @author IgnatevPavel
 */
'use strict';

module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Замените использование _.map на нативное Array#map',
            category: 'suggestion',
            recommended: false
        },
        fixable: 'code',
        schema: [],
    },
    create: context => {
        let assignment = false;

        const isLodash = node => node.callee.object.name === '_'
        const isMap = node => node.callee.property.name === "map"
        const isArrayExpression = node => node.type === "ArrayExpression"
        const isObjectExpression = node => node.type === "ObjectExpression"
        const isConditionalExpression = node => node.type === 'ConditionalExpression';

        const sourceCode = context.getSourceCode();

        return {
            AssignmentExpression: node => {
                if (node.left.name = '_') {
                    assignment = true;
                }
            },
            CallExpression: node => {
                const [param, func] = node.arguments

                if (isMap(node) && isLodash(node) && !assignment && !isObjectExpression(param)) {

                    const textParam = sourceCode.getText(param)
                    const textFunc = sourceCode.getText(func)

                    const template = [
                        `Array.isArray(${textParam})`,
                        '?',
                        `${textParam}.map(${textFunc})`,
                        ':',
                        `_.map(${textParam}, ${textFunc})`
                    ];

                    if (isConditionalExpression(node.parent) &&
                        sourceCode.getText(node.parent.alternate) === template[4]) {
                        return;
                    }
                    if (isArrayExpression(param)) {
                        context.report({
                            node,
                            message:
                                'Замените использование _.map на нативное Array#map',
                            fix: fixer => {
                                return fixer.replaceText(node, template[2]);
                            },
                        })
                        return
                    }

                    context.report({
                        node,
                        message: 'Заменить использование _.map на нативное Array#map, если первый параметр массив',
                        fix: fixer => {
                            return fixer.replaceText(node, `${template.join(' ')}`);
                        }
                    })

                }
            }
        }
    }

}