/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/@babel/runtime/node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/@glidejs/glide/dist/glide.esm.js":
/*!*******************************************************!*\
  !*** ./node_modules/@glidejs/glide/dist/glide.esm.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*!
 * Glide.js v3.3.0
 * (c) 2013-2019 Jędrzej Chałubek <jedrzej.chalubek@gmail.com> (http://jedrzejchalubek.com/)
 * Released under the MIT License.
 */

var defaults = {
  /**
   * Type of the movement.
   *
   * Available types:
   * `slider` - Rewinds slider to the start/end when it reaches the first or last slide.
   * `carousel` - Changes slides without starting over when it reaches the first or last slide.
   *
   * @type {String}
   */
  type: 'slider',

  /**
   * Start at specific slide number defined with zero-based index.
   *
   * @type {Number}
   */
  startAt: 0,

  /**
   * A number of slides visible on the single viewport.
   *
   * @type {Number}
   */
  perView: 1,

  /**
   * Focus currently active slide at a specified position in the track.
   *
   * Available inputs:
   * `center` - Current slide will be always focused at the center of a track.
   * `0,1,2,3...` - Current slide will be focused on the specified zero-based index.
   *
   * @type {String|Number}
   */
  focusAt: 0,

  /**
   * A size of the gap added between slides.
   *
   * @type {Number}
   */
  gap: 10,

  /**
   * Change slides after a specified interval. Use `false` for turning off autoplay.
   *
   * @type {Number|Boolean}
   */
  autoplay: false,

  /**
   * Stop autoplay on mouseover event.
   *
   * @type {Boolean}
   */
  hoverpause: true,

  /**
   * Allow for changing slides with left and right keyboard arrows.
   *
   * @type {Boolean}
   */
  keyboard: true,

  /**
   * Stop running `perView` number of slides from the end. Use this
   * option if you don't want to have an empty space after
   * a slider. Works only with `slider` type and a
   * non-centered `focusAt` setting.
   *
   * @type {Boolean}
   */
  bound: false,

  /**
   * Minimal swipe distance needed to change the slide. Use `false` for turning off a swiping.
   *
   * @type {Number|Boolean}
   */
  swipeThreshold: 80,

  /**
   * Minimal mouse drag distance needed to change the slide. Use `false` for turning off a dragging.
   *
   * @type {Number|Boolean}
   */
  dragThreshold: 120,

  /**
   * A maximum number of slides to which movement will be made on swiping or dragging. Use `false` for unlimited.
   *
   * @type {Number|Boolean}
   */
  perTouch: false,

  /**
   * Moving distance ratio of the slides on a swiping and dragging.
   *
   * @type {Number}
   */
  touchRatio: 0.5,

  /**
   * Angle required to activate slides moving on swiping or dragging.
   *
   * @type {Number}
   */
  touchAngle: 45,

  /**
   * Duration of the animation in milliseconds.
   *
   * @type {Number}
   */
  animationDuration: 400,

  /**
   * Allows looping the `slider` type. Slider will rewind to the first/last slide when it's at the start/end.
   *
   * @type {Boolean}
   */
  rewind: true,

  /**
   * Duration of the rewinding animation of the `slider` type in milliseconds.
   *
   * @type {Number}
   */
  rewindDuration: 800,

  /**
   * Easing function for the animation.
   *
   * @type {String}
   */
  animationTimingFunc: 'cubic-bezier(.165, .840, .440, 1)',

  /**
   * Throttle costly events at most once per every wait milliseconds.
   *
   * @type {Number}
   */
  throttle: 10,

  /**
   * Moving direction mode.
   *
   * Available inputs:
   * - 'ltr' - left to right movement,
   * - 'rtl' - right to left movement.
   *
   * @type {String}
   */
  direction: 'ltr',

  /**
   * The distance value of the next and previous viewports which
   * have to peek in the current view. Accepts number and
   * pixels as a string. Left and right peeking can be
   * set up separately with a directions object.
   *
   * For example:
   * `100` - Peek 100px on the both sides.
   * { before: 100, after: 50 }` - Peek 100px on the left side and 50px on the right side.
   *
   * @type {Number|String|Object}
   */
  peek: 0,

  /**
   * Collection of options applied at specified media breakpoints.
   * For example: display two slides per view under 800px.
   * `{
   *   '800px': {
   *     perView: 2
   *   }
   * }`
   */
  breakpoints: {},

  /**
   * Collection of internally used HTML classes.
   *
   * @todo Refactor `slider` and `carousel` properties to single `type: { slider: '', carousel: '' }` object
   * @type {Object}
   */
  classes: {
    direction: {
      ltr: 'glide--ltr',
      rtl: 'glide--rtl'
    },
    slider: 'glide--slider',
    carousel: 'glide--carousel',
    swipeable: 'glide--swipeable',
    dragging: 'glide--dragging',
    cloneSlide: 'glide__slide--clone',
    activeNav: 'glide__bullet--active',
    activeSlide: 'glide__slide--active',
    disabledArrow: 'glide__arrow--disabled'
  }
};

/**
 * Outputs warning message to the bowser console.
 *
 * @param  {String} msg
 * @return {Void}
 */
function warn(msg) {
  console.error("[Glide warn]: " + msg);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * Converts value entered as number
 * or string to integer value.
 *
 * @param {String} value
 * @returns {Number}
 */
function toInt(value) {
  return parseInt(value);
}

/**
 * Converts value entered as number
 * or string to flat value.
 *
 * @param {String} value
 * @returns {Number}
 */
function toFloat(value) {
  return parseFloat(value);
}

/**
 * Indicates whether the specified value is a string.
 *
 * @param  {*}   value
 * @return {Boolean}
 */
function isString(value) {
  return typeof value === 'string';
}

/**
 * Indicates whether the specified value is an object.
 *
 * @param  {*} value
 * @return {Boolean}
 *
 * @see https://github.com/jashkenas/underscore
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

  return type === 'function' || type === 'object' && !!value; // eslint-disable-line no-mixed-operators
}

/**
 * Indicates whether the specified value is a number.
 *
 * @param  {*} value
 * @return {Boolean}
 */
function isNumber(value) {
  return typeof value === 'number';
}

/**
 * Indicates whether the specified value is a function.
 *
 * @param  {*} value
 * @return {Boolean}
 */
function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Indicates whether the specified value is undefined.
 *
 * @param  {*} value
 * @return {Boolean}
 */
function isUndefined(value) {
  return typeof value === 'undefined';
}

/**
 * Indicates whether the specified value is an array.
 *
 * @param  {*} value
 * @return {Boolean}
 */
function isArray(value) {
  return value.constructor === Array;
}

/**
 * Creates and initializes specified collection of extensions.
 * Each extension receives access to instance of glide and rest of components.
 *
 * @param {Object} glide
 * @param {Object} extensions
 *
 * @returns {Object}
 */
function mount(glide, extensions, events) {
  var components = {};

  for (var name in extensions) {
    if (isFunction(extensions[name])) {
      components[name] = extensions[name](glide, components, events);
    } else {
      warn('Extension must be a function');
    }
  }

  for (var _name in components) {
    if (isFunction(components[_name].mount)) {
      components[_name].mount();
    }
  }

  return components;
}

/**
 * Defines getter and setter property on the specified object.
 *
 * @param  {Object} obj         Object where property has to be defined.
 * @param  {String} prop        Name of the defined property.
 * @param  {Object} definition  Get and set definitions for the property.
 * @return {Void}
 */
function define(obj, prop, definition) {
  Object.defineProperty(obj, prop, definition);
}

/**
 * Sorts aphabetically object keys.
 *
 * @param  {Object} obj
 * @return {Object}
 */
function sortKeys(obj) {
  return Object.keys(obj).sort().reduce(function (r, k) {
    r[k] = obj[k];

    return r[k], r;
  }, {});
}

/**
 * Merges passed settings object with default options.
 *
 * @param  {Object} defaults
 * @param  {Object} settings
 * @return {Object}
 */
function mergeOptions(defaults, settings) {
  var options = _extends({}, defaults, settings);

  // `Object.assign` do not deeply merge objects, so we
  // have to do it manually for every nested object
  // in options. Although it does not look smart,
  // it's smaller and faster than some fancy
  // merging deep-merge algorithm script.
  if (settings.hasOwnProperty('classes')) {
    options.classes = _extends({}, defaults.classes, settings.classes);

    if (settings.classes.hasOwnProperty('direction')) {
      options.classes.direction = _extends({}, defaults.classes.direction, settings.classes.direction);
    }
  }

  if (settings.hasOwnProperty('breakpoints')) {
    options.breakpoints = _extends({}, defaults.breakpoints, settings.breakpoints);
  }

  return options;
}

var EventsBus = function () {
  /**
   * Construct a EventBus instance.
   *
   * @param {Object} events
   */
  function EventsBus() {
    var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, EventsBus);

    this.events = events;
    this.hop = events.hasOwnProperty;
  }

  /**
   * Adds listener to the specifed event.
   *
   * @param {String|Array} event
   * @param {Function} handler
   */


  createClass(EventsBus, [{
    key: 'on',
    value: function on(event, handler) {
      if (isArray(event)) {
        for (var i = 0; i < event.length; i++) {
          this.on(event[i], handler);
        }
      }

      // Create the event's object if not yet created
      if (!this.hop.call(this.events, event)) {
        this.events[event] = [];
      }

      // Add the handler to queue
      var index = this.events[event].push(handler) - 1;

      // Provide handle back for removal of event
      return {
        remove: function remove() {
          delete this.events[event][index];
        }
      };
    }

    /**
     * Runs registered handlers for specified event.
     *
     * @param {String|Array} event
     * @param {Object=} context
     */

  }, {
    key: 'emit',
    value: function emit(event, context) {
      if (isArray(event)) {
        for (var i = 0; i < event.length; i++) {
          this.emit(event[i], context);
        }
      }

      // If the event doesn't exist, or there's no handlers in queue, just leave
      if (!this.hop.call(this.events, event)) {
        return;
      }

      // Cycle through events queue, fire!
      this.events[event].forEach(function (item) {
        item(context || {});
      });
    }
  }]);
  return EventsBus;
}();

var Glide = function () {
  /**
   * Construct glide.
   *
   * @param  {String} selector
   * @param  {Object} options
   */
  function Glide(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Glide);

    this._c = {};
    this._t = [];
    this._e = new EventsBus();

    this.disabled = false;
    this.selector = selector;
    this.settings = mergeOptions(defaults, options);
    this.index = this.settings.startAt;
  }

  /**
   * Initializes glide.
   *
   * @param {Object} extensions Collection of extensions to initialize.
   * @return {Glide}
   */


  createClass(Glide, [{
    key: 'mount',
    value: function mount$$1() {
      var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._e.emit('mount.before');

      if (isObject(extensions)) {
        this._c = mount(this, extensions, this._e);
      } else {
        warn('You need to provide a object on `mount()`');
      }

      this._e.emit('mount.after');

      return this;
    }

    /**
     * Collects an instance `translate` transformers.
     *
     * @param  {Array} transformers Collection of transformers.
     * @return {Void}
     */

  }, {
    key: 'mutate',
    value: function mutate() {
      var transformers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (isArray(transformers)) {
        this._t = transformers;
      } else {
        warn('You need to provide a array on `mutate()`');
      }

      return this;
    }

    /**
     * Updates glide with specified settings.
     *
     * @param {Object} settings
     * @return {Glide}
     */

  }, {
    key: 'update',
    value: function update() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.settings = mergeOptions(this.settings, settings);

      if (settings.hasOwnProperty('startAt')) {
        this.index = settings.startAt;
      }

      this._e.emit('update');

      return this;
    }

    /**
     * Change slide with specified pattern. A pattern must be in the special format:
     * `>` - Move one forward
     * `<` - Move one backward
     * `={i}` - Go to {i} zero-based slide (eq. '=1', will go to second slide)
     * `>>` - Rewinds to end (last slide)
     * `<<` - Rewinds to start (first slide)
     *
     * @param {String} pattern
     * @return {Glide}
     */

  }, {
    key: 'go',
    value: function go(pattern) {
      this._c.Run.make(pattern);

      return this;
    }

    /**
     * Move track by specified distance.
     *
     * @param {String} distance
     * @return {Glide}
     */

  }, {
    key: 'move',
    value: function move(distance) {
      this._c.Transition.disable();
      this._c.Move.make(distance);

      return this;
    }

    /**
     * Destroy instance and revert all changes done by this._c.
     *
     * @return {Glide}
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this._e.emit('destroy');

      return this;
    }

    /**
     * Start instance autoplaying.
     *
     * @param {Boolean|Number} interval Run autoplaying with passed interval regardless of `autoplay` settings
     * @return {Glide}
     */

  }, {
    key: 'play',
    value: function play() {
      var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (interval) {
        this.settings.autoplay = interval;
      }

      this._e.emit('play');

      return this;
    }

    /**
     * Stop instance autoplaying.
     *
     * @return {Glide}
     */

  }, {
    key: 'pause',
    value: function pause() {
      this._e.emit('pause');

      return this;
    }

    /**
     * Sets glide into a idle status.
     *
     * @return {Glide}
     */

  }, {
    key: 'disable',
    value: function disable() {
      this.disabled = true;

      return this;
    }

    /**
     * Sets glide into a active status.
     *
     * @return {Glide}
     */

  }, {
    key: 'enable',
    value: function enable() {
      this.disabled = false;

      return this;
    }

    /**
     * Adds cuutom event listener with handler.
     *
     * @param  {String|Array} event
     * @param  {Function} handler
     * @return {Glide}
     */

  }, {
    key: 'on',
    value: function on(event, handler) {
      this._e.on(event, handler);

      return this;
    }

    /**
     * Checks if glide is a precised type.
     *
     * @param  {String} name
     * @return {Boolean}
     */

  }, {
    key: 'isType',
    value: function isType(name) {
      return this.settings.type === name;
    }

    /**
     * Gets value of the core options.
     *
     * @return {Object}
     */

  }, {
    key: 'settings',
    get: function get$$1() {
      return this._o;
    }

    /**
     * Sets value of the core options.
     *
     * @param  {Object} o
     * @return {Void}
     */
    ,
    set: function set$$1(o) {
      if (isObject(o)) {
        this._o = o;
      } else {
        warn('Options must be an `object` instance.');
      }
    }

    /**
     * Gets current index of the slider.
     *
     * @return {Object}
     */

  }, {
    key: 'index',
    get: function get$$1() {
      return this._i;
    }

    /**
     * Sets current index a slider.
     *
     * @return {Object}
     */
    ,
    set: function set$$1(i) {
      this._i = toInt(i);
    }

    /**
     * Gets type name of the slider.
     *
     * @return {String}
     */

  }, {
    key: 'type',
    get: function get$$1() {
      return this.settings.type;
    }

    /**
     * Gets value of the idle status.
     *
     * @return {Boolean}
     */

  }, {
    key: 'disabled',
    get: function get$$1() {
      return this._d;
    }

    /**
     * Sets value of the idle status.
     *
     * @return {Boolean}
     */
    ,
    set: function set$$1(status) {
      this._d = !!status;
    }
  }]);
  return Glide;
}();

function Run (Glide, Components, Events) {
  var Run = {
    /**
     * Initializes autorunning of the glide.
     *
     * @return {Void}
     */
    mount: function mount() {
      this._o = false;
    },


    /**
     * Makes glides running based on the passed moving schema.
     *
     * @param {String} move
     */
    make: function make(move) {
      var _this = this;

      if (!Glide.disabled) {
        Glide.disable();

        this.move = move;

        Events.emit('run.before', this.move);

        this.calculate();

        Events.emit('run', this.move);

        Components.Transition.after(function () {
          if (_this.isStart()) {
            Events.emit('run.start', _this.move);
          }

          if (_this.isEnd()) {
            Events.emit('run.end', _this.move);
          }

          if (_this.isOffset('<') || _this.isOffset('>')) {
            _this._o = false;

            Events.emit('run.offset', _this.move);
          }

          Events.emit('run.after', _this.move);

          Glide.enable();
        });
      }
    },


    /**
     * Calculates current index based on defined move.
     *
     * @return {Void}
     */
    calculate: function calculate() {
      var move = this.move,
          length = this.length;
      var steps = move.steps,
          direction = move.direction;


      var countableSteps = isNumber(toInt(steps)) && toInt(steps) !== 0;

      switch (direction) {
        case '>':
          if (steps === '>') {
            Glide.index = length;
          } else if (this.isEnd()) {
            if (!(Glide.isType('slider') && !Glide.settings.rewind)) {
              this._o = true;

              Glide.index = 0;
            }
          } else if (countableSteps) {
            Glide.index += Math.min(length - Glide.index, -toInt(steps));
          } else {
            Glide.index++;
          }
          break;

        case '<':
          if (steps === '<') {
            Glide.index = 0;
          } else if (this.isStart()) {
            if (!(Glide.isType('slider') && !Glide.settings.rewind)) {
              this._o = true;

              Glide.index = length;
            }
          } else if (countableSteps) {
            Glide.index -= Math.min(Glide.index, toInt(steps));
          } else {
            Glide.index--;
          }
          break;

        case '=':
          Glide.index = steps;
          break;

        default:
          warn('Invalid direction pattern [' + direction + steps + '] has been used');
          break;
      }
    },


    /**
     * Checks if we are on the first slide.
     *
     * @return {Boolean}
     */
    isStart: function isStart() {
      return Glide.index === 0;
    },


    /**
     * Checks if we are on the last slide.
     *
     * @return {Boolean}
     */
    isEnd: function isEnd() {
      return Glide.index === this.length;
    },


    /**
     * Checks if we are making a offset run.
     *
     * @param {String} direction
     * @return {Boolean}
     */
    isOffset: function isOffset(direction) {
      return this._o && this.move.direction === direction;
    }
  };

  define(Run, 'move', {
    /**
     * Gets value of the move schema.
     *
     * @returns {Object}
     */
    get: function get() {
      return this._m;
    },


    /**
     * Sets value of the move schema.
     *
     * @returns {Object}
     */
    set: function set(value) {
      var step = value.substr(1);

      this._m = {
        direction: value.substr(0, 1),
        steps: step ? toInt(step) ? toInt(step) : step : 0
      };
    }
  });

  define(Run, 'length', {
    /**
     * Gets value of the running distance based
     * on zero-indexing number of slides.
     *
     * @return {Number}
     */
    get: function get() {
      var settings = Glide.settings;
      var length = Components.Html.slides.length;

      // If the `bound` option is acitve, a maximum running distance should be
      // reduced by `perView` and `focusAt` settings. Running distance
      // should end before creating an empty space after instance.

      if (Glide.isType('slider') && settings.focusAt !== 'center' && settings.bound) {
        return length - 1 - (toInt(settings.perView) - 1) + toInt(settings.focusAt);
      }

      return length - 1;
    }
  });

  define(Run, 'offset', {
    /**
     * Gets status of the offsetting flag.
     *
     * @return {Boolean}
     */
    get: function get() {
      return this._o;
    }
  });

  return Run;
}

/**
 * Returns a current time.
 *
 * @return {Number}
 */
function now() {
  return new Date().getTime();
}

/**
 * Returns a function, that, when invoked, will only be triggered
 * at most once during a given window of time.
 *
 * @param {Function} func
 * @param {Number} wait
 * @param {Object=} options
 * @return {Function}
 *
 * @see https://github.com/jashkenas/underscore
 */
