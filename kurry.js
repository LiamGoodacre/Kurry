/*
 * Kurry.js
 * 
 * Copyright 2013 jQuery Foundation and other contributors
 * http://jquery.com/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function(define) {

	define(function Kurry() {

		/* Kurrier constructor */
		var Kurrier = function(p) {
			return function(n, f) {
				return (function recur(b_args) {
					return function() {
						return p(f, n, recur, b_args, [].slice.call(arguments));
					};
				})([]);
			};
		};

		/* utility functions */
		var appendAtLeastOne = function(xs, ys) {
			return xs.concat(ys.length ? ys : [void 0]);
		};

		var threadArgs = function recur(f, args) {
			return args.length ? recur(f.apply(this, args.splice(0, f.length)), args) : f;
		};

		var automaker = function(p) {
			return function(f) {
				return p(f.length, f);
			};
		};

		/* kurriers */
		var vari = Kurrier(function(f, n, recur, b_args, args) {
			var n_args = appendAtLeastOne(b_args, args);
			return n_args.length >= n ? f.apply(this, n_args) : recur(n_args);
		});

		var poly = Kurrier(function(f, n, recur, b_args, args) {
			var n_args = appendAtLeastOne(b_args, args);
			return (n_args.length >= n) ? threadArgs(f, n_args.slice(0, n)) : recur(n_args);
		});

		var mono = Kurrier(function(f, n, recur, b_args, args) {
			var n_args = b_args.concat([args[0]]);
			return (n_args.length >= n) ? f.apply(this, n_args.slice(0, n)) : recur(n_args);
		});

		/* local namespace */
		return {
			vari: poly(2, vari),
			autovari: automaker(vari),
			poly: poly(2, poly),
			autopoly: automaker(poly),
			mono: poly(2, mono),
			automono: automaker(mono),
			automaker: poly(2, automaker),
			Kurrier: Kurrier
		};
	});

})(typeof define == "function" ? define : typeof exports == "object" ? function(f) {
	module.exports = f()
} : function(f) {
	this[f.name] = f()
});