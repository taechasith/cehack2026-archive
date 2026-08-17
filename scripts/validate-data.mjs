import { readFile } from "node:fs/promises";

const raw = await readFile(new URL("../data/projects.json", import.meta.url), "utf8");
const catalog = JSON.parse(raw);
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(catalog.schema_version === "1.0.0", "schema_version must be 1.0.0");
assert(Array.isArray(catalog.projects), "projects must be an array");
assert(catalog.projects.length === 26, "catalog must contain 26 project records");

const ids = new Set();
for (const [index, project] of catalog.projects.entries()) {
  const context = `projects[${index}]`;
  assert(/^CEHACK-2026-\d{3}$/.test(project.submission_id), `${context}: invalid submission_id`);
  assert(!ids.has(project.submission_id), `${context}: duplicate submission_id ${project.submission_id}`);
  ids.add(project.submission_id);
  assert(typeof project.project_name === "string" && project.project_name.trim(), `${context}: missing project_name`);
  assert(typeof project.team === "string" && project.team.trim(), `${context}: missing team`);
  assert(typeof project.summary === "string" && project.summary.trim(), `${context}: missing summary`);
  assert(Array.isArray(project.credits) && project.credits.length > 0, `${context}: credits must not be empty`);
  assert(project.links && Array.isArray(project.links.source) && Array.isArray(project.links.demo), `${context}: invalid links object`);

  const urls = [
    ...project.links.source.flatMap((source) => [source.submitted_url, source.canonical_url]),
    ...project.links.demo.map((demo) => demo.url),
    project.links.pitch
  ].filter((value) => typeof value === "string" && value.startsWith("http"));

  for (const value of urls) {
    try {
      const parsed = new URL(value);
      assert(parsed.protocol === "https:", `${context}: non-HTTPS URL ${value}`);
    } catch {
      errors.push(`${context}: malformed URL ${value}`);
    }
  }
}

if (errors.length) {
  console.error(`Archive validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const verified = catalog.projects.flatMap((project) => project.links.source)
  .filter((source) => source.status.startsWith("verified_public"));
const uniqueVerified = new Set(verified.map((source) => source.canonical_url));
const pitches = catalog.projects.filter((project) => project.links.pitch).length;

console.log(`Archive valid: ${catalog.projects.length} submissions, ${uniqueVerified.size} unique verified repositories, ${pitches} pitch links.`);