function throttle(func, wait, options) {
  var timeout = void 0,
      context = void 0,
      args = void 0,
      result = void 0;
  var previous = 0;
  if (!options) options = {};

  var later = function later() {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function throttled() {
    var at = now();
    if (!previous && options.leading === false) previous = at;
    var remaining = wait - (at - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = at;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

var MARGIN_TYPE = {
  ltr: ['marginLeft', 'marginRight'],
  rtl: ['marginRight', 'marginLeft']
};

function Gaps (Glide, Components, Events) {
  var Gaps = {
    /**
     * Applies gaps between slides. First and last
     * slides do not receive it's edge margins.
     *
     * @param {HTMLCollection} slides
     * @return {Void}
     */
    apply: function apply(slides) {
      for (var i = 0, len = slides.length; i < len; i++) {
        var style = slides[i].style;
        var direction = Components.Direction.value;

        if (i !== 0) {
          style[MARGIN_TYPE[direction][0]] = this.value / 2 + 'px';
        } else {
          style[MARGIN_TYPE[direction][0]] = '';
        }

        if (i !== slides.length - 1) {
          style[MARGIN_TYPE[direction][1]] = this.value / 2 + 'px';
        } else {
          style[MARGIN_TYPE[direction][1]] = '';
        }
      }
    },


    /**
     * Removes gaps from the slides.
     *
     * @param {HTMLCollection} slides
     * @returns {Void}
    */
    remove: function remove(slides) {
      for (var i = 0, len = slides.length; i < len; i++) {
        var style = slides[i].style;

        style.marginLeft = '';
        style.marginRight = '';
      }
    }
  };

  define(Gaps, 'value', {
    /**
     * Gets value of the gap.
     *
     * @returns {Number}
     */
    get: function get() {
      return toInt(Glide.settings.gap);
    }
  });

  define(Gaps, 'grow', {
    /**
     * Gets additional dimentions value caused by gaps.
     * Used to increase width of the slides wrapper.
     *
     * @returns {Number}
     */
    get: function get() {
      return Gaps.value * (Components.Sizes.length - 1);
    }
  });

  define(Gaps, 'reductor', {
    /**
     * Gets reduction value caused by gaps.
     * Used to subtract width of the slides.
     *
     * @returns {Number}
     */
    get: function get() {
      var perView = Glide.settings.perView;

      return Gaps.value * (perView - 1) / perView;
    }
  });

  /**
   * Apply calculated gaps:
   * - after building, so slides (including clones) will receive proper margins
   * - on updating via API, to recalculate gaps with new options
   */
  Events.on(['build.after', 'update'], throttle(function () {
    Gaps.apply(Components.Html.wrapper.children);
  }, 30));

  /**
   * Remove gaps:
   * - on destroying to bring markup to its inital state
   */
  Events.on('destroy', function () {
    Gaps.remove(Components.Html.wrapper.children);
  });

  return Gaps;
}

/**
 * Finds siblings nodes of the passed node.
 *
 * @param  {Element} node
 * @return {Array}
 */
function siblings(node) {
  if (node && node.parentNode) {
    var n = node.parentNode.firstChild;
    var matched = [];

    for (; n; n = n.nextSibling) {
      if (n.nodeType === 1 && n !== node) {
        matched.push(n);
      }
    }

    return matched;
  }

  return [];
}

/**
 * Checks if passed node exist and is a valid element.
 *
 * @param  {Element} node
 * @return {Boolean}
 */
function exist(node) {
  if (node && node instanceof window.HTMLElement) {
    return true;
  }

  return false;
}

var TRACK_SELECTOR = '[data-glide-el="track"]';

function Html (Glide, Components) {
  var Html = {
    /**
     * Setup slider HTML nodes.
     *
     * @param {Glide} glide
     */
    mount: function mount() {
      this.root = Glide.selector;
      this.track = this.root.querySelector(TRACK_SELECTOR);
      this.slides = Array.prototype.slice.call(this.wrapper.children).filter(function (slide) {
        return !slide.classList.contains(Glide.settings.classes.cloneSlide);
      });
    }
  };

  define(Html, 'root', {
    /**
     * Gets node of the glide main element.
     *
     * @return {Object}
     */
    get: function get() {
      return Html._r;
    },


    /**
     * Sets node of the glide main element.
     *
     * @return {Object}
     */
    set: function set(r) {
      if (isString(r)) {
        r = document.querySelector(r);
      }

      if (exist(r)) {
        Html._r = r;
      } else {
        warn('Root element must be a existing Html node');
      }
    }
  });

  define(Html, 'track', {
    /**
     * Gets node of the glide track with slides.
     *
     * @return {Object}
     */
    get: function get() {
      return Html._t;
    },


    /**
     * Sets node of the glide track with slides.
     *
     * @return {Object}
     */
    set: function set(t) {
      if (exist(t)) {
        Html._t = t;
      } else {
        warn('Could not find track element. Please use ' + TRACK_SELECTOR + ' attribute.');
      }
    }
  });

  define(Html, 'wrapper', {
    /**
     * Gets node of the slides wrapper.
     *
     * @return {Object}
     */
    get: function get() {
      return Html.track.children[0];
    }
  });

  return Html;
}

function Peek (Glide, Components, Events) {
  var Peek = {
    /**
     * Setups how much to peek based on settings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.value = Glide.settings.peek;
    }
  };

  define(Peek, 'value', {
    /**
     * Gets value of the peek.
     *
     * @returns {Number|Object}
     */
    get: function get() {
      return Peek._v;
    },


    /**
     * Sets value of the peek.
     *
     * @param {Number|Object} value
     * @return {Void}
     */
    set: function set(value) {
      if (isObject(value)) {
        value.before = toInt(value.before);
        value.after = toInt(value.after);
      } else {
        value = toInt(value);
      }

      Peek._v = value;
    }
  });

  define(Peek, 'reductor', {
    /**
     * Gets reduction value caused by peek.
     *
     * @returns {Number}
     */
    get: function get() {
      var value = Peek.value;
      var perView = Glide.settings.perView;

      if (isObject(value)) {
        return value.before / perView + value.after / perView;
      }

      return value * 2 / perView;
    }
  });

  /**
   * Recalculate peeking sizes on:
   * - when resizing window to update to proper percents
   */
  Events.on(['resize', 'update'], function () {
    Peek.mount();
  });

  return Peek;
}

function Move (Glide, Components, Events) {
  var Move = {
    /**
     * Constructs move component.
     *
     * @returns {Void}
     */
    mount: function mount() {
      this._o = 0;
    },


    /**
     * Calculates a movement value based on passed offset and currently active index.
     *
     * @param  {Number} offset
     * @return {Void}
     */
    make: function make() {
      var _this = this;

      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.offset = offset;

      Events.emit('move', {
        movement: this.value
      });

      Components.Transition.after(function () {
        Events.emit('move.after', {
          movement: _this.value
        });
      });
    }
  };

  define(Move, 'offset', {
    /**
     * Gets an offset value used to modify current translate.
     *
     * @return {Object}
     */
    get: function get() {
      return Move._o;
    },


    /**
     * Sets an offset value used to modify current translate.
     *
     * @return {Object}
     */
    set: function set(value) {
      Move._o = !isUndefined(value) ? toInt(value) : 0;
    }
  });

  define(Move, 'translate', {
    /**
     * Gets a raw movement value.
     *
     * @return {Number}
     */
    get: function get() {
      return Components.Sizes.slideWidth * Glide.index;
    }
  });

  define(Move, 'value', {
    /**
     * Gets an actual movement value corrected by offset.
     *
     * @return {Number}
     */
    get: function get() {
      var offset = this.offset;
      var translate = this.translate;

      if (Components.Direction.is('rtl')) {
        return translate + offset;
      }

      return translate - offset;
    }
  });

  /**
   * Make movement to proper slide on:
   * - before build, so glide will start at `startAt` index
   * - on each standard run to move to newly calculated index
   */
  Events.on(['build.before', 'run'], function () {
    Move.make();
  });

  return Move;
}

function Sizes (Glide, Components, Events) {
  var Sizes = {
    /**
     * Setups dimentions of slides.
     *
     * @return {Void}
     */
    setupSlides: function setupSlides() {
      var width = this.slideWidth + 'px';
      var slides = Components.Html.slides;

      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = width;
      }
    },


    /**
     * Setups dimentions of slides wrapper.
     *
     * @return {Void}
     */
    setupWrapper: function setupWrapper(dimention) {
      Components.Html.wrapper.style.width = this.wrapperSize + 'px';
    },


    /**
     * Removes applied styles from HTML elements.
     *
     * @returns {Void}
     */
    remove: function remove() {
      var slides = Components.Html.slides;

      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = '';
      }

      Components.Html.wrapper.style.width = '';
    }
  };

  define(Sizes, 'length', {
    /**
     * Gets count number of the slides.
     *
     * @return {Number}
     */
    get: function get() {
      return Components.Html.slides.length;
    }
  });

  define(Sizes, 'width', {
    /**
     * Gets width value of the glide.
     *
     * @return {Number}
     */
    get: function get() {
      return Components.Html.root.offsetWidth;
    }
  });

  define(Sizes, 'wrapperSize', {
    /**
     * Gets size of the slides wrapper.
     *
     * @return {Number}
     */
    get: function get() {
      return Sizes.slideWidth * Sizes.length + Components.Gaps.grow + Components.Clones.grow;
    }
  });

  define(Sizes, 'slideWidth', {
    /**
     * Gets width value of the single slide.
     *
     * @return {Number}
     */
    get: function get() {
      return Sizes.width / Glide.settings.perView - Components.Peek.reductor - Components.Gaps.reductor;
    }
  });

  /**
   * Apply calculated glide's dimensions:
   * - before building, so other dimentions (e.g. translate) will be calculated propertly
   * - when resizing window to recalculate sildes dimensions
   * - on updating via API, to calculate dimensions based on new options
   */
  Events.on(['build.before', 'resize', 'update'], function () {
    Sizes.setupSlides();
    Sizes.setupWrapper();
  });

  /**
   * Remove calculated glide's dimensions:
   * - on destoting to bring markup to its inital state
   */
  Events.on('destroy', function () {
    Sizes.remove();
  });

  return Sizes;
}

function Build (Glide, Components, Events) {
  var Build = {
    /**
     * Init glide building. Adds classes, sets
     * dimensions and setups initial state.
     *
     * @return {Void}
     */
    mount: function mount() {
      Events.emit('build.before');

      this.typeClass();
      this.activeClass();

      Events.emit('build.after');
    },


    /**
     * Adds `type` class to the glide element.
     *
     * @return {Void}
     */
    typeClass: function typeClass() {
      Components.Html.root.classList.add(Glide.settings.classes[Glide.settings.type]);
    },


    /**
     * Sets active class to current slide.
     *
     * @return {Void}
     */
    activeClass: function activeClass() {
      var classes = Glide.settings.classes;
      var slide = Components.Html.slides[Glide.index];

      if (slide) {
        slide.classList.add(classes.activeSlide);

        siblings(slide).forEach(function (sibling) {
          sibling.classList.remove(classes.activeSlide);
        });
      }
    },


    /**
     * Removes HTML classes applied at building.
     *
     * @return {Void}
     */
    removeClasses: function removeClasses() {
      var classes = Glide.settings.classes;

      Components.Html.root.classList.remove(classes[Glide.settings.type]);

      Components.Html.slides.forEach(function (sibling) {
        sibling.classList.remove(classes.activeSlide);
      });
    }
  };

  /**
   * Clear building classes:
   * - on destroying to bring HTML to its initial state
   * - on updating to remove classes before remounting component
   */
  Events.on(['destroy', 'update'], function () {
    Build.removeClasses();
  });

  /**
   * Remount component:
   * - on resizing of the window to calculate new dimentions
   * - on updating settings via API
   */
  Events.on(['resize', 'update'], function () {
    Build.mount();
  });

  /**
   * Swap active class of current slide:
   * - after each move to the new index
   */
  Events.on('move.after', function () {
    Build.activeClass();
  });

  return Build;
}

function Clones (Glide, Components, Events) {
  var Clones = {
    /**
     * Create pattern map and collect slides to be cloned.
     */
    mount: function mount() {
      this.items = [];

      if (Glide.isType('carousel')) {
        this.items = this.collect();
      }
    },


    /**
     * Collect clones with pattern.
     *
     * @return {Void}
     */
    collect: function collect() {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var slides = Components.Html.slides;
      var _Glide$settings = Glide.settings,
          perView = _Glide$settings.perView,
          classes = _Glide$settings.classes;


      var peekIncrementer = +!!Glide.settings.peek;
      var part = perView + peekIncrementer;
      var start = slides.slice(0, part);
      var end = slides.slice(-part);

      for (var r = 0; r < Math.max(1, Math.floor(perView / slides.length)); r++) {
        for (var i = 0; i < start.length; i++) {
          var clone = start[i].cloneNode(true);

          clone.classList.add(classes.cloneSlide);

          items.push(clone);
        }

        for (var _i = 0; _i < end.length; _i++) {
          var _clone = end[_i].cloneNode(true);

          _clone.classList.add(classes.cloneSlide);

          items.unshift(_clone);
        }
      }

      return items;
    },


    /**
     * Append cloned slides with generated pattern.
     *
     * @return {Void}
     */
    append: function append() {
      var items = this.items;
      var _Components$Html = Components.Html,
          wrapper = _Components$Html.wrapper,
          slides = _Components$Html.slides;


      var half = Math.floor(items.length / 2);
      var prepend = items.slice(0, half).reverse();
      var append = items.slice(half, items.length);
      var width = Components.Sizes.slideWidth + 'px';

      for (var i = 0; i < append.length; i++) {
        wrapper.appendChild(append[i]);
      }

      for (var _i2 = 0; _i2 < prepend.length; _i2++) {
        wrapper.insertBefore(prepend[_i2], slides[0]);
      }

      for (var _i3 = 0; _i3 < items.length; _i3++) {
        items[_i3].style.width = width;
      }
    },


    /**
     * Remove all cloned slides.
     *
     * @return {Void}
     */
    remove: function remove() {
      var items = this.items;


      for (var i = 0; i < items.length; i++) {
        Components.Html.wrapper.removeChild(items[i]);
      }
    }
  };

  define(Clones, 'grow', {
    /**
     * Gets additional dimentions value caused by clones.
     *
     * @return {Number}
     */
    get: function get() {
      return (Components.Sizes.slideWidth + Components.Gaps.value) * Clones.items.length;
    }
  });

  /**
   * Append additional slide's clones:
   * - while glide's type is `carousel`
   */
  Events.on('update', function () {
    Clones.remove();
    Clones.mount();
    Clones.append();
  });

  /**
   * Append additional slide's clones:
   * - while glide's type is `carousel`
   */
  Events.on('build.before', function () {
    if (Glide.isType('carousel')) {
      Clones.append();
    }
  });

  /**
   * Remove clones HTMLElements:
   * - on destroying, to bring HTML to its initial state
   */
  Events.on('destroy', function () {
    Clones.remove();
  });

  return Clones;
}

var EventsBinder = function () {
  /**
   * Construct a EventsBinder instance.
   */
  function EventsBinder() {
    var listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, EventsBinder);

    this.listeners = listeners;
  }

  /**
   * Adds events listeners to arrows HTML elements.
   *
   * @param  {String|Array} events
   * @param  {Element|Window|Document} el
   * @param  {Function} closure
   * @param  {Boolean|Object} capture
   * @return {Void}
   */


  createClass(EventsBinder, [{
    key: 'on',
    value: function on(events, el, closure) {
      var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (isString(events)) {
        events = [events];
      }

      for (var i = 0; i < events.length; i++) {
        this.listeners[events[i]] = closure;

        el.addEventListener(events[i], this.listeners[events[i]], capture);
      }
    }

    /**
     * Removes event listeners from arrows HTML elements.
     *
     * @param  {String|Array} events
     * @param  {Element|Window|Document} el
     * @param  {Boolean|Object} capture
     * @return {Void}
     */

  }, {
    key: 'off',
    value: function off(events, el) {
      var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (isString(events)) {
        events = [events];
      }

      for (var i = 0; i < events.length; i++) {
        el.removeEventListener(events[i], this.listeners[events[i]], capture);
      }
    }

    /**
     * Destroy collected listeners.
     *
     * @returns {Void}
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      delete this.listeners;
    }
  }]);
  return EventsBinder;
}();

function Resize (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();

  var Resize = {
    /**
     * Initializes window bindings.
     */
    mount: function mount() {
      this.bind();
    },


    /**
     * Binds `rezsize` listener to the window.
     * It's a costly event, so we are debouncing it.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('resize', window, throttle(function () {
        Events.emit('resize');
      }, Glide.settings.throttle));
    },


    /**
     * Unbinds listeners from the window.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('resize', window);
    }
  };

  /**
   * Remove bindings from window:
   * - on destroying, to remove added EventListener
   */
  Events.on('destroy', function () {
    Resize.unbind();
    Binder.destroy();
  });

  return Resize;
}

var VALID_DIRECTIONS = ['ltr', 'rtl'];
var FLIPED_MOVEMENTS = {
  '>': '<',
  '<': '>',
  '=': '='
};

function Direction (Glide, Components, Events) {
  var Direction = {
    /**
     * Setups gap value based on settings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.value = Glide.settings.direction;
    },


    /**
     * Resolves pattern based on direction value
     *
     * @param {String} pattern
     * @returns {String}
     */
    resolve: function resolve(pattern) {
      var token = pattern.slice(0, 1);

      if (this.is('rtl')) {
        return pattern.split(token).join(FLIPED_MOVEMENTS[token]);
      }

      return pattern;
    },


    /**
     * Checks value of direction mode.
     *
     * @param {String} direction
     * @returns {Boolean}
     */
    is: function is(direction) {
      return this.value === direction;
    },


    /**
     * Applies direction class to the root HTML element.
     *
     * @return {Void}
     */
    addClass: function addClass() {
      Components.Html.root.classList.add(Glide.settings.classes.direction[this.value]);
    },


    /**
     * Removes direction class from the root HTML element.
     *
     * @return {Void}
     */
    removeClass: function removeClass() {
      Components.Html.root.classList.remove(Glide.settings.classes.direction[this.value]);
    }
  };

  define(Direction, 'value', {
    /**
     * Gets value of the direction.
     *
     * @returns {Number}
     */
    get: function get() {
      return Direction._v;
    },


    /**
     * Sets value of the direction.
     *
     * @param {String} value
     * @return {Void}
     */
    set: function set(value) {
      if (VALID_DIRECTIONS.indexOf(value) > -1) {
        Direction._v = value;
      } else {
        warn('Direction value must be `ltr` or `rtl`');
      }
    }
  });

  /**
   * Clear direction class:
   * - on destroy to bring HTML to its initial state
   * - on update to remove class before reappling bellow
   */
  Events.on(['destroy', 'update'], function () {
    Direction.removeClass();
  });

  /**
   * Remount component:
   * - on update to reflect changes in direction value
   */
  Events.on('update', function () {
    Direction.mount();
  });

  /**
   * Apply direction class:
   * - before building to apply class for the first time
   * - on updating to reapply direction class that may changed
   */
  Events.on(['build.before', 'update'], function () {
    Direction.addClass();
  });

  return Direction;
}

/**
 * Reflects value of glide movement.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Rtl (Glide, Components) {
  return {
    /**
     * Negates the passed translate if glide is in RTL option.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      if (Components.Direction.is('rtl')) {
        return -translate;
      }

      return translate;
    }
  };
}

/**
 * Updates glide movement with a `gap` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Gap (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with number in the `gap` settings.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      return translate + Components.Gaps.value * Glide.index;
    }
  };
}

/**
 * Updates glide movement with width of additional clones width.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Grow (Glide, Components) {
  return {
    /**
     * Adds to the passed translate width of the half of clones.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      return translate + Components.Clones.grow / 2;
    }
  };
}

/**
 * Updates glide movement with a `peek` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Peeking (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with a `peek` setting.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      if (Glide.settings.focusAt >= 0) {
        var peek = Components.Peek.value;

        if (isObject(peek)) {
          return translate - peek.before;
        }

        return translate - peek;
      }

      return translate;
    }
  };
}

/**
 * Updates glide movement with a `focusAt` settings.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function Focusing (Glide, Components) {
  return {
    /**
     * Modifies passed translate value with index in the `focusAt` setting.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    modify: function modify(translate) {
      var gap = Components.Gaps.value;
      var width = Components.Sizes.width;
      var focusAt = Glide.settings.focusAt;
      var slideWidth = Components.Sizes.slideWidth;

      if (focusAt === 'center') {
        return translate - (width / 2 - slideWidth / 2);
      }

      return translate - slideWidth * focusAt - gap * focusAt;
    }
  };
}

/**
 * Applies diffrent transformers on translate value.
 *
 * @param  {Object} Glide
 * @param  {Object} Components
 * @return {Object}
 */
function mutator (Glide, Components, Events) {
  /**
   * Merge instance transformers with collection of default transformers.
   * It's important that the Rtl component be last on the list,
   * so it reflects all previous transformations.
   *
   * @type {Array}
   */
  var TRANSFORMERS = [Gap, Grow, Peeking, Focusing].concat(Glide._t, [Rtl]);

  return {
    /**
     * Piplines translate value with registered transformers.
     *
     * @param  {Number} translate
     * @return {Number}
     */
    mutate: function mutate(translate) {
      for (var i = 0; i < TRANSFORMERS.length; i++) {
        var transformer = TRANSFORMERS[i];

        if (isFunction(transformer) && isFunction(transformer().modify)) {
          translate = transformer(Glide, Components, Events).modify(translate);
        } else {
          warn('Transformer should be a function that returns an object with `modify()` method');
        }
      }

      return translate;
    }
  };
}

function Translate (Glide, Components, Events) {
  var Translate = {
    /**
     * Sets value of translate on HTML element.
     *
     * @param {Number} value
     * @return {Void}
     */
    set: function set(value) {
      var transform = mutator(Glide, Components).mutate(value);

      Components.Html.wrapper.style.transform = 'translate3d(' + -1 * transform + 'px, 0px, 0px)';
    },


    /**
     * Removes value of translate from HTML element.
     *
     * @return {Void}
     */
    remove: function remove() {
      Components.Html.wrapper.style.transform = '';
    }
  };

  /**
   * Set new translate value:
   * - on move to reflect index change
   * - on updating via API to reflect possible changes in options
   */
  Events.on('move', function (context) {
    var gap = Components.Gaps.value;
    var length = Components.Sizes.length;
    var width = Components.Sizes.slideWidth;

    if (Glide.isType('carousel') && Components.Run.isOffset('<')) {
      Components.Transition.after(function () {
        Events.emit('translate.jump');

        Translate.set(width * (length - 1));
      });

      return Translate.set(-width - gap * length);
    }

    if (Glide.isType('carousel') && Components.Run.isOffset('>')) {
      Components.Transition.after(function () {
        Events.emit('translate.jump');

        Translate.set(0);
      });

      return Translate.set(width * length + gap * length);
    }

    return Translate.set(context.movement);
  });

  /**
   * Remove translate:
   * - on destroying to bring markup to its inital state
   */
  Events.on('destroy', function () {
    Translate.remove();
  });

  return Translate;
}

function Transition (Glide, Components, Events) {
  /**
   * Holds inactivity status of transition.
   * When true transition is not applied.
   *
   * @type {Boolean}
   */
  var disabled = false;

  var Transition = {
    /**
     * Composes string of the CSS transition.
     *
     * @param {String} property
     * @return {String}
     */
    compose: function compose(property) {
      var settings = Glide.settings;

      if (!disabled) {
        return property + ' ' + this.duration + 'ms ' + settings.animationTimingFunc;
      }

      return property + ' 0ms ' + settings.animationTimingFunc;
    },


    /**
     * Sets value of transition on HTML element.
     *
     * @param {String=} property
     * @return {Void}
     */
    set: function set() {
      var property = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';

      Components.Html.wrapper.style.transition = this.compose(property);
    },


    /**
     * Removes value of transition from HTML element.
     *
     * @return {Void}
     */
    remove: function remove() {
      Components.Html.wrapper.style.transition = '';
    },


    /**
     * Runs callback after animation.
     *
     * @param  {Function} callback
     * @return {Void}
     */
    after: function after(callback) {
      setTimeout(function () {
        callback();
      }, this.duration);
    },


    /**
     * Enable transition.
     *
     * @return {Void}
     */
    enable: function enable() {
      disabled = false;

      this.set();
    },


    /**
     * Disable transition.
     *
     * @return {Void}
     */
    disable: function disable() {
      disabled = true;

      this.set();
    }
  };

  define(Transition, 'duration', {
    /**
     * Gets duration of the transition based
     * on currently running animation type.
     *
     * @return {Number}
     */
    get: function get() {
      var settings = Glide.settings;

      if (Glide.isType('slider') && Components.Run.offset) {
        return settings.rewindDuration;
      }

      return settings.animationDuration;
    }
  });

  /**
   * Set transition `style` value:
   * - on each moving, because it may be cleared by offset move
   */
  Events.on('move', function () {
    Transition.set();
  });

  /**
   * Disable transition:
   * - before initial build to avoid transitioning from `0` to `startAt` index
   * - while resizing window and recalculating dimentions
   * - on jumping from offset transition at start and end edges in `carousel` type
   */
  Events.on(['build.before', 'resize', 'translate.jump'], function () {
    Transition.disable();
  });

  /**
   * Enable transition:
   * - on each running, because it may be disabled by offset move
   */
  Events.on('run', function () {
    Transition.enable();
  });

  /**
   * Remove transition:
   * - on destroying to bring markup to its inital state
   */
  Events.on('destroy', function () {
    Transition.remove();
  });

  return Transition;
}

/**
 * Test via a getter in the options object to see
 * if the passive property is accessed.
 *
 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
 */

var supportsPassive = false;

try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      supportsPassive = true;
    }
  });

  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {}

var supportsPassive$1 = supportsPassive;

var START_EVENTS = ['touchstart', 'mousedown'];
var MOVE_EVENTS = ['touchmove', 'mousemove'];
var END_EVENTS = ['touchend', 'touchcancel', 'mouseup', 'mouseleave'];
var MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];

function Swipe (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();

  var swipeSin = 0;
  var swipeStartX = 0;
  var swipeStartY = 0;
  var disabled = false;
  var capture = supportsPassive$1 ? { passive: true } : false;

  var Swipe = {
    /**
     * Initializes swipe bindings.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.bindSwipeStart();
    },


    /**
     * Handler for `swipestart` event. Calculates entry points of the user's tap.
     *
     * @param {Object} event
     * @return {Void}
     */
    start: function start(event) {
      if (!disabled && !Glide.disabled) {
        this.disable();

        var swipe = this.touches(event);

        swipeSin = null;
        swipeStartX = toInt(swipe.pageX);
        swipeStartY = toInt(swipe.pageY);

        this.bindSwipeMove();
        this.bindSwipeEnd();

        Events.emit('swipe.start');
      }
    },


    /**
     * Handler for `swipemove` event. Calculates user's tap angle and distance.
     *
     * @param {Object} event
     */
    move: function move(event) {
      if (!Glide.disabled) {
        var _Glide$settings = Glide.settings,
            touchAngle = _Glide$settings.touchAngle,
            touchRatio = _Glide$settings.touchRatio,
            classes = _Glide$settings.classes;


        var swipe = this.touches(event);

        var subExSx = toInt(swipe.pageX) - swipeStartX;
        var subEySy = toInt(swipe.pageY) - swipeStartY;
        var powEX = Math.abs(subExSx << 2);
        var powEY = Math.abs(subEySy << 2);
        var swipeHypotenuse = Math.sqrt(powEX + powEY);
        var swipeCathetus = Math.sqrt(powEY);

        swipeSin = Math.asin(swipeCathetus / swipeHypotenuse);

        if (swipeSin * 180 / Math.PI < touchAngle) {
          event.stopPropagation();

          Components.Move.make(subExSx * toFloat(touchRatio));

          Components.Html.root.classList.add(classes.dragging);

          Events.emit('swipe.move');
        } else {
          return false;
        }
      }
    },


    /**
     * Handler for `swipeend` event. Finitializes user's tap and decides about glide move.
     *
     * @param {Object} event
     * @return {Void}
     */
    end: function end(event) {
      if (!Glide.disabled) {
        var settings = Glide.settings;

        var swipe = this.touches(event);
        var threshold = this.threshold(event);

        var swipeDistance = swipe.pageX - swipeStartX;
        var swipeDeg = swipeSin * 180 / Math.PI;
        var steps = Math.round(swipeDistance / Components.Sizes.slideWidth);

        this.enable();

        if (swipeDistance > threshold && swipeDeg < settings.touchAngle) {
          // While swipe is positive and greater than threshold move backward.
          if (settings.perTouch) {
            steps = Math.min(steps, toInt(settings.perTouch));
          }

          if (Components.Direction.is('rtl')) {
            steps = -steps;
          }

          Components.Run.make(Components.Direction.resolve('<' + steps));
        } else if (swipeDistance < -threshold && swipeDeg < settings.touchAngle) {
          // While swipe is negative and lower than negative threshold move forward.
          if (settings.perTouch) {
            steps = Math.max(steps, -toInt(settings.perTouch));
          }

          if (Components.Direction.is('rtl')) {
            steps = -steps;
          }

          Components.Run.make(Components.Direction.resolve('>' + steps));
        } else {
          // While swipe don't reach distance apply previous transform.
          Components.Move.make();
        }

        Components.Html.root.classList.remove(settings.classes.dragging);

        this.unbindSwipeMove();
        this.unbindSwipeEnd();

        Events.emit('swipe.end');
      }
    },


    /**
     * Binds swipe's starting event.
     *
     * @return {Void}
     */
    bindSwipeStart: function bindSwipeStart() {
      var _this = this;

      var settings = Glide.settings;

      if (settings.swipeThreshold) {
        Binder.on(START_EVENTS[0], Components.Html.wrapper, function (event) {
          _this.start(event);
        }, capture);
      }

      if (settings.dragThreshold) {
        Binder.on(START_EVENTS[1], Components.Html.wrapper, function (event) {
          _this.start(event);
        }, capture);
      }
    },


    /**
     * Unbinds swipe's starting event.
     *
     * @return {Void}
     */
    unbindSwipeStart: function unbindSwipeStart() {
      Binder.off(START_EVENTS[0], Components.Html.wrapper, capture);
      Binder.off(START_EVENTS[1], Components.Html.wrapper, capture);
    },


    /**
     * Binds swipe's moving event.
     *
     * @return {Void}
     */
    bindSwipeMove: function bindSwipeMove() {
      var _this2 = this;

      Binder.on(MOVE_EVENTS, Components.Html.wrapper, throttle(function (event) {
        _this2.move(event);
      }, Glide.settings.throttle), capture);
    },


    /**
     * Unbinds swipe's moving event.
     *
     * @return {Void}
     */
    unbindSwipeMove: function unbindSwipeMove() {
      Binder.off(MOVE_EVENTS, Components.Html.wrapper, capture);
    },


    /**
     * Binds swipe's ending event.
     *
     * @return {Void}
     */
    bindSwipeEnd: function bindSwipeEnd() {
      var _this3 = this;

      Binder.on(END_EVENTS, Components.Html.wrapper, function (event) {
        _this3.end(event);
      });
    },


    /**
     * Unbinds swipe's ending event.
     *
     * @return {Void}
     */
    unbindSwipeEnd: function unbindSwipeEnd() {
      Binder.off(END_EVENTS, Components.Html.wrapper);
    },


    /**
     * Normalizes event touches points accorting to different types.
     *
     * @param {Object} event
     */
    touches: function touches(event) {
      if (MOUSE_EVENTS.indexOf(event.type) > -1) {
        return event;
      }

      return event.touches[0] || event.changedTouches[0];
    },


    /**
     * Gets value of minimum swipe distance settings based on event type.
     *
     * @return {Number}
     */
    threshold: function threshold(event) {
      var settings = Glide.settings;

      if (MOUSE_EVENTS.indexOf(event.type) > -1) {
        return settings.dragThreshold;
      }

      return settings.swipeThreshold;
    },


    /**
     * Enables swipe event.
     *
     * @return {self}
     */
    enable: function enable() {
      disabled = false;

      Components.Transition.enable();

      return this;
    },


    /**
     * Disables swipe event.
     *
     * @return {self}
     */
    disable: function disable() {
      disabled = true;

      Components.Transition.disable();

      return this;
    }
  };

  /**
   * Add component class:
   * - after initial building
   */
  Events.on('build.after', function () {
    Components.Html.root.classList.add(Glide.settings.classes.swipeable);
  });

  /**
   * Remove swiping bindings:
   * - on destroying, to remove added EventListeners
   */
  Events.on('destroy', function () {
    Swipe.unbindSwipeStart();
    Swipe.unbindSwipeMove();
    Swipe.unbindSwipeEnd();
    Binder.destroy();
  });

  return Swipe;
}

function Images (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();

  var Images = {
    /**
     * Binds listener to glide wrapper.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.bind();
    },


    /**
     * Binds `dragstart` event on wrapper to prevent dragging images.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('dragstart', Components.Html.wrapper, this.dragstart);
    },


    /**
     * Unbinds `dragstart` event on wrapper.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('dragstart', Components.Html.wrapper);
    },


    /**
     * Event handler. Prevents dragging.
     *
     * @return {Void}
     */
    dragstart: function dragstart(event) {
      event.preventDefault();
    }
  };

  /**
   * Remove bindings from images:
   * - on destroying, to remove added EventListeners
   */
  Events.on('destroy', function () {
    Images.unbind();
    Binder.destroy();
  });

  return Images;
}

function Anchors (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();

  /**
   * Holds detaching status of anchors.
   * Prevents detaching of already detached anchors.
   *
   * @private
   * @type {Boolean}
   */
  var detached = false;

  /**
   * Holds preventing status of anchors.
   * If `true` redirection after click will be disabled.
   *
   * @private
   * @type {Boolean}
   */
  var prevented = false;

  var Anchors = {
    /**
     * Setups a initial state of anchors component.
     *
     * @returns {Void}
     */
    mount: function mount() {
      /**
       * Holds collection of anchors elements.
       *
       * @private
       * @type {HTMLCollection}
       */
      this._a = Components.Html.wrapper.querySelectorAll('a');

      this.bind();
    },


    /**
     * Binds events to anchors inside a track.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('click', Components.Html.wrapper, this.click);
    },


    /**
     * Unbinds events attached to anchors inside a track.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('click', Components.Html.wrapper);
    },


    /**
     * Handler for click event. Prevents clicks when glide is in `prevent` status.
     *
     * @param  {Object} event
     * @return {Void}
     */
    click: function click(event) {
      if (prevented) {
        event.stopPropagation();
        event.preventDefault();
      }
    },


    /**
     * Detaches anchors click event inside glide.
     *
     * @return {self}
     */
    detach: function detach() {
      prevented = true;

      if (!detached) {
        for (var i = 0; i < this.items.length; i++) {
          this.items[i].draggable = false;

          this.items[i].setAttribute('data-href', this.items[i].getAttribute('href'));

          this.items[i].removeAttribute('href');
        }

        detached = true;
      }

      return this;
    },


    /**
     * Attaches anchors click events inside glide.
     *
     * @return {self}
     */
    attach: function attach() {
      prevented = false;

      if (detached) {
        for (var i = 0; i < this.items.length; i++) {
          this.items[i].draggable = true;

          this.items[i].setAttribute('href', this.items[i].getAttribute('data-href'));
        }

        detached = false;
      }

      return this;
    }
  };

  define(Anchors, 'items', {
    /**
     * Gets collection of the arrows HTML elements.
     *
     * @return {HTMLElement[]}
     */
    get: function get() {
      return Anchors._a;
    }
  });

  /**
   * Detach anchors inside slides:
   * - on swiping, so they won't redirect to its `href` attributes
   */
  Events.on('swipe.move', function () {
    Anchors.detach();
  });

  /**
   * Attach anchors inside slides:
   * - after swiping and transitions ends, so they can redirect after click again
   */
  Events.on('swipe.end', function () {
    Components.Transition.after(function () {
      Anchors.attach();
    });
  });

  /**
   * Unbind anchors inside slides:
   * - on destroying, to bring anchors to its initial state
   */
  Events.on('destroy', function () {
    Anchors.attach();
    Anchors.unbind();
    Binder.destroy();
  });

  return Anchors;
}

var NAV_SELECTOR = '[data-glide-el="controls[nav]"]';
var CONTROLS_SELECTOR = '[data-glide-el^="controls"]';

function Controls (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();

  var capture = supportsPassive$1 ? { passive: true } : false;

  var Controls = {
    /**
     * Inits arrows. Binds events listeners
     * to the arrows HTML elements.
     *
     * @return {Void}
     */
    mount: function mount() {
      /**
       * Collection of navigation HTML elements.
       *
       * @private
       * @type {HTMLCollection}
       */
      this._n = Components.Html.root.querySelectorAll(NAV_SELECTOR);

      /**
       * Collection of controls HTML elements.
       *
       * @private
       * @type {HTMLCollection}
       */
      this._c = Components.Html.root.querySelectorAll(CONTROLS_SELECTOR);

      this.addBindings();
    },


    /**
     * Sets active class to current slide.
     *
     * @return {Void}
     */
    setActive: function setActive() {
      for (var i = 0; i < this._n.length; i++) {
        this.addClass(this._n[i].children);
      }
    },


    /**
     * Removes active class to current slide.
     *
     * @return {Void}
     */
    removeActive: function removeActive() {
      for (var i = 0; i < this._n.length; i++) {
        this.removeClass(this._n[i].children);
      }
    },


    /**
     * Toggles active class on items inside navigation.
     *
     * @param  {HTMLElement} controls
     * @return {Void}
     */
    addClass: function addClass(controls) {
      var settings = Glide.settings;
      var item = controls[Glide.index];

      if (item) {
        item.classList.add(settings.classes.activeNav);

        siblings(item).forEach(function (sibling) {
          sibling.classList.remove(settings.classes.activeNav);
        });
      }
    },


    /**
     * Removes active class from active control.
     *
     * @param  {HTMLElement} controls
     * @return {Void}
     */
    removeClass: function removeClass(controls) {
      var item = controls[Glide.index];

      if (item) {
        item.classList.remove(Glide.settings.classes.activeNav);
      }
    },


    /**
     * Adds handles to the each group of controls.
     *
     * @return {Void}
     */
    addBindings: function addBindings() {
      for (var i = 0; i < this._c.length; i++) {
        this.bind(this._c[i].children);
      }
    },


    /**
     * Removes handles from the each group of controls.
     *
     * @return {Void}
     */
    removeBindings: function removeBindings() {
      for (var i = 0; i < this._c.length; i++) {
        this.unbind(this._c[i].children);
      }
    },


    /**
     * Binds events to arrows HTML elements.
     *
     * @param {HTMLCollection} elements
     * @return {Void}
     */
    bind: function bind(elements) {
      for (var i = 0; i < elements.length; i++) {
        Binder.on('click', elements[i], this.click);
        Binder.on('touchstart', elements[i], this.click, capture);
      }
    },


    /**
     * Unbinds events binded to the arrows HTML elements.
     *
     * @param {HTMLCollection} elements
     * @return {Void}
     */
    unbind: function unbind(elements) {
      for (var i = 0; i < elements.length; i++) {
        Binder.off(['click', 'touchstart'], elements[i]);
      }
    },


    /**
     * Handles `click` event on the arrows HTML elements.
     * Moves slider in driection precised in
     * `data-glide-dir` attribute.
     *
     * @param {Object} event
     * @return {Void}
     */
    click: function click(event) {
      event.preventDefault();

      Components.Run.make(Components.Direction.resolve(event.currentTarget.getAttribute('data-glide-dir')));
    }
  };

  define(Controls, 'items', {
    /**
     * Gets collection of the controls HTML elements.
     *
     * @return {HTMLElement[]}
     */
    get: function get() {
      return Controls._c;
    }
  });

  /**
   * Swap active class of current navigation item:
   * - after mounting to set it to initial index
   * - after each move to the new index
   */
  Events.on(['mount.after', 'move.after'], function () {
    Controls.setActive();
  });

  /**
   * Remove bindings and HTML Classes:
   * - on destroying, to bring markup to its initial state
   */
  Events.on('destroy', function () {
    Controls.removeBindings();
    Controls.removeActive();
    Binder.destroy();
  });

  return Controls;
}

