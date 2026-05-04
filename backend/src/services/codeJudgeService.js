import vm from "node:vm";
import { codingProblems, normalizeCareer } from "../data/questions.js";
import { ApiError } from "../utils/errors.js";

function gradeSqlSubmission(code, testCases) {
  const normalized = String(code || "").toLowerCase();
  const results = testCases.map((testCase) => ({
    name: testCase.name,
    passed: normalized.includes(testCase.contains)
  }));
  const passed = results.filter((result) => result.passed).length;
  return {
    score: testCases.length ? Math.round((passed / testCases.length) * 100) : 0,
    passed,
    total: testCases.length,
    results
  };
}

function gradeJavaScriptSubmission(code, testCases) {
  const sandbox = {
    module: { exports: {} },
    exports: {}
  };

  vm.createContext(sandbox);
  vm.runInContext(String(code || ""), sandbox, { timeout: 750 });
  const exported = sandbox.module.exports;

  const results = testCases.map((testCase) => {
    try {
      if (testCase.expectedType) {
        return {
          name: testCase.name,
          passed: typeof exported === testCase.expectedType
        };
      }

      const actual = exported(...testCase.args);
      return {
        name: testCase.name,
        passed: Object.is(actual, testCase.expected),
        expected: testCase.expected,
        actual
      };
    } catch (error) {
      return {
        name: testCase.name,
        passed: false,
        error: error.message
      };
    }
  });

  const passed = results.filter((result) => result.passed).length;
  return {
    score: testCases.length ? Math.round((passed / testCases.length) * 100) : 0,
    passed,
    total: testCases.length,
    results
  };
}

export function judgeCodingSubmission({ career, problemId, code }) {
  const problem = (codingProblems[normalizeCareer(career)] || []).find((item) => item.id === problemId);
  if (!problem) throw new ApiError(404, "Coding problem not found");

  if (problem.skills?.includes("SQL")) {
    return gradeSqlSubmission(code, problem.testCases || []);
  }

  return gradeJavaScriptSubmission(code, problem.testCases || []);
}
