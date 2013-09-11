# Kurry.js [0.0.1]

Kurry.js is a JavaScript library providing a small collection of functions that allow various forms of currying/uncurrying.  The main idea is to produce functions that can be used as both curried and uncurried functions.

So a function `f` of two arguments could be applied in multiple ways, here are two: `f(a, b)` or `f(a)(b)`.

[Wikipedia: Currying](http://en.wikipedia.org/wiki/Currying)

> In mathematics and computer science, currying is the technique of transforming a function that takes multiple arguments (or a tuple of arguments) in such a way that it can be called as a chain of functions, each with a single argument (partial application).

> Uncurrying is the dual transformation to currying, and can be seen as a form of defunctionalization. It takes a function f(x) which returns another function g(y) as a result, and yields a new function f′(x,y) which takes a number of additional parameters and applies them to the function returned by function f. The process can be iterated if necessary.


# npm

Now available on npm:

```
npm install kurry
```


# Documentation

### Kurry.mix(`exact argument count`, `function`) &rarr; `function`

Also called `poly`

Given an exact argument count (`n`), and a function (`f`) to curry/uncurry, it produces a new function (`f'`) said to be in a mixcurried state.

When function `f'` is called and the number of arguments provided match or exceed the required amount, then function `f` will be called with the number of named arguments `f` specifies.  If `f` requires less arguments than `n` and returns a function, then that function will be called, and we continue on in such a fashion until `n` arguments have been used up.

If there are fewer arguments provided to `f'` than required, then a new function is returned, which requires the rest of the arguments.

Calls with no arguments are equivalent to calling with one undefined argument.

It is incorrect for `n` to exceed the number of named arguments.

```js
var f = Kurry.mix(4, function (a, b) {
    return function (c, d) {
        return [a, b].concat([].slice.call(arguments));
    };
});

f(1, 2, 3, 4)    == [1, 2, 3, 4]
f(1)(2, 3, 4)    == [1, 2, 3, 4]
f(1, 2)(3, 4)    == [1, 2, 3, 4]
f(1, 2, 3)(4)    == [1, 2, 3, 4]
f(1, 2)(3)(4)    == [1, 2, 3, 4]
f(1)(2, 3)(4)    == [1, 2, 3, 4]
f(1)(2)(3, 4)    == [1, 2, 3, 4]
f(1)(2)(3)(4)    == [1, 2, 3, 4]
f(1, 2, 3, 4, 5) == [1, 2, 3, 4]
f(1, 2, 3)(4, 5) == [1, 2, 3, 4]
f(1, 2)()(4)     == [1, 2, undefined, 4]
f(1)(2)()(4)     == [1, 2, undefined, 4]
f(1)()()(4)      == [1, undefined, undefined, 4]
f(1)()(3, 4)     == [1, undefined, 3, 4]
...
```


### Kurry.automix(`function`) &rarr; `function`

Also called `autopoly`.

This is a wrapper around `Kurry.mix`.  The first argument passed to `Kurry.mix` is the number of named arguments in the top-level function passed in.

```js
var f = Kurry.automix(function (a, b, c) {
    return [].slice.call(arguments);
});

f(1, 2, 3)    == [1, 2, 3]
f(1)(2, 3)    == [1, 2, 3]
f(1, 2)(3)    == [1, 2, 3]
f(1)(2)(3)    == [1, 2, 3]
f(1, 2, 3, 4) == [1, 2, 3]
f(1)(2, 3, 4) == [1, 2, 3]
f(1, 2)(3, 4) == [1, 2, 3]
f(1)(2)(3, 4) == [1, 2, 3]
f(1, 2)()     == [1, 2, undefined]
f(1)()()      == [1, undefined, undefined]
f()()()       == [undefined, undefined, undefined]
```


### Kurry.vari(`minimum argument count`, `function`) &rarr; `function`

Given a minimum argument count (`n`), and a function (`f`) to curry/uncurry, it produces a new function (`f'`).

When function `f'` is called and the number of arguments provided match or exceed the required amount, then function `f` will be called with all the supplied arguments.

If there are fewer arguments provided to `f'` than required, then a new function is returned, which requires the rest of the arguments.

Calls with no arguments are equivalent to calling with one undefined argument.

```js
var f = Kurry.vari(2, function () {
    return [].slice.call(arguments);
});

f(2, 3)    == [2, 3]
f(2)(3)    == [2, 3]
f(2, 3, 4) == [2, 3, 4]
f(2)(3, 4) == [2, 3, 4]
f(2)(3)(4) // Error [2, 3] is not a function
```


### Kurry.autovari(`function`) &rarr; `function`

Wrapper around `Kurry.vari`, fills in the minimum argument count to be the number of named arguments in the function passed in.

```js
var f = Kurry.autovari(function (a, b) {
    return [].slice.call(arguments);
});

f(2, 3)    == [2, 3]
f(2)(3)    == [2, 3]
f(2, 3, 4) == [2, 3, 4]
f(2)(3, 4) == [2, 3, 4]
f(2)(3)(4) // Error [2, 3] is not a function
```


### Kurry.mono(`exact argument count`, `function`) &rarr; `function`

Only the first argument to each call of the resulting function are accepted as valid arguments.

Given an exact argument count (`n`), and a function (`f`) to curry/uncurry, it produces a new function (`f'`).

When function `f'` is called, the first argument is accepted and another function is returned.  This process repeats `n` times.  Once the final argument has been provided, `f` is applied with exactly `n` arguments.

Calls with no arguments are equivalent to calling with one undefined argument.

```js
var f = Kurry.mono(2, function () {
    return [].slice.call(arguments);
});

f(1)(2)             == [1, 2]
f(1, 2)(3, 4)       == [1, 3]
f(1, 2, 3)(4, 5, 6) == [1, 4]
```


### Kurry.automono(`function`) &rarr; `function`

Wrapper around `Kurry.mono`.  Fills in the exact argument count to be the number of named arguments in the function passed in.

```js
var f = Kurry.automono(function (x, y) {
    return [].slice.call(arguments);
});

f(1)(2)             == [1, 2]
f(1, 2)(3, 4)       == [1, 3]
f(1, 2, 3)(4, 5, 6) == [1, 4]
```