function Keyboard (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();

  var Keyboard = {
    /**
     * Binds keyboard events on component mount.
     *
     * @return {Void}
     */
    mount: function mount() {
      if (Glide.settings.keyboard) {
        this.bind();
      }
    },


    /**
     * Adds keyboard press events.
     *
     * @return {Void}
     */
    bind: function bind() {
      Binder.on('keyup', document, this.press);
    },


    /**
     * Removes keyboard press events.
     *
     * @return {Void}
     */
    unbind: function unbind() {
      Binder.off('keyup', document);
    },


    /**
     * Handles keyboard's arrows press and moving glide foward and backward.
     *
     * @param  {Object} event
     * @return {Void}
     */
    press: function press(event) {
      if (event.keyCode === 39) {
        Components.Run.make(Components.Direction.resolve('>'));
      }

      if (event.keyCode === 37) {
        Components.Run.make(Components.Direction.resolve('<'));
      }
    }
  };

  /**
   * Remove bindings from keyboard:
   * - on destroying to remove added events
   * - on updating to remove events before remounting
   */
  Events.on(['destroy', 'update'], function () {
    Keyboard.unbind();
  });

  /**
   * Remount component
   * - on updating to reflect potential changes in settings
   */
  Events.on('update', function () {
    Keyboard.mount();
  });

  /**
   * Destroy binder:
   * - on destroying to remove listeners
   */
  Events.on('destroy', function () {
    Binder.destroy();
  });

  return Keyboard;
}

function Autoplay (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();

  var Autoplay = {
    /**
     * Initializes autoplaying and events.
     *
     * @return {Void}
     */
    mount: function mount() {
      this.start();

      if (Glide.settings.hoverpause) {
        this.bind();
      }
    },


    /**
     * Starts autoplaying in configured interval.
     *
     * @param {Boolean|Number} force Run autoplaying with passed interval regardless of `autoplay` settings
     * @return {Void}
     */
    start: function start() {
      var _this = this;

      if (Glide.settings.autoplay) {
        if (isUndefined(this._i)) {
          this._i = setInterval(function () {
            _this.stop();

            Components.Run.make('>');

            _this.start();
          }, this.time);
        }
      }
    },


    /**
     * Stops autorunning of the glide.
     *
     * @return {Void}
     */
    stop: function stop() {
      this._i = clearInterval(this._i);
    },


    /**
     * Stops autoplaying while mouse is over glide's area.
     *
     * @return {Void}
     */
    bind: function bind() {
      var _this2 = this;

      Binder.on('mouseover', Components.Html.root, function () {
        _this2.stop();
      });

      Binder.on('mouseout', Components.Html.root, function () {
        _this2.start();
      });
    },


    /**
     * Unbind mouseover events.
     *
     * @returns {Void}
     */
    unbind: function unbind() {
      Binder.off(['mouseover', 'mouseout'], Components.Html.root);
    }
  };

  define(Autoplay, 'time', {
    /**
     * Gets time period value for the autoplay interval. Prioritizes
     * times in `data-glide-autoplay` attrubutes over options.
     *
     * @return {Number}
     */
    get: function get() {
      var autoplay = Components.Html.slides[Glide.index].getAttribute('data-glide-autoplay');

      if (autoplay) {
        return toInt(autoplay);
      }

      return toInt(Glide.settings.autoplay);
    }
  });

  /**
   * Stop autoplaying and unbind events:
   * - on destroying, to clear defined interval
   * - on updating via API to reset interval that may changed
   */
  Events.on(['destroy', 'update'], function () {
    Autoplay.unbind();
  });

  /**
   * Stop autoplaying:
   * - before each run, to restart autoplaying
   * - on pausing via API
   * - on destroying, to clear defined interval
   * - while starting a swipe
   * - on updating via API to reset interval that may changed
   */
  Events.on(['run.before', 'pause', 'destroy', 'swipe.start', 'update'], function () {
    Autoplay.stop();
  });

  /**
   * Start autoplaying:
   * - after each run, to restart autoplaying
   * - on playing via API
   * - while ending a swipe
   */
  Events.on(['run.after', 'play', 'swipe.end'], function () {
    Autoplay.start();
  });

  /**
   * Remount autoplaying:
   * - on updating via API to reset interval that may changed
   */
  Events.on('update', function () {
    Autoplay.mount();
  });

  /**
   * Destroy a binder:
   * - on destroying glide instance to clearup listeners
   */
  Events.on('destroy', function () {
    Binder.destroy();
  });

  return Autoplay;
}

/**
 * Sorts keys of breakpoint object so they will be ordered from lower to bigger.
 *
 * @param {Object} points
 * @returns {Object}
 */
function sortBreakpoints(points) {
  if (isObject(points)) {
    return sortKeys(points);
  } else {
    warn('Breakpoints option must be an object');
  }

  return {};
}

function Breakpoints (Glide, Components, Events) {
  /**
   * Instance of the binder for DOM Events.
   *
   * @type {EventsBinder}
   */
  var Binder = new EventsBinder();

  /**
   * Holds reference to settings.
   *
   * @type {Object}
   */
  var settings = Glide.settings;

  /**
   * Holds reference to breakpoints object in settings. Sorts breakpoints
   * from smaller to larger. It is required in order to proper
   * matching currently active breakpoint settings.
   *
   * @type {Object}
   */
  var points = sortBreakpoints(settings.breakpoints);

  /**
   * Cache initial settings before overwritting.
   *
   * @type {Object}
   */
  var defaults = _extends({}, settings);

  var Breakpoints = {
    /**
     * Matches settings for currectly matching media breakpoint.
     *
     * @param {Object} points
     * @returns {Object}
     */
    match: function match(points) {
      if (typeof window.matchMedia !== 'undefined') {
        for (var point in points) {
          if (points.hasOwnProperty(point)) {
            if (window.matchMedia('(max-width: ' + point + 'px)').matches) {
              return points[point];
            }
          }
        }
      }

      return defaults;
    }
  };

  /**
   * Overwrite instance settings with currently matching breakpoint settings.
   * This happens right after component initialization.
   */
  _extends(settings, Breakpoints.match(points));

  /**
   * Update glide with settings of matched brekpoint:
   * - window resize to update slider
   */
  Binder.on('resize', window, throttle(function () {
    Glide.settings = mergeOptions(settings, Breakpoints.match(points));
  }, Glide.settings.throttle));

  /**
   * Resort and update default settings:
   * - on reinit via API, so breakpoint matching will be performed with options
   */
  Events.on('update', function () {
    points = sortBreakpoints(points);

    defaults = _extends({}, settings);
  });

  /**
   * Unbind resize listener:
   * - on destroying, to bring markup to its initial state
   */
  Events.on('destroy', function () {
    Binder.off('resize', window);
  });

  return Breakpoints;
}

var COMPONENTS = {
  // Required
  Html: Html,
  Translate: Translate,
  Transition: Transition,
  Direction: Direction,
  Peek: Peek,
  Sizes: Sizes,
  Gaps: Gaps,
  Move: Move,
  Clones: Clones,
  Resize: Resize,
  Build: Build,
  Run: Run,

  // Optional
  Swipe: Swipe,
  Images: Images,
  Anchors: Anchors,
  Controls: Controls,
  Keyboard: Keyboard,
  Autoplay: Autoplay,
  Breakpoints: Breakpoints
};

var Glide$1 = function (_Core) {
  inherits(Glide$$1, _Core);

  function Glide$$1() {
    classCallCheck(this, Glide$$1);
    return possibleConstructorReturn(this, (Glide$$1.__proto__ || Object.getPrototypeOf(Glide$$1)).apply(this, arguments));
  }

  createClass(Glide$$1, [{
    key: 'mount',
    value: function mount() {
      var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return get(Glide$$1.prototype.__proto__ || Object.getPrototypeOf(Glide$$1.prototype), 'mount', this).call(this, _extends({}, COMPONENTS, extensions));
    }
  }]);
  return Glide$$1;
}(Glide);

/* harmony default export */ __webpack_exports__["default"] = (Glide$1);


/***/ }),

/***/ "./node_modules/core-js/modules/_a-function.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_a-function.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_advance-string-index.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/_advance-string-index.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__(/*! ./_string-at */ "./node_modules/core-js/modules/_string-at.js")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_an-instance.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_an-instance.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_an-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_an-object.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_classof.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_classof.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/modules/_cof.js");
var TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_cof.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_cof.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_core.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_core.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.9' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/core-js/modules/_ctx.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_ctx.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/modules/_a-function.js");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_defined.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_defined.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_descriptors.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_descriptors.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/modules/_dom-create.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_dom-create.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var document = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/modules/_export.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_export.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/modules/_ctx.js");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "./node_modules/core-js/modules/_fails.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/modules/_fails.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/modules/_fix-re-wks.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_fix-re-wks.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ./es6.regexp.exec */ "./node_modules/core-js/modules/es6.regexp.exec.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
var wks = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js");
var regexpExec = __webpack_require__(/*! ./_regexp-exec */ "./node_modules/core-js/modules/_regexp-exec.js");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "./node_modules/core-js/modules/_flags.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/modules/_flags.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_for-of.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_for-of.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/modules/_ctx.js");
var call = __webpack_require__(/*! ./_iter-call */ "./node_modules/core-js/modules/_iter-call.js");
var isArrayIter = __webpack_require__(/*! ./_is-array-iter */ "./node_modules/core-js/modules/_is-array-iter.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/modules/_to-length.js");
var getIterFn = __webpack_require__(/*! ./core.get-iterator-method */ "./node_modules/core-js/modules/core.get-iterator-method.js");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "./node_modules/core-js/modules/_function-to-string.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/_function-to-string.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/modules/_shared.js")('native-function-to-string', Function.toString);


/***/ }),

/***/ "./node_modules/core-js/modules/_global.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_global.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/core-js/modules/_has.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_has.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_hide.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_hide.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/modules/_property-desc.js");
module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_html.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_html.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "./node_modules/core-js/modules/_ie8-dom-define.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/_ie8-dom-define.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") && !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js")(function () {
  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/modules/_dom-create.js")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/modules/_invoke.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_invoke.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_is-array-iter.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_is-array-iter.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/modules/_iterators.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_is-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_is-object.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iter-call.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-call.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iter-detect.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-detect.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iterators.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_iterators.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/modules/_library.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_library.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "./node_modules/core-js/modules/_microtask.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_microtask.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var macrotask = __webpack_require__(/*! ./_task */ "./node_modules/core-js/modules/_task.js").set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/modules/_cof.js")(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_new-promise-capability.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/_new-promise-capability.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/modules/_a-function.js");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-dp.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-dp.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/modules/_ie8-dom-define.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/modules/_to-primitive.js");
var dP = Object.defineProperty;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_perform.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_perform.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "./node_modules/core-js/modules/_promise-resolve.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/_promise-resolve.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var newPromiseCapability = __webpack_require__(/*! ./_new-promise-capability */ "./node_modules/core-js/modules/_new-promise-capability.js");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_property-desc.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_property-desc.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_redefine-all.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/_redefine-all.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_redefine.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/modules/_redefine.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var SRC = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/modules/_uid.js")('src');
var $toString = __webpack_require__(/*! ./_function-to-string */ "./node_modules/core-js/modules/_function-to-string.js");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "./node_modules/core-js/modules/_regexp-exec-abstract.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/_regexp-exec-abstract.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__(/*! ./_classof */ "./node_modules/core-js/modules/_classof.js");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_regexp-exec.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_regexp-exec.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__(/*! ./_flags */ "./node_modules/core-js/modules/_flags.js");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "./node_modules/core-js/modules/_same-value.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_same-value.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_set-species.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_set-species.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js");
var DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js");
var SPECIES = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "./node_modules/core-js/modules/_set-to-string-tag.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/_set-to-string-tag.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js").f;
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "./node_modules/core-js/modules/_shared.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_shared.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(/*! ./_library */ "./node_modules/core-js/modules/_library.js") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "./node_modules/core-js/modules/_species-constructor.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/_species-constructor.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/modules/_a-function.js");
var SPECIES = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_string-at.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_string-at.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_string-html.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_string-html.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_task.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_task.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/modules/_ctx.js");
var invoke = __webpack_require__(/*! ./_invoke */ "./node_modules/core-js/modules/_invoke.js");
var html = __webpack_require__(/*! ./_html */ "./node_modules/core-js/modules/_html.js");
var cel = __webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/modules/_dom-create.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(/*! ./_cof */ "./node_modules/core-js/modules/_cof.js")(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-integer.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-integer.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-length.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-length.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-object.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-primitive.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/_to-primitive.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/modules/_uid.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_uid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "./node_modules/core-js/modules/_user-agent.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_user-agent.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ "./node_modules/core-js/modules/_wks.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_wks.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/modules/_shared.js")('wks');
var uid = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/modules/_uid.js");
var Symbol = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "./node_modules/core-js/modules/core.get-iterator-method.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/modules/core.get-iterator-method.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(/*! ./_classof */ "./node_modules/core-js/modules/_classof.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('iterator');
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/modules/_iterators.js");
module.exports = __webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "./node_modules/core-js/modules/es6.function.name.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.function.name.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.object.to-string.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.object.to-string.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(/*! ./_classof */ "./node_modules/core-js/modules/_classof.js");
var test = {};
test[__webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js")(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}


/***/ }),

/***/ "./node_modules/core-js/modules/es6.promise.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/es6.promise.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(/*! ./_library */ "./node_modules/core-js/modules/_library.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/modules/_ctx.js");
var classof = __webpack_require__(/*! ./_classof */ "./node_modules/core-js/modules/_classof.js");
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/modules/_a-function.js");
var anInstance = __webpack_require__(/*! ./_an-instance */ "./node_modules/core-js/modules/_an-instance.js");
var forOf = __webpack_require__(/*! ./_for-of */ "./node_modules/core-js/modules/_for-of.js");
var speciesConstructor = __webpack_require__(/*! ./_species-constructor */ "./node_modules/core-js/modules/_species-constructor.js");
var task = __webpack_require__(/*! ./_task */ "./node_modules/core-js/modules/_task.js").set;
var microtask = __webpack_require__(/*! ./_microtask */ "./node_modules/core-js/modules/_microtask.js")();
var newPromiseCapabilityModule = __webpack_require__(/*! ./_new-promise-capability */ "./node_modules/core-js/modules/_new-promise-capability.js");
var perform = __webpack_require__(/*! ./_perform */ "./node_modules/core-js/modules/_perform.js");
var userAgent = __webpack_require__(/*! ./_user-agent */ "./node_modules/core-js/modules/_user-agent.js");
var promiseResolve = __webpack_require__(/*! ./_promise-resolve */ "./node_modules/core-js/modules/_promise-resolve.js");
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(/*! ./_redefine-all */ "./node_modules/core-js/modules/_redefine-all.js")($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/modules/_set-to-string-tag.js")($Promise, PROMISE);
__webpack_require__(/*! ./_set-species */ "./node_modules/core-js/modules/_set-species.js")(PROMISE);
Wrapper = __webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js")[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(/*! ./_iter-detect */ "./node_modules/core-js/modules/_iter-detect.js")(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.exec.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.exec.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__(/*! ./_regexp-exec */ "./node_modules/core-js/modules/_regexp-exec.js");
__webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.flags.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.flags.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") && /./g.flags != 'g') __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js").f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(/*! ./_flags */ "./node_modules/core-js/modules/_flags.js")
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.replace.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.replace.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/modules/_to-object.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/modules/_to-length.js");
var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var advanceStringIndex = __webpack_require__(/*! ./_advance-string-index */ "./node_modules/core-js/modules/_advance-string-index.js");
var regExpExec = __webpack_require__(/*! ./_regexp-exec-abstract */ "./node_modules/core-js/modules/_regexp-exec-abstract.js");
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__(/*! ./_fix-re-wks */ "./node_modules/core-js/modules/_fix-re-wks.js")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.search.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.search.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var sameValue = __webpack_require__(/*! ./_same-value */ "./node_modules/core-js/modules/_same-value.js");
var regExpExec = __webpack_require__(/*! ./_regexp-exec-abstract */ "./node_modules/core-js/modules/_regexp-exec-abstract.js");

// @@search logic
__webpack_require__(/*! ./_fix-re-wks */ "./node_modules/core-js/modules/_fix-re-wks.js")('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[SEARCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative($search, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.to-string.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.to-string.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ./es6.regexp.flags */ "./node_modules/core-js/modules/es6.regexp.flags.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var $flags = __webpack_require__(/*! ./_flags */ "./node_modules/core-js/modules/_flags.js");
var DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js");
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js")(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js")(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es6.string.link.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.string.link.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// B.2.3.10 String.prototype.link(url)
__webpack_require__(/*! ./_string-html */ "./node_modules/core-js/modules/_string-html.js")('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});


/***/ }),

/***/ "./node_modules/embedo/embedo.js":
/*!***************************************!*\
  !*** ./node_modules/embedo/embedo.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @file embedo.js
 *
 * Embedo is third party content embed plugin with features having events and resizing.
 * It provides a layer above popular social media sites native embed snippets
 * making it easier to hook content without modifying much code.
 *
 * @author Shobhit Sharma <hi@shobh.it>
 * @license MIT
 */



