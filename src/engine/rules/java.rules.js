// src/engine/rules/java.rules.js

export const javaRules = [
  {
    id: "JAVA_NULL_POINTER",
    severity: "high",
    title: "Possible NullPointerException",
    test(code) {
      return /null/.test(code) && /\.\w+\(/.test(code);
    },
    message:
      "A method or property is accessed on a potentially null reference.",
    suggestion:
      "Add null checks before dereferencing or use Optional to handle null values safely.",
    confidence: 0.93
  },

  {
    id: "JAVA_OFF_BY_ONE_LOOP",
    severity: "high",
    title: "Off-by-one error in loop condition",
    test(code) {
      return /for\s*\(.*<=\s*\w+\.size\(\)/.test(code);
    },
    message:
      "Loop condition uses <= size(), which can cause IndexOutOfBoundsException.",
    suggestion:
      "Change the condition to `< collection.size()`.",
    confidence: 0.94
  },

  {
    id: "JAVA_RAW_TYPE_USAGE",
    severity: "medium",
    title: "Raw type usage in generics",
    test(code) {
      return /List\s+\w+\s*=\s*new\s+ArrayList\s*\(/.test(code);
    },
    message:
      "Using raw types bypasses generic type checks and can lead to runtime errors.",
    suggestion:
      "Specify generic types, e.g., `List<String> list = new ArrayList<>();`",
    confidence: 0.88
  },

  {
    id: "JAVA_UNCLOSED_RESOURCE",
    severity: "high",
    title: "Resource not closed",
    test(code) {
      return (
        /(FileReader|BufferedReader|Scanner)\s+\w+\s*=\s*new/.test(code) &&
        !/try\s*\(/.test(code)
      );
    },
    message:
      "I/O resources should be closed to avoid resource leaks.",
    suggestion:
      "Use try-with-resources to ensure automatic resource management.",
    confidence: 0.92
  },

  {
    id: "JAVA_STRING_COMPARISON",
    severity: "high",
    title: "Incorrect String comparison",
    test(code) {
      return /"\w*"\s*==\s*\w+/.test(code);
    },
    message:
      "Strings compared using '==' check reference equality, not value equality.",
    suggestion:
      "Use `.equals()` method for string comparison.",
    confidence: 0.95
  },

  {
    id: "JAVA_MAGIC_NUMBER",
    severity: "low",
    title: "Magic number usage",
    test(code) {
      return /\b\d{2,}\b/.test(code);
    },
    message:
      "Hard-coded numeric literals reduce code readability and maintainability.",
    suggestion:
      "Replace magic numbers with named constants.",
    confidence: 0.6
  },

  {
    id: "JAVA_EMPTY_CATCH",
    severity: "medium",
    title: "Empty catch block",
    test(code) {
      return /catch\s*\(\s*\w+\s+\w+\s*\)\s*\{\s*\}/.test(code);
    },
    message:
      "Empty catch blocks swallow exceptions and make debugging difficult.",
    suggestion:
      "Log the exception or rethrow it after handling.",
    confidence: 0.85
  },

  {
    id: "JAVA_STATIC_ACCESS_VIA_INSTANCE",
    severity: "low",
    title: "Static member accessed via instance",
    test(code) {
      return /\w+\.\w+\s*\(/.test(code) && /static/.test(code);
    },
    message:
      "Static methods or fields should be accessed via the class name.",
    suggestion:
      "Access static members using the class name instead of an instance.",
    confidence: 0.7
  },

  {
    id: "JAVA_MISSING_OVERRIDE",
    severity: "low",
    title: "Missing @Override annotation",
    test(code) {
      return (
        /class\s+\w+\s+extends\s+\w+/.test(code) &&
        /void\s+\w+\(/.test(code) &&
        !/@Override/.test(code)
      );
    },
    message:
      "@Override annotation improves readability and catches method signature errors.",
    suggestion:
      "Add @Override annotation when overriding methods.",
    confidence: 0.65
  },

  {
    id: "JAVA_UNUSED_IMPORT",
    severity: "low",
    title: "Unused import detected",
    test(code) {
      return /import\s+[\w.]+;/.test(code) && !/new\s+\w+/.test(code);
    },
    message:
      "Unused imports increase clutter and reduce code clarity.",
    suggestion:
      "Remove unused import statements.",
    confidence: 0.7
  },

  {
    id: "JAVA_SYNCHRONIZED_ON_STRING",
    severity: "high",
    title: "Synchronization on String literal",
    test(code) {
      return /synchronized\s*\(\s*".*"\s*\)/.test(code);
    },
    message:
      "Synchronizing on String literals can lead to unexpected locking issues.",
    suggestion:
      "Synchronize on a private final Object instead.",
    confidence: 0.9
  },

  {
    id: "JAVA_PUBLIC_FIELD",
    severity: "medium",
    title: "Public field exposed",
    test(code) {
      return /public\s+\w+\s+\w+;/.test(code);
    },
    message:
      "Public fields break encapsulation and can lead to unstable code.",
    suggestion:
      "Make fields private and provide getters/setters if needed.",
    confidence: 0.82
  },

  {
    id: "JAVA_THREAD_SLEEP_IN_LOOP",
    severity: "medium",
    title: "Thread.sleep inside loop",
    test(code) {
      return /for\s*\(.*\)\s*\{[\s\S]*Thread\.sleep/.test(code);
    },
    message:
      "Calling Thread.sleep inside loops can degrade performance.",
    suggestion:
      "Consider using scheduled executors or better concurrency patterns.",
    confidence: 0.8
  },

  {
    id: "JAVA_BOOLEAN_LITERAL_COMPARISON",
    severity: "low",
    title: "Boolean literal comparison",
    test(code) {
      return /==\s*true|==\s*false/.test(code);
    },
    message:
      "Comparing directly with boolean literals is unnecessary.",
    suggestion:
      "Use the boolean expression directly or negate it if needed.",
    confidence: 0.75
  }
];