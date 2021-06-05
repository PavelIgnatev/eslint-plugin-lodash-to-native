# eslint-plugin-lodash-to-native


## Установка

Если в вашем проекте ещё не присутствует eslint:
```
$ npm i eslint --save-dev
```

Далее устанавливаем плагин `eslint-plugin-lodash-to-native`:

```
$ npm install -S https://github.com/PavelIgnatev/eslint-plugin-lodash-to-native.git
```

## Использование

Добавьте плагин `lodash-to-native` в ваш конфигурационный файл `.eslintrc`:

```json
{
  "plugins": ["lodash-to-native"]
}
```

Затем настройте правило, которое вы хотите использовать:

```json
{
  "rules": {
    "lodash-to-native/map": 1
  }
}
```

## Правила
_map_ - это правило, которое проверяет использование метода Lodash "_.map" и, при возможности, исправит на нативное `Array # map` 


```js
// До исправления
_.map([1, 2, 3], n => {
  n * n;
});

// После исправления
[1, 2, 3].map(n => {
  n * n;
});
```
```js
// До исправления
_.map([1, 2, 3], fn);

// После исправления
[1, 2, 3].map(fn);
```

```js
// До исправления
_.map(variable, () => {});

// После исправления
Array.isArray(variable) ? variable.map(() => {}) : _.map(variable, () => {});
```

Если _ было переопределёно в коде, то правило не будет срабатывать после переопределения

```js
// До исправления
false ? true : _.map(variable, () => {});
_ = {map: () => []};
false ? true : _.map(variable, () => {})

// После исправления
false ? true : Array.isArray(variable) ? variable.map(() => {}) : _.map(variable, () => {});
_ = {map: () => []};
false ? true : _.map(variable, () => {})
```

### Тесты

### Правило изначально было покрыто тестам. 
Их можно было запустить с помощью команды:
```js
npm run test
```

### Если вы хотите запустить тесты из текущего проекта, то вам нужно сделать следующее:

Установить _mocha_ в проект:

```
$ npm install mocha --save-dev
```
В файл package.json добавить:
```json
"scripts": {
    "test": "mocha tests --recursive"
}
```
Запустить тесты с помощью команды:
```
$ npm run test node_modules/eslint-plugin-lodash-to-native/tests/lib/rules/map.js
```