(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(this, function () {
  /**
   * @class Embedo Prototype
   *
   * @param {object} options Initialize options.
   */
  function Embedo(options) {
    this.options = options || Embedo.defaults.OPTIONS;
    this.requests = [];
    this.events = [];

    this.init(this.options);

    return this;
  }

  /**
   * @constant
   * Embedo defaults
   *
   * @description Embedo defaults contains basic configuration and values required to build internal engine.
   */
  Object.defineProperty(Embedo, 'defaults', {
    value: {
      OPTIONS: {
        facebook: null,
        twitter: false,
        instagram: false,
        pinterest: false
      },
      SOURCES: {
        facebook: {
          GLOBAL: 'FB',
          SDK: '//connect.facebook.net/${locale}/all.js',
          oEmbed: '//www.facebook.com/plugins/${type}/oembed.json',
          REGEX: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?([\w\-]*)?/g,
          PARAMS: {
            version: 'v3.2',
            cookie: true,
            appId: null,
            xfbml: true
          }
        },
        twitter: {
          GLOBAL: 'twttr',
          SDK: '//platform.twitter.com/widgets.js',
          oEmbed: '//publish.twitter.com/oembed',
          REGEX: /^http[s]*:\/\/[www.]*twitter(\.[a-z]+).*/i,
          PARAMS: {}
        },
        instagram: {
          GLOBAL: 'instgrm',
          SDK: '//www.instagram.com/embed.js',
          oEmbed: '//api.instagram.com/oembed',
          REGEX: /(http|https)?:\/\/(www\.)?instagram.com\/p\/[a-zA-Z0-9_\/\?\-\=]+/gi,
          PARAMS: {}
        },
        youtube: {
          GLOBAL: null,
          SDK: null,
          oEmbed: '//www.youtube.com/embed/',
          REGEX: /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/,
          PARAMS: null
        },
        pinterest: {
          GLOBAL: 'PinUtils',
          SDK: '//assets.pinterest.com/js/pinit.js',
          oEmbed: null,
          REGEX: /(https?:\/\/(ww.)?)?pinterest(\.[a-z]+).*/i,
          PARAMS: {}
        },
        vimeo: {
          GLOBAL: null,
          SDK: null,
          oEmbed: '//vimeo.com/api/oembed.json',
          REGEX: /(http|https)?:\/\/(www\.)?vimeo(\.[a-z]+)\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/,
          PARAMS: {}
        },
        github: {
          GLOBAL: null,
          SDK: null,
          oEmbed: null,
          REGEX: /(http|https):\/\/gist\.github\.com\/(\w+)\/(\w+)/,
          PARAMS: {}
        },
        soundcloud: {
          GLOBAL: null,
          SDK: null,
          oEmbed: '//soundcloud.com/oembed',
          REGEX: /^(http|https):\/\/soundcloud\.com\/(\w+)\/.*$/,
          PARAMS: {}
        }
      },
      RESTRICTED: ['url', 'strict', 'height', 'width', 'centerize', 'jsonp']
    },
    writable: false,
    enumerable: true,
    configurable: false
  });

  // Application Logger
  Object.defineProperty(Embedo, 'log', {
    value: function log(type) {
      if (!Embedo.debug) {
        return;
      }
      if (typeof console !== 'undefined' && typeof console[type] !== 'undefined') {
        console[type].apply(console, Array.prototype.slice.call(arguments, 1));
      }
    },
    writable: false,
    enumerable: true,
    configurable: false
  });

  // Plugins Loader
  Object.defineProperty(Embedo, 'plugins', {
    value: function load(plugins) {
      if (!plugins) {
        return;
      }
      if (plugins instanceof Array) {
        plugins.forEach(function (plugin) {
          if (typeof plugin === 'function') {
            plugin(Embedo);
          }
        });
      } else if (plugins === 'fuction') {
        plugins(Embedo);
      }
    },
    writable: false,
    enumerable: true,
    configurable: false
  });

  /**
   * Helper utlities
   * @method utils
   *
   * @private
   */
  Object.defineProperty(Embedo, 'utils', {
    value: Object.create({
      /**
       * @function uuid
       */
      uuid: function uuid() {
        var primary = (Math.random() * 0x10000) | 0;
        var secondary = (Math.random() * 0x10000) | 0;
        primary = ('000' + primary.toString(36)).slice(-3);
        secondary = ('000' + secondary.toString(36)).slice(-3);
        return 'embedo_' + primary + secondary;
      },

      /**
       * @function extend
       * @returns {object}
       */
      extend: function extend(obj) {
        obj = obj || {};
        for (var i = 1; i < arguments.length; i++) {
          if (!arguments[i]) {
            continue;
          }
          for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
              obj[key] = arguments[i][key];
            }
          }
        }
        return obj;
      },

      /**
       * @function merge
       *
       * @param {object} destination
       * @param {object} source
       * @param {array} preserve
       * @returns
       */
      merge: function merge(destination, source, preserve) {
        preserve = preserve || [];

        for (var property in source) {
          if (preserve.indexOf(property) === -1) {
            destination[property] = source[property];
          }
        }

        return destination;
      },

      /**
       * @func sequencer
       * Breaks down array into sequencer
       *
       * @param {Array} array
       * @param {Number} size
       * @returns
       */
      sequencer: function sequencer() {
        var args = arguments;
        return {
          then: function (done) {
            var counter = 0;
            for (var i = 0; i < args.length; i++) {
              args[i](callme);
            }

            function callme() {
              counter++;
              if (counter === args.length) {
                done();
              }
            }
          }
        };
      },

      /**
       * @func replacer
       * Replaces ${entity} with object key/value pair
       *
       * @param {string} str
       * @param {object} obj
       */
      replacer: function replacer(str, obj) {
        if (!str || !obj) {
          return;
        }
        if (obj) {
          for (var key in obj) {
            if (str) {
              str = str.split('${' + key + '}').join(obj[key]);
            }
          }
        }
        return str;
      },

      /**
       * @func observer
       *
       * Deferred Implementation for Object
       */
      observer: (function () {
        function Deferred() {
          this.resolved = [];
          this.rejected = [];
        }
        Deferred.prototype = {
          execute: function (list, args) {
            var i = list.length;
            args = Array.prototype.slice.call(args);
            while (i--) {
              list[i].apply(null, args);
            }
          },
          resolve: function () {
            this.execute(this.resolved, arguments);
          },
          reject: function () {
            this.execute(this.rejected, arguments);
          },
          done: function (callback) {
            this.resolved.push(callback);
            return this;
          },
          fail: function (callback) {
            this.rejected.push(callback);
            return this;
          }
        };
        return Deferred;
      })(),

      camelToSnake: function camelToSnake(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      },

      /**
       * @function validateURL
       *
       * @param {string} url
       * @returns
       */
      validateURL: function validateURL(url) {
        return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(
          url
        );
      },

      /**
       * @function generateElement
       * Generates DOM element
       *
       * @param {string} source
       * @param {object} attributes
       * @param {string} html
       * @returns HTMLElement
       */
      generateElement: function generateElement(type, attributes, html) {
        var el = document.createElement(type);
        Object.keys(attributes || {}).forEach(function (type) {
          el.setAttribute(type, attributes[type]);
        });
        if (html) {
          el.innerHTML = html;
        }
        return el;
      },

      /**
       * @function generateEmbed
       * Generates Embed Container
       *
       * @param {string} source
       * @param {string} html
       * @returns
       */
      generateEmbed: function generateEmbed(id, source, html) {
        id = id || Embedo.utils.uuid();
        var container = document.createElement('div');

        container.setAttribute('id', id);
        container.setAttribute('data-embedo-id', id);
        container.setAttribute('data-embedo-source', source);

        if (Embedo.utils.validateElement(html)) {
          container.appendChild(html);
        } else {
          container.innerHTML = html || '';
        }

        return container;
      },

      /**
       * @function generateScript
       * Generates script tag element
       *
       * @param {string} source
       * @returns HTMLElement
       */
      generateScript: function generateScript(source) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = encodeURI(source);
        script.setAttribute('async', '');
        script.setAttribute('charset', 'utf-8');
        return script;
      },

      /**
       * @function validateElement
       * Validates if passed argument is valid DOM element
       *
       * @param {object} obj
       * @returns HTMLElement
       */
      validateElement: function validateElement(obj) {
        return typeof HTMLElement === 'object' ?
          obj instanceof window.HTMLElement :
          obj &&
          typeof obj === 'object' &&
          obj !== null &&
          obj.nodeType === 1 &&
          typeof obj.nodeName === 'string';
      },

      /**
       * @function sdkReady
       * Checks when SDK global object is ready
       *
       * @param {string} type
       * @param {function} callback
       */
      sdkReady: function sdkReady(type, callback) {
        callback = callback || function () {};
        if (!Embedo.defaults.SOURCES[type]) {
          return callback(new Error('unsupported_sdk_type'));
        }
        var counter = 0;
        (function check() {
          counter++;
          if (counter > 15) {
            return callback(new Error(type + ':sdk_not_available'));
          }
          if (window[Embedo.defaults.SOURCES[type].GLOBAL]) {
            return callback(null, window[Embedo.defaults.SOURCES[type].GLOBAL]);
          }
          setTimeout(check, 10 * counter);
        })(type);
      },

      /**
       * @function querystring
       * Object to Query String
       *
       * @param {object} obj
       * @returns {string}
       */
      querystring: function querystring(obj) {
        var parts = [];

        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
          }
        }

        return parts.join('&');
      },

      /**
       * @function fetch
       * JSONP XHR fetch
       *
       * @param {string} url
       * @param {object} options
       * @param {function} callback
       */
      fetch: function fetch(url, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        options = options || {};
        options.callback = options.callback || 'callback';
        var target = document.head || document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        var jsonpCallback = 'jsonp_' + Embedo.utils.uuid();
        url += (~url.indexOf('?') ? '&' : '?') + options.callback + '=' + encodeURIComponent(jsonpCallback);
        url = url.replace('?&', '?');

        window[jsonpCallback] = function (data) {
          clear(jsonpCallback, script);
          callback(null, data);
        };

        script.type = 'text/javascript';
        script.defer = true;
        script.charset = 'UTF-8';
        script.onerror = function (err) {
          clear(jsonpCallback, script);
          return callback(err);
        };
        target.appendChild(script);
        script.src = url;

        function clear(jsonpCallback, script) {
          try {
            delete window[jsonpCallback];
          } catch (e) {
            window[jsonpCallback] = undefined;
          }
          if (script) {
            target.removeChild(script);
            script = undefined;
          }
        }
      },

      /**
       * XHR HTTP Requests
       *
       * @param {string} url
       * @param {object} options
       * @param {Function} callback
       */
      ajax: function ajax(url, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        callback = callback || function () {};
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (xhr.status >= 400) {
            return callback(new Error(xhr.responseText || xhr.statusText));
          }
          try {
            return callback(null, JSON.parse(xhr.responseText));
          } catch (e) {
            return callback(new Error('invalid_response'));
          }
        };
        xhr.onerror = function (err) {
          return callback(err);
        };
        xhr.open('GET', url);
        xhr.send();
      },

      /**
       * @function transform
       * Cross Browser CSS Transformation
       *
       * @param {HTMLElement} element
       * @param {string} props
       */
      transform: function transform(element, props) {
        if (!Embedo.utils.validateElement(element)) {
          return;
        }
        element.style.webkitTransform = props;
        element.style.MozTransform = props;
        element.style.msTransform = props;
        element.style.OTransform = props;
        element.style.transform = props;
      },

      /**
       * @function compute
       * Computes property value of HTMLElement
       *
       * @param {HTMLElement} el
       * @param {string} prop
       * @param {Boolean} stylesheet
       * @returns {Number}
       */
      compute: function compute(el, prop, is_computed) {
        if (!Embedo.utils.validateElement(el) || !prop) {
          return;
        }

        var bounds = el.getBoundingClientRect();
        var value = bounds[prop];

        if (is_computed || !value) {
          if (document.defaultView && document.defaultView.getComputedStyle) {
            value = document.defaultView.getComputedStyle(el, '').getPropertyValue(prop);
          } else if (el.currentStyle) {
            prop = prop.replace(/\-(\w)/g, function (m, p) {
              return p.toUpperCase();
            });
            value = el.currentStyle[prop];
          }
        }

        if (typeof value === 'string' && !/^\d+(\.\d+)?%$/.test(value)) {
          value = value.replace(/[^\d.-]/g, '');
        }

        return isNaN(Number(value)) ? value : Number(value);
      },

      /**
       * @method convertToPx
       * Calculates approximate pixel value for vw, vh or % values
       *
       * @implements relative_px
       * @implements percent_px
       */
      convertToPx: function convertToPx(el, prop, value) {
        if (!isNaN(Number(value))) {
          return Number(value);
        } else if (/^\d+(\.\d+)?%$/.test(value)) {
          return percent_px(el, prop, value);
        } else if (value.match(/(vh|vw)/)) {
          var dimension = value.replace(/[0-9]/g, '');
          return relative_px(dimension, value);
        }

        // Converts vw or vh to PX
        function relative_px(type, value) {
          var w = window,
            d = document,
            e = d.documentElement,
            g = d.body,
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;

          if (type === 'vw') {
            return (x * parseFloat(value)) / 100;
          } else if (type === 'vh') {
            return (y * parseFloat(value)) / 100;
          } else {
            return undefined;
          }
        }

        // Converts % to PX
        function percent_px(el, prop, percent) {
          var parent_width = Embedo.utils.compute(el.parentNode, prop, true);
          percent = parseFloat(percent);
          return parent_width * (percent / 100);
        }
      },

      /**
       * @function watcher
       *
       * @param {string} Identifer
       * @param {Function} Function to Trigger
       * @param {integer} timer
       *
       * @returns {Function}
       */
      watcher: function watcher(id, fn, timer) {
        window.EMBEDO_WATCHER = window.EMBEDO_WATCHER || {};
        window.EMBEDO_WATCHER[id] = window.EMBEDO_WATCHER[id] || {
          id: id,
          count: 0,
          request: null
        };

        if (window.EMBEDO_WATCHER[id].count > 0 && window.EMBEDO_WATCHER[id].request) {
          window.EMBEDO_WATCHER[id].count -= 1;
          clearTimeout(window.EMBEDO_WATCHER[id].request);
        }

        window.EMBEDO_WATCHER[id].count += 1;
        window.EMBEDO_WATCHER[id].request = setTimeout(function () {
          window.EMBEDO_WATCHER[id].count -= 1;
          if (window.EMBEDO_WATCHER[id].count === 0) {
            fn.call();
          }
        }, timer);

        return null;
      },

      /**
       * @function dimensions
       *
       * @param {HTMLElement} el
       * @param {string} width
       * @param {string} height
       *
       * @returns {object{width,height}}
       */
      dimensions: function dimensions(el, width, height) {
        var el_width = Embedo.utils.compute(el, 'width');
        width = width ?
          width :
          el_width > 0 ?
          el_width :
          Embedo.utils.compute(el.parentNode, 'width');
        height = height ?
          height :
          el_width > 0 ?
          el_width / 1.5 :
          Embedo.utils.compute(el.parentNode, 'height');
        return {
          width: width,
          height: height
        };
      },

      /**
       * @function centerize
       * Align an element center in relation to parent div
       *
       * @param {HTMLElement} parent_el
       * @param {HTMLElement} child_el
       * @param {object} options
       * @returns
       */
      centerize: function centerize(parent_el, child_el, options) {
        Embedo.log('info', 'centerize', parent_el, child_el, options);
        if (!Embedo.utils.validateElement(parent_el) || !Embedo.utils.validateElement(child_el)) {
          return;
        }
        options = options || {};

        if (options.width) {
          parent_el.style.width = options.width;
          parent_el.style.maxWidth = options.width;
          parent_el.style.marginLeft = 'auto';
          parent_el.style.marginRight = 'auto';
        }

        if (options.height) {
          parent_el.style.height = options.height;
          parent_el.style.maxHeight = options.height;
        }

        child_el.style.display = '-moz-box';
        child_el.style.display = '-ms-flexbox';
        child_el.style.display = '-webkit-flex';
        child_el.style.display = '-webkit-box';
        child_el.style.display = 'flex';
        child_el.style.textAlign = 'center';
        child_el.style['justify-content'] = 'center';
        child_el.style['align-items'] = 'center';
        child_el.style.margin = '0 auto';
      },

      /**
       * @function handleScriptValidation
       *
       * @param {string} url
       */
      handleScriptValidation: function handleScriptValidation(url) {
        if (!url) {
          return;
        }
        url = url.split('#')[0];
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length; i--;) {
          if (scripts[i].src === url) {
            return true;
          }
        }
        return false;
      }
    }),
    writable: false,
    enumerable: true,
    configurable: false
  });

  /**
   * Embedo Event Listeners
   * @private
   *
   * @implements on
   * @implements off
   * @implements emit
   */
  Object.defineProperties(Embedo.prototype, {
    on: {
      value: function (event, listener) {
        if (typeof this.events[event] !== 'object') {
          this.events[event] = [];
        }
        this.events[event].push(listener);
      },
      writable: false,
      configurable: false
    },
    off: {
      value: function (event, listener) {
        var index;
        if (typeof this.events[event] === 'object') {
          index = this.events[event].indexOf(listener);
          if (index > -1) {
            this.events[event].splice(index, 1);
          }
        }
      },
      writable: false,
      configurable: false
    },
    emit: {
      value: function (event) {
        var i,
          listeners,
          length,
          args = [].slice.call(arguments, 1);
        if (typeof this.events[event] === 'object') {
          listeners = this.events[event].slice();
          length = listeners.length;

          for (i = 0; i < length; i++) {
            listeners[i].apply(this, args);
          }
        }
      },
      writable: false,
      configurable: false
    },
    once: {
      value: function (event, listener) {
        this.on(event, function g() {
          this.off(event, g);
          listener.apply(this, arguments);
        });
      },
      writable: false,
      configurable: false
    }
  });

  /**
   * @method init
   * Primary Embedo initialization
   *
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.init = function (options) {
    Embedo.log('info', 'init', this.requests, options);

    // Append enabled SDKs to DOM
    Object.keys(Embedo.defaults.SOURCES).forEach(function (source) {
      if (Embedo.defaults.SOURCES[source].SDK) {
        appendSDK(source, options[source]);
      }
    });

    this.domify();

    /**
     * @func appendSDK
     * Injects SDK's to body
     * @private
     *
     * @param {*} type
     * @param {*} props
     */
    function appendSDK(type, props) {
      if (!type || !props) {
        return;
      }
      var sdk = Embedo.utils.replacer(Embedo.defaults.SOURCES[type.toLowerCase()].SDK, {
        locale: props.locale || window.navigator.language || 'en_US'
      });

      if (!Embedo.utils.handleScriptValidation(sdk)) {
        if (props && typeof props === 'object') {
          sdk += (type === 'facebook' ? '#' : '?') + Embedo.utils.querystring(props);
        }
        document.body.appendChild(Embedo.utils.generateScript(sdk));
      }
    }
  };

  /**
   * @method domify
   * Replaces "data-embedo-*" elements during initialization.
   */
  Embedo.prototype.domify = function domify() {
    var embedos = document.querySelectorAll('[data-embedo-url]');
    [].forEach.call(embedos, function (embedo_el) {
      var options = Object.keys(embedo_el.dataset || {}).reduce(function (acc, cur) {
        if (cur.indexOf('embedo') !== -1) {
          var option = Embedo.utils.camelToSnake(cur).replace('embedo-', '');
          acc[option] = embedo_el.dataset[cur];
        }
        return acc;
      }, {});

      this.render(embedo_el, options.url, options);
    }.bind(this));
  };

  /**
   * @method facebook
   * Facebook embed prototype
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.facebook = function facebook(id, element, url, options, callback) {
    var type, fb_html_class;

    if (/^([^\/?].+\/)?post|photo(s|\.php)[\/?].*$/gm.test(url)) {
      type = url.match(/comment_id|reply_comment_id/) ? 'comment' : 'post';
    } else if (/^([^\/?].+\/)?video(s|\.php)[\/?].*$/gm.test(url)) {
      type = 'video';
    }

    if (type && type.match(/post|video/)) {
      var embed_uri = Embedo.utils.replacer(Embedo.defaults.SOURCES.facebook.oEmbed, {
        type: type
      });
      var query = Embedo.utils.merge({
          url: encodeURI(url),
          omitscript: true
        },
        options,
        Embedo.defaults.RESTRICTED
      );

      if ('width' in options || 'maxwidth' in options) {
        query.maxwidth = options.maxwidth || options.width;
      }

      embed_uri += '?' + Embedo.utils.querystring(query);

      Embedo.utils.fetch(embed_uri, function (error, content) {
        if (error) {
          Embedo.log('error', 'facebook', error);
          return callback(error);
        }
        handleFacebookEmbed(content.html);
      });
    } else {
      if (type === 'comment' || url.match(/comment_id|reply_comment_id/)) {
        fb_html_class = 'fb-comment-embed';
        options['data-numposts'] = options['data-numposts'] || 5;
      } else if (url.match(/plugins\/comments/)) {
        fb_html_class = 'fb-comments';
      } else {
        fb_html_class = 'fb-page';
        options['data-height'] =
          options['data-height'] || options.maxheight || options.height || 500;
      }

      var fb_html = Embedo.utils.generateElement(
        'div',
        Embedo.utils.merge({
            class: fb_html_class,
            'data-href': url,
            'data-width': options['data-width'] || options.maxwidth || options.width || 350
          },
          options
        )
      );

      fb_html.removeAttribute('width');
      fb_html.removeAttribute('height');
      handleFacebookEmbed(fb_html);
    }

    function handleFacebookEmbed(html) {
      var container = Embedo.utils.generateEmbed(id, 'facebook', html);
      element.appendChild(container);

      facebookify(
        element,
        container, {
          id: id,
          url: url,
          strict: options.strict,
          width: options.width,
          height: options.height,
          centerize: options.centerize
        },
        function (err, result) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            id: id,
            el: element,
            width: result.width,
            height: result.height
          });
        }
      );
    }
  };

  /**
   * Twitter embed prototype
   * @method twitter
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.twitter = function twitter(id, element, url, options, callback) {
    var embed_uri = Embedo.defaults.SOURCES.twitter.oEmbed;
    var query = Embedo.utils.merge({
        url: encodeURI(url),
        omit_script: 1
      },
      options,
      Embedo.defaults.RESTRICTED
    );

    if ('width' in options || 'maxwidth' in options) {
      query.maxwidth = options.maxwidth || options.width;
    }

    if ('height' in options || 'maxheight' in options) {
      query.maxheight = options.maxheight || options.height;
    }

    embed_uri += '?' + Embedo.utils.querystring(query);

    Embedo.utils.fetch(embed_uri, function (error, content) {
      if (error) {
        Embedo.log('error', 'twitter', error);
        return callback(error);
      }
      var container = Embedo.utils.generateEmbed(id, 'twitter', content.html);
      element.appendChild(container);

      twitterify(
        element,
        container, {
          id: id,
          url: url,
          strict: options.strict,
          width: options.width,
          height: options.height,
          centerize: options.centerize
        },
        function (err, result) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            id: id,
            el: element,
            width: result.width,
            height: result.height
          });
        }
      );
    });
  };

  /**
   * @method instagram
   * Instagram embed prototype
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.instagram = function (id, element, url, options, callback) {
    var embed_uri = Embedo.defaults.SOURCES.instagram.oEmbed;
    var query = Embedo.utils.merge({
        url: encodeURI(url),
        omitscript: true,
        hidecaption: true
      },
      options,
      Embedo.defaults.RESTRICTED
    );

    if ('width' in options || 'maxwidth' in options) {
      options.width = options.maxwidth ? options.maxwidth : options.width;
      if (options.width > 320) {
        query.maxwidth = options.width;
      }
    }

    embed_uri += '?' + Embedo.utils.querystring(query);

    var method = options.jsonp ? 'jsonp' : 'ajax';

    Embedo.utils[method](embed_uri, function (err, content) {
      if (err) {
        Embedo.log('error', 'instagram', err);
        // If oembed or instagram embed script is unavailable.
        if (options.jsonp === undefined || options.jsonp === null) {
          var extracted_url = url.match(Embedo.defaults.SOURCES.instagram.REGEX);
          url = extracted_url && extracted_url.length > 0 ? extracted_url[0].replace(/\/$/, '') : url;
          return this.iframe(id, element, url + '/embed/', options, callback);
        }
        return callback(err);
      }

      var container = Embedo.utils.generateEmbed(id, 'instagram', content.html);
      element.appendChild(container);

      instagramify(
        element,
        container, {
          id: id,
          url: url,
          strict: options.strict,
          width: options.width,
          height: options.height,
          centerize: options.centerize
        },
        function (err, result) {
          if (err) {
            return callback(err);
          }
          callback(null, {
            id: id,
            el: element,
            width: result.width,
            height: result.height
          });
        }
      );
    }.bind(this));
  };

  /**
   * @method youtube
   * YouTube embed prototype
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.youtube = function (id, element, url, options, callback) {
    if (!getYTVideoID(url)) {
      Embedo.log('error', 'youtube', 'Unable to detect Youtube video id.');
      return callback('Unable to detect Youtube video id.');
    }

    var youtube_uri = Embedo.defaults.SOURCES.youtube.oEmbed + getYTVideoID(url);
    youtube_uri += '?' + Embedo.utils.querystring(
      Embedo.utils.merge({
          modestbranding: 1,
          autohide: 1,
          showinfo: 0
        },
        options,
        Embedo.defaults.RESTRICTED
      )
    );

    this.iframe(id, element, youtube_uri, options, callback);

    /**
     * @func getYTVideoID
     * @private
     *
     * @param {string} url
     * @returns {String|Boolean}
     */
    function getYTVideoID(url) {
      var regexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
      var match = url.match(regexp);
      return match && match.length === 2 ? match[1] : false;
    }
  };

  /**
   * @method vimeo
   * Vimeo embed prototype
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.vimeo = function (id, element, url, options, callback) {
    var size = Embedo.utils.dimensions(element, options.width, options.height);
    var embed_options = Embedo.utils.merge({
        url: url,
        width: size.width,
        height: size.height,
        autohide: 1
      },
      options,
      Embedo.defaults.RESTRICTED
    );
    var embed_uri =
      Embedo.defaults.SOURCES.vimeo.oEmbed + '?' + Embedo.utils.querystring(embed_options);

    Embedo.utils.fetch(embed_uri, function (error, content) {
      if (error) {
        Embedo.log('error', 'vimeo', error);
        return callback(error);
      }
      var container = Embedo.utils.generateEmbed(id, 'vimeo', content.html);
      element.appendChild(container);

      callback(null, {
        id: id,
        el: element,
        width: size.width,
        height: size.height
      });
    });
  };

  /**
   * @method pinterest
   * Pinterest Embed
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.pinterest = function (id, element, url, options, callback) {
    var size = Embedo.utils.dimensions(element, options.width, options.height);
    var pin_size = size.width > 600 ? 'large' : size.width < 345 ? 'small' : 'medium';
    var pin_el = Embedo.utils.generateElement(
      'a',
      Embedo.utils.merge({
          href: url,
          'data-pin-do': options['data-pin-do'] || 'embedPin',
          'data-pin-lang': options['data-pin-lang'] || 'en',
          'data-pin-width': pin_size
        },
        options
      )
    );
    var container = Embedo.utils.generateEmbed(id, 'pinterest', pin_el);

    element.appendChild(container);

    pinterestify(
      element,
      container, {
        id: id,
        url: url,
        strict: options.strict,
        width: options.width,
        height: options.height,
        centerize: options.centerize
      },
      function (err, result) {
        if (err) {
          Embedo.log('error', 'pinterest', err);
          return callback(err);
        }
        callback(null, {
          id: id,
          el: element,
          width: result.width,
          height: result.height
        });
      }
    );
  };

  /**
   * @method github
   * Embed github URLs (gist) to DOM
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.github = function github(id, element, url, options, callback) {
    var size = Embedo.utils.dimensions(element, options.width, options.height);
    var iframe = Embedo.utils.generateElement('iframe',
      Embedo.utils.merge({
          width: size.width,
          height: size.height
        },
        options,
        Embedo.defaults.RESTRICTED
      )
    );
    var container = Embedo.utils.generateEmbed(id, 'github', iframe);

    element.appendChild(container);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(
      '<body><style type="text/css">body,html{margin:0;padding:0;border-radius:3px;}' +
      '.gist .gist-file{margin:0 !important;padding:0;}</style>' +
      '<script src="' + url + '"></script>' +
      '</body>'
    );
    iframe.contentWindow.document.close();
    iframe.onerror = function (err) {
      callback(err);
    };
    iframe.addEventListener("load", function (event) {
      callback(null, {
        id: id,
        el: element,
        event: event,
        width: Embedo.utils.compute(container, 'width'),
        height: Embedo.utils.compute(container, 'height')
      });
    });
  };

  /**
   * @method soundcloud
   * SoundCloud Embed Player (api-web) prototype
   *
   * @see https://developers.soundcloud.com/docs/oembed
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.soundcloud = function (id, element, url, options, callback) {
    if (options.hasOwnProperty('width') && options.width) {
      options.maxwidth = options.maxwidth || options.width || '100%';
    }
    if (options.hasOwnProperty('height') && options.height) {
      options.maxheight = options.maxheight || options.height;
    }
    var size = Embedo.utils.dimensions(element, options.maxwidth, options.maxheight);
    var embed_options = Embedo.utils.merge({
        url: encodeURI(url),
        format: 'js' // Defaults JSONP
      },
      options,
      Embedo.defaults.RESTRICTED
    );
    var embed_uri =
      Embedo.defaults.SOURCES.soundcloud.oEmbed + '?' + Embedo.utils.querystring(embed_options);

    Embedo.utils.fetch(embed_uri, function (error, content) {
      if (error) {
        Embedo.log('error', 'soundcloud', error);
        return callback(error);
      }
      var container = Embedo.utils.generateEmbed(id, 'soundcloud', content.html);
      element.appendChild(container);

      callback(null, {
        id: id,
        el: element,
        width: size.width,
        height: size.height
      });
    });
  };

  /**
   * @method iframe
   * Embed URLs to HTML5 frame prototype
   *
   * @param {number} id
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.iframe = function (id, element, url, options, callback) {
    var fragment = document.createDocumentFragment();
    var size = Embedo.utils.dimensions(element, options.width, options.height);
    var extension = (url.substr(url.lastIndexOf('.')) || '').replace('.', '').toLowerCase();
    var mimes = {
      csv: 'text/csv',
      pdf: 'application/pdf',
      gif: 'image/gif',
      js: 'application/javascript',
      json: 'application/json',
      xhtml: 'application/xhtml+xml',
      pps: 'application/vnd.ms-powerpoint',
      ppsx: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
      xml: 'application/xml',
      ogg: 'video/ogg',
      mp4: 'video/mp4',
      webm: 'video/webm',
      html: 'text/html'
    };
    var mimetype = mimes[extension] || mimes.html;
    var has_video = extension.match(/(mp4|ogg|webm|ogv|ogm)/);
    var el_type = has_video ? 'video' : options.tagName || 'embed';
    var override = Embedo.utils.merge({}, options, Embedo.defaults.RESTRICTED);
    var embed_el = Embedo.utils.generateElement(el_type,
      Embedo.utils.merge({
          type: mimetype,
          src: url,
          width: size.width,
          height: size.height
        },
        override
      )
    );

    fragment.appendChild(Embedo.utils.generateEmbed(id, 'iframe', embed_el));
    element.appendChild(fragment);

    if (el_type === 'video') {
      setTimeout(function () {
        callback(null, {
          id: id,
          el: element,
          width: Embedo.utils.compute(embed_el, 'width'),
          height: Embedo.utils.compute(embed_el, 'height')
        });
      }, 250);
    } else {
      embed_el.onerror = function (err) {
        callback(err);
      };
      embed_el.addEventListener("load", function (event) {
        callback(null, {
          id: id,
          el: element,
          event: event,
          width: Embedo.utils.compute(embed_el, 'width'),
          height: Embedo.utils.compute(embed_el, 'height')
        });
      });
    }
  };

  /**
   * @method render
   * Renders an embedo instance
   *
   * @name load
   * @param {HTMLElement} element
   * @param {string} url
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.render = function (element, url, options, callback) {
    Embedo.log('info', 'render', element, url, options);
    options = options || {};
    callback = callback || function () {};

    if (!element || !Embedo.utils.validateElement(element)) {
      Embedo.log('info', 'render', '`element` is either missing or invalid');
      return this.emit('error', new Error('element_is_missing'));
    }

    if (typeof url !== 'string') {
      return this.emit('error', new Error('invalid_url_string'));
    }

    if (!url || !Embedo.utils.validateURL(url)) {
      Embedo.log('info', 'render', '`url` is either missing or invalid');
      return this.emit('error', new Error('invalid_or_missing_url'));
    }

    var source = getURLSource(url);

    if (!source) {
      Embedo.log('info', 'render', new Error('Invalid or Unsupported URL'));
      return this.emit('error', new Error('url_not_supported'));
    }

    if (!this[source]) {
      Embedo.log('info', 'render', new Error('Requested source is not implemented or missing.'));
      return this.emit('error', new Error('unrecognised_url'));
    }

    if ('width' in options && options.width) {
      options.width = Embedo.utils.convertToPx(element, 'width', options.width);
    }

    if ('height' in options && options.height) {
      options.height = Embedo.utils.convertToPx(element, 'height', options.height);
    }

    var id = Embedo.utils.uuid();
    var request = {
      id: id,
      el: element,
      source: source,
      url: url,
      attributes: options
    };

    this.requests.push(request);

    this.emit('watch', 'load', request);

    this[source](id, element, url, options,
      function (err, data) {
        if (err) {
          this.emit('error', err);
          return callback(err);
        }
        data.url = request.url;
        data.source = request.source;
        data.options = request.attributes;

        this.emit('watch', 'loaded', data);
        callback(null, data);
      }.bind(this)
    );

    /**
     * @function getURLSource
     * Checks Source from URI
     *
     * @param {string} url
     * @returns {string}
     */
    function getURLSource(url) {
      var urlRegExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
      var sources = Object.keys(Embedo.defaults.SOURCES) || [];

      if (!urlRegExp.test(url)) {
        return null;
      }

      var matched_source = sources
        .filter(function (source) {
          if (Embedo.defaults.SOURCES[source] && url.match(Embedo.defaults.SOURCES[source].REGEX)) {
            return source;
          }
        })
        .filter(Boolean);

      return matched_source && matched_source.length ? matched_source[0] : 'iframe';
    }
  };

  /**
   * @method load
   * Loads single or multiple embedo instances
   *
   * @name load
   * @param {HTMLElement} element
   * @param {String|Array} urls
   * @param {object} options Optional parameters.
   * @return callback
   */
  Embedo.prototype.load = function (element, urls, options) {
    Embedo.log('info', 'load', element, urls, options);
    options = options || {};
    var observer = new Embedo.utils.observer();

    if (!element || !Embedo.utils.validateElement(element)) {
      Embedo.log('info', 'load', '`element` is either missing or invalid');
      this.emit('error', new Error('element_is_missing'));
    } else {
      if (urls instanceof Array) {
        var reqs = {
          failed: [],
          finished: []
        };
        var jobs = urls.map(
          function (url) {
            return function (done) {
              this.render(element, url, options, function (err, data) {
                if (err) {
                  reqs.failed.push(err);
                  return done(err);
                }
                reqs.finished.push(data);
                done(null, data);
              });
            }.bind(this);
          }.bind(this)
        );

        Embedo.utils.sequencer.apply(this, jobs).then(function () {
          if (reqs.failed.length > 0) {
            return observer.reject(reqs.failed);
          }
          observer.resolve(reqs.finished);
        });
      } else if (typeof urls === 'string') {
        this.render(element, urls, options, function (err, data) {
          if (err) {
            return observer.reject(err);
          }
          observer.resolve(data);
        });
      } else {
        this.emit('error', new Error('invalid_url_string'));
      }
    }

    return observer;
  };

  /**
   * @method refresh
   * Refresh single or all embedo instances
   *
   * @param {object} element
   */
  Embedo.prototype.refresh = function (element) {
    Embedo.log('info', 'refresh', this.requests, element);
    if (this.requests.length === 0) {
      return;
    }
    this.requests.forEach(
      function (request) {
        if (!request.el) {
          return;
        }

        if (request.source === 'iframe') {
          return this.emit('refresh', request, {
            width: Embedo.utils.compute(request.el, 'width'),
            height: Embedo.utils.compute(request.el, 'height')
          });
        }

        if (element) {
          if (!Embedo.utils.validateElement(element)) {
            return;
          }
          if (element === request.el) {
            automagic(
              request.el,
              document.getElementById(request.id),
              request.attributes,
              function (err, data) {
                if (data) {
                  this.emit('refresh', request, data);
                }
              }.bind(this)
            );
          }
        } else {
          automagic(
            request.el,
            document.getElementById(request.id),
            request.attributes,
            function (err, data) {
              if (data) {
                this.emit('refresh', request, data);
              }
            }.bind(this)
          );
        }
      }.bind(this)
    );

    return this;
  };

  /**
   * @method destroy
   * Destroy an/all instance(s) of embedo
   *
   * @param {object} element
   */
  Embedo.prototype.destroy = function (element) {
    Embedo.log('warn', 'destroy', this.requests, element);
    if (this.requests.length === 0) {
      return;
    }
    var removed = [];

    this.requests.forEach(
      function (request) {
        if (!request.el || !Embedo.utils.validateElement(request.el)) {
          return;
        }
        if (element) {
          if (!Embedo.utils.validateElement(element)) {
            return;
          }
          if (element === request.el) {
            if (document.getElementById(request.id)) {
              document.getElementById(request.id).remove();
            }
            removed.push(request.id);
            this.emit('destroy', request);
          }
        } else {
          if (document.getElementById(request.id)) {
            document.getElementById(request.id).remove();
          }
          removed.push(request.id);
          this.emit('destroy', request);
        }
      }.bind(this)
    );

    this.requests = this.requests.filter(function (request) {
      return removed.indexOf(request.id) < 0;
    });

    return this;
  };

  /**
   * @function facebookify
   * Parses Facebook SDK
   *
   * @param {HTMLElement} parentNode
   * @param {HTMLElement} childNode
   * @param {object} options
   */
  function facebookify(parentNode, childNode, options, callback) {
    Embedo.utils.sdkReady('facebook', function (err) {
      if (err) {
        return callback(err);
      }
      window.FB.XFBML.parse(parentNode);
      window.FB.Event.subscribe('xfbml.render', function () {
        // First state will be `parsed` and then `rendered` to acknowledge embed.
        if (childNode.firstChild) {
          if (options.centerize !== false) {
            Embedo.utils.centerize(parentNode, childNode, options);
          }
          if (childNode.firstChild.getAttribute('fb-xfbml-state') === 'rendered') {
            automagic(parentNode, childNode, options, callback);
          }
        }
      });
    });
  }

  /**
   * @function twitterify
   * Parses Twitter SDK
   *
   * @param {HTMLElement} parentNode
   * @param {HTMLElement} childNode
   * @param {object} options
   */
  function twitterify(parentNode, childNode, options, callback) {
    Embedo.utils.sdkReady('twitter', function (err) {
      if (err) {
        return callback(err);
      }
      window.twttr.widgets.load(childNode);
      window.twttr.events.bind('rendered', function (event) {
        if (
          childNode.firstChild &&
          childNode.firstChild.getAttribute('id') === event.target.getAttribute('id')
        ) {
          if (options.centerize !== false) {
            Embedo.utils.centerize(parentNode, childNode, options);
          }
          automagic(parentNode, childNode, options, callback);
        }
      });
    });
  }

  /**
   * @function instagramify
   * Parses Instagram SDK
   *
   * @param {HTMLElement} parentNode
   * @param {HTMLElement} childNode
   * @param {object} options
   */
  function instagramify(parentNode, childNode, options, callback) {
    Embedo.utils.sdkReady('instagram', function (err) {
      if (err) {
        return callback(err);
      }
      if (!window.instgrm.Embeds || !window.instgrm.Embeds) {
        return callback(new Error('instagram_sdk_missing'));
      }

      window.instgrm.Embeds.process(childNode);
      var instagram_embed_timer = setInterval(handleInstagramRendered, 250);

      function handleInstagramRendered() {
        if (
          childNode.firstChild &&
          childNode.firstChild.className.match(/instagram-media-rendered/)
        ) {
          clearInterval(instagram_embed_timer);
          if (options.centerize !== false) {
            Embedo.utils.centerize(parentNode, childNode, options);
          }
          return automagic(parentNode, childNode, options, callback);
        }
      }
    });
  }

  /**
   * @function pinterestify
   * Parses Pinterest SDK
   *
   * @param {HTMLElement} parentNode
   * @param {HTMLElement} childNode
   * @param {object} options
   */
  function pinterestify(parentNode, childNode, options, callback) {
    Embedo.utils.sdkReady('pinterest', function (err) {
      if (err) {
        return callback(err);
      }
      if (!window.PinUtils || !window.PinUtils || !childNode || !childNode.firstChild) {
        return callback(new Error('pinterest_sdk_missing'));
      }

      setTimeout(function () {
        if (!childNode.querySelector('[data-pin-href]')) {
          window.PinUtils.build(childNode);
        }

        var pinterest_embed_timer_count = 0;
        var pinterest_embed_timer = setInterval(function () {
          pinterest_embed_timer_count += 1;
          if (childNode.querySelector('[data-pin-href]')) {
            clearInterval(pinterest_embed_timer);
            if (options.centerize !== false) {
              Embedo.utils.centerize(parentNode, childNode, options);
            }
            return automagic(parentNode, childNode, options, callback);
          } else if (pinterest_embed_timer_count >= 20) {
            clearInterval(pinterest_embed_timer);
            return callback(new Error('pinterest_embed_failed'));
          }
        }, 250);
      }, 750);
    });
  }

  /**
   * @function automagic
   * Automagic - Scales and resizes embed container
   *
   * @param {HTMLElement} parentNode
   * @param {HTMLElement} childNode
   * @param {object} options
   */
  function automagic(parentNode, childNode, options, callback) {
    Embedo.log('info', 'automagic', parentNode, childNode, options);
    options = options || {};
    callback = callback || function () {};

    if (!Embedo.utils.validateElement(parentNode) || !Embedo.utils.validateElement(childNode)) {
      return callback(new Error('HTMLElement does not exist in DOM.'));
    }

    Embedo.utils.watcher(
      options.id || Embedo.utils.uuid(),
      function () {
        var parent = {
          width: options.width || Embedo.utils.compute(parentNode, 'width'),
          height: options.height || Embedo.utils.compute(parentNode, 'height')
        };
        var child = {
          width: Embedo.utils.compute(childNode, 'width'),
          height: Embedo.utils.compute(childNode, 'height')
        };

        if (options.strict) {
          return callback(null, {
            width: parent.width,
            height: parent.height
          });
        }

        // Odd case when requested height is beyond limit of third party
        // Only apply when fixed width and heights are provided
        if (options.width && options.height) {
          var isOverflowing = child.width > parent.width || child.height > parent.height;

          if (options.width) {
            childNode.style.width = options.width + 'px';
          }

          if (options.height) {
            childNode.style.height = options.height + 'px';
          }

          if (isOverflowing) {
            var scale = Math.min(parent.width / child.width, parent.height / child.height);
            Embedo.utils.transform(childNode, 'scale(' + scale + ')');
          }
        }

        callback(null, {
          width: parent.width,
          height: parent.height
        });
      },
      500
    );
  }

  return Embedo;
});


