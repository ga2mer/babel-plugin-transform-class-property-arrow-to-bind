# babel-plugin-transform-class-property-arrow-to-bind
[![npm version](https://badge.fury.io/js/babel-plugin-transform-class-property-arrow-to-bind.svg)](https://badge.fury.io/js/babel-plugin-transform-class-property-arrow-to-bind)

Babel plugin for transform arrow functions in class to bind in constructor, fork of [louisscruz's plugin](https://github.com/louisscruz/babel-plugin-transform-class-property-arrow-functions)

Example:
```js
class A {
  method() {
    return 'Hello';
  }
}

class A1 extends A {
  method() {
    return super.method() + ' World';
  }
}


class B {
  test3 = 1337;
  method = () => {
    return 'Hello';
  }
  method2 = async () => {
    const result = await new Promise((res) => {
      setTimeout(() => res('Hello Async'), 1000);
    });
    return result;
  }
}

class B1 extends B {
  test = 123;
  test2 = 456;
  method = () => {
    return super.method() + ' World';
  }
  method2 = async () => {
    const result = await super.method2() + ' World';
    console.log(result);
  }
}


const a = new A1();
const b = new B1();

console.log(a.method())
console.log(b.method())
```
transforming to
```js
class A {
  method() {
    return 'Hello';
  }

}

class A1 extends A {
  method() {
    return super.method() + ' World';
  }

}

class B {
  constructor() {
    this.test3 = 1337;
    this.method = this.method.bind(this);
    this.method2 = this.method2.bind(this);
  }

  method() {
    return 'Hello';
  }

  async method2() {
    const result = await new Promise(res => {
      setTimeout(() => res('Hello Async'), 1000);
    });
    return result;
  }

}

class B1 extends B {
  constructor(...args) {
    super(...args);
    this.test = 123;
    this.test2 = 456;
    this.method = this.method.bind(this);
    this.method2 = this.method2.bind(this);
  }

  method() {
    return super.method() + ' World';
  }

  async method2() {
    const result = (await super.method2()) + ' World';
    console.log(result);
  }

}

const a = new A1();
const b = new B1();
console.log(a.method());
console.log(b.method());
```
## Installation
`npm install --save-dev babel-plugin-transform-class-property-arrow-to-bind`

`yarn add --dev babel-plugin-transform-class-property-arrow-to-bind`

## Usage

This plugin does not handle the transformation of class properties themselves.
For that, you will likely need to use [babel-plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties).

### Via `.babelrc` (Recommended)

```json
{
  "plugins": ["transform-class-property-arrow-to-bind"]
}
```

### Via CLI

```shell
babel --plugins transform-class-property-arrow-to-bind script.js
```

### Via Node API

```js
require('babel-core').transform('code', {
  plugins: ['transform-class-property-arrow-to-bind']
});
```