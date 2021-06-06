/**
 * @fileoverview eslint-plugin-lodash-to-native
 * @author Ignatev Pavel
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

let rule = require('../../../lib/rules/map'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2021 } });
ruleTester.run('map', rule, {
  valid: [
    //ES6
    'let a = _.map({a : 1, b: 2}, n => {n * n})',
    //ES5
    'var a = _.map({a : 1, b: 2}, function(n){n * n})',
    //Без объявления функции как переменная
    '_.map({a : 1, b: 2}, n => {n * n})',
    //Правило не тригерит само себя, если проверка на значение переменной массив ли это уже существует
    'Array.isArray(variable) ? variable.map(() => {}) : _.map(variable, () => {})',
    //После присваиная не отрабатывает
    `_ = {map: () => []};
    false ? true : _.map(variable, () => {})`,
    //require
    'const _ = require("lodash")'
    
  ],

  invalid: [
    {
      code: '_.map([1, 2, 3], function(n){n * n})',
      output: "[1, 2, 3].map(function(n){n * n})",
      errors: [
        {
          message: 'Замените использование _.map на нативное Array#map',
          type: 'CallExpression'
        }
      ]
    }, 
    {
        code: '_.map([1, 2, 3], fn)',
        output: "[1, 2, 3].map(fn)",
        errors: [
          {
            message: 'Замените использование _.map на нативное Array#map',
            type: 'CallExpression'
          }
        ]
      }, 
    {
        code: '_.map(variable, () => {})',
        output: "(Array.isArray(variable) ? variable.map(() => {}) : _.map(variable, () => {}))",
        errors: [
          {
            message: 'Замените использование _.map на нативное Array#map, если первый параметр массив',
            type: 'CallExpression'
          }
        ]
      }, 
      {
        code: 'false ? true : _.map(variable, () => {})',
        output: "false ? true : (Array.isArray(variable) ? variable.map(() => {}) : _.map(variable, () => {}))",
        errors: [
          {
            message: 'Замените использование _.map на нативное Array#map, если первый параметр массив',
          }
        ]
      }, 
      {
        code: `false ? true : _.map(variable, () => {});
        _ = {map: () => []};
        false ? true : _.map(variable, () => {})`,
        output: `false ? true : (Array.isArray(variable) ? variable.map(() => {}) : _.map(variable, () => {}));
        _ = {map: () => []};
        false ? true : _.map(variable, () => {})`,
        errors: [
          {
            message: 'Замените использование _.map на нативное Array#map, если первый параметр массив',
          }
        ]
      }, 
      {
        code: '_.map(variable, (n) => n * n).map((n) => n * n);',
        output: '(Array.isArray(variable) ? variable.map((n) => n * n) : _.map(variable, (n) => n * n)).map((n) => n * n);',
        errors: [
          {
            message: 'Замените использование _.map на нативное Array#map, если первый параметр массив',
          }
        ]
      }, 
      {
        code: `const _ = require("lodash");
        _.map(variable, (n) => n * n).map((n) => n * n);`,
        output: `const _ = require("lodash");
        (Array.isArray(variable) ? variable.map((n) => n * n) : _.map(variable, (n) => n * n)).map((n) => n * n);`,
        errors: [
          {
            message: 'Замените использование _.map на нативное Array#map, если первый параметр массив',
          }
        ]
      }
      



  ]
});