/***/ }),

/***/ "./node_modules/pnotify/dist/es/PNotify.js":
/*!*************************************************!*\
  !*** ./node_modules/pnotify/dist/es/PNotify.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
let PNotify,posTimer,onDocumentLoaded=()=>{PNotify.defaultStack.context=document.body,window.addEventListener("resize",()=>{posTimer&&clearTimeout(posTimer),posTimer=setTimeout(()=>{PNotify.positionAll()},10)})},createStackOverlay=t=>{const e=document.createElement("div");e.classList.add("ui-pnotify-modal-overlay"),t.context!==document.body&&(e.style.height=t.context.scrollHeight+"px",e.style.width=t.context.scrollWidth+"px"),e.addEventListener("click",()=>{t.overlayClose&&PNotify.closeStack(t)}),t.overlay=e},insertStackOverlay=t=>{t.overlay.parentNode!==t.context&&(t.overlay=t.context.insertBefore(t.overlay,t.context.firstChild))},removeStackOverlay=t=>{t.overlay.parentNode&&t.overlay.parentNode.removeChild(t.overlay)};const getDefaultArgs=(t,e)=>("object"!=typeof t&&(t={text:t}),e&&(t.type=e),{target:document.body,data:t});function _styles({styling:t}){return"object"==typeof t?t:PNotify.styling[t]}function _icons({icons:t}){return"object"==typeof t?t:PNotify.icons[t]}function _widthStyle({width:t}){return"string"==typeof t?"width: "+t+";":""}function _minHeightStyle({minHeight:t}){return"string"==typeof t?"min-height: "+t+";":""}function data(){const t=Object.assign({_state:"initializing",_timer:null,_animTimer:null,_animating:!1,_animatingClass:"",_moveClass:"",_timerHide:!1,_moduleClasses:[],_moduleIsNoticeOpen:!1,_modules:{},_modulesPrependContainer:PNotify.modulesPrependContainer,_modulesAppendContainer:PNotify.modulesAppendContainer},PNotify.defaults);return t.modules=Object.assign({},PNotify.defaults.modules),t}var methods={runModules(t){if("init"===t){for(let t in PNotify.modules)if(PNotify.modules.hasOwnProperty(t)&&"function"==typeof PNotify.modules[t].init){const e=PNotify.modules[t].init(this);this.initModule(e)}}else{const{_modules:e}=this.get();for(let i in e){if(!e.hasOwnProperty(i))continue;const n=Object.assign({_notice:this,_options:this.get()},this.get().modules[i]);e[i].set(n),"function"==typeof e[i][t]&&e[i][t]()}}},initModule(t){const{modules:e}=this.get();e.hasOwnProperty(t.constructor.key)||(e[t.constructor.key]={});const i=Object.assign({_notice:this,_options:this.get()},e[t.constructor.key]);t.initModule(i);const{_modules:n}=this.get();n[t.constructor.key]=t},update(t){const e=this.get().hide,i=this.get().icon;this.set(t),this.runModules("update"),this.get().hide?e||this.queueClose():this.cancelClose(),this.queuePosition();const{icon:n}=this.get();return n!==i&&(!0===n&&"fontawesome5"===this.get().icons||"string"==typeof n&&n.match(/(^| )fa[srlb]($| )/))&&(this.set({icon:!1}),this.set({icon:n})),this},open(){const{_state:t,hide:e}=this.get();if("opening"===t)return;if("open"===t)return void(e&&this.queueClose());this.set({_state:"opening",_animatingClass:"ui-pnotify-initial-hidden"}),this.runModules("beforeOpen");let{stack:i}=this.get();if(!this.refs.elem.parentNode||i&&i.context&&i.context!==this.refs.elem.parentNode)if(i&&i.context)i.context.appendChild(this.refs.elem);else{if(!document.body)throw new Error("No context to open this notice in.");document.body.appendChild(this.refs.elem)}return setTimeout(()=>{i&&(i.animation=!1,PNotify.positionAll(),i.animation=!0),this.animateIn(()=>{this.get().hide&&this.queueClose(),this.set({_state:"open"}),this.runModules("afterOpen")})},0),this},remove(t){return this.close(t)},close(t){const{_state:e}=this.get();if("closing"===e||"closed"===e)return;this.set({_state:"closing",_timerHide:!!t}),this.runModules("beforeClose");const{_timer:i}=this.get();return i&&clearTimeout&&(clearTimeout(i),this.set({_timer:null})),this.animateOut(()=>{if(this.set({_state:"closed"}),this.runModules("afterClose"),this.queuePosition(),this.get().remove&&this.refs.elem.parentNode.removeChild(this.refs.elem),this.runModules("beforeDestroy"),this.get().destroy&&null!==PNotify.notices){const t=PNotify.notices.indexOf(this);-1!==t&&PNotify.notices.splice(t,1)}this.runModules("afterDestroy")}),this},animateIn(t){this.set({_animating:"in"});const e=()=>{this.refs.elem.removeEventListener("transitionend",e);const{_animTimer:i,_animating:n,_moduleIsNoticeOpen:o}=this.get();if(i&&clearTimeout(i),"in"!==n)return;let s=o;if(!s){const t=this.refs.elem.getBoundingClientRect();for(let e in t)if(t[e]>0){s=!0;break}}s?(t&&t.call(),this.set({_animating:!1})):this.set({_animTimer:setTimeout(e,40)})};"fade"===this.get().animation?(this.refs.elem.addEventListener("transitionend",e),this.set({_animatingClass:"ui-pnotify-in"}),this.refs.elem.style.opacity,this.set({_animatingClass:"ui-pnotify-in ui-pnotify-fade-in"}),this.set({_animTimer:setTimeout(e,650)})):(this.set({_animatingClass:"ui-pnotify-in"}),e())},animateOut(t){this.set({_animating:"out"});const e=()=>{this.refs.elem.removeEventListener("transitionend",e);const{_animTimer:i,_animating:n,_moduleIsNoticeOpen:o}=this.get();if(i&&clearTimeout(i),"out"!==n)return;let s=o;if(!s){const t=this.refs.elem.getBoundingClientRect();for(let e in t)if(t[e]>0){s=!0;break}}if(this.refs.elem.style.opacity&&"0"!==this.refs.elem.style.opacity&&s)this.set({_animTimer:setTimeout(e,40)});else{this.set({_animatingClass:""});const{stack:e}=this.get();if(e&&e.overlay){let t=!1;for(let i=0;i<PNotify.notices.length;i++){const n=PNotify.notices[i];if(n!==this&&n.get().stack===e&&"closed"!==n.get()._state){t=!0;break}}t||removeStackOverlay(e)}t&&t.call(),this.set({_animating:!1})}};"fade"===this.get().animation?(this.refs.elem.addEventListener("transitionend",e),this.set({_animatingClass:"ui-pnotify-in"}),this.set({_animTimer:setTimeout(e,650)})):(this.set({_animatingClass:""}),e())},position(){let{stack:t}=this.get(),e=this.refs.elem;if(!t)return;if(t.context||(t.context=document.body),"number"!=typeof t.nextpos1&&(t.nextpos1=t.firstpos1),"number"!=typeof t.nextpos2&&(t.nextpos2=t.firstpos2),"number"!=typeof t.addpos2&&(t.addpos2=0),!e.classList.contains("ui-pnotify-in")&&!e.classList.contains("ui-pnotify-initial-hidden"))return this;t.modal&&(t.overlay||createStackOverlay(t),insertStackOverlay(t)),e.getBoundingClientRect(),t.animation&&this.set({_moveClass:"ui-pnotify-move"});let i,n=t.context===document.body?window.innerHeight:t.context.scrollHeight,o=t.context===document.body?window.innerWidth:t.context.scrollWidth;if(t.dir1){let s;switch(i={down:"top",up:"bottom",left:"right",right:"left"}[t.dir1],t.dir1){case"down":s=e.offsetTop;break;case"up":s=n-e.scrollHeight-e.offsetTop;break;case"left":s=o-e.scrollWidth-e.offsetLeft;break;case"right":s=e.offsetLeft}void 0===t.firstpos1&&(t.firstpos1=s,t.nextpos1=t.firstpos1)}if(t.dir1&&t.dir2){let i,s={down:"top",up:"bottom",left:"right",right:"left"}[t.dir2];switch(t.dir2){case"down":i=e.offsetTop;break;case"up":i=n-e.scrollHeight-e.offsetTop;break;case"left":i=o-e.scrollWidth-e.offsetLeft;break;case"right":i=e.offsetLeft}void 0===t.firstpos2&&(t.firstpos2=i,t.nextpos2=t.firstpos2);const r=t.nextpos1+e.offsetHeight+(void 0===t.spacing1?25:t.spacing1),a=t.nextpos1+e.offsetWidth+(void 0===t.spacing1?25:t.spacing1);switch((("down"===t.dir1||"up"===t.dir1)&&r>n||("left"===t.dir1||"right"===t.dir1)&&a>o)&&(t.nextpos1=t.firstpos1,t.nextpos2+=t.addpos2+(void 0===t.spacing2?25:t.spacing2),t.addpos2=0),"number"==typeof t.nextpos2&&(e.style[s]=t.nextpos2+"px",t.animation||e.style[s]),t.dir2){case"down":case"up":e.offsetHeight+(parseFloat(e.style.marginTop,10)||0)+(parseFloat(e.style.marginBottom,10)||0)>t.addpos2&&(t.addpos2=e.offsetHeight);break;case"left":case"right":e.offsetWidth+(parseFloat(e.style.marginLeft,10)||0)+(parseFloat(e.style.marginRight,10)||0)>t.addpos2&&(t.addpos2=e.offsetWidth)}}else if(t.dir1){let i,o;switch(t.dir1){case"down":case"up":o=["left","right"],i=t.context.scrollWidth/2-e.offsetWidth/2;break;case"left":case"right":o=["top","bottom"],i=n/2-e.offsetHeight/2}e.style[o[0]]=i+"px",e.style[o[1]]="auto",t.animation||e.style[o[0]]}if(t.dir1)switch("number"==typeof t.nextpos1&&(e.style[i]=t.nextpos1+"px",t.animation||e.style[i]),t.dir1){case"down":case"up":t.nextpos1+=e.offsetHeight+(void 0===t.spacing1?25:t.spacing1);break;case"left":case"right":t.nextpos1+=e.offsetWidth+(void 0===t.spacing1?25:t.spacing1)}else{let i=o/2-e.offsetWidth/2,s=n/2-e.offsetHeight/2;e.style.left=i+"px",e.style.top=s+"px",t.animation||e.style.left}return this},queuePosition(t){return posTimer&&clearTimeout(posTimer),t||(t=10),posTimer=setTimeout(()=>{PNotify.positionAll()},t),this},cancelRemove(){return this.cancelClose()},cancelClose(){const{_timer:t,_animTimer:e,_state:i,animation:n}=this.get();return t&&clearTimeout(t),e&&clearTimeout(e),"closing"===i&&this.set({_state:"open",_animating:!1,_animatingClass:"fade"===n?"ui-pnotify-in ui-pnotify-fade-in":"ui-pnotify-in"}),this},queueRemove(){return this.queueClose()},queueClose(){return this.cancelClose(),this.set({_timer:setTimeout(()=>this.close(!0),isNaN(this.get().delay)?0:this.get().delay)}),this},addModuleClass(...t){const{_moduleClasses:e}=this.get();for(let i=0;i<t.length;i++){let n=t[i];-1===e.indexOf(n)&&e.push(n)}this.set({_moduleClasses:e})},removeModuleClass(...t){const{_moduleClasses:e}=this.get();for(let i=0;i<t.length;i++){let n=t[i];const o=e.indexOf(n);-1!==o&&e.splice(o,1)}this.set({_moduleClasses:e})},hasModuleClass(...t){const{_moduleClasses:e}=this.get();for(let i=0;i<t.length;i++){let n=t[i];if(-1===e.indexOf(n))return!1}return!0}};function oncreate(){this.on("mouseenter",t=>{if(this.get().mouseReset&&"out"===this.get()._animating){if(!this.get()._timerHide)return;this.cancelClose()}this.get().hide&&this.get().mouseReset&&this.cancelClose()}),this.on("mouseleave",t=>{this.get().hide&&this.get().mouseReset&&"out"!==this.get()._animating&&this.queueClose(),PNotify.positionAll()});let{stack:t}=this.get();t&&"top"===t.push?PNotify.notices.splice(0,0,this):PNotify.notices.push(this),this.runModules("init"),this.set({_state:"closed"}),this.get().autoDisplay&&this.open()}function setup(t){(PNotify=t).VERSION="4.0.0",PNotify.defaultStack={dir1:"down",dir2:"left",firstpos1:25,firstpos2:25,spacing1:36,spacing2:36,push:"bottom",context:window&&document.body},PNotify.defaults={title:!1,titleTrusted:!1,text:!1,textTrusted:!1,styling:"brighttheme",icons:"brighttheme",addClass:"",cornerClass:"",autoDisplay:!0,width:"360px",minHeight:"16px",type:"notice",icon:!0,animation:"fade",animateSpeed:"normal",shadow:!0,hide:!0,delay:8e3,mouseReset:!0,remove:!0,destroy:!0,stack:PNotify.defaultStack,modules:{}},PNotify.notices=[],PNotify.modules={},PNotify.modulesPrependContainer=[],PNotify.modulesAppendContainer=[],PNotify.alert=(t=>new PNotify(getDefaultArgs(t))),PNotify.notice=(t=>new PNotify(getDefaultArgs(t,"notice"))),PNotify.info=(t=>new PNotify(getDefaultArgs(t,"info"))),PNotify.success=(t=>new PNotify(getDefaultArgs(t,"success"))),PNotify.error=(t=>new PNotify(getDefaultArgs(t,"error"))),PNotify.removeAll=(()=>{PNotify.closeAll()}),PNotify.closeAll=(()=>{for(let t=0;t<PNotify.notices.length;t++)PNotify.notices[t].close&&PNotify.notices[t].close(!1)}),PNotify.removeStack=(t=>{PNotify.closeStack(t)}),PNotify.closeStack=(t=>{if(!1!==t)for(let e=0;e<PNotify.notices.length;e++)PNotify.notices[e].close&&PNotify.notices[e].get().stack===t&&PNotify.notices[e].close(!1)}),PNotify.positionAll=(()=>{if(posTimer&&clearTimeout(posTimer),posTimer=null,PNotify.notices.length>0){for(let t=0;t<PNotify.notices.length;t++){let e=PNotify.notices[t],{stack:i}=e.get();i&&(i.overlay&&removeStackOverlay(i),i.nextpos1=i.firstpos1,i.nextpos2=i.firstpos2,i.addpos2=0)}for(let t=0;t<PNotify.notices.length;t++)PNotify.notices[t].position()}else delete PNotify.defaultStack.nextpos1,delete PNotify.defaultStack.nextpos2}),PNotify.styling={brighttheme:{container:"brighttheme",notice:"brighttheme-notice",info:"brighttheme-info",success:"brighttheme-success",error:"brighttheme-error"},bootstrap3:{container:"alert",notice:"alert-warning",info:"alert-info",success:"alert-success",error:"alert-danger",icon:"ui-pnotify-icon-bs3"},bootstrap4:{container:"alert",notice:"alert-warning",info:"alert-info",success:"alert-success",error:"alert-danger",icon:"ui-pnotify-icon-bs4",title:"ui-pnotify-title-bs4"}},PNotify.icons={brighttheme:{notice:"brighttheme-icon-notice",info:"brighttheme-icon-info",success:"brighttheme-icon-success",error:"brighttheme-icon-error"},bootstrap3:{notice:"glyphicon glyphicon-exclamation-sign",info:"glyphicon glyphicon-info-sign",success:"glyphicon glyphicon-ok-sign",error:"glyphicon glyphicon-warning-sign"},fontawesome4:{notice:"fa fa-exclamation-circle",info:"fa fa-info-circle",success:"fa fa-check-circle",error:"fa fa-exclamation-triangle"},fontawesome5:{notice:"fas fa-exclamation-circle",info:"fas fa-info-circle",success:"fas fa-check-circle",error:"fas fa-exclamation-triangle"}},window&&document.body?onDocumentLoaded():document.addEventListener("DOMContentLoaded",onDocumentLoaded)}function add_css(){var t=createElement("style");t.id="svelte-1eldsjg-style",t.textContent='body > .ui-pnotify{position:fixed;z-index:100040}body > .ui-pnotify.ui-pnotify-modal{z-index:100042}.ui-pnotify{position:absolute;height:auto;z-index:1;display:none}.ui-pnotify.ui-pnotify-modal{z-index:3}.ui-pnotify.ui-pnotify-in{display:block}.ui-pnotify.ui-pnotify-initial-hidden{display:block;visibility:hidden}.ui-pnotify.ui-pnotify-move{transition:left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-slow{transition:opacity .4s linear;opacity:0}.ui-pnotify.ui-pnotify-fade-slow.ui-pnotify.ui-pnotify-move{transition:opacity .4s linear, left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-normal{transition:opacity .25s linear;opacity:0}.ui-pnotify.ui-pnotify-fade-normal.ui-pnotify.ui-pnotify-move{transition:opacity .25s linear, left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-fast{transition:opacity .1s linear;opacity:0}.ui-pnotify.ui-pnotify-fade-fast.ui-pnotify.ui-pnotify-move{transition:opacity .1s linear, left .5s ease, top .5s ease, right .5s ease, bottom .5s ease}.ui-pnotify.ui-pnotify-fade-in{opacity:1}.ui-pnotify .ui-pnotify-shadow{-webkit-box-shadow:0px 6px 28px 0px rgba(0,0,0,0.1);-moz-box-shadow:0px 6px 28px 0px rgba(0,0,0,0.1);box-shadow:0px 6px 28px 0px rgba(0,0,0,0.1)}.ui-pnotify-container{background-position:0 0;padding:.8em;height:100%;margin:0}.ui-pnotify-container:after{content:" ";visibility:hidden;display:block;height:0;clear:both}.ui-pnotify-container.ui-pnotify-sharp{-webkit-border-radius:0;-moz-border-radius:0;border-radius:0}.ui-pnotify-title{display:block;white-space:pre-line;margin-bottom:.4em;margin-top:0}.ui-pnotify.ui-pnotify-with-icon .ui-pnotify-title,.ui-pnotify.ui-pnotify-with-icon .ui-pnotify-text{margin-left:24px}[dir=rtl] .ui-pnotify.ui-pnotify-with-icon .ui-pnotify-title,[dir=rtl] .ui-pnotify.ui-pnotify-with-icon .ui-pnotify-text{margin-right:24px;margin-left:0}.ui-pnotify-title-bs4{font-size:1.2rem}.ui-pnotify-text{display:block;white-space:pre-line}.ui-pnotify-icon,.ui-pnotify-icon span{display:block;float:left}[dir=rtl] .ui-pnotify-icon,[dir=rtl] .ui-pnotify-icon span{float:right}.ui-pnotify-icon-bs3 > span{position:relative;top:2px}.ui-pnotify-icon-bs4 > span{position:relative;top:4px}.ui-pnotify-modal-overlay{background-color:rgba(0, 0, 0, .4);top:0;left:0;position:absolute;height:100%;width:100%;z-index:2}body > .ui-pnotify-modal-overlay{position:fixed;z-index:100041}',append(document.head,t)}function get_each1_context(t,e,i){const n=Object.create(t);return n.module=e[i],n}function get_each0_context(t,e,i){const n=Object.create(t);return n.module=e[i],n}function create_main_fragment(t,e){var i,n,o,s,r,a,c,l,f,d=[],u=blankObject(),h=[],m=blankObject(),p=e._modulesPrependContainer;const y=t=>t.module.key;for(var _=0;_<p.length;_+=1){let i=get_each0_context(e,p,_),n=y(i);d[_]=u[n]=create_each_block_1(t,n,i)}var g=!1!==e.icon&&create_if_block_4(t,e),b=!1!==e.title&&create_if_block_2(t,e),v=!1!==e.text&&create_if_block(t,e),x=e._modulesAppendContainer;const N=t=>t.module.key;for(_=0;_<x.length;_+=1){let i=get_each1_context(e,x,_),n=N(i);h[_]=m[n]=create_each_block(t,n,i)}function k(e){t.fire("mouseover",e)}function C(e){t.fire("mouseout",e)}function w(e){t.fire("mouseenter",e)}function P(e){t.fire("mouseleave",e)}function T(e){t.fire("mousemove",e)}function L(e){t.fire("mousedown",e)}function S(e){t.fire("mouseup",e)}function O(e){t.fire("click",e)}function A(e){t.fire("dblclick",e)}function H(e){t.fire("focus",e)}function E(e){t.fire("blur",e)}function j(e){t.fire("touchstart",e)}function M(e){t.fire("touchmove",e)}function D(e){t.fire("touchend",e)}function B(e){t.fire("touchcancel",e)}return{c(){for(i=createElement("div"),n=createElement("div"),_=0;_<d.length;_+=1)d[_].c();for(o=createText("\n    "),g&&g.c(),s=createText("\n    "),b&&b.c(),r=createText("\n    "),v&&v.c(),a=createText("\n    "),_=0;_<h.length;_+=1)h[_].c();n.className=c="\n        ui-pnotify-container\n        "+(e._styles.container?e._styles.container:"")+"\n        "+(e._styles[e.type]?e._styles[e.type]:"")+"\n        "+e.cornerClass+"\n        "+(e.shadow?"ui-pnotify-shadow":"")+"\n      ",n.style.cssText=l=e._widthStyle+" "+e._minHeightStyle,setAttribute(n,"role","alert"),addListener(i,"mouseover",k),addListener(i,"mouseout",C),addListener(i,"mouseenter",w),addListener(i,"mouseleave",P),addListener(i,"mousemove",T),addListener(i,"mousedown",L),addListener(i,"mouseup",S),addListener(i,"click",O),addListener(i,"dblclick",A),addListener(i,"focus",H),addListener(i,"blur",E),addListener(i,"touchstart",j),addListener(i,"touchmove",M),addListener(i,"touchend",D),addListener(i,"touchcancel",B),i.className=f="\n      ui-pnotify\n      "+(!1!==e.icon?"ui-pnotify-with-icon":"")+"\n      "+(e._styles.element?e._styles.element:"")+"\n      "+e.addClass+"\n      "+e._animatingClass+"\n      "+e._moveClass+"\n      "+("fade"===e.animation?"ui-pnotify-fade-"+e.animateSpeed:"")+"\n      "+(e.stack&&e.stack.modal?"ui-pnotify-modal":"")+"\n      "+e._moduleClasses.join(" ")+"\n    ",setAttribute(i,"aria-live","assertive"),setAttribute(i,"role","alertdialog"),setAttribute(i,"ui-pnotify",!0)},m(e,c){for(insert(e,i,c),append(i,n),_=0;_<d.length;_+=1)d[_].m(n,null);for(append(n,o),g&&g.m(n,null),append(n,s),b&&b.m(n,null),append(n,r),v&&v.m(n,null),append(n,a),_=0;_<h.length;_+=1)h[_].m(n,null);t.refs.container=n,t.refs.elem=i},p(e,p){const _=p._modulesPrependContainer;d=updateKeyedEach(d,t,e,y,1,p,_,u,n,destroyBlock,create_each_block_1,"m",o,get_each0_context),!1!==p.icon?g?g.p(e,p):((g=create_if_block_4(t,p)).c(),g.m(n,s)):g&&(g.d(1),g=null),!1!==p.title?b?b.p(e,p):((b=create_if_block_2(t,p)).c(),b.m(n,r)):b&&(b.d(1),b=null),!1!==p.text?v?v.p(e,p):((v=create_if_block(t,p)).c(),v.m(n,a)):v&&(v.d(1),v=null);const x=p._modulesAppendContainer;h=updateKeyedEach(h,t,e,N,1,p,x,m,n,destroyBlock,create_each_block,"m",null,get_each1_context),(e._styles||e.type||e.cornerClass||e.shadow)&&c!==(c="\n        ui-pnotify-container\n        "+(p._styles.container?p._styles.container:"")+"\n        "+(p._styles[p.type]?p._styles[p.type]:"")+"\n        "+p.cornerClass+"\n        "+(p.shadow?"ui-pnotify-shadow":"")+"\n      ")&&(n.className=c),(e._widthStyle||e._minHeightStyle)&&l!==(l=p._widthStyle+" "+p._minHeightStyle)&&(n.style.cssText=l),(e.icon||e._styles||e.addClass||e._animatingClass||e._moveClass||e.animation||e.animateSpeed||e.stack||e._moduleClasses)&&f!==(f="\n      ui-pnotify\n      "+(!1!==p.icon?"ui-pnotify-with-icon":"")+"\n      "+(p._styles.element?p._styles.element:"")+"\n      "+p.addClass+"\n      "+p._animatingClass+"\n      "+p._moveClass+"\n      "+("fade"===p.animation?"ui-pnotify-fade-"+p.animateSpeed:"")+"\n      "+(p.stack&&p.stack.modal?"ui-pnotify-modal":"")+"\n      "+p._moduleClasses.join(" ")+"\n    ")&&(i.className=f)},d(e){for(e&&detachNode(i),_=0;_<d.length;_+=1)d[_].d();for(g&&g.d(),b&&b.d(),v&&v.d(),_=0;_<h.length;_+=1)h[_].d();t.refs.container===n&&(t.refs.container=null),removeListener(i,"mouseover",k),removeListener(i,"mouseout",C),removeListener(i,"mouseenter",w),removeListener(i,"mouseleave",P),removeListener(i,"mousemove",T),removeListener(i,"mousedown",L),removeListener(i,"mouseup",S),removeListener(i,"click",O),removeListener(i,"dblclick",A),removeListener(i,"focus",H),removeListener(i,"blur",E),removeListener(i,"touchstart",j),removeListener(i,"touchmove",M),removeListener(i,"touchend",D),removeListener(i,"touchcancel",B),t.refs.elem===i&&(t.refs.elem=null)}}}function create_each_block_1(t,e,i){var n,o,s=i.module;function r(e){return{root:t.root,store:t.store}}if(s)var a=new s(r());function c(e){t.initModule(e.module)}return a&&a.on("init",c),{key:e,first:null,c(){n=createComment(),a&&a._fragment.c(),o=createComment(),this.first=n},m(t,e){insert(t,n,e),a&&a._mount(t,e),insert(t,o,e)},p(t,e){s!==(s=e.module)&&(a&&a.destroy(),s?((a=new s(r()))._fragment.c(),a._mount(o.parentNode,o),a.on("init",c)):a=null)},d(t){t&&(detachNode(n),detachNode(o)),a&&a.destroy(t)}}}function create_if_block_4(t,e){var i,n,o,s;return{c(){i=createElement("div"),(n=createElement("span")).className=o=!0===e.icon?e._icons[e.type]?e._icons[e.type]:"":e.icon,i.className=s="ui-pnotify-icon "+(e._styles.icon?e._styles.icon:"")},m(e,o){insert(e,i,o),append(i,n),t.refs.iconContainer=i},p(t,e){(t.icon||t._icons||t.type)&&o!==(o=!0===e.icon?e._icons[e.type]?e._icons[e.type]:"":e.icon)&&(n.className=o),t._styles&&s!==(s="ui-pnotify-icon "+(e._styles.icon?e._styles.icon:""))&&(i.className=s)},d(e){e&&detachNode(i),t.refs.iconContainer===i&&(t.refs.iconContainer=null)}}}function create_if_block_2(t,e){var i,n;function o(t){return t.titleTrusted?create_if_block_3:create_else_block_1}var s=o(e),r=s(t,e);return{c(){i=createElement("h4"),r.c(),i.className=n="ui-pnotify-title "+(e._styles.title?e._styles.title:"")},m(e,n){insert(e,i,n),r.m(i,null),t.refs.titleContainer=i},p(e,a){s===(s=o(a))&&r?r.p(e,a):(r.d(1),(r=s(t,a)).c(),r.m(i,null)),e._styles&&n!==(n="ui-pnotify-title "+(a._styles.title?a._styles.title:""))&&(i.className=n)},d(e){e&&detachNode(i),r.d(),t.refs.titleContainer===i&&(t.refs.titleContainer=null)}}}function create_else_block_1(t,e){var i;return{c(){i=createText(e.title)},m(t,e){insert(t,i,e)},p(t,e){t.title&&setData(i,e.title)},d(t){t&&detachNode(i)}}}function create_if_block_3(t,e){var i,n;return{c(){i=createElement("noscript"),n=createElement("noscript")},m(t,o){insert(t,i,o),i.insertAdjacentHTML("afterend",e.title),insert(t,n,o)},p(t,e){t.title&&(detachBetween(i,n),i.insertAdjacentHTML("afterend",e.title))},d(t){t&&(detachBetween(i,n),detachNode(i),detachNode(n))}}}function create_if_block(t,e){var i,n;function o(t){return t.textTrusted?create_if_block_1:create_else_block}var s=o(e),r=s(t,e);return{c(){i=createElement("div"),r.c(),i.className=n="ui-pnotify-text "+(e._styles.text?e._styles.text:""),setAttribute(i,"role","alert")},m(e,n){insert(e,i,n),r.m(i,null),t.refs.textContainer=i},p(e,a){s===(s=o(a))&&r?r.p(e,a):(r.d(1),(r=s(t,a)).c(),r.m(i,null)),e._styles&&n!==(n="ui-pnotify-text "+(a._styles.text?a._styles.text:""))&&(i.className=n)},d(e){e&&detachNode(i),r.d(),t.refs.textContainer===i&&(t.refs.textContainer=null)}}}function create_else_block(t,e){var i;return{c(){i=createText(e.text)},m(t,e){insert(t,i,e)},p(t,e){t.text&&setData(i,e.text)},d(t){t&&detachNode(i)}}}function create_if_block_1(t,e){var i,n;return{c(){i=createElement("noscript"),n=createElement("noscript")},m(t,o){insert(t,i,o),i.insertAdjacentHTML("afterend",e.text),insert(t,n,o)},p(t,e){t.text&&(detachBetween(i,n),i.insertAdjacentHTML("afterend",e.text))},d(t){t&&(detachBetween(i,n),detachNode(i),detachNode(n))}}}function create_each_block(t,e,i){var n,o,s=i.module;function r(e){return{root:t.root,store:t.store}}if(s)var a=new s(r());function c(e){t.initModule(e.module)}return a&&a.on("init",c),{key:e,first:null,c(){n=createComment(),a&&a._fragment.c(),o=createComment(),this.first=n},m(t,e){insert(t,n,e),a&&a._mount(t,e),insert(t,o,e)},p(t,e){s!==(s=e.module)&&(a&&a.destroy(),s?((a=new s(r()))._fragment.c(),a._mount(o.parentNode,o),a.on("init",c)):a=null)},d(t){t&&(detachNode(n),detachNode(o)),a&&a.destroy(t)}}}function PNotify_1(t){init(this,t),this.refs={},this._state=assign(data(),t.data),this._recompute({styling:1,icons:1,width:1,minHeight:1},this._state),this._intro=!0,document.getElementById("svelte-1eldsjg-style")||add_css(),this._fragment=create_main_fragment(this,this._state),this.root._oncreate.push(()=>{oncreate.call(this),this.fire("update",{changed:assignTrue({},this._state),current:this._state})}),t.target&&(this._fragment.c(),this._mount(t.target,t.anchor),flush(this))}function createElement(t){return document.createElement(t)}function append(t,e){t.appendChild(e)}function blankObject(){return Object.create(null)}function createText(t){return document.createTextNode(t)}function setAttribute(t,e,i){null==i?t.removeAttribute(e):t.setAttribute(e,i)}function addListener(t,e,i,n){t.addEventListener(e,i,n)}function insert(t,e,i){t.insertBefore(e,i)}function updateKeyedEach(t,e,i,n,o,s,r,a,c,l,f,d,u,h){for(var m=t.length,p=r.length,y=m,_={};y--;)_[t[y].key]=y;var g=[],b={},v={};for(y=p;y--;){var x=h(s,r,y),N=n(x),k=a[N];k?o&&k.p(i,x):(k=f(e,N,x)).c(),g[y]=b[N]=k,N in _&&(v[N]=Math.abs(y-_[N]))}var C={},w={};function P(t){t[d](c,u),a[t.key]=t,u=t.first,p--}for(;m&&p;){var T=g[p-1],L=t[m-1],S=T.key,O=L.key;T===L?(u=T.first,m--,p--):b[O]?!a[S]||C[S]?P(T):w[O]?m--:v[S]>v[O]?(w[S]=!0,P(T)):(C[O]=!0,m--):(l(L,a),m--)}for(;m--;){b[(L=t[m]).key]||l(L,a)}for(;p;)P(g[p-1]);return g}function destroyBlock(t,e){t.d(1),e[t.key]=null}function detachNode(t){t.parentNode.removeChild(t)}function removeListener(t,e,i,n){t.removeEventListener(e,i,n)}function createComment(){return document.createComment("")}function setData(t,e){t.data=""+e}function detachBetween(t,e){for(;t.nextSibling&&t.nextSibling!==e;)t.parentNode.removeChild(t.nextSibling)}function init(t,e){t._handlers=blankObject(),t._slots=blankObject(),t._bind=e._bind,t._staged={},t.options=e,t.root=e.root||t,t.store=e.store||t.root.store,e.root||(t._beforecreate=[],t._oncreate=[],t._aftercreate=[])}function assign(t,e){for(var i in e)t[i]=e[i];return t}function assignTrue(t,e){for(var i in e)t[i]=1;return t}function flush(t){t._lock=!0,callAll(t._beforecreate),callAll(t._oncreate),callAll(t._aftercreate),t._lock=!1}function destroy(t){this.destroy=noop,this.fire("destroy"),this.set=noop,this._fragment.d(!1!==t),this._fragment=null,this._state={}}function get(){return this._state}function fire(t,e){var i=t in this._handlers&&this._handlers[t].slice();if(i)for(var n=0;n<i.length;n+=1){var o=i[n];if(!o.__calling)try{o.__calling=!0,o.call(this,e)}finally{o.__calling=!1}}}function on(t,e){var i=this._handlers[t]||(this._handlers[t]=[]);return i.push(e),{cancel:function(){var t=i.indexOf(e);~t&&i.splice(t,1)}}}function set(t){this._set(assign({},t)),this.root._lock||flush(this.root)}function _set(t){var e=this._state,i={},n=!1;for(var o in t=assign(this._staged,t),this._staged={},t)this._differs(t[o],e[o])&&(i[o]=n=!0);n&&(this._state=assign(assign({},e),t),this._recompute(i,this._state),this._bind&&this._bind(i,this._state),this._fragment&&(this.fire("state",{changed:i,current:this._state,previous:e}),this._fragment.p(i,this._state),this.fire("update",{changed:i,current:this._state,previous:e})))}function _stage(t){assign(this._staged,t)}function _mount(t,e){this._fragment[this._fragment.i?"i":"m"](t,e||null)}function _differs(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function callAll(t){for(;t&&t.length;)t.shift()()}function noop(){}assign(PNotify_1.prototype,{destroy:destroy,get:get,fire:fire,on:on,set:set,_set:_set,_stage:_stage,_mount:_mount,_differs:_differs}),assign(PNotify_1.prototype,methods),PNotify_1.prototype._recompute=function(t,e){t.styling&&this._differs(e._styles,e._styles=_styles(e))&&(t._styles=!0),t.icons&&this._differs(e._icons,e._icons=_icons(e))&&(t._icons=!0),t.width&&this._differs(e._widthStyle,e._widthStyle=_widthStyle(e))&&(t._widthStyle=!0),t.minHeight&&this._differs(e._minHeightStyle,e._minHeightStyle=_minHeightStyle(e))&&(t._minHeightStyle=!0)},setup(PNotify_1);/* harmony default export */ __webpack_exports__["default"] = (PNotify_1);
//# sourceMappingURL=PNotify.js.map

