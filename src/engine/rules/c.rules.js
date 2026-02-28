export const cRules = [
  {
    id: "C_RETURN_LOCAL_ADDRESS",
    severity: "high",
    title: "Returning address of local variable",
    test(code) {
      return (
        /\w+\s*\*\s*\w+\s*\(.*\)\s*\{[\s\S]*\w+\s+\w+\s*\[.*\];[\s\S]*return\s+\w+;/.test(
          code
        )
      );
    },
    message:
      "Returning the address of a local variable leads to undefined behavior because the memory is deallocated after function returns.",
    suggestion:
      "Allocate memory dynamically using malloc or return data via function parameters.",
    confidence: 0.96
  },

  {
    id: "C_BUFFER_OVERFLOW",
    severity: "high",
    title: "Possible buffer overflow",
    test(code) {
      return /(gets\s*\(|scanf\s*\(\s*\"%s\"|strcpy\s*\()/.test(code);
    },
    message:
      "Unsafe functions can write beyond buffer bounds, causing memory corruption.",
    suggestion:
      "Use safer alternatives like fgets, snprintf, or strncpy.",
    confidence: 0.94
  },

  {
    id: "C_UNINITIALIZED_VARIABLE",
    severity: "high",
    title: "Use of uninitialized variable",
    test(code) {
      return /\b(int|float|double|char)\s+\w+\s*;\s*[\s\S]*\bprintf\b/.test(
        code
      );
    },
    message:
      "Using variables without initialization leads to unpredictable behavior.",
    suggestion:
      "Initialize variables when declaring them.",
    confidence: 0.9
  },

  {
    id: "C_NULL_POINTER_DEREFERENCE",
    severity: "high",
    title: "Possible null pointer dereference",
    test(code) {
      return /\*\s*\w+[\s\S]*=\s*NULL[\s\S]*\*\w+/.test(code);
    },
    message:
      "Dereferencing a NULL pointer results in a segmentation fault.",
    suggestion:
      "Always check if pointer is NULL before dereferencing.",
    confidence: 0.95
  },

  {
    id: "C_MEMORY_LEAK",
    severity: "medium",
    title: "Potential memory leak",
    test(code) {
      return /malloc\s*\(|calloc\s*\(/.test(code) && !/free\s*\(/.test(code);
    },
    message:
      "Dynamically allocated memory is not released, causing memory leaks.",
    suggestion:
      "Ensure free() is called for every allocated memory block.",
    confidence: 0.88
  },

  {
    id: "C_DOUBLE_FREE",
    severity: "high",
    title: "Double free detected",
    test(code) {
      return /free\s*\(\s*\w+\s*\)[\s\S]*free\s*\(\s*\w+\s*\)/.test(code);
    },
    message:
      "Freeing the same memory twice leads to undefined behavior.",
    suggestion:
      "Set pointer to NULL after freeing and avoid multiple frees.",
    confidence: 0.91
  },

  {
    id: "C_USE_AFTER_FREE",
    severity: "high",
    title: "Use after free",
    test(code) {
      return /free\s*\(\s*\w+\s*\)[\s\S]*\*\w+/.test(code);
    },
    message:
      "Accessing memory after it has been freed can crash the program.",
    suggestion:
      "Do not use memory after calling free().",
    confidence: 0.93
  },

  {
    id: "C_OFF_BY_ONE_LOOP",
    severity: "high",
    title: "Off-by-one error in loop",
    test(code) {
      return /for\s*\(.*<=\s*\w+\s*\)/.test(code);
    },
    message:
      "Loop condition allows one extra iteration, possibly accessing invalid memory.",
    suggestion:
      "Use < instead of <= in loop conditions.",
    confidence: 0.92
  },

  {
    id: "C_UNUSED_VARIABLE",
    severity: "low",
    title: "Unused variable",
    test(code) {
      return /\b(int|char|float|double)\s+\w+\s*;/.test(code);
    },
    message:
      "Declared variable is never used, which increases code clutter.",
    suggestion:
      "Remove unused variables or use them appropriately.",
    confidence: 0.6
  },

  {
    id: "C_PRINTF_FORMAT_MISMATCH",
    severity: "medium",
    title: "printf format specifier mismatch",
    test(code) {
      return /printf\s*\(\s*\".*%d.*\"\s*,\s*\w+\s*\)/.test(code);
    },
    message:
      "Format specifier may not match variable type, causing undefined output.",
    suggestion:
      "Ensure format specifiers correspond to variable data types.",
    confidence: 0.78
  },

  {
    id: "C_MISSING_RETURN",
    severity: "high",
    title: "Missing return statement",
    test(code) {
      return /int\s+\w+\s*\([^)]*\)\s*\{(?![\s\S]*return)/.test(code);
    },
    message:
      "Non-void function does not return a value in all execution paths.",
    suggestion:
      "Ensure a return statement exists for all control paths.",
    confidence: 0.9
  },

  {
    id: "C_NO_HEADER_STDIO",
    severity: "medium",
    title: "stdio.h not included",
    test(code) {
      return /printf\s*\(/.test(code) && !/#include\s*<stdio\.h>/.test(code);
    },
    message:
      "printf used without including stdio.h can cause compilation issues.",
    suggestion:
      "Include #include <stdio.h> at the top of the file.",
    confidence: 0.85
  },

  {
    id: "C_MAGIC_NUMBER",
    severity: "low",
    title: "Magic number detected",
    test(code) {
      return /\b\d{2,}\b/.test(code);
    },
    message:
      "Hard-coded numbers reduce readability and maintainability.",
    suggestion:
      "Replace magic numbers with named constants or macros.",
    confidence: 0.55
  }
];