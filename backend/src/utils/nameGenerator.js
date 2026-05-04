const adjectives = [
  "Calm",
  "Silent",
  "Bright",
  "Kind",
  "Brave",
  "Curious",
  "Steady",
  "Wise",
  "Gentle",
  "Clear"
];

const nouns = [
  "River",
  "Hawk",
  "Meadow",
  "Harbor",
  "Summit",
  "Forest",
  "Spark",
  "Compass",
  "Lantern",
  "Bridge"
];

export function generateHumanName() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
}
