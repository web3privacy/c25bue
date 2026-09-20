# c25bue

Public repository of the code for the 2025 Web3Privacy Now Congress held in Mumbai -  built with simple web-standard HTML and CSS

## CONTENTS

- [ ] /fonts/            =  folder that holds all the fonts used by the website
- [ ] /img/              =  folder that holds all images used by the website
- [ ] /data/             =  single source of truth for people and projects — see [PEOPLE DATABASE](#people-database)
- [ ] /backup/           =  retired JSON files, kept only as a rollback fallback — see [PEOPLE DATABASE](#people-database)
- [ ] /scripts/          =  one-off Node scripts (e.g. the people-data migration script)
- [ ] index.html         =  what-you-code-is-what-you-get HTML
- [ ] input.css          =  Tailwind entry point — imports Tailwind and `w3pevent.css`
- [ ] output.css         =  compiled Tailwind output (auto-generated, do not edit)
- [ ] w3pevent.css       =  custom CSS classes — edit this file for styling changes
- [ ] package.json       =  Node.js config with `dev` and `build` scripts for Tailwind
- [ ] .nvmrc             =  pinned Node.js version
- [ ] favion.png         =  website favicon (should be placed in main folder of hosting)

## TAILWIND CSS

The site uses [Tailwind CSS v4](https://tailwindcss.com/) with a build step that compiles `input.css` into `output.css`. The entry file (`input.css`) imports Tailwind and the custom stylesheet (`w3pevent.css`).

**Prerequisites:** Node.js (see `.nvmrc` for the recommended version)

```bash
npm install
```

**Development** (watches for changes and rebuilds automatically):

```bash
npm run dev
```

**Production build** (minified output):

```bash
npm run build
```

## PEOPLE DATABASE

All speakers, community members, and project/partner members are now driven from a **single source of truth**: `data/people.json`. This replaced three previously separate, manually-maintained lists (the "2026 Speakers" section on the homepage, `community/comminity.json`, and `projects/projects.json`'s inline member data) that used to drift out of sync with each other. Add a person once in `data/people.json` and they can appear correctly everywhere they're supposed to — no more copy-pasting the same person into multiple files.

### Files

- **`data/people.json`** — flat array of every person. This is what you edit to add/update someone.
- **`data/projects.json`** — array of projects/partner orgs. Each project references its members by `memberIds` (an array of person `id`s from `people.json`) instead of embedding full member data.
- **`backup/projects.json`** and **`backup/comminity.json`** — the old, retired data sources. Kept only as a rollback reference; the live site does **not** read them. Do not add new people here.
- **`scripts/migrate-people.mjs`** — the one-off script used to generate `data/people.json` and `data/projects.json` from the old `backup/*.json` files. You shouldn't need to run this again for day-to-day edits; it's kept for reference/rollback purposes.

### `data/people.json` fields

```json
{
  "id": "kurt-opsahl",
  "name": "KURT OPSAHL",
  "photo": "img/kurtopsahl2.jpg",
  "xUrl": "https://x.com/kurtopsahl",
  "tagline": "Former Deputy Executive Director and General Counsel of EFF",
  "role": "Associate General Counsel for Cybersecurity and Civil Liberties Policy",
  "orgName": "Filecoin",
  "orgUrl": "https://fil.org",
  "industries": ["Privacy", "Digital Rights"],
  "speaker2026": true,
  "speakerOrder": 0
}
```

| Field | Meaning |
|---|---|
| `id` | Stable, unique, kebab-case slug (e.g. `kurt-opsahl`). Referenced by `data/projects.json`'s `memberIds`. If two different people share the same name, give the second one a suffixed id (e.g. `wei-dai-2`). |
| `name` | Display name, as shown on cards. |
| `photo` | Path to the photo, **relative to the site root, with no leading `./` or `../`** (e.g. `img/kurtopsahl2.jpg`, not `./img/...` or `../img/...`). Each page prefixes it correctly at render time. |
| `xUrl` | Link to the person's profile (X/Twitter, LinkedIn, etc.). Leave as `""` if unknown — the card will render without a link instead of a broken one. |
| `tagline` | Short one-line description shown under the name. |
| `role` | Their role/title (e.g. "Founder", "Research Partner"). |
| `orgName` / `orgUrl` | Their organization's name and website. |
| `industries` | Array of category tags (e.g. `["Privacy", "Cryptography"]`) — powers the filter pills on `/community/`. Defaults to `["Privacy"]` if you leave it as `[]`. |
| `speaker2026` | Set to `true` to make this person appear in the homepage's "2026 Speakers" section. |
| `speakerOrder` | A number controlling their position in the "2026 Speakers" grid (lower = earlier). Only matters when `speaker2026` is `true`. |

### Common tasks

**Add a new speaker to the homepage:** add a new object to `data/people.json` with `speaker2026: true` and a `speakerOrder` (e.g. one higher than the current max). They'll automatically show up on the homepage, and also in `/community/` and the homepage's community carousel — no HTML editing required.

**Add someone to a project/partner card on `/projects/`:** make sure they exist in `data/people.json` (add them if not), then add their `id` to that project's `memberIds` array in `data/projects.json`.

**Update someone's photo, title, or link:** edit their single entry in `data/people.json` — the change applies everywhere they're shown.

**Remove someone from the "2026 Speakers" section without deleting them entirely:** set `speaker2026: false` (or remove the field) instead of deleting their `people.json` entry, so they're still available for `/community/` and any project they belong to.

### How each page loads this data

- Homepage "2026 Speakers" section and the "Join the Community" carousel: `fetch('./data/people.json')`, rendered by `initSpeakers2026()` / `initCommunityCarousel()` in `index.html`.
- `/community/index.html`: `fetch('../data/people.json')`.
- `/projects/index.html`: `fetch('../data/projects.json')` + `fetch('../data/people.json')`, then resolves each project's `memberIds` against the loaded people list.

## COMMENTS

- This repository is automatically deployed on Github Pages 
- The website has a unique subdomain: [c25bue.web3privacy.info](https://c25bue.web3privacy.info/)
- [congress.web3privacy.info](https://congress.web3privacy.info/) redirects to this deployment
 
## LICENSE

All HTML is licensed [Creative Commons Zero v1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

The CSS used leverages TailwindCSS which is licensed under [MIT](https://github.com/tailwindlabs/tailwindcss/blob/next/LICENSE)

Please note that even though the code is open-sourced - the names, content, and images within may well have their own licenses from their respective owners.
