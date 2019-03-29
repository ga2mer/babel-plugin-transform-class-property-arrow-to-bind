const out = require("@babel/core").transform(`
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
}

class B1 extends B {
  test = 123;
  test2 = 456;
  method = () => {
    return super.method() + ' World';
  }
}


const a = new A1();
const b = new B1();

console.log(a.method())
console.log(b.method())

`, {
  plugins: [require('./dist/index').default, ['@babel/plugin-proposal-class-properties', { loose: true, }]],
});

console.log(out.code);
