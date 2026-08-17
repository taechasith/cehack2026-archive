const state = { projects: [], query: "", source: "all" };

const elements = {
  grid: document.querySelector("#project-grid"),
  template: document.querySelector("#project-card-template"),
  search: document.querySelector("#search"),
  source: document.querySelector("#source-filter"),
  reset: document.querySelector("#reset"),
  resultCount: document.querySelector("#result-count"),
  activeQuery: document.querySelector("#active-query"),
  empty: document.querySelector("#empty-state")
};

function sourceState(project) {
  const sources = project.links.source ?? [];
  const statuses = sources.map((item) => item.status);
  if (statuses.some((status) => status.startsWith("verified_public"))) return "verified";
  if (statuses.some((status) => status.includes("unavailable") || status.includes("no_public_url"))) return "unavailable";
  if ((project.links.demo ?? []).length > 0) return "external";
  return "none";
}

function searchText(project) {
  return [
    project.submission_id,
    project.project_name,
    project.team,
    project.summary,
    project.learnings,
    project.mentor_notes,
    ...(project.credits ?? [])
  ].filter(Boolean).join(" ").toLocaleLowerCase("th");
}

function link(label, url) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.textContent = `${label} ↗`;
  return anchor;
}

function renderCard(project) {
  const fragment = elements.template.content.cloneNode(true);
  const card = fragment.querySelector(".project-card");
  const badge = fragment.querySelector(".source-badge");
  const status = sourceState(project);

  fragment.querySelector(".project-id").textContent = project.submission_id;
  fragment.querySelector(".project-name").textContent = project.project_name;
  fragment.querySelector(".team-name").textContent = `TEAM / ${project.team}`;
  fragment.querySelector(".project-summary").textContent = project.summary;

  const labels = {
    verified: "source verified",
    external: "external demo",
    unavailable: "source unavailable",
    none: "no public source"
  };
  badge.textContent = labels[status];
  badge.classList.add(status);
  card.dataset.source = status;

  const credits = fragment.querySelector(".credits-list");
  for (const credit of project.credits ?? []) {
    const item = document.createElement("li");
    item.textContent = credit;
    credits.append(item);
  }

  const links = fragment.querySelector(".card-links");
  for (const source of project.links.source ?? []) {
    const url = source.canonical_url ?? (source.submitted_url?.startsWith("http") ? source.submitted_url : null);
    if (url) links.append(link("Source", url));
  }
  for (const demo of project.links.demo ?? []) links.append(link("Demo", demo.url));
  if (project.links.pitch) links.append(link("Pitch", project.links.pitch));

  return fragment;
}

function filteredProjects() {
  const normalized = state.query.trim().toLocaleLowerCase("th");
  return state.projects.filter((project) => {
    const matchesQuery = !normalized || searchText(project).includes(normalized);
    const matchesSource = state.source === "all" || sourceState(project) === state.source;
    return matchesQuery && matchesSource;
  });
}

function render() {
  const projects = filteredProjects();
  elements.grid.replaceChildren(...projects.map(renderCard));
  elements.resultCount.textContent = `${projects.length} ${projects.length === 1 ? "project" : "projects"}`;
  elements.activeQuery.textContent = state.query ? `query: “${state.query}”` : "";
  elements.empty.hidden = projects.length !== 0;
}

function updateMetrics(projects) {
  const repos = projects.flatMap((project) => project.links.source ?? [])
    .filter((source) => source.status.startsWith("verified_public"));
  const uniqueRepos = new Set(repos.map((source) => source.canonical_url));
  const pitches = projects.filter((project) => Boolean(project.links.pitch));
  document.querySelector("#metric-projects").textContent = projects.length;
  document.querySelector("#metric-repos").textContent = uniqueRepos.size;
  document.querySelector("#metric-pitches").textContent = pitches.length;
}

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

elements.source.addEventListener("change", (event) => {
  state.source = event.target.value;
  render();
});

elements.reset.addEventListener("click", () => {
  state.query = "";
  state.source = "all";
  elements.search.value = "";
  elements.source.value = "all";
  render();
  elements.search.focus();
});

try {
  const response = await fetch("./data/projects.json");
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
  const catalog = await response.json();
  state.projects = catalog.projects;
  updateMetrics(state.projects);
  render();
} catch (error) {
  elements.grid.innerHTML = `<div class="empty-state"><strong>Archive data could not be loaded.</strong><p>${error.message}</p></div>`;
  console.error(error);
}