/***/ }),

/***/ "./node_modules/pnotify/dist/es/PNotifyButtons.js":
/*!********************************************************!*\
  !*** ./node_modules/pnotify/dist/es/PNotifyButtons.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PNotify_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PNotify.js */ "./node_modules/pnotify/dist/es/PNotify.js");
function _showSticker({sticker:e,_notice:t}){return e&&!(t&&t.refs.elem.classList.contains("nonblock"))}function _showCloser({closer:e,_notice:t}){return e&&!(t&&t.refs.elem.classList.contains("nonblock"))}function _pinUpClass({classes:e,_notice:t}){return t?null===e.pinUp?t.get()._icons.pinUp:e.pinUp:""}function _pinDownClass({classes:e,_notice:t}){return t?null===e.pinDown?t.get()._icons.pinDown:e.pinDown:""}function _closerClass({classes:e,_notice:t}){return t?null===e.closer?t.get()._icons.closer:e.closer:""}function data(){return Object.assign({_notice:null,_options:{},_mouseIsIn:!1},_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].modules.Buttons.defaults)}var methods={initModule(e){this.set(e);const{_notice:t}=this.get();t.on("mouseenter",()=>this.set({_mouseIsIn:!0})),t.on("mouseleave",()=>this.set({_mouseIsIn:!1})),t.on("state",({changed:e,current:t})=>{if(!e.hide)return;const{sticker:s}=this.get();if(!s)return;const i=t.hide?this.get().classes.pinUp:this.get().classes.pinDown;("fontawesome5"===this.get()._notice.get().icons||"string"==typeof i&&i.match(/(^| )fa[srlb]($| )/))&&(this.set({sticker:!1}),this.set({sticker:!0}))})},handleStickerClick(){const{_notice:e}=this.get();e.update({hide:!e.get().hide})},handleCloserClick(){this.get()._notice.close(!1),this.set({_mouseIsIn:!1})}};function oncreate(){this.fire("init",{module:this})}function setup(e){e.key="Buttons",e.defaults={closer:!0,closerHover:!0,sticker:!0,stickerHover:!0,labels:{close:"Close",stick:"Stick",unstick:"Unstick"},classes:{closer:null,pinUp:null,pinDown:null}},_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].modules.Buttons=e,_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].modulesPrependContainer.push(e),Object.assign(_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].icons.brighttheme,{closer:"brighttheme-icon-closer",pinUp:"brighttheme-icon-sticker",pinDown:"brighttheme-icon-sticker brighttheme-icon-stuck"}),Object.assign(_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].icons.bootstrap3,{closer:"glyphicon glyphicon-remove",pinUp:"glyphicon glyphicon-pause",pinDown:"glyphicon glyphicon-play"}),Object.assign(_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].icons.fontawesome4,{closer:"fa fa-times",pinUp:"fa fa-pause",pinDown:"fa fa-play"}),Object.assign(_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].icons.fontawesome5,{closer:"fas fa-times",pinUp:"fas fa-pause",pinDown:"fas fa-play"})}function add_css(){var e=createElement("style");e.id="svelte-1yjle82-style",e.textContent=".ui-pnotify-closer.svelte-1yjle82,.ui-pnotify-sticker.svelte-1yjle82{float:right;margin-left:.5em;cursor:pointer}[dir=rtl] .ui-pnotify-closer.svelte-1yjle82,[dir=rtl] .ui-pnotify-sticker.svelte-1yjle82{float:left;margin-right:.5em;margin-left:0}.ui-pnotify-buttons-hidden.svelte-1yjle82{visibility:hidden}",append(document.head,e)}function create_main_fragment(e,t){var s,i,n=t._showCloser&&create_if_block_1(e,t),o=t._showSticker&&create_if_block(e,t);return{c(){n&&n.c(),s=createText("\n"),o&&o.c(),i=createComment()},m(e,t){n&&n.m(e,t),insert(e,s,t),o&&o.m(e,t),insert(e,i,t)},p(t,r){r._showCloser?n?n.p(t,r):((n=create_if_block_1(e,r)).c(),n.m(s.parentNode,s)):n&&(n.d(1),n=null),r._showSticker?o?o.p(t,r):((o=create_if_block(e,r)).c(),o.m(i.parentNode,i)):o&&(o.d(1),o=null)},d(e){n&&n.d(e),e&&detachNode(s),o&&o.d(e),e&&detachNode(i)}}}function create_if_block_1(e,t){var s,i,n,o;function r(t){e.handleCloserClick()}return{c(){s=createElement("div"),(i=createElement("span")).className=t._closerClass+" svelte-1yjle82",addListener(s,"click",r),s.className=n="ui-pnotify-closer "+(!t.closerHover||t._mouseIsIn?"":"ui-pnotify-buttons-hidden")+" svelte-1yjle82",setAttribute(s,"role","button"),s.tabIndex="0",s.title=o=t.labels.close},m(e,t){insert(e,s,t),append(s,i)},p(e,t){e._closerClass&&(i.className=t._closerClass+" svelte-1yjle82"),(e.closerHover||e._mouseIsIn)&&n!==(n="ui-pnotify-closer "+(!t.closerHover||t._mouseIsIn?"":"ui-pnotify-buttons-hidden")+" svelte-1yjle82")&&(s.className=n),e.labels&&o!==(o=t.labels.close)&&(s.title=o)},d(e){e&&detachNode(s),removeListener(s,"click",r)}}}function create_if_block(e,t){var s,i,n,o,r,c;function l(t){e.handleStickerClick()}return{c(){s=createElement("div"),(i=createElement("span")).className=n=(t._options.hide?t._pinUpClass:t._pinDownClass)+" svelte-1yjle82",addListener(s,"click",l),s.className=o="ui-pnotify-sticker "+(!t.stickerHover||t._mouseIsIn?"":"ui-pnotify-buttons-hidden")+" svelte-1yjle82",setAttribute(s,"role","button"),setAttribute(s,"aria-pressed",r=t._options.hide),s.tabIndex="0",s.title=c=t._options.hide?t.labels.stick:t.labels.unstick},m(e,t){insert(e,s,t),append(s,i)},p(e,t){(e._options||e._pinUpClass||e._pinDownClass)&&n!==(n=(t._options.hide?t._pinUpClass:t._pinDownClass)+" svelte-1yjle82")&&(i.className=n),(e.stickerHover||e._mouseIsIn)&&o!==(o="ui-pnotify-sticker "+(!t.stickerHover||t._mouseIsIn?"":"ui-pnotify-buttons-hidden")+" svelte-1yjle82")&&(s.className=o),e._options&&r!==(r=t._options.hide)&&setAttribute(s,"aria-pressed",r),(e._options||e.labels)&&c!==(c=t._options.hide?t.labels.stick:t.labels.unstick)&&(s.title=c)},d(e){e&&detachNode(s),removeListener(s,"click",l)}}}function PNotifyButtons(e){init(this,e),this._state=assign(data(),e.data),this._recompute({sticker:1,_notice:1,closer:1,classes:1},this._state),this._intro=!0,document.getElementById("svelte-1yjle82-style")||add_css(),this._fragment=create_main_fragment(this,this._state),this.root._oncreate.push(()=>{oncreate.call(this),this.fire("update",{changed:assignTrue({},this._state),current:this._state})}),e.target&&(this._fragment.c(),this._mount(e.target,e.anchor),flush(this))}function createElement(e){return document.createElement(e)}function append(e,t){e.appendChild(t)}function createText(e){return document.createTextNode(e)}function createComment(){return document.createComment("")}function insert(e,t,s){e.insertBefore(t,s)}function detachNode(e){e.parentNode.removeChild(e)}function addListener(e,t,s,i){e.addEventListener(t,s,i)}function setAttribute(e,t,s){null==s?e.removeAttribute(t):e.setAttribute(t,s)}function removeListener(e,t,s,i){e.removeEventListener(t,s,i)}function init(e,t){e._handlers=blankObject(),e._slots=blankObject(),e._bind=t._bind,e._staged={},e.options=t,e.root=t.root||e,e.store=t.store||e.root.store,t.root||(e._beforecreate=[],e._oncreate=[],e._aftercreate=[])}function assign(e,t){for(var s in t)e[s]=t[s];return e}function assignTrue(e,t){for(var s in t)e[s]=1;return e}function flush(e){e._lock=!0,callAll(e._beforecreate),callAll(e._oncreate),callAll(e._aftercreate),e._lock=!1}function destroy(e){this.destroy=noop,this.fire("destroy"),this.set=noop,this._fragment.d(!1!==e),this._fragment=null,this._state={}}function get(){return this._state}function fire(e,t){var s=e in this._handlers&&this._handlers[e].slice();if(s)for(var i=0;i<s.length;i+=1){var n=s[i];if(!n.__calling)try{n.__calling=!0,n.call(this,t)}finally{n.__calling=!1}}}function on(e,t){var s=this._handlers[e]||(this._handlers[e]=[]);return s.push(t),{cancel:function(){var e=s.indexOf(t);~e&&s.splice(e,1)}}}function set(e){this._set(assign({},e)),this.root._lock||flush(this.root)}function _set(e){var t=this._state,s={},i=!1;for(var n in e=assign(this._staged,e),this._staged={},e)this._differs(e[n],t[n])&&(s[n]=i=!0);i&&(this._state=assign(assign({},t),e),this._recompute(s,this._state),this._bind&&this._bind(s,this._state),this._fragment&&(this.fire("state",{changed:s,current:this._state,previous:t}),this._fragment.p(s,this._state),this.fire("update",{changed:s,current:this._state,previous:t})))}function _stage(e){assign(this._staged,e)}function _mount(e,t){this._fragment[this._fragment.i?"i":"m"](e,t||null)}function _differs(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function blankObject(){return Object.create(null)}function callAll(e){for(;e&&e.length;)e.shift()()}function noop(){}assign(PNotifyButtons.prototype,{destroy:destroy,get:get,fire:fire,on:on,set:set,_set:_set,_stage:_stage,_mount:_mount,_differs:_differs}),assign(PNotifyButtons.prototype,methods),PNotifyButtons.prototype._recompute=function(e,t){(e.sticker||e._notice)&&this._differs(t._showSticker,t._showSticker=_showSticker(t))&&(e._showSticker=!0),(e.closer||e._notice)&&this._differs(t._showCloser,t._showCloser=_showCloser(t))&&(e._showCloser=!0),(e.classes||e._notice)&&(this._differs(t._pinUpClass,t._pinUpClass=_pinUpClass(t))&&(e._pinUpClass=!0),this._differs(t._pinDownClass,t._pinDownClass=_pinDownClass(t))&&(e._pinDownClass=!0),this._differs(t._closerClass,t._closerClass=_closerClass(t))&&(e._closerClass=!0))},setup(PNotifyButtons);/* harmony default export */ __webpack_exports__["default"] = (PNotifyButtons);
//# sourceMappingURL=PNotifyButtons.js.map

/***/ }),

/***/ "./node_modules/pnotify/dist/es/PNotifyStyleMaterial.js":
/*!**************************************************************!*\
  !*** ./node_modules/pnotify/dist/es/PNotifyStyleMaterial.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PNotify_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PNotify.js */ "./node_modules/pnotify/dist/es/PNotify.js");
function setup(t){t.key="StyleMaterial",_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].modules.StyleMaterial=t,_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].modulesPrependContainer.push(t),_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].styling.material||(_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].styling.material={}),_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].styling.material=Object.assign(_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].styling.material,{container:"pnotify-material",notice:"pnotify-material-notice",info:"pnotify-material-info",success:"pnotify-material-success",error:"pnotify-material-error"}),_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].icons.material||(_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].icons.material={}),_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].icons.material=Object.assign(_PNotify_js__WEBPACK_IMPORTED_MODULE_0__["default"].icons.material,{notice:"material-icons pnotify-material-icon-notice",info:"material-icons pnotify-material-icon-info",success:"material-icons pnotify-material-icon-success",error:"material-icons pnotify-material-icon-error",closer:"material-icons pnotify-material-icon-closer",pinUp:"material-icons pnotify-material-icon-sticker",pinDown:"material-icons pnotify-material-icon-sticker pnotify-material-icon-stuck"})}function add_css(){var t=createElement("style");t.id="svelte-19og8nx-style",t.textContent='[ui-pnotify] .pnotify-material{-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;font-size:14px}[ui-pnotify] .pnotify-material.ui-pnotify-shadow{-webkit-box-shadow:0px 6px 24px 0px rgba(0,0,0,0.2);-moz-box-shadow:0px 6px 24px 0px rgba(0,0,0,0.2);box-shadow:0px 6px 24px 0px rgba(0,0,0,0.2)}[ui-pnotify] .pnotify-material.ui-pnotify-container{padding:24px}[ui-pnotify] .pnotify-material .ui-pnotify-title{font-size:20px;margin-bottom:20px;line-height:24px}[ui-pnotify] .pnotify-material .ui-pnotify-title:last-child{margin-bottom:0}[ui-pnotify] .pnotify-material .ui-pnotify-text{font-size:16px;line-height:24px}[ui-pnotify].ui-pnotify-with-icon .pnotify-material .ui-pnotify-title,[ui-pnotify].ui-pnotify-with-icon .pnotify-material .ui-pnotify-text,[ui-pnotify].ui-pnotify-with-icon .pnotify-material .ui-pnotify-confirm{margin-left:32px}[dir=rtl] [ui-pnotify].ui-pnotify-with-icon .pnotify-material .ui-pnotify-title,[dir=rtl] [ui-pnotify].ui-pnotify-with-icon .pnotify-material .ui-pnotify-text,[dir=rtl] [ui-pnotify].ui-pnotify-with-icon .pnotify-material .ui-pnotify-confirm{margin-right:32px;margin-left:0}[ui-pnotify] .pnotify-material .ui-pnotify-action-bar{margin-top:20px;margin-right:-16px;margin-bottom:-16px}[dir=rtl] [ui-pnotify] .pnotify-material .ui-pnotify-action-bar{margin-left:-16px;margin-right:0}[ui-pnotify] .pnotify-material-notice{background-color:#FFEE58;border:none;color:#000}[ui-pnotify] .pnotify-material-info{background-color:#26C6DA;border:none;color:#000}[ui-pnotify] .pnotify-material-success{background-color:#66BB6A;border:none;color:#fff}[ui-pnotify] .pnotify-material-error{background-color:#EF5350;border:none;color:#fff}[ui-pnotify] .pnotify-material-icon-notice,[ui-pnotify] .pnotify-material-icon-info,[ui-pnotify] .pnotify-material-icon-success,[ui-pnotify] .pnotify-material-icon-error,[ui-pnotify] .pnotify-material-icon-closer,[ui-pnotify] .pnotify-material-icon-sticker{position:relative}[ui-pnotify] .pnotify-material-icon-closer,[ui-pnotify] .pnotify-material-icon-sticker{height:20px;width:20px;font-size:20px;line-height:20px;position:relative}[ui-pnotify] .pnotify-material-icon-notice:after,[ui-pnotify] .pnotify-material-icon-info:after,[ui-pnotify] .pnotify-material-icon-success:after,[ui-pnotify] .pnotify-material-icon-error:after,[ui-pnotify] .pnotify-material-icon-closer:after,[ui-pnotify] .pnotify-material-icon-sticker:after{font-family:\'Material Icons\'}[ui-pnotify] .pnotify-material-icon-notice:after{content:"announcement"}[ui-pnotify] .pnotify-material-icon-info:after{content:"info"}[ui-pnotify] .pnotify-material-icon-success:after{content:"check_circle"}[ui-pnotify] .pnotify-material-icon-error:after{content:"error"}[ui-pnotify] .pnotify-material-icon-closer,[ui-pnotify] .pnotify-material-icon-sticker{display:inline-block}[ui-pnotify] .pnotify-material-icon-closer:after{top:-4px;content:"close"}[ui-pnotify] .pnotify-material-icon-sticker:after{top:-5px;content:"pause"}[ui-pnotify] .pnotify-material-icon-sticker.pnotify-material-icon-stuck:after{content:"play_arrow"}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-prompt-input{display:block;width:100%;margin-bottom:8px;padding:15px 0 8px;background-color:transparent;color:inherit;border-radius:0;border-top:none;border-left:none;border-right:none;border-bottom-style:solid;border-bottom-color:inherit;border-bottom-width:1px}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-prompt-input:focus{outline:none;border-bottom-color:#3F51B5;border-bottom-width:2px}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button{position:relative;padding:0 16px;overflow:hidden;border-width:0;outline:none;border-radius:2px;background-color:transparent;color:inherit;transition:background-color .3s;text-transform:uppercase;height:36px;margin:6px;min-width:64px;font-weight:bold}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button.ui-pnotify-material-primary{color:#3F51B5}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button:hover,[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button:focus{background-color:rgba(0, 0, 0, .12);color:inherit}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button.ui-pnotify-material-primary:hover,[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button.ui-pnotify-material-primary:focus{color:#303F9F}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button:before{content:"";position:absolute;top:50%;left:50%;display:block;width:0;padding-top:0;border-radius:100%;background-color:rgba(153, 153, 153, .4);-webkit-transform:translate(-50%, -50%);-moz-transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);-o-transform:translate(-50%, -50%);transform:translate(-50%, -50%)}[ui-pnotify].ui-pnotify .pnotify-material .ui-pnotify-action-button:active:before{width:120%;padding-top:120%;transition:width .2s ease-out, padding-top .2s ease-out}',append(document.head,t)}function create_main_fragment(t,i){return{c:noop,m:noop,p:noop,d:noop}}function PNotifyStyleMaterial(t){init(this,t),this._state=assign({},t.data),this._intro=!0,document.getElementById("svelte-19og8nx-style")||add_css(),this._fragment=create_main_fragment(this,this._state),t.target&&(this._fragment.c(),this._mount(t.target,t.anchor))}function createElement(t){return document.createElement(t)}function append(t,i){t.appendChild(i)}function noop(){}function init(t,i){t._handlers=blankObject(),t._slots=blankObject(),t._bind=i._bind,t._staged={},t.options=i,t.root=i.root||t,t.store=i.store||t.root.store,i.root||(t._beforecreate=[],t._oncreate=[],t._aftercreate=[])}function assign(t,i){for(var o in i)t[o]=i[o];return t}function destroy(t){this.destroy=noop,this.fire("destroy"),this.set=noop,this._fragment.d(!1!==t),this._fragment=null,this._state={}}function get(){return this._state}function fire(t,i){var o=t in this._handlers&&this._handlers[t].slice();if(o)for(var n=0;n<o.length;n+=1){var e=o[n];if(!e.__calling)try{e.__calling=!0,e.call(this,i)}finally{e.__calling=!1}}}function on(t,i){var o=this._handlers[t]||(this._handlers[t]=[]);return o.push(i),{cancel:function(){var t=o.indexOf(i);~t&&o.splice(t,1)}}}function set(t){this._set(assign({},t)),this.root._lock||flush(this.root)}function _set(t){var i=this._state,o={},n=!1;for(var e in t=assign(this._staged,t),this._staged={},t)this._differs(t[e],i[e])&&(o[e]=n=!0);n&&(this._state=assign(assign({},i),t),this._recompute(o,this._state),this._bind&&this._bind(o,this._state),this._fragment&&(this.fire("state",{changed:o,current:this._state,previous:i}),this._fragment.p(o,this._state),this.fire("update",{changed:o,current:this._state,previous:i})))}function _stage(t){assign(this._staged,t)}function _mount(t,i){this._fragment[this._fragment.i?"i":"m"](t,i||null)}function _differs(t,i){return t!=t?i==i:t!==i||t&&"object"==typeof t||"function"==typeof t}function blankObject(){return Object.create(null)}function flush(t){t._lock=!0,callAll(t._beforecreate),callAll(t._oncreate),callAll(t._aftercreate),t._lock=!1}function callAll(t){for(;t&&t.length;)t.shift()()}assign(PNotifyStyleMaterial.prototype,{destroy:destroy,get:get,fire:fire,on:on,set:set,_set:_set,_stage:_stage,_mount:_mount,_differs:_differs}),PNotifyStyleMaterial.prototype._recompute=noop,setup(PNotifyStyleMaterial);/* harmony default export */ __webpack_exports__["default"] = (PNotifyStyleMaterial);
//# sourceMappingURL=PNotifyStyleMaterial.js.map

/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),

/***/ "./node_modules/sharer.js/sharer.js":
/*!******************************************!*\
  !*** ./node_modules/sharer.js/sharer.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @preserve
 * Sharer.js
 *
 * @description Create your own social share buttons
 * @version 0.3.8
 * @author Ellison Leao <ellisonleao@gmail.com>
 * @license GPLv3
 *
 */

