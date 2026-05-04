import assert from "node:assert/strict";

process.env.SUPABASE_URL = "https://example.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.JWT_SECRET = "test-secret";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

const { calculateLevelScore, calculateSkillOverlap, getLevelLabel } = await import("../src/utils/scoring.js");
const { judgeCodingSubmission } = await import("../src/services/codeJudgeService.js");
const { createApp } = await import("../src/app.js");

test("calculates weighted level score", () => {
  const score = calculateLevelScore({
    codingScore: 80,
    quizScore: 60,
    projectScore: 70,
    skillMatchScore: 50
  });

  assert.equal(score, 68);
});

test("calculates skill overlap and missing skills", () => {
  const result = calculateSkillOverlap(["React", "JavaScript"], ["React", "CSS", "JavaScript", "Testing"]);

  assert.equal(result.percentage, 50);
  assert.deepEqual(result.missingSkills, ["CSS", "Testing"]);
  assert.deepEqual(result.matchedSkills, ["React", "JavaScript"]);
});

test("returns level labels", () => {
  assert.equal(getLevelLabel(20), "beginner");
  assert.equal(getLevelLabel(50), "intermediate");
  assert.equal(getLevelLabel(90), "advanced");
});

test("grades JavaScript coding submissions", () => {
  const result = judgeCodingSubmission({
    career: "Backend Developer",
    problemId: "be-c1",
    code: "function isAllowed(requests, maxRequests) { return requests < maxRequests; } module.exports = isAllowed;"
  });

  assert.equal(result.score, 100);
  assert.equal(result.passed, 2);
});

test("grades SQL submissions by expected query features", () => {
  const result = judgeCodingSubmission({
    career: "Data Analyst",
    problemId: "da-c1",
    code: "select date_trunc('month', created_at), count(*) from users group by 1"
  });

  assert.equal(result.score, 100);
});

test("health endpoint returns JSON", async () => {
  const app = createApp();
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

for (const item of tests) {
  await item.fn();
  console.log(`ok - ${item.name}`);
}

console.log(`${tests.length} tests passed`);
