// src/engine/rules/python.rules.js

export const pythonRules = [
  {
    id: "PY_DIVIDE_BY_ZERO",
    severity: "high",
    title: "Possible division by zero",
    test(code) {
      return (
        /\/\s*0/.test(code) ||
        /ZeroDivisionError/.test(code)
      );
    },
    message:
      "Division by zero can raise a ZeroDivisionError and crash the program.",
    suggestion:
      "Validate the divisor before division or handle ZeroDivisionError explicitly.",
    confidence: 0.94
  },

  {
    id: "PY_BARE_EXCEPT",
    severity: "high",
    title: "Bare except clause",
    test(code) {
      return /except\s*:/.test(code);
    },
    message:
      "Bare except catches all exceptions, including system-exiting ones.",
    suggestion:
      "Catch specific exceptions like `except ValueError:` or `except Exception:`.",
    confidence: 0.91
  },

  {
    id: "PY_TYPE_ERROR_STRING_INT",
    severity: "medium",
    title: "String and number concatenation",
    test(code) {
      return /print\s*\(.*".*"\s*\+\s*\w+.*\)/.test(code);
    },
    message:
      "Concatenating strings with numbers without conversion causes TypeError.",
    suggestion:
      "Use f-strings or explicitly convert numbers to strings.",
    confidence: 0.88
  },

  {
    id: "PY_INDEX_OUT_OF_RANGE",
    severity: "high",
    title: "Possible index out of range",
    test(code) {
      return (
        /range\s*\(\s*len\(\w+\)\s*\)/.test(code) &&
        /\[\s*\w+\s*\+\s*1\s*\]/.test(code)
      );
    },
    message:
      "Indexing beyond list length can raise IndexError.",
    suggestion:
      "Adjust loop bounds or check index before accessing the list.",
    confidence: 0.93
  },

  {
    id: "PY_UNUSED_VARIABLE",
    severity: "low",
    title: "Unused variable",
    test(code) {
      return /(\w+)\s*=\s*.+/.test(code) &&
        !new RegExp("\\b" + RegExp.$1 + "\\b", "g").test(
          code.replace(RegExp.$1, "")
        );
    },
    message:
      "A variable is assigned but never used.",
    suggestion:
      "Remove unused variables or use them where intended.",
    confidence: 0.6
  },

  {
    id: "PY_MUTABLE_DEFAULT_ARG",
    severity: "high",
    title: "Mutable default argument",
    test(code) {
      return /def\s+\w+\(.*=\s*(\[\]|\{\})\)/.test(code);
    },
    message:
      "Mutable default arguments persist across function calls.",
    suggestion:
      "Use None as default and initialize inside the function.",
    confidence: 0.95
  },

  {
    id: "PY_GLOBAL_USAGE",
    severity: "medium",
    title: "Use of global keyword",
    test(code) {
      return /\bglobal\s+\w+/.test(code);
    },
    message:
      "Using global variables makes code harder to debug and test.",
    suggestion:
      "Refactor to pass variables as function parameters.",
    confidence: 0.72
  },

  {
    id: "PY_SHADOW_BUILTIN",
    severity: "medium",
    title: "Shadowing built-in name",
    test(code) {
      return /\b(list|dict|str|int|set|tuple|len|id)\s*=/.test(code);
    },
    message:
      "Overwriting built-in names can lead to unexpected behavior.",
    suggestion:
      "Rename the variable to avoid shadowing Python built-ins.",
    confidence: 0.86
  },

  {
    id: "PY_MISSING_RETURN",
    severity: "low",
    title: "Function may return None implicitly",
    test(code) {
      return (
        /def\s+\w+\(.*\):/.test(code) &&
        !/return\s+/.test(code)
      );
    },
    message:
      "Function does not explicitly return a value and may return None.",
    suggestion:
      "Add a return statement if a value is expected.",
    confidence: 0.67
  },

  {
    id: "PY_UNUSED_IMPORT",
    severity: "low",
    title: "Unused import detected",
    test(code) {
      return /import\s+\w+/.test(code) &&
        !new RegExp("\\b" + RegExp.$1 + "\\b", "g").test(
          code.replace(RegExp.$1, "")
        );
    },
    message:
      "Imported module is never used in the code.",
    suggestion:
      "Remove unused imports to keep the code clean.",
    confidence: 0.7
  },

  {
    id: "PY_INFINITE_LOOP",
    severity: "high",
    title: "Possible infinite loop",
    test(code) {
      return /while\s+True\s*:/.test(code) && !/break/.test(code);
    },
    message:
      "Infinite loop detected without a break condition.",
    suggestion:
      "Add a break condition or loop termination logic.",
    confidence: 0.9
  },

  {
    id: "PY_BLOCKING_INPUT",
    severity: "medium",
    title: "Blocking input call",
    test(code) {
      return /\binput\s*\(/.test(code);
    },
    message:
      "Blocking input calls can hang execution in non-interactive environments.",
    suggestion:
      "Avoid input() in production code or mock it during testing.",
    confidence: 0.75
  },

  {
    id: "PY_COMPARISON_CHAIN_ERROR",
    severity: "medium",
    title: "Incorrect chained comparison",
    test(code) {
      return /\w+\s*==\s*\w+\s*==\s*\w+/.test(code);
    },
    message:
      "Chained comparisons may not behave as expected.",
    suggestion:
      "Split into separate comparisons using logical operators.",
    confidence: 0.8
  }
];