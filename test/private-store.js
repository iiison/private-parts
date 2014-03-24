var test = require('tape');
var createStore = require('../lib/private-store');

test('It accepts an object and returns an object.', function(t) {
  t.plan(1);

  var _ = createStore();
  t.ok(_({}));
});

test('It returns undefined if given a non-object.', function(t) {
  t.plan(1);

  var _ = createStore();
  t.notOk(_());
});

test('It always returns the same private object'
  + ' given the same public object.', function(t) {

  t.plan(1);

  var _ = createStore();
  var pub = {};

  t.equal(_(pub), _(pub));
});

test('It will not double privatize an object.', function(t) {
  t.plan(1);

  var _ = createStore();
  var pub = {};

  t.equal(_(_(pub)), _(pub));
});

test('If a factory method is passed,'
  + ' it will use it to create the private object.', function(t) {

  t.plan(1);

  var factory = function(obj) {
    return { contains: obj };
  };

  var pub = {};
  var _ = createStore(factory);

  t.deepEqual(_(pub), { contains: pub });
});

test('If factory is an object, it will create new objects'
  + ' with factory as their prototype.', function(t) {

  t.plan(1);

  var obj = {};
  var _ = createStore(obj);

  t.equal(Object.getPrototypeOf(_({})), obj);
});


test('If no factory method is passed, it will default '
  + ' to creating an object with a null prototype.', function(t) {

  t.plan(1);

  var _ = createStore();

  t.equal(Object.getPrototypeOf(_({})), null);
});

test('Given the same public object, two different stores'
  + ' will return two different private objects.', function(t) {

  t.plan(1);

  var _1 = createStore();
  var _2 = createStore();
  var pub = {};

  t.notEqual(_1(pub), _2(pub));
});

test('It does not leak values outside of a scope', function(t) {

  t.plan(3);

  var pub = {};

  (function() {
    // inner scope 1
    var _ = createStore();

    _(pub).foo = 'foo';
    _(pub).bar = 'bar';

    t.deepEqual(_(pub), { foo: 'foo', bar: 'bar' });
  }());

  (function() {
    // inner scope 2
    var _ = createStore();

    _(pub).fizz = 'fizz';
    _(pub).buzz = 'buzz';

    t.deepEqual(_(pub), { fizz: 'fizz', buzz: 'buzz' });
  }());

  // outer scope
  var _ = createStore();
  t.deepEqual(_(pub), {});
});