(function(window, document) {
    'use strict';
    /**
     * @constructor
     */
    var Sharer = function(elem) {
        this.elem = elem;
    };

    /**
     *  @function init
     *  @description bind the events for multiple sharer elements
     *  @returns {Empty}
     */
    Sharer.init = function() {
        var elems = document.querySelectorAll('[data-sharer]'),
            i,
            l = elems.length;

        for (i = 0; i < l; i++) {
            elems[i].addEventListener('click', Sharer.add);
        }
    };

    /**
     *  @function add
     *  @description bind the share event for a single dom element
     *  @returns {Empty}
     */
    Sharer.add = function(elem) {
        var target = elem.currentTarget || elem.srcElement;
        var sharer = new Sharer(target);
        sharer.share();
    };

    // instance methods
    Sharer.prototype = {
        constructor: Sharer,
        /**
         *  @function getValue
         *  @description Helper to get the attribute of a DOM element
         *  @param {String} attr DOM element attribute
         *  @returns {String|Empty} returns the attr value or empty string
         */
        getValue: function(attr) {
            var val = this.elem.getAttribute('data-' + attr);
            // handing facebook hashtag attribute
            if (val && attr === 'hashtag') {
                if (!val.startsWith('#')) {
                    val = '#' + val;
                }
            }
            return val;
        },

        /**
         * @event share
         * @description Main share event. Will pop a window or redirect to a link
         * based on the data-sharer attribute.
         */
        share: function() {
            var sharer = this.getValue('sharer').toLowerCase(),
                sharers = {
                    facebook: {
                        shareUrl: 'https://www.facebook.com/sharer/sharer.php',
                        params: {
                            u: this.getValue('url'),
                            hashtag: this.getValue('hashtag')
                        }
                    },
                    linkedin: {
                        shareUrl: 'https://www.linkedin.com/shareArticle',
                        params: {
                            url: this.getValue('url'),
                            mini: true
                        }
                    },
                    twitter: {
                        shareUrl: 'https://twitter.com/intent/tweet/',
                        params: {
                            text: this.getValue('title'),
                            url: this.getValue('url'),
                            hashtags: this.getValue('hashtags'),
                            via: this.getValue('via')
                        }
                    },
                    email: {
                        shareUrl: 'mailto:' + this.getValue('to') || false,
                        params: {
                            subject: this.getValue('subject'),
                            body: this.getValue('title') + '\n' + this.getValue('url')
                        },
                        isLink: true
                    },
                    whatsapp: {
                        shareUrl: this.getValue('web') !== null ? 'https://api.whatsapp.com/send' : 'whatsapp://send',
                        params: {
                            text: this.getValue('title') + ' ' + this.getValue('url')
                        },
                        isLink: true
                    },
                    telegram: {
                        shareUrl: 'tg://msg_url',
                        params: {
                            text: this.getValue('title'),
                            url: this.getValue('url'),
                            to: this.getValue('to')
                        },
                        isLink: true
                    },
                    viber: {
                        shareUrl: 'viber://forward',
                        params: {
                            text: this.getValue('title') + ' ' + this.getValue('url')
                        },
                        isLink: true
                    },
                    line: {
                        shareUrl:
                            'http://line.me/R/msg/text/?' +
                            encodeURIComponent(this.getValue('title') + ' ' + this.getValue('url')),
                        isLink: true
                    },
                    pinterest: {
                        shareUrl: 'https://www.pinterest.com/pin/create/button/',
                        params: {
                            url: this.getValue('url'),
                            media: this.getValue('image'),
                            description: this.getValue('description')
                        }
                    },
                    tumblr: {
                        shareUrl: 'http://tumblr.com/widgets/share/tool',
                        params: {
                            canonicalUrl: this.getValue('url'),
                            content: this.getValue('url'),
                            posttype: 'link',
                            title: this.getValue('title'),
                            caption: this.getValue('caption'),
                            tags: this.getValue('tags')
                        }
                    },
                    hackernews: {
                        shareUrl: 'https://news.ycombinator.com/submitlink',
                        params: {
                            u: this.getValue('url'),
                            t: this.getValue('title')
                        }
                    },
                    reddit: {
                        shareUrl: 'https://www.reddit.com/submit',
                        params: { url: this.getValue('url') }
                    },
                    vk: {
                        shareUrl: 'http://vk.com/share.php',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            description: this.getValue('caption'),
                            image: this.getValue('image')
                        }
                    },
                    xing: {
                        shareUrl: 'https://www.xing.com/app/user',
                        params: {
                            op: 'share',
                            url: this.getValue('url'),
                            title: this.getValue('title')
                        }
                    },
                    buffer: {
                        shareUrl: 'https://buffer.com/add',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            via: this.getValue('via'),
                            picture: this.getValue('picture')
                        }
                    },
                    instapaper: {
                        shareUrl: 'http://www.instapaper.com/edit',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            description: this.getValue('description')
                        }
                    },
                    pocket: {
                        shareUrl: 'https://getpocket.com/save',
                        params: {
                            url: this.getValue('url')
                        }
                    },
                    digg: {
                        shareUrl: 'http://www.digg.com/submit',
                        params: {
                            url: this.getValue('url')
                        }
                    },
                    stumbleupon: {
                        shareUrl: 'http://www.stumbleupon.com/submit',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title')
                        }
                    },
                    flipboard: {
                        shareUrl: 'https://share.flipboard.com/bookmarklet/popout',
                        params: {
                            v: 2,
                            title: this.getValue('title'),
                            url: this.getValue('url'),
                            t: Date.now()
                        }
                    },
                    weibo: {
                        shareUrl: 'http://service.weibo.com/share/share.php',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title'),
                            pic: this.getValue('image'),
                            appkey: this.getValue('appkey'),
                            ralateUid: this.getValue('ralateuid'),
                            language: 'zh_cn'
                        }
                    },
                    renren: {
                        shareUrl: 'http://share.renren.com/share/buttonshare',
                        params: {
                            link: this.getValue('url')
                        }
                    },
                    myspace: {
                        shareUrl: 'https://myspace.com/post',
                        params: {
                            u: this.getValue('url'),
                            t: this.getValue('title'),
                            c: this.getValue('description')
                        }
                    },
                    blogger: {
                        shareUrl: 'https://www.blogger.com/blog-this.g',
                        params: {
                            u: this.getValue('url'),
                            n: this.getValue('title'),
                            t: this.getValue('description')
                        }
                    },
                    baidu: {
                        shareUrl: 'http://cang.baidu.com/do/add',
                        params: {
                            it: this.getValue('title'),
                            iu: this.getValue('url')
                        }
                    },
                    douban: {
                        shareUrl: 'https://www.douban.com/share/service',
                        params: {
                            name: this.getValue('title'),
                            href: this.getValue('url'),
                            image: this.getValue('image')
                        }
                    },
                    okru: {
                        shareUrl: 'https://connect.ok.ru/dk',
                        params: {
                            'st.cmd': 'WidgetSharePreview',
                            'st.shareUrl': this.getValue('url'),
                            title: this.getValue('title')
                        }
                    },
                    mailru: {
                        shareUrl: 'http://connect.mail.ru/share',
                        params: {
                            share_url: this.getValue('url'),
                            linkname: this.getValue('title'),
                            linknote: this.getValue('description'),
                            type: 'page'
                        }
                    },
                    evernote: {
                        shareUrl: 'http://www.evernote.com/clip.action',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title')
                        }
                    },
                    skype: {
                        shareUrl: 'https://web.skype.com/share',
                        params: {
                            url: this.getValue('url'),
                            title: this.getValue('title')
                        }
                    }
                },
                s = sharers[sharer];

            // custom popups sizes
            if (s) {
                s.width = this.getValue('width');
                s.height = this.getValue('height');
            }
            return s !== undefined ? this.urlSharer(s) : false;
        },
        /**
         * @event urlSharer
         * @param {Object} sharer
         */
        urlSharer: function(sharer) {
            var p = sharer.params || {},
                keys = Object.keys(p),
                i,
                str = keys.length > 0 ? '?' : '';
            for (i = 0; i < keys.length; i++) {
                if (str !== '?') {
                    str += '&';
                }
                if (p[keys[i]]) {
                    str += keys[i] + '=' + encodeURIComponent(p[keys[i]]);
                }
            }
            sharer.shareUrl += str;

            if (!sharer.isLink) {
                var popWidth = sharer.width || 600,
                    popHeight = sharer.height || 480,
                    left = window.innerWidth / 2 - popWidth / 2 + window.screenX,
                    top = window.innerHeight / 2 - popHeight / 2 + window.screenY,
                    popParams =
                        'scrollbars=no, width=' +
                        popWidth +
                        ', height=' +
                        popHeight +
                        ', top=' +
                        top +
                        ', left=' +
                        left,
                    newWindow = window.open(sharer.shareUrl, '', popParams);

                if (window.focus) {
                    newWindow.focus();
                }
            } else {
                window.location.href = sharer.shareUrl;
            }
        }
    };

    // adding sharer events on domcontentload
    if (document.readyState === 'complete' || document.readyState !== 'loading') {
        Sharer.init();
    } else {
        document.addEventListener('DOMContentLoaded', Sharer.init);
    }

    // turbolinks compatibility
    window.addEventListener('page:load', Sharer.init);

    // exporting sharer for external usage
    window.Sharer = Sharer;
})(window, document);


/***/ }),

/***/ "./node_modules/vanilla-lazyload/dist/lazyload.min.js":
/*!************************************************************!*\
  !*** ./node_modules/vanilla-lazyload/dist/lazyload.min.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;function _extends(){return(_extends=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t}).apply(this,arguments)}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}!function(t,e){"object"===( false?undefined:_typeof(exports))&&"undefined"!=typeof module?module.exports=e(): true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):undefined}(this,function(){"use strict";var t="undefined"!=typeof window,e=t&&!("onscroll"in window)||"undefined"!=typeof navigator&&/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent),n=t&&"IntersectionObserver"in window,o=t&&"classList"in document.createElement("p"),r={elements_selector:"img",container:e||t?document:null,threshold:300,thresholds:null,data_src:"src",data_srcset:"srcset",data_sizes:"sizes",data_bg:"bg",class_loading:"loading",class_loaded:"loaded",class_error:"error",load_delay:0,auto_unobserve:!0,callback_enter:null,callback_exit:null,callback_reveal:null,callback_loaded:null,callback_error:null,callback_finish:null,use_native:!1},a=function(t,e){var n,o=new t(e);try{n=new CustomEvent("LazyLoad::Initialized",{detail:{instance:o}})}catch(t){(n=document.createEvent("CustomEvent")).initCustomEvent("LazyLoad::Initialized",!1,!1,{instance:o})}window.dispatchEvent(n)};var i=function(t,e){return t.getAttribute("data-"+e)},s=function(t,e,n){var o="data-"+e;null!==n?t.setAttribute(o,n):t.removeAttribute(o)},c=function(t){return"true"===i(t,"was-processed")},l=function(t,e){return s(t,"ll-timeout",e)},u=function(t){return i(t,"ll-timeout")},d=function(t,e){t&&t(e)},f=function(t,e){t._loadingCount+=e,0===t._elements.length&&0===t._loadingCount&&d(t._settings.callback_finish)},_=function(t){for(var e,n=[],o=0;e=t.children[o];o+=1)"SOURCE"===e.tagName&&n.push(e);return n},v=function(t,e,n){n&&t.setAttribute(e,n)},g=function(t,e){v(t,"sizes",i(t,e.data_sizes)),v(t,"srcset",i(t,e.data_srcset)),v(t,"src",i(t,e.data_src))},m={IMG:function(t,e){var n=t.parentNode;n&&"PICTURE"===n.tagName&&_(n).forEach(function(t){g(t,e)});g(t,e)},IFRAME:function(t,e){v(t,"src",i(t,e.data_src))},VIDEO:function(t,e){_(t).forEach(function(t){v(t,"src",i(t,e.data_src))}),v(t,"src",i(t,e.data_src)),t.load()}},b=function(t,e){var n,o,r=e._settings,a=t.tagName,s=m[a];if(s)return s(t,r),f(e,1),void(e._elements=(n=e._elements,o=t,n.filter(function(t){return t!==o})));!function(t,e){var n=i(t,e.data_src),o=i(t,e.data_bg);n&&(t.style.backgroundImage='url("'.concat(n,'")')),o&&(t.style.backgroundImage=o)}(t,r)},h=function(t,e){o?t.classList.add(e):t.className+=(t.className?" ":"")+e},p=function(t,e,n){t.addEventListener(e,n)},y=function(t,e,n){t.removeEventListener(e,n)},E=function(t,e,n){y(t,"load",e),y(t,"loadeddata",e),y(t,"error",n)},w=function(t,e,n){var r=n._settings,a=e?r.class_loaded:r.class_error,i=e?r.callback_loaded:r.callback_error,s=t.target;!function(t,e){o?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\s+)"+e+"(\\s+|$)")," ").replace(/^\s+/,"").replace(/\s+$/,"")}(s,r.class_loading),h(s,a),d(i,s),f(n,-1)},I=function(t,e){var n=function n(r){w(r,!0,e),E(t,n,o)},o=function o(r){w(r,!1,e),E(t,n,o)};!function(t,e,n){p(t,"load",e),p(t,"loadeddata",e),p(t,"error",n)}(t,n,o)},k=["IMG","IFRAME","VIDEO"],A=function(t,e){var n=e._observer;z(t,e),n&&e._settings.auto_unobserve&&n.unobserve(t)},L=function(t){var e=u(t);e&&(clearTimeout(e),l(t,null))},x=function(t,e){var n=e._settings.load_delay,o=u(t);o||(o=setTimeout(function(){A(t,e),L(t)},n),l(t,o))},z=function(t,e,n){var o=e._settings;!n&&c(t)||(k.indexOf(t.tagName)>-1&&(I(t,e),h(t,o.class_loading)),b(t,e),function(t){s(t,"was-processed","true")}(t),d(o.callback_reveal,t),d(o.callback_set,t))},O=function(t){return!!n&&(t._observer=new IntersectionObserver(function(e){e.forEach(function(e){return function(t){return t.isIntersecting||t.intersectionRatio>0}(e)?function(t,e){var n=e._settings;d(n.callback_enter,t),n.load_delay?x(t,e):A(t,e)}(e.target,t):function(t,e){var n=e._settings;d(n.callback_exit,t),n.load_delay&&L(t)}(e.target,t)})},{root:(e=t._settings).container===document?null:e.container,rootMargin:e.thresholds||e.threshold+"px"}),!0);var e},N=["IMG","IFRAME"],C=function(t,e){return function(t){return t.filter(function(t){return!c(t)})}((n=t||function(t){return t.container.querySelectorAll(t.elements_selector)}(e),Array.prototype.slice.call(n)));var n},M=function(t,e){this._settings=function(t){return _extends({},r,t)}(t),this._loadingCount=0,O(this),this.update(e)};return M.prototype={update:function(t){var n,o=this,r=this._settings;(this._elements=C(t,r),!e&&this._observer)?(function(t){return t.use_native&&"loading"in HTMLImageElement.prototype}(r)&&((n=this)._elements.forEach(function(t){-1!==N.indexOf(t.tagName)&&(t.setAttribute("loading","lazy"),z(t,n))}),this._elements=C(t,r)),this._elements.forEach(function(t){o._observer.observe(t)})):this.loadAll()},destroy:function(){var t=this;this._observer&&(this._elements.forEach(function(e){t._observer.unobserve(e)}),this._observer=null),this._elements=null,this._settings=null},load:function(t,e){z(t,this,e)},loadAll:function(){var t=this;this._elements.forEach(function(e){A(e,t)})}},t&&function(t,e){if(e)if(e.length)for(var n,o=0;n=e[o];o+=1)a(t,n);else a(t,e)}(M,window.lazyLoadOptions),M});

/***/ }),

/***/ "./resources/js/_authorization.js":
/*!****************************************!*\
  !*** ./resources/js/_authorization.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.promise */ "./node_modules/core-js/modules/es6.promise.js");
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.object.to-string */ "./node_modules/core-js/modules/es6.object.to-string.js");
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _api_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./api/auth */ "./resources/js/api/auth.js");
/* harmony import */ var _classes_AuthModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./classes/AuthModal */ "./resources/js/classes/AuthModal.js");
/* harmony import */ var _classes_AuthModal__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_classes_AuthModal__WEBPACK_IMPORTED_MODULE_5__);





function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable */


document.addEventListener('DOMContentLoaded', function () {
  var formResetPassword = document.querySelector('.form--reset-pasword');
  var formForgot = document.querySelector('.form--forgot');
  var formSignup = document.querySelector('.form--signup');
  var formLogin = document.querySelector('.form--login');
  var logoutBtn = document.querySelector('#logout');
  var authModalTrigger = document.querySelector('a.auth__action');
  var authModal = document.querySelector('#signup-overlay');

  if (authModalTrigger && authModal) {
    new _classes_AuthModal__WEBPACK_IMPORTED_MODULE_5___default.a(authModal, authModalTrigger);
  }

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  if (formResetPassword) {
    formResetPassword.addEventListener('submit',
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee(e) {
        var formData;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                e.preventDefault();
                formData = new FormData(e.target);
                _context.next = 4;
                return Object(_api_auth__WEBPACK_IMPORTED_MODULE_4__["resetPassword"])({
                  token: formData.get('token'),
                  p: formData.get('password'),
                  pc: formData.get('passwordConfirm')
                });

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }

  if (formSignup) {
    var formSignupEmail = formSignup.querySelector('#signup-email');
    formSignupEmail.onblur =
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee2() {
      var errorEmail, existUser;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              errorEmail = formSignup.querySelector('#signup-email-error');

              if (validateEmail(this.value)) {
                _context2.next = 6;
                break;
              }

              errorEmail.innerHTML = 'Пожалуйста, введите правильный email.';
              this.classList.add('form__input--error');
              formSignupEmail.focus();
              return _context2.abrupt("return");

            case 6:
              _context2.next = 8;
              return Object(_api_auth__WEBPACK_IMPORTED_MODULE_4__["emailExists"])(this.value);

            case 8:
              existUser = _context2.sent;

              if (!existUser) {
                _context2.next = 13;
                break;
              }

              errorEmail.innerHTML = 'Пользователь с таким Email уже зарегистрирован.';
              this.classList.add('form__input--error');
              return _context2.abrupt("return");

            case 13:
              errorEmail.innerHTML = '';
              this.classList.remove('form__input--error');

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));
    formSignup.addEventListener('submit',
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee3(e) {
        var formData, submit;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                e.preventDefault();
                formData = new FormData(e.target);
                submit = formSignup.querySelector('.button');
                submit.textContent = 'Регистрация...';
                submit.setAttribute('disabled', true);
                _context3.next = 7;
                return Object(_api_auth__WEBPACK_IMPORTED_MODULE_4__["signup"])({
                  firstName: formData.get('firstName'),
                  email: formData.get('email'),
                  password: formData.get('password'),
                  passwordConfirm: formData.get('passwordConfirm'),
                  agree: formData.get('agree') ? true : false
                });

              case 7:
                submit.textContent = 'Создать учетную запись';
                submit.removeAttribute('disabled');

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());
  }

  if (formForgot) {
    formForgot.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = formForgot.querySelector('#forgot-email').value;
      Object(_api_auth__WEBPACK_IMPORTED_MODULE_4__["forgotPassword"])(email);
    });
  }

  if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = formLogin.querySelector('#email').value;
      var password = formLogin.querySelector('#password').value;
      Object(_api_auth__WEBPACK_IMPORTED_MODULE_4__["login"])(email, password);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      Object(_api_auth__WEBPACK_IMPORTED_MODULE_4__["logout"])();
    });
  }
});

/***/ }),

/***/ "./resources/js/_cabinet-profile.js":
/*!******************************************!*\
  !*** ./resources/js/_cabinet-profile.js ***!
  \******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.promise */ "./node_modules/core-js/modules/es6.promise.js");
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.object.to-string */ "./node_modules/core-js/modules/es6.object.to-string.js");
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _api_update_user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./api/update-user */ "./resources/js/api/update-user.js");





function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


document.addEventListener('DOMContentLoaded', function () {
  var formUserAvatar = document.querySelector('#form-user-avatar');
  var formUserSettings = document.querySelector('#form-user-settings');
  var formUserPassword = document.querySelector('#form-user-password'); // User Account

  if (formUserAvatar) {
    var inputPhoto = formUserAvatar.querySelector('#photo');
    inputPhoto.addEventListener('change',
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee(e) {
        var reader, userPhoto, formData;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(e.target.files && e.target.files[0])) {
                  _context.next = 8;
                  break;
                }

                reader = new FileReader();
                userPhoto = formUserAvatar.querySelector('#user-photo');
                formData = new FormData(formUserAvatar);

                reader.onload = function (e) {
                  return userPhoto.setAttribute('src', e.target.result);
                };

                reader.readAsDataURL(e.target.files[0]);
                _context.next = 8;
                return Object(_api_update_user__WEBPACK_IMPORTED_MODULE_4__["updateSettings"])(formData);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }

  if (formUserSettings) {
    formUserSettings.addEventListener('submit',
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee2(e) {
        var submit, formData;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                e.preventDefault();
                submit = formUserSettings.querySelector('.button');
                submit.textContent = 'Обновление...';
                submit.setAttribute('disabled', true);
                formData = new FormData(e.target);
                _context2.next = 7;
                return Object(_api_update_user__WEBPACK_IMPORTED_MODULE_4__["updateSettings"])(formData);

              case 7:
                submit.textContent = 'Сохранить изменения';
                submit.removeAttribute('disabled', true);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  }

  if (formUserPassword) {
    formUserPassword.addEventListener('submit',
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee3(e) {
        var formData, submit;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                e.preventDefault();
                formData = new FormData(e.target);
                submit = formUserPassword.querySelector('.button');
                submit.textContent = 'Обновление...';
                submit.setAttribute('disabled', true);
                _context3.next = 7;
                return Object(_api_update_user__WEBPACK_IMPORTED_MODULE_4__["updatePassword"])({
                  passwordCurrent: formData.get('passwordCurrent'),
                  password: formData.get('password'),
                  passwordConfirm: formData.get('passwordConfirm')
                });

              case 7:
                submit.textContent = 'Сохранить пароль';
                submit.removeAttribute('disabled', true);
                formUserPassword.reset();

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());
  }
});

/***/ }),

/***/ "./resources/js/_comments.js":
/*!***********************************!*\
  !*** ./resources/js/_comments.js ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.promise */ "./node_modules/core-js/modules/es6.promise.js");
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.object.to-string */ "./node_modules/core-js/modules/es6.object.to-string.js");
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _classes_Notice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./classes/Notice */ "./resources/js/classes/Notice.js");





function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable */

document.addEventListener('DOMContentLoaded', function () {
  var commentsForm = document.querySelector('.comments__form');
  var notice = new _classes_Notice__WEBPACK_IMPORTED_MODULE_4__["default"]();

  var sendComment =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee(data, postId) {
      var query, response, result;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
              };
              notice.start();
              _context.next = 4;
              return fetch("/api/v1/posts/".concat(postId, "/comments/add"), query);

            case 4:
              response = _context.sent;
              _context.next = 7;
              return response.json();

            case 7:
              result = _context.sent;

              if (result.status === 'success') {
                _context.next = 11;
                break;
              }

              notice.error('Ошибка!', result.message);
              return _context.abrupt("return", null);

            case 11:
              notice.success('Комментарий отправлен!', 'Он будет доступен всем посетителям после проверки модератором.');
              return _context.abrupt("return", result.data.data);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function sendComment(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var openAuthModal = function openAuthModal() {
    var authModal = document.querySelector('#signup-overlay');
    authModal.classList.add('overlay--visible');
  };

  var createComment = function createComment(comment) {
    var userName = comment.owner.lastName ? "".concat(comment.owner.firstName, " ").concat(comment.owner.lastName) : comment.owner.firstName;
    var html = "\n      <div class=\"comments__item\">\n        <div class=\"avatar\">\n          <picture>\n            <source type=\"image/webp\" srcset=\"images/users/".concat(comment.owner.photo, "_500.webp 500w\">\n            <img src=\"images/users/").concat(comment.owner.photo, "_150.jpeg\" alt=\"").concat(userName, "\" srcset=\"images/users/").concat(comment.owner.photo, "_150.jpeg 1x, images/users/").concat(comment.owner.photo, "_300.jpeg 2x, images/users/").concat(comment.owner.photo, ".jpeg 3x\">\n          </picture>\n        </div>\n        <div class=\"info\">\n          <p class=\"published\"><a class=\"name\" href=\"user/").concat(comment.owner._id, "\" target=\"__blank\">").concat(userName, "</a> <span class=\"date\">\u043D\u0430 \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u0438</span></p>\n          <p class=\"text\">").concat(comment.text, "</p>\n        </div>\n      </div>");

    var fragmentFromString = function fragmentFromString(strHTML) {
      return document.createRange().createContextualFragment(strHTML);
    };

    var commentsList = document.querySelector('.comments__list');
    var fragment = fragmentFromString(html);
    commentsList.prepend(fragment);
  };

  if (commentsForm) {
    commentsForm.addEventListener('click', function (event) {
      var trigger = event.target.closest('form');
      var userId = trigger.dataset.user;
      if (!userId) openAuthModal();
      return;
    });
    commentsForm.addEventListener('submit',
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee2(event) {
        var userId, postId, formData, comment;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                event.preventDefault();
                userId = event.target.dataset.user;

                if (userId) {
                  _context2.next = 5;
                  break;
                }

                openAuthModal();
                return _context2.abrupt("return");

              case 5:
                postId = event.target.dataset.post;
                formData = new FormData(event.target);
                _context2.next = 9;
                return sendComment({
                  text: formData.get('text'),
                  _csrf: formData.get('_csrf')
                }, postId);

              case 9:
                comment = _context2.sent;

                if (comment) {
                  createComment(comment);
                }

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }());
  }
});

/***/ }),

/***/ "./resources/js/_scroll-page.js":
/*!**************************************!*\
  !*** ./resources/js/_scroll-page.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* eslint-disable */
document.addEventListener('DOMContentLoaded', function () {
  var backToTopButton = document.querySelector('#back-to-top-btn');

  if (backToTopButton) {
    backToTopButton.addEventListener('click', smoothScrollBackToTop);
  }

  var onScrollPage = function () {
    var oldPos = window.scrollY;

    function fu() {
      var clientHeight = document.documentElement.clientHeight;
      var newPos = window.scrollY;
      var scroll = {
        up: newPos < oldPos,
        // прокрутка вверх
        down: newPos > oldPos,
        // прокрутка вниз
        limit: newPos > 200,
        // ниже 200px
        hero: newPos < clientHeight // в границе первого экрана

      };
      var pageHeader = document.querySelector('#header');

      if (pageHeader) {
        pageHeaderStiky(pageHeader, scroll);
      }

      if (scroll.limit) {
        // Show backToTopButton
        if (!backToTopButton.classList.contains('btnEntrance')) {
          backToTopButton.classList.remove('btnExit');
          backToTopButton.classList.add('btnEntrance');
          backToTopButton.style.display = 'block';
        }
      } else {
        // Hide backToTopButton
        if (backToTopButton.classList.contains('btnEntrance')) {
          backToTopButton.classList.remove('btnEntrance');
          backToTopButton.classList.add('btnExit');
          setTimeout(function () {
            backToTopButton.style.display = 'none';
          }, 250);
        }
      }

      oldPos = newPos;
    }

    return fu;
  }();

  window.addEventListener('scroll', onScrollPage);

  var pageHeaderStiky = function pageHeaderStiky(pageHeader, scroll) {
    if (scroll.limit && !pageHeader.classList.contains('header--fixed')) {
      pageHeader.classList.add('header--fixed');
    }

    if (!scroll.limit) {
      pageHeader.classList.remove('header--fixed');
    }

    if (scroll.up && scroll.limit) {
      pageHeader.classList.add('header--show');
    }

    if (scroll.down || !scroll.limit) {
      pageHeader.classList.remove('header--show');
    }
  };

  function smoothScrollBackToTop() {
    var targetPosition = 0;
    var startPosition = window.pageYOffset;
    var distance = targetPosition - startPosition;
    var duration = 750;
    var start = null;
    window.requestAnimationFrame(step);

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = timestamp - start;
      window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
      if (progress < duration) window.requestAnimationFrame(step);
    }
  }

  function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }
});

/***/ }),

/***/ "./resources/js/api/auth.js":
/*!**********************************!*\
  !*** ./resources/js/api/auth.js ***!
  \**********************************/
/*! exports provided: signup, login, emailExists, logout, forgotPassword, resetPassword */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "signup", function() { return signup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "login", function() { return login; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "emailExists", function() { return emailExists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logout", function() { return logout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forgotPassword", function() { return forgotPassword; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetPassword", function() { return resetPassword; });
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.promise */ "./node_modules/core-js/modules/es6.promise.js");
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.object.to-string */ "./node_modules/core-js/modules/es6.object.to-string.js");
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.regexp.replace */ "./node_modules/core-js/modules/es6.regexp.replace.js");
/* harmony import */ var core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _classes_Notice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../classes/Notice */ "./resources/js/classes/Notice.js");






function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


var notice = new _classes_Notice__WEBPACK_IMPORTED_MODULE_5__["default"]();

