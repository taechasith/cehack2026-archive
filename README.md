# 67HACK 2026 Open Source Archive

> The community-built project archive for **CREATIVE data ENGINEERING HACKATHON 2026 (EP: 67HACK: THE MEME Engineering for Next Generation Learners)**.

[![Archive](https://img.shields.io/badge/status-archived-101828?style=flat-square)](./data/projects.json)
[![Projects](https://img.shields.io/badge/submissions-26-CCFF00?style=flat-square&labelColor=101828)](./data/projects.json)
[![Event](https://img.shields.io/badge/event-15%E2%80%9316%20Aug%202026-FF4F9A?style=flat-square)](https://contester.life/contest/creative-data-engineering-hackathon-2026)
[![Data](https://img.shields.io/badge/catalog-JSON-7C3AED?style=flat-square)](./data/projects.json)

This repository preserves the projects, ideas, contributor credits, learning reflections, mentor acknowledgements, source links, live demos, and pitch materials submitted at 67HACK. It is an index and historical record, not a transfer of ownership of participant work.

## Event

| Field | Details |
| --- | --- |
| Official name | CREATIVE data ENGINEERING HACKATHON 2026 |
| Episode | 67HACK: THE MEME Engineering for Next Generation Learners |
| Hack Day / Pitch Day | 15–16 August 2026 |
| Format | Online |
| Organizers | Faculty of Engineering, University of the Thai Chamber of Commerce (UTCC) × CIA CreativeLab |
| In partnership with | Adam's House |
| Official event page | [contester.life](https://contester.life/contest/creative-data-engineering-hackathon-2026) |

67HACK invited young creators to explore how meme culture, data, design, and technology can help communicate difficult ideas, surface learner insights, and address challenges in educational environments.

## Explore the archive

- Open [the searchable project gallery](./index.html).
- Browse the [machine-readable catalog](./data/projects.json).
- Use Search, Source status, and Link type filters to find a submission.

Current snapshot:

- 26 submitted project records
- 20 verified source records across 19 submissions, representing 19 unique GitHub repositories
- 2 submitted GitHub links unavailable during verification
- 25 pitch-material links
- Email addresses and form timestamps intentionally excluded

## Data model

Every record has a stable `submission_id`, submitted team name, project name, summary, contributor credits, learning reflection, mentor note, and grouped links. Link status is explicit so the archive does not silently present an inaccessible URL as verified.

The source of truth for this snapshot is the event's [project submission spreadsheet](https://docs.google.com/spreadsheets/d/1Et4_oDxy_xerXzvliYzKSD6KZTfNdciDJZF0IX91WJI/edit). Text has been lightly normalized for readability while preserving meaning. Project names may be derived from the submitted repository name or project summary when the form did not provide a separate title.

## Repository structure

| Path | Purpose |
| --- | --- |
| `index.html` | Searchable archive interface |
| `assets/` | Frontend styles and behavior |
| `data/projects.json` | Versioned project catalog |
| `scripts/validate-data.mjs` | Schema and link validation |
| `.github/workflows/validate.yml` | Continuous data-quality check |

## Run locally

Any static HTTP server works. For example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

Validate the catalog with:

```bash
npm test
```

## Corrections and additions

Project authors can open an issue or pull request to correct names, roles, links, or descriptions. Please include the affected `submission_id` and enough evidence to verify the requested change. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Credits and ownership

All project concepts, source code, designs, media, and pitch materials remain credited to and owned by their respective teams and authors. Each linked project is governed by the license, terms, and attribution in its own repository or platform.

The archive curation and interface are maintained by [TaechaSith](https://github.com/taechasith) for CIA CreativeLab. Event credit belongs to the organizers and partner listed above. Mentor acknowledgements are reproduced from team submissions and should not be interpreted as authorship of participant work.

## License

The archive interface and original curation are available under the terms in [LICENSE.md](./LICENSE.md). That license does **not** relicense any linked participant project, pitch deck, third-party asset, trademark, or event identity.

---

Built to keep what happened at 67HACK discoverable, attributable, and useful after the final pitch.
