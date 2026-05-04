export const quizQuestions = {
  "frontend developer": [
    {
      id: "fe-q1",
      question: "Which React hook is best for memoizing an expensive derived value?",
      options: ["useEffect", "useMemo", "useRef", "useReducer"],
      correctAnswer: "useMemo"
    },
    {
      id: "fe-q2",
      question: "What does semantic HTML improve most directly?",
      options: ["Accessibility", "Bundle size", "Database speed", "JWT expiry"],
      correctAnswer: "Accessibility"
    },
    {
      id: "fe-q3",
      question: "Which CSS feature is designed for two-dimensional layout?",
      options: ["Flexbox", "Grid", "Float", "Position fixed"],
      correctAnswer: "Grid"
    }
  ],
  "backend developer": [
    {
      id: "be-q1",
      question: "Which HTTP status code is most appropriate after creating a resource?",
      options: ["200", "201", "204", "409"],
      correctAnswer: "201"
    },
    {
      id: "be-q2",
      question: "What does database indexing primarily optimize?",
      options: ["Reads", "Password hashing", "JWT signing", "CORS"],
      correctAnswer: "Reads"
    },
    {
      id: "be-q3",
      question: "Which pattern helps isolate business rules from route handlers?",
      options: ["Service layer", "Global variables", "Inline SQL only", "Console logging"],
      correctAnswer: "Service layer"
    }
  ],
  "data analyst": [
    {
      id: "da-q1",
      question: "Which SQL clause groups rows for aggregate calculations?",
      options: ["ORDER BY", "GROUP BY", "WHERE", "LIMIT"],
      correctAnswer: "GROUP BY"
    },
    {
      id: "da-q2",
      question: "What is the median resistant to?",
      options: ["Outliers", "Sorting", "Sampling", "Filtering"],
      correctAnswer: "Outliers"
    },
    {
      id: "da-q3",
      question: "Which chart is usually best for showing a trend over time?",
      options: ["Line chart", "Pie chart", "Treemap", "Gauge"],
      correctAnswer: "Line chart"
    }
  ]
};

export const codingProblems = {
  "frontend developer": [
    {
      id: "fe-c1",
      title: "Debounced Search",
      prompt: "Build a reusable debounced search input that calls an API after the user stops typing.",
      difficulty: "intermediate",
      skills: ["React", "JavaScript", "API"],
      functionName: "debounce",
      starterCode: "function debounce(fn, delay) {\n  // return a debounced version of fn\n}\nmodule.exports = debounce;",
      testCases: [
        {
          name: "exports a function",
          args: [],
          expectedType: "function"
        }
      ]
    }
  ],
  "backend developer": [
    {
      id: "be-c1",
      title: "Rate Limited API",
      prompt: "Implement an endpoint that limits repeated requests by user id and returns structured errors.",
      difficulty: "intermediate",
      skills: ["Node.js", "Express", "API"],
      functionName: "isAllowed",
      starterCode: "function isAllowed(requests, maxRequests) {\n  // return true when requests is below maxRequests\n}\nmodule.exports = isAllowed;",
      testCases: [
        { name: "allows below limit", args: [2, 3], expected: true },
        { name: "blocks at limit", args: [3, 3], expected: false }
      ]
    }
  ],
  "data analyst": [
    {
      id: "da-c1",
      title: "Sales Cohort Query",
      prompt: "Write a SQL query that groups monthly customer retention by signup cohort.",
      difficulty: "intermediate",
      skills: ["SQL", "Analytics", "PostgreSQL"],
      functionName: "containsCohortSql",
      starterCode: "-- submit a SQL query using date_trunc, group by, and count",
      testCases: [
        { name: "contains date_trunc", contains: "date_trunc" },
        { name: "contains group by", contains: "group by" },
        { name: "contains count", contains: "count" }
      ]
    }
  ]
};

export function normalizeCareer(career) {
  return String(career || "").trim().toLowerCase();
}