var fetchApi =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.mark(function _callee(query, url, success) {
    var response, result;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            notice.start();
            _context.next = 3;
            return fetch("/api/v1/".concat(url), query);

          case 3:
            response = _context.sent;
            _context.next = 6;
            return response.json();

          case 6:
            result = _context.sent;

            if (result.status === 'success') {
              _context.next = 10;
              break;
            }

            notice.error('Ошибка!', result.message);
            return _context.abrupt("return", false);

          case 10:
            notice.success(success.title, success.text);
            return _context.abrupt("return", result);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchApi(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var signup =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.mark(function _callee2() {
    var data,
        query,
        success,
        result,
        _args2 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            data = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
            query = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(data)
            };
            success = {
              title: 'Вы зарегистрированы!',
              text: 'Сейчас Вы будете перенаправлены на главную страницу.'
            };
            _context2.next = 5;
            return fetchApi(query, 'users/signup', success);

          case 5:
            result = _context2.sent;
            if (result) window.setTimeout(function () {
              location.assign('/');
            }, 1500);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function signup() {
    return _ref2.apply(this, arguments);
  };
}();
var login =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.mark(function _callee3(email, password) {
    var query, success, result;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            query = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify({
                email: email,
                password: password
              })
            };
            success = {
              title: 'Вы авторизованы!',
              text: 'Обновление информации...'
            };
            _context3.next = 4;
            return fetchApi(query, 'users/login', success);

          case 4:
            result = _context3.sent;

            if (result) {
              console.log(location);

              if (location.pathname === '/auth/login') {
                window.setTimeout(function () {
                  location.assign('/');
                }, 1500);
              } else {
                location.reload(true);
              }
            }

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function login(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
var emailExists =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.mark(function _callee4(email) {
    var query, response, result;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            query = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify({
                email: email
              })
            };
            _context4.next = 3;
            return fetch('/api/v1/users/email-exists', query);

          case 3:
            response = _context4.sent;
            _context4.next = 6;
            return response.json();

          case 6:
            result = _context4.sent;
            return _context4.abrupt("return", result.data);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function emailExists(_x6) {
    return _ref4.apply(this, arguments);
  };
}();
var logout = function logout() {
  fetch('/api/v1/users/logout').then(function (res) {
    return location.replace = '/';
  });
};
var forgotPassword =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.mark(function _callee5(email) {
    var query, success;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            query = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify({
                email: email
              })
            };
            success = {
              title: 'Выполнено!',
              text: 'Ссылка для сброса пароля выслана на указанный Email.'
            };
            _context5.next = 4;
            return fetchApi(query, 'users/pass/forgot', success);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function forgotPassword(_x7) {
    return _ref5.apply(this, arguments);
  };
}();
var resetPassword =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.mark(function _callee6() {
    var data,
        query,
        success,
        result,
        _args6 = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            data = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : {};
            query = {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify({
                password: data.p,
                passwordConfirm: data.pc
              })
            };
            success = {
              title: 'Новый пароль задан!',
              text: 'Сейчас Вы будете перенаправлены на страницу авторизации'
            };
            _context6.next = 5;
            return fetchApi(query, "users/pass/reset/".concat(data.token), success);

          case 5:
            result = _context6.sent;
            if (result) window.setTimeout(function () {
              location.assign('/auth/login');
            }, 1500);

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function resetPassword() {
    return _ref6.apply(this, arguments);
  };
}();

/***/ }),

/***/ "./resources/js/api/update-user.js":
/*!*****************************************!*\
  !*** ./resources/js/api/update-user.js ***!
  \*****************************************/
/*! exports provided: updateSettings, updatePassword */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateSettings", function() { return updateSettings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updatePassword", function() { return updatePassword; });
/* harmony import */ var _classes_Notice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../classes/Notice */ "./resources/js/classes/Notice.js");

var notice = new _classes_Notice__WEBPACK_IMPORTED_MODULE_0__["default"]();
var updateSettings = function updateSettings() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var query = {
    method: 'PATCH',
    body: data
  };
  notice.start();
  fetch('/api/v1/users/update', query).then(function (response) {
    return response.json();
  }).then(function (result) {
    if (!(result.status === 'success')) {
      var errors = result.error.errors;

      if (errors === undefined) {
        notice.error('Ошибка!', result.message);
        return;
      }

      if (errors.firstName) {
        notice.error('Ошибка!', errors.firstName.message);
      } else if (errors.lastName) {
        notice.error('Ошибка!', errors.lastName.message);
      } else if (errors.email) {
        notice.error('Ошибка!', errors.email.message);
      } else if (errors.photo) {
        notice.error('Ошибка!', errors.photo.message);
      } else {
        notice.error('Ошибка!', result.message);
      }

      return;
    }

    notice.success('Выполнено!', 'Данные успешно обновлены.');
    window.setTimeout(function () {
      location.assign('/me');
    }, 1500);
  });
};
var updatePassword = function updatePassword() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var query = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  };
  notice.start();
  fetch('/api/v1/users/pass/update', query).then(function (response) {
    return response.json();
  }).then(function (result) {
    if (!(result.status === 'success')) {
      var errors = result.error.errors;

      if (errors === undefined) {
        notice.error('Ошибка!', result.message);
        return;
      }

      if (errors.password) {
        notice.error('Ошибка!', errors.password.message);
      } else if (errors.passwordConfirm) {
        notice.error('Ошибка!', errors.passwordConfirm.message);
      } else {
        notice.error('Ошибка!', result.message);
      }

      return;
    }

    notice.success('Выполнено!', 'Данные успешно обновлены.');
  });
};

/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.promise */ "./node_modules/core-js/modules/es6.promise.js");
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.object.to-string */ "./node_modules/core-js/modules/es6.object.to-string.js");
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _classes_Notice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./classes/Notice */ "./resources/js/classes/Notice.js");
/* harmony import */ var embedo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! embedo */ "./node_modules/embedo/embedo.js");
/* harmony import */ var embedo__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(embedo__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var vanilla_lazyload__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vanilla-lazyload */ "./node_modules/vanilla-lazyload/dist/lazyload.min.js");
/* harmony import */ var vanilla_lazyload__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(vanilla_lazyload__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var sharer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! sharer.js */ "./node_modules/sharer.js/sharer.js");
/* harmony import */ var sharer_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(sharer_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _trigger_init__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./trigger-init */ "./resources/js/trigger-init.js");
/* harmony import */ var _classes_Filter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./classes/Filter */ "./resources/js/classes/Filter.js");
/* harmony import */ var _glide_init__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./glide-init */ "./resources/js/glide-init.js");





function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable */







Object(_trigger_init__WEBPACK_IMPORTED_MODULE_8__["jsTriggerInit"])();
Object(_glide_init__WEBPACK_IMPORTED_MODULE_10__["popularPostsSlider"])();

__webpack_require__(/*! ./_scroll-page */ "./resources/js/_scroll-page.js");

__webpack_require__(/*! ./_authorization */ "./resources/js/_authorization.js");

__webpack_require__(/*! ./_cabinet-profile */ "./resources/js/_cabinet-profile.js");

__webpack_require__(/*! ./_comments */ "./resources/js/_comments.js");

document.addEventListener('DOMContentLoaded', function () {
  var formSearch = document.querySelector('form#search');
  var categoriesDropdown = document.querySelector('#categories-dropdown');
  var btnsFavorite = document.querySelectorAll('.button--favorite');
  var filter = document.querySelector('#page-filter');
  var singleContent = document.querySelector('.single__content');
  var singleVideoContent = document.querySelector('.single--video .single__content');
  var notice = new _classes_Notice__WEBPACK_IMPORTED_MODULE_4__["default"]();
  if (singleVideoContent) headerInsertBeforeVideo(singleVideoContent);
  if (singleContent) registerView(singleContent);

  function registerView(article) {
    var postId = article.querySelector('.button--favorite').dataset.post;
    var query = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    };
    fetch("/api/v1/posts/".concat(postId, "/views"), query).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (!(result.status === 'success')) return;
      var views = article.querySelector('.badge--views .count');
      views.innerText = result.data;
    });
  }

  function headerInsertBeforeVideo(article) {
    var fragment = document.createDocumentFragment();
    var header = article.querySelector('.single__header');
    var line = article.querySelector('.line');
    var body = article.querySelector('.single__body');
    var media = body.querySelector('.media');
    fragment.appendChild(header);
    body.insertBefore(fragment, media.nextSibling);
    body.insertBefore(line, header.nextSibling);
  }

  var embedo = new embedo__WEBPACK_IMPORTED_MODULE_5___default.a({
    twitter: true,
    instagram: true,
    pinterest: true
  });
  document.querySelectorAll('oembed[url]').forEach(function (element) {
    embedo.load(element, element.attributes.url.value);
  });
  var lazyLoadInstance = new vanilla_lazyload__WEBPACK_IMPORTED_MODULE_6___default.a({
    elements_selector: ".lazy",
    to_webp: true,
    callback_error: function callback_error(element) {
      element.src = "data:image/gif;base64,R0lGODlhAgABAIAAAP///wAAACH5BAEAAAEALAAAAAACAAEAAAICTAoAOw==";
    }
  });

  var getPostsForCategory =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee() {
      var catID,
          url,
          total,
          _args = arguments;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              catID = _args.length > 0 && _args[0] !== undefined ? _args[0] : '';
              url = "/api/v1/render/home?category=".concat(catID, "&limit=9");
              _context.next = 4;
              return updatePostsList(url);

            case 4:
              total = _context.sent;

              if (!(total === undefined)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", null);

            case 7:
              return _context.abrupt("return", total);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getPostsForCategory() {
      return _ref.apply(this, arguments);
    };
  }();

  var updatePostsList = function updatePostsList() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/api/v1/render/search';
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (!(result.status === 'success')) throw Error('Ошибка обращения к серверу. Обновите страницу и попробуйте еще раз.');
      document.querySelector('#posts').innerHTML = result.data;
      var favorite = document.querySelectorAll('.button--favorite');
      if (lazyLoadInstance) lazyLoadInstance.update();
      if (favorite.length > 0) favorite.forEach(function (element) {
        element.addEventListener('click', onButtonFavoriteClick);
      });
      return result.total;
    }).catch(function (error) {
      return notice.pnotify('error', {
        title: 'Ошибка!',
        text: error
      });
    });
  };

  if (filter) {
    var FilterInstance = new _classes_Filter__WEBPACK_IMPORTED_MODULE_9__["default"](filter, filterParams, updatePostsList);
  } // Search Form


  if (formSearch) {
    var searchInput = document.querySelector('#search-value');

    searchInput.onfocus = function () {
      formSearch.classList.add('focus');
    };

    searchInput.onblur = function () {
      formSearch.classList.remove('focus');
    };

    searchInput.addEventListener('input', function (e) {
      if (e.target.value) {
        console.log(e.target.value);
        if (!formSearch.classList.contains('active')) formSearch.classList.add('active');
        return;
      }

      formSearch.classList.remove('active');
    });
  } // Select Category and Show Posts


  if (categoriesDropdown) {
    categoriesDropdown.addEventListener('click', onDropdownClick);
    var categoriesSelect = categoriesDropdown.querySelector('#categories-select');

    if (categoriesSelect) {
      categoriesSelect.addEventListener('change', function (event) {
        var catID = event.target.options[event.target.selectedIndex].value;
        getPostsForCategory(catID);
      });
    }
  }

  function onDropdownClick(event) {
    var button = event.target.closest('.dropdown__button');

    if (button && button.classList.contains('active')) {
      button.classList.remove('active');
      return;
    }

    if (button && !button.classList.contains('active')) {
      button.classList.add('active');
      return;
    }

    var item = event.target.closest('li');
    if (!item) return;
    var dropdown = event.target.closest('.dropdown');
    var btn = dropdown.querySelector('.dropdown__button');
    var select = dropdown.querySelector('.dropdown__select');
    btn.classList.remove('active');
    btn.innerText = item.innerText;
    select.selectedIndex = -1;

    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === item.dataset.value) {
        select.selectedIndex = i;
        select.dispatchEvent(new Event('change'));
        break;
      }
    }
  } // if click button add Post to favorites


  if (btnsFavorite.length > 0) {
    btnsFavorite.forEach(function (element) {
      element.addEventListener('click', onButtonFavoriteClick);
    });
  }

  function onButtonFavoriteClick(_x) {
    return _onButtonFavoriteClick.apply(this, arguments);
  }

  function _onButtonFavoriteClick() {
    _onButtonFavoriteClick = _asyncToGenerator(
    /*#__PURE__*/
    _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.mark(function _callee2(event) {
      var btn, post, user, like;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              btn = event.target.closest('.button--favorite');

              if (btn) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return");

            case 3:
              post = btn.dataset.post;
              user = btn.dataset.user;
              like = btn.dataset.like;

              if (post) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return");

            case 8:
              if (user) {
                _context2.next = 11;
                break;
              }

              document.querySelector('#signup-overlay').classList.add('overlay--visible');
              return _context2.abrupt("return");

            case 11:
              if (!like) {
                _context2.next = 15;
                break;
              }

              _context2.next = 14;
              return deleteLike({
                like: like,
                user: user,
                post: post
              }, btn);

            case 14:
              return _context2.abrupt("return");

            case 15:
              _context2.next = 17;
              return createLike({
                post: post,
                user: user
              }, btn);

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _onButtonFavoriteClick.apply(this, arguments);
  }

  var createLike = function createLike(data, btn) {
    var query = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    };
    notice.start();
    return fetch("/api/v1/posts/".concat(data.post, "/likes"), query).then(function (response) {
      return response.json();
    }).then(function (result) {
      if (result.status === 'success') {
        var newLike = result.data.data;
        var article = document.getElementById(newLike.post);
        var badgeLikes = article.querySelector('.badge--likes .count');
        var likes = parseInt(badgeLikes.innerText, 10);
        notice.success(null, 'Статья добавлена в избранное');
        btn.classList.add('active');
        btn.setAttribute('data-like', newLike.id);
        badgeLikes.innerText = likes + 1;
        return true;
      }

      notice.error('Ошибка!', result.message);
    });
  };

  var deleteLike = function deleteLike(data, btn) {
    var query = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    };
    notice.start();
    return fetch("/api/v1/likes/".concat(data.like), query).then(function (response) {
      if (response.status === 204) {
        var article = document.getElementById(data.post);
        var badgeLikes = article.querySelector('.badge--likes .count');
        var likes = parseInt(badgeLikes.innerText, 10);
        notice.info(null, 'Статья удалена из избранного');
        btn.classList.remove('active');
        btn.removeAttribute('data-like', data.like);
        badgeLikes.innerText = likes - 1;
        return true;
      }

      notice.error('Ошибка!', response.json().message);
    });
  };
});

/***/ }),

/***/ "./resources/js/classes/AuthModal.js":
/*!*******************************************!*\
  !*** ./resources/js/classes/AuthModal.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable */
module.exports =
/*#__PURE__*/
function () {
  function AuthModal(modal, trigger) {
    _classCallCheck(this, AuthModal);

    this._trigger = trigger;
    this._modal = modal;
    this.formSignup = modal.querySelector('.form--signup');
    this.signupFields = modal.querySelector('#signup-fields');
    this.loginFields = modal.querySelector('#login-fields');
    this.forgotFields = modal.querySelector('#forgot-fields');
    trigger.onclick = this.openModal.bind(this);
    modal.onclick = this.onClick.bind(this);
  }

  _createClass(AuthModal, [{
    key: "openModal",
    value: function openModal(event) {
      event.preventDefault();

      this._modal.classList.add('overlay--visible');
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      this._modal.classList.remove('overlay--visible');
    }
  }, {
    key: "showSignupForm",
    value: function showSignupForm() {
      console.log('showSignupForm');
      this.formSignup.classList.add('show');
    }
  }, {
    key: "showLoginFields",
    value: function showLoginFields() {
      console.log('showLoginFields');
      this.loginFields.classList.remove('hide');
      this.signupFields.classList.add('hide');
      this.forgotFields.classList.add('hide');
    }
  }, {
    key: "showSignupFields",
    value: function showSignupFields() {
      console.log('showSignupFields');
      this.signupFields.classList.remove('hide');
      this.loginFields.classList.add('hide');
      this.forgotFields.classList.add('hide');
    }
  }, {
    key: "showForgotFields",
    value: function showForgotFields(event) {
      event.preventDefault();
      console.log('showForgotFields');
      this.forgotFields.classList.remove('hide');
      this.loginFields.classList.add('hide');
      this.signupFields.classList.add('hide');
    }
  }, {
    key: "onClick",
    value: function onClick(event) {
      var target = event.target;

      if (this._modal === target) {
        this.closeModal();
        return;
      }

      var action = target.closest('.js');

      if (action) {
        var f = action.dataset.action;

        if (f) {
          this[f](event);
        }
      }
    }
  }]);

  return AuthModal;
}();

/***/ }),

/***/ "./resources/js/classes/Filter.js":
/*!****************************************!*\
  !*** ./resources/js/classes/Filter.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.promise */ "./node_modules/core-js/modules/es6.promise.js");
/* harmony import */ var core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.regexp.to-string */ "./node_modules/core-js/modules/es6.regexp.to-string.js");
/* harmony import */ var core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_to_string__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.object.to-string */ "./node_modules/core-js/modules/es6.object.to-string.js");
/* harmony import */ var core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es6_regexp_search__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es6.regexp.search */ "./node_modules/core-js/modules/es6.regexp.search.js");
/* harmony import */ var core_js_modules_es6_regexp_search__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_search__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es6.function.name */ "./node_modules/core-js/modules/es6.function.name.js");
/* harmony import */ var core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_function_name__WEBPACK_IMPORTED_MODULE_6__);








function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable */
var Filter =
/*#__PURE__*/
function () {
  function Filter(elem, params, updateFunction) {
    _classCallCheck(this, Filter);

    this._elem = elem;
    this.params = params;
    this.update = updateFunction;
    elem.onclick = this.onClick.bind(this);
  }

  _createClass(Filter, [{
    key: "onClick",
    value: function onClick(event) {
      var eventTarget = event.target;
      var trigger = eventTarget.closest('label');
      var dropdownBtn = eventTarget.closest('.dropdown__button');
      var dropdownItem = eventTarget.closest('.dropdown__item');
      if (!trigger && !dropdownBtn && !dropdownItem) return;

      if (dropdownBtn) {
        this.toggleActiveClass(dropdownBtn);
        return;
      }

      if (dropdownItem) {
        var _data = this.getDataTrigger(dropdownItem);

        var _dropdownBtn = this._elem.querySelector('.dropdown__button');

        var itemValue = dropdownItem.innerHTML;
        _dropdownBtn.innerHTML = itemValue;
        this.toggleActiveClass(_dropdownBtn);
        this.replaceParams(_data);
        this.pushParams(_data.name, _data.value);
        this.search();
      }

      if (!trigger) return;
      var data = this.getDataTrigger(trigger); // Checkbox click

      if (trigger.classList.contains('control--checkbox')) {
        this.toggleActiveClass(trigger);
        this.appendParams(data);
        this.pushParams(data.name, this.params[data.name].join(','));
        this.pushParams('page', 1);
        this.search();
      } // radio click


      if (trigger.classList.contains('control--radio')) {
        var inputs = this._elem.querySelectorAll("label.active[data-field-name=\"".concat(data.name, "\"]"));

        inputs.forEach(function (element) {
          element.classList.remove('active');
        });
        this.toggleActiveClass(trigger);
        this.replaceParams(data);
        this.pushParams(data.name, data.value);
        this.search();
      }

      return;
    }
  }, {
    key: "search",
    value: function () {
      var _search = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.mark(function _callee() {
        var _window$location, pathname, search, total, text;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log('search() =>', this.params);
                _window$location = window.location, pathname = _window$location.pathname, search = _window$location.search;

                if (!(pathname !== '/search')) {
                  _context.next = 5;
                  break;
                }

                window.location.href = "/search".concat(search);
                return _context.abrupt("return");

              case 5:
                _context.next = 7;
                return this.update("/api/v1/render/search".concat(search));

              case 7:
                total = _context.sent;
                text = this.correctForm(total, ['запись', 'записи', 'записей']);
                document.querySelector('.total-count').innerHTML = "".concat(total, " ").concat(text);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function search() {
        return _search.apply(this, arguments);
      }

      return search;
    }()
  }, {
    key: "pushParams",
    value: function pushParams(key, value) {
      key = encodeURI(key);
      value = encodeURI(value); // console.log('pushParams() =>', { key, value });

      var _window$location2 = window.location,
          href = _window$location2.href,
          pathname = _window$location2.pathname,
          search = _window$location2.search;
      var params = new URLSearchParams(search.slice(1));

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      window.history.pushState({
        path: href
      }, '', "".concat(pathname, "?").concat(params.toString()));
    }
  }, {
    key: "toggleActiveClass",
    value: function toggleActiveClass(element) {
      element.classList.contains('active') ? element.classList.remove('active') : element.classList.add('active');
    }
  }, {
    key: "appendParams",
    value: function appendParams(data) {
      if (this.params[data.name]) {
        var values = this.params[data.name];

        if (values.indexOf(data.value) !== -1) {
          values.splice(values.indexOf(data.value), 1);
        } else {
          values.push(data.value);
          this.params[data.name] = values;
        }
      } else {
        this.params[data.name] = [data.value];
      }
    }
  }, {
    key: "replaceParams",
    value: function replaceParams(data) {
      this.params[data.name] = data.value;
    }
  }, {
    key: "getDataTrigger",
    value: function getDataTrigger(element) {
      if (!element.dataset.fieldName && !element.dataset.value) return false;
      var data = {
        name: element.dataset.fieldName,
        value: element.dataset.value
      };
      console.log('getDataTrigger() =>', data);
      return data;
    }
  }, {
    key: "correctForm",
    value: function correctForm(number, suffix) {
      var keys = [2, 0, 1, 1, 1, 2];
      var mod = number % 100;
      var suffixKey = mod > 7 && mod < 20 ? 2 : keys[Math.min(mod % 10, 5)];
      return suffix[suffixKey];
    }
  }]);

  return Filter;
}();

/* harmony default export */ __webpack_exports__["default"] = (Filter); // module.exports = Filter;

/***/ }),

/***/ "./resources/js/classes/Notice.js":
/*!****************************************!*\
  !*** ./resources/js/classes/Notice.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Notice; });
/* harmony import */ var pnotify_dist_es_PNotify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pnotify/dist/es/PNotify */ "./node_modules/pnotify/dist/es/PNotify.js");
/* harmony import */ var pnotify_dist_es_PNotifyButtons_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pnotify/dist/es/PNotifyButtons.js */ "./node_modules/pnotify/dist/es/PNotifyButtons.js");
/* harmony import */ var pnotify_dist_es_PNotifyStyleMaterial_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pnotify/dist/es/PNotifyStyleMaterial.js */ "./node_modules/pnotify/dist/es/PNotifyStyleMaterial.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




pnotify_dist_es_PNotify__WEBPACK_IMPORTED_MODULE_0__["default"].defaults.styling = 'material';
pnotify_dist_es_PNotify__WEBPACK_IMPORTED_MODULE_0__["default"].defaults.icons = 'material';

var Notice =
/*#__PURE__*/
function () {
  function Notice() {
    _classCallCheck(this, Notice);

    this.notice = null;
    this.started = {
      text: 'Обработка...',
      icon: false,
      hide: false,
      shadow: false,
      width: '200px',
      modules: {
        Buttons: {
          closer: false,
          sticker: false
        }
      }
    };
    this.updated = {
      icon: true,
      hide: true,
      shadow: true,
      width: pnotify_dist_es_PNotify__WEBPACK_IMPORTED_MODULE_0__["default"].defaults.width,
      modules: {
        Buttons: {
          closer: true,
          sticker: true
        }
      }
    };
  }

  _createClass(Notice, [{
    key: "pnotify",
    value: function pnotify(type, data) {
      pnotify_dist_es_PNotify__WEBPACK_IMPORTED_MODULE_0__["default"][type](data);
    }
  }, {
    key: "start",
    value: function start() {
      this.notice = pnotify_dist_es_PNotify__WEBPACK_IMPORTED_MODULE_0__["default"].info(this.started);
    }
  }, {
    key: "error",
    value: function error(title, text) {
      if (title) this.updated.title = title;
      if (text) this.updated.text = text;
      this.updated.type = 'error';
      this.notice.update(this.updated);
    }
  }, {
    key: "success",
    value: function success(title, text) {
      if (title) this.updated.title = title;
      if (text) this.updated.text = text;
      this.updated.type = 'success';
      this.notice.update(this.updated);
    }
  }, {
    key: "info",
    value: function info(title, text) {
      if (title) this.updated.title = title;
      if (text) this.updated.text = text;
      this.updated.type = 'info';
      this.notice.update(this.updated);
    }
  }]);

  return Notice;
}();



/***/ }),

/***/ "./resources/js/classes/Trigger.js":
/*!*****************************************!*\
  !*** ./resources/js/classes/Trigger.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Trigger; });
/* harmony import */ var core_js_modules_es6_string_link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.string.link */ "./node_modules/core-js/modules/es6.string.link.js");
/* harmony import */ var core_js_modules_es6_string_link__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_string_link__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var pnotify_dist_es_PNotify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pnotify/dist/es/PNotify.js */ "./node_modules/pnotify/dist/es/PNotify.js");


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable */


var copyLink = function copyLink(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    return clipboardData.setData("Text", text);
  }

  if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      pnotify_dist_es_PNotify_js__WEBPACK_IMPORTED_MODULE_1__["default"].success({
        text: 'Ссылка скопирована!'
      });
      return;
    } catch (ex) {
      console.warn("Ошибка копирования ссылки:", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

var Trigger =
/*#__PURE__*/
function () {
  function Trigger(elem) {
    _classCallCheck(this, Trigger);

    this._elem = elem;
    elem.onclick = this.onClick.bind(this);
  }

  _createClass(Trigger, [{
    key: "updateCookieFilter",
    value: function updateCookieFilter(element) {
      if (element.classList.contains('active')) {
        document.cookie = 'filter--show=true; path=/; max-age=86400';
        return;
      }

      document.cookie = 'filter--show=false; path=/; max-age=86400';
    }
  }, {
    key: "toggleClassActive",
    value: function toggleClassActive(element) {
      if (element.classList.contains('active')) {
        element.classList.remove('active');
      } else {
        element.classList.add('active');
      }

      return element;
    }
  }, {
    key: "toggleHTMLDataAttribute",
    value: function toggleHTMLDataAttribute(element) {
      if (element.classList.contains('active')) {
        document.querySelector('html').setAttribute('data-active', element.id);
      } else {
        document.querySelector('html').removeAttribute('data-active', element.id);
      }
    }
  }, {
    key: "filterShow",
    value: function filterShow(element) {
      var target = this.toggleClassActive(element);
      this.toggleHTMLDataAttribute(target);
      this.updateCookieFilter(target);
    }
  }, {
    key: "filterClose",
    value: function filterClose(element) {
      element.classList.remove('active');
      document.querySelector('html').removeAttribute('data-active', element.id);
      this.updateCookieFilter(element);
    }
  }, {
    key: "pageMenuShow",
    value: function pageMenuShow(element) {
      element.classList.add('active');
      document.querySelector('html').setAttribute('data-active', element.id);
    }
  }, {
    key: "pageMenuClose",
    value: function pageMenuClose(element) {
      element.classList.remove('active');
      document.querySelector('html').removeAttribute('data-active', element.id);
    }
  }, {
    key: "userMenuToggle",
    value: function userMenuToggle(element) {
      this.toggleClassActive(element);
    }
  }, {
    key: "openSharerModal",
    value: function openSharerModal(element) {
      element.classList.add('overlay--visible');
      element.addEventListener('click', this.onSharerModalClick);
    }
  }, {
    key: "onSharerModalClick",
    value: function onSharerModalClick(event) {
      var eventTarget = event.target;
      var overlay = eventTarget.closest('.overlay');
      var close = eventTarget.closest("button[data-action='closeModal']");
      var copy = eventTarget.closest("button[data-action='copyLink']");

      if (eventTarget === overlay || close) {
        overlay.classList.remove('overlay--visible');
        overlay.removeEventListener('click', this.onSharerModalClick);
        return;
      }

      if (copy) {
        var link = copy.dataset.link;
        copyLink(link);
        return;
      }
    }
  }, {
    key: "triggerDefinition",
    value: function triggerDefinition(element) {
      var targetElem = element.dataset.target;
      var actionName = element.dataset.action;
      if (!targetElem && !actionName) return false;
      var target = document.querySelector(targetElem);
      if (!target) return false;
      return {
        element: target,
        action: actionName
      };
    }
  }, {
    key: "onClick",
    value: function onClick(event) {
      var eventTarget = event.target;
      var trigger = eventTarget.closest('.js-trigger');
      if (!trigger) return;
      var target = this.triggerDefinition(trigger);
      if (!target) return;
      var f = target.action;
      if (f) this[f](target.element);
    }
  }]);

  return Trigger;
}(); // module.exports = Trigger;




/***/ }),

/***/ "./resources/js/glide-init.js":
/*!************************************!*\
  !*** ./resources/js/glide-init.js ***!
  \************************************/
/*! exports provided: popularPostsSlider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "popularPostsSlider", function() { return popularPostsSlider; });
/* harmony import */ var _glidejs_glide__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @glidejs/glide */ "./node_modules/@glidejs/glide/dist/glide.esm.js");


var createGlidePopular = function createGlidePopular() {
  var glidePopularElement = document.querySelector('#glide-popular');

  if (glidePopularElement) {
    var glidePopularPosts = new _glidejs_glide__WEBPACK_IMPORTED_MODULE_0__["default"](glidePopularElement, {
      hoverpause: true,
      autoplay: 6000,
      animationDuration: 500,
      rewindDuration: 2000,
      perView: 1
    });
    return glidePopularPosts.mount();
  }
};

var popularPostsSlider = function popularPostsSlider() {
  document.addEventListener("DOMContentLoaded", createGlidePopular);
};

/***/ }),

/***/ "./resources/js/trigger-init.js":
/*!**************************************!*\
  !*** ./resources/js/trigger-init.js ***!
  \**************************************/
/*! exports provided: jsTriggerInit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jsTriggerInit", function() { return jsTriggerInit; });
/* harmony import */ var _classes_Trigger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/Trigger */ "./resources/js/classes/Trigger.js");
/* eslint-disable */


var createTriggerInstance = function createTriggerInstance() {
  return new _classes_Trigger__WEBPACK_IMPORTED_MODULE_0__["default"](document.body);
};

var jsTriggerInit = function jsTriggerInit() {
  document.addEventListener("DOMContentLoaded", createTriggerInstance);
};

/***/ }),

/***/ "./resources/sass/app.scss":
/*!*********************************!*\
  !*** ./resources/sass/app.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./resources/sass/lg/lightgallery.scss":
/*!*********************************************!*\
  !*** ./resources/sass/lg/lightgallery.scss ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!***************************************************************************************************!*\
  !*** multi ./resources/js/app.js ./resources/sass/app.scss ./resources/sass/lg/lightgallery.scss ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! e:\Node\owlcrafts\resources\js\app.js */"./resources/js/app.js");
__webpack_require__(/*! e:\Node\owlcrafts\resources\sass\app.scss */"./resources/sass/app.scss");
module.exports = __webpack_require__(/*! e:\Node\owlcrafts\resources\sass\lg\lightgallery.scss */"./resources/sass/lg/lightgallery.scss");


/***/ })

/******/ });