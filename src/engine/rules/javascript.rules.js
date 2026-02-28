// src/engine/rules/javascript.rules.js

export const javascriptRules = [
  {
    id: "JS_ASYNC_AWAIT_MISSING",
    severity: "high",
    title: "Missing await for async operation",
    test(code) {
      return (
        /async\s+function/.test(code) &&
        /fetch\(/.test(code) &&
        /\.json\(\)/.test(code) &&
        !/await\s+.*\.json\(\)/.test(code)
      );
    },
    message:
      "An async function calls response.json() without using await, which returns a Promise instead of actual data.",
    suggestion:
      "Use `const data = await response.json()` to properly resolve the Promise.",
    confidence: 0.92
  },

  {
    id: "JS_PROMISE_NOT_AWAITED",
    severity: "high",
    title: "Promise used without await",
    test(code) {
      return (
        /async\s*\(/.test(code) &&
        /const\s+\w+\s*=\s*\w+\(/.test(code) &&
        /console\.log\(\w+\.\w+\)/.test(code) &&
        !/await\s+\w+\(/.test(code)
      );
    },
    message:
      "A Promise-returning function is used without await, causing undefined or unexpected values.",
    suggestion:
      "Await the function call or handle the Promise using `.then()`.",
    confidence: 0.9
  },

  {
    id: "JS_UNDEFINED_VARIABLE",
    severity: "medium",
    title: "Undefined variable usage",
    test(code) {
      return (
        /catch\s*\(\s*\w+\s*\)/.test(code) &&
        /console\.log\(\s*error\s*\)/.test(code) &&
        !/catch\s*\(\s*error\s*\)/.test(code)
      );
    },
    message:
      "The variable `error` is referenced but not defined in the catch block.",
    suggestion:
      "Ensure the catch parameter matches the variable used inside the block.",
    confidence: 0.88
  },

  {
    id: "JS_CONSOLE_IN_PRODUCTION",
    severity: "low",
    title: "Console statements in production code",
    test(code) {
      return /console\.(log|warn|error)\(/.test(code);
    },
    message:
      "Console statements should be removed or replaced with a logging system in production.",
    suggestion:
      "Remove console statements or guard them behind a debug flag.",
    confidence: 0.7
  },

  {
    id: "JS_VAR_USAGE",
    severity: "medium",
    title: "Usage of var instead of let/const",
    test(code) {
      return /\bvar\s+\w+/.test(code);
    },
    message:
      "`var` has function scope and can lead to bugs due to hoisting.",
    suggestion:
      "Replace `var` with `let` or `const` depending on mutability.",
    confidence: 0.85
  },

  {
    id: "JS_LOOSE_EQUALITY",
    severity: "medium",
    title: "Loose equality comparison",
    test(code) {
      return /[^=!]==[^=]/.test(code);
    },
    message:
      "Loose equality (==) can cause unexpected type coercion.",
    suggestion:
      "Use strict equality (===) to avoid implicit type conversion.",
    confidence: 0.87
  },

  {
    id: "JS_MUTABLE_CONST_OBJECT",
    severity: "low",
    title: "Mutating const object or array",
    test(code) {
      return (
        /const\s+\w+\s*=\s*\{/.test(code) &&
        /\w+\.\w+\s*=/.test(code)
      );
    },
    message:
      "Objects declared with const can still be mutated, which may be misleading.",
    suggestion:
      "Avoid mutating const objects or use Object.freeze() if immutability is required.",
    confidence: 0.65
  },

  {
    id: "JS_FOR_LOOP_OFF_BY_ONE",
    severity: "high",
    title: "Possible off-by-one error in loop",
    test(code) {
      return /for\s*\(.*<=\s*\w+\.length/.test(code);
    },
    message:
      "Loop condition uses <= length, which can access out-of-bounds index.",
    suggestion:
      "Change condition to `< array.length`.",
    confidence: 0.93
  },

  {
    id: "JS_ARROW_RETURN_MISSING",
    severity: "medium",
    title: "Missing return in arrow function",
    test(code) {
      return (
        /\(\s*\)\s*=>\s*\{[^}]*\}/.test(code) &&
        !/return\s+/.test(code)
      );
    },
    message:
      "Arrow function with a block body does not explicitly return a value.",
    suggestion:
      "Add a return statement or use implicit return syntax.",
    confidence: 0.78
  },

  {
    id: "JS_UNUSED_VARIABLE",
    severity: "low",
    title: "Unused variable detected",
    test(code) {
      return (
        /(const|let)\s+(\w+)\s*=/.test(code) &&
        !new RegExp("\\b" + RegExp.$2 + "\\b", "g").test(code.replace(RegExp.$2, ""))
      );
    },
    message:
      "A variable is declared but never used, increasing code noise.",
    suggestion:
      "Remove the unused variable or use it where necessary.",
    confidence: 0.72
  },

  {
    id: "JS_SHADOWED_VARIABLE",
    severity: "medium",
    title: "Variable shadowing detected",
    test(code) {
      return (
        /(let|const)\s+(\w+)/.test(code) &&
        new RegExp(`function\\s+\\w*\\([^)]*${RegExp.$2}[^)]*\\)`).test(code)
      );
    },
    message:
      "A variable name is reused in an inner scope, which can cause confusion.",
    suggestion:
      "Rename inner variables to avoid shadowing outer scope variables.",
    confidence: 0.8
  },

  {
    id: "JS_NO_STRICT_MODE",
    severity: "low",
    title: "Strict mode not enabled",
    test(code) {
      return !/["']use strict["']/.test(code);
    },
    message:
      "Strict mode helps catch common bugs and unsafe actions.",
    suggestion:
      "Add `'use strict';` at the top of the file or module.",
    confidence: 0.6
  },

  {
    id: "JS_FUNCTION_TOO_LARGE",
    severity: "medium",
    title: "Function is too long",
    test(code) {
      return /function\s+\w+\s*\([^)]*\)\s*\{[\s\S]{400,}\}/.test(code);
    },
    message:
      "Large functions reduce readability and maintainability.",
    suggestion:
      "Break the function into smaller, reusable functions.",
    confidence: 0.82
  },

  {
    id: "JS_DIRECT_DOM_MANIPULATION",
    severity: "medium",
    title: "Direct DOM manipulation detected",
    test(code) {
      return /document\.getElementById|document\.querySelector/.test(code);
    },
    message:
      "Direct DOM manipulation can conflict with modern frameworks and state-driven UI.",
    suggestion:
      "Use framework state or refs instead of direct DOM access.",
    confidence: 0.75
  }
];