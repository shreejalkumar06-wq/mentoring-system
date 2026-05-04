export function clampScore(score) {
  const value = Number(score || 0);
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateLevelScore({
  codingScore = 0,
  quizScore = 0,
  projectScore = 0,
  skillMatchScore = 0
}) {
  return clampScore(
    0.35 * codingScore +
      0.25 * quizScore +
      0.25 * projectScore +
      0.15 * skillMatchScore
  );
}

export function getLevelLabel(levelScore) {
  if (levelScore >= 75) return "advanced";
  if (levelScore >= 45) return "intermediate";
  return "beginner";
}

export function calculateSkillOverlap(userSkills = [], requiredSkills = []) {
  const normalizedUserSkills = new Set(userSkills.map((skill) => skill.toLowerCase()));
  const normalizedRequiredSkills = requiredSkills.map((skill) => skill.toLowerCase());
  const matched = normalizedRequiredSkills.filter((skill) => normalizedUserSkills.has(skill));
  const missing = requiredSkills.filter((skill) => !normalizedUserSkills.has(skill.toLowerCase()));
  const percentage = normalizedRequiredSkills.length
    ? Math.round((matched.length / normalizedRequiredSkills.length) * 100)
    : 0;

  return {
    percentage,
    missingSkills: missing,
    matchedSkills: requiredSkills.filter((skill) => normalizedUserSkills.has(skill.toLowerCase()))
  };
}
