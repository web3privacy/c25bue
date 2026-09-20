// One-off migration: builds data/people.json and data/projects.json from the
// retired backup/projects.json and backup/comminity.json sources, plus 12
// speakers hand-entered below that exist only as static HTML cards in
// index.html's "2026 Speakers" section (never added to either JSON source).
//
// Run: node scripts/migrate-people.mjs
// Safe to re-run: it only reads the backup files and (over)writes data/*.json.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const projectsOld = JSON.parse(readFileSync(join(ROOT, 'backup/projects.json'), 'utf8'));
const communityOld = JSON.parse(readFileSync(join(ROOT, 'backup/comminity.json'), 'utf8'));

// The 12 speakers present as static HTML cards in index.html's "2026 Speakers"
// section but absent from both projects.json and comminity.json. Extracted
// verbatim by hand (no HTML parsing) from index.html, in their original
// on-page order, continuing the 0-based speakerOrder sequence after the 33
// speakers that DO match an existing projects.json/comminity.json entry.
const handEnteredSpeakers = [
  { name: 'AURYN MCMILLAN', photo: 'img/auryn.png', xUrl: 'https://x.com/auryn_macmillan', tagline: 'Confidential computing visionary', role: 'Co-founder', orgName: 'Enclave', orgUrl: 'https://enclave.gg' },
  { name: 'Prasanth Sugathan', photo: 'img/prasanth-sugathan.jpeg', xUrl: 'https://x.com/PrasanthTweets', tagline: 'two decades of work focused on data protection law, critical technology law', role: 'Legal Director', orgName: 'Software Freedom Law Center', orgUrl: 'https://www.linkedin.com/in/prasanthsugathan/' },
  { name: 'RIDDHIMA SHARMA', photo: 'img/riddhima.jpeg', xUrl: 'https://www.linkedin.com/in/riddhimasharma/', tagline: 'Gender and Technology Researcher and Educator', role: 'Knowledge Specialist', orgName: 'Point Of View', orgUrl: 'https://pointofview.org' },
  { name: 'VINAY NARAYAN', photo: 'img/vinaj.jpeg', xUrl: 'https://www.linkedin.com/in/vinay-narayan16/', tagline: 'Focused on turning digital infrastructures into equitable governance frameworks', role: 'Associate Director', orgName: 'AAPTI Institute', orgUrl: 'https://aapti.in/' },
  { name: 'Kunāl Majumder', photo: 'img/kunal-majumder.jpeg', xUrl: 'https://www.linkedin.com/in/kunalmajumder/', tagline: 'Committee to Protect Journalists', role: 'Asia-Pacific Program Coordinator', orgName: 'Committee to Protect Journalists', orgUrl: 'https://cpj.org' },
  { name: 'SUSHIMITA', photo: 'img/sushmita.jpg', xUrl: 'https://x.com/Sushmitav1', tagline: 'an international award-winning journalist & researcher', role: 'Independent', orgName: "fellow Pulitzer Center, Society of Environmental journalists' and Uproot Project's", orgUrl: 'https://linktr.ee/sushmitaw' },
  { name: 'SAM DE SILVA', photo: 'img/sam-de-silva.jpeg', xUrl: 'https://www.linkedin.com/in/samdesilva/', tagline: 'Independent digital rights consultant (Session, CommonEdge Asia, ex-Luminate)', role: 'Lead', orgName: 'Independent', orgUrl: 'https://www.linkedin.com/in/samdesilva/' },
  { name: 'DEVANSH MEHTA', photo: 'img/devansh-mehta.jpg', xUrl: 'https://x.com/devanshmehta', tagline: 'Deep Public Goods Funding expert', role: 'public goods', orgName: 'ex-Ethereum Foundation', orgUrl: 'https://ethereum.foundation' },
  { name: 'MANY SHEEL GUPTA', photo: 'img/manu-sheel-gupta.JPG', xUrl: 'https://x.com/manusheel', tagline: 'delivering modular p2p network stack', role: 'maintainer', orgName: 'Libp2p', orgUrl: 'https://libp2p.io' },
  { name: 'FAIZ NAEEM', photo: 'img/faiz-naeem.jpeg', xUrl: 'https://www.linkedin.com/in/faiznaeem/', tagline: 'Tech Policy & Digital Rights', role: 'Chief of Staff', orgName: 'Access Now', orgUrl: 'https://www.accessnow.org' },
  { name: 'SASHA SHILINA', photo: 'img/sasha-shilina.jpg', xUrl: 'https://x.com/sshshln', tagline: 'Philosopher of tech, art & decentralisation', role: 'researcher', orgName: 'Paradigm', orgUrl: 'https://linktr.ee/paradigm_research' },
  { name: 'CHANDRESH', photo: 'img/chandresh.jpg', xUrl: 'https://x.com/thisischandresh', tagline: 'Community organiser', role: 'core', orgName: 'ETHMumbai', orgUrl: 'https://www.ethmumbai.in' },
];

// Known data bugs in the old sources, fixed during migration.
const NAME_FIXES = new Map([['sebastian burgel', 'Sebastian Bürgel']]);
const XURL_FIXES = new Map([['harry halpin', 'https://x.com/harryhalpin']]);

// The exact 45 names shown in index.html's "2026 Speakers" grid, in on-page
// order (33 that already exist in one of the old JSON sources + the 12
// hand-entered above). Used to set speaker2026/speakerOrder.
const speakerGridNames = [
  'KURT OPSAHL', 'ISABELA FERNANDES', 'AHMED GHAPPOUR', 'AMIR TAAKI', "DANNY O'BRIEN",
  'VIJAY KRISHNAVANSHI', 'DENIS "JAROMIL" ROJO', 'JUSTIN DRAKE', 'ANDY GUZMAN', 'JORDI BAYLINA',
  'KYLE DEN HARTOG', 'HARRY HALPIN', 'YING TONG LAI', 'ml_sudo', 'AURYN MCMILLAN',
  'Prasanth Sugathan', 'JUAN BENET', 'SEBASTIAN BURGEL', 'RIDDHIMA SHARMA', 'VINAY NARAYAN',
  'BOB SUMMERWILL', 'MIROYATO', 'CHRIS MCCABE', 'NICO CONSIGNY', 'PETER VAN VALKENBURGH',
  'FATEMEH FANNIZADEH', 'Kunāl Majumder', 'MARIO HAVEL', 'OSKARTH', 'POL LANSKI',
  'SUSHIMITA', 'YEN-LIN (mashbean) HUANG', 'SAM DE SILVA', 'WILL SCOTT', 'Loring Harkness',
  'VIKTOR TRÓN', 'DEVANSH MEHTA', 'MANY SHEEL GUPTA', 'FAIZ NAEEM', 'SASHA SHILINA',
  'ANTONIO SEVESO', 'KIERAN MESQUITA', 'CHANDRESH', 'DANIEL KNOBELSDORF', 'SHADY EL DAMATY',
];

// A handful of speaker-grid names don't literally string-match their
// projects.json/comminity.json counterpart (punctuation differences or a
// display-name vs. handle mismatch). Maps the grid name (lowercased) to the
// lowercased name actually used in the JSON sources.
const SPEAKER_NAME_ALIASES = new Map([
  ['denis "jaromil" rojo', 'denis jaromil rojo'],
  ['yen-lin (mashbean) huang', 'mashbean'],
]);

function slugify(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripPhotoPrefix(photo) {
  if (!photo) return '';
  return String(photo).replace(/^\.{1,2}\//, '');
}

function normalizeIndustries(raw) {
  const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(',') : raw != null ? [raw] : [];
  const clean = list.map((v) => String(v || '').trim()).filter(Boolean);
  return clean.length ? [...new Set(clean)] : ['Privacy'];
}

function applyBugFixes(seed) {
  const lower = seed.name.trim().toLowerCase();
  if (NAME_FIXES.has(lower)) seed.name = NAME_FIXES.get(lower);
  if (XURL_FIXES.has(lower)) seed.xUrl = XURL_FIXES.get(lower);
  return seed;
}

// --- Step 3: build seed records in scan order (a) projects.json members,
// (b) comminity.json entries not already matched, (c) hand-entered speakers.

const seeds = [];
const seenNames = new Set(); // lowercased names already claimed by an earlier seed
const NEVER_MERGE = new Set(['wei dai']);

// (a) projects.json members
for (const project of projectsOld) {
  for (const member of project.members || []) {
    const seed = applyBugFixes({
      name: member.name,
      photo: member.photo,
      xUrl: member.xUrl,
      tagline: member.tagline,
      role: member.role,
      orgName: project.name,
      orgUrl: project.orgUrl,
      industries: undefined,
      source: 'projects',
      projectSlug: project.slug,
    });
    seeds.push(seed);
    seenNames.add(seed.name.trim().toLowerCase());
  }
}

// (b) comminity.json entries not already matched. For names on the
// never-merge list, a same-name seed from step (a) might still be the exact
// same person duplicated across both source files (identical tagline) — in
// that case merge normally (just backfill industries onto the existing seed)
// rather than creating a spurious extra record. Only create a new seed when
// the tagline actually differs, which is what distinguishes a genuine second
// person sharing that name (e.g. the two real "Wei Dai"s).
for (const person of communityOld) {
  const seed = applyBugFixes({
    name: person.name,
    photo: person.photo,
    xUrl: person.xUrl,
    tagline: person.tagline,
    role: person.role,
    orgName: person.orgName,
    orgUrl: person.orgUrl,
    industries: normalizeIndustries(
      Object.prototype.hasOwnProperty.call(person, 'industries') ? person.industries : person.industry
    ),
    source: 'community',
  });
  const lower = seed.name.trim().toLowerCase();
  if (seenNames.has(lower)) {
    const existingSeed = seeds.find((s) => s.name.trim().toLowerCase() === lower);
    if (!NEVER_MERGE.has(lower)) {
      // Same person as an existing (non-collision) seed: backfill industries
      // (projects.json seeds never carry industries) and move on.
      if (existingSeed && !existingSeed.industries) existingSeed.industries = seed.industries;
      continue;
    }
    if (existingSeed && existingSeed.tagline === seed.tagline) {
      // Same person, duplicated across sources: backfill industries only.
      if (!existingSeed.industries) existingSeed.industries = seed.industries;
      continue;
    }
  }
  seeds.push(seed);
  seenNames.add(lower);
}

// (c) hand-entered speakers not already matched
let handEnteredSkipped = 0;
for (const person of handEnteredSpeakers) {
  const seed = applyBugFixes({ ...person, industries: undefined, source: 'speaker-html' });
  const lower = seed.name.trim().toLowerCase();
  if (seenNames.has(lower)) {
    handEnteredSkipped++;
    continue;
  }
  seeds.push(seed);
  seenNames.add(lower);
}

// --- Step 4/5: union fields (already unioned above per-seed since each
// person only ever has one seed record now) + assign stable ids.

const usedIds = new Set();
function assignId(name) {
  const base = slugify(name);
  let id = base;
  let n = 2;
  while (usedIds.has(id)) {
    id = `${base}-${n}`;
    n++;
  }
  usedIds.add(id);
  return id;
}

const peopleByName = new Map(); // lowercased name -> person record, for step 6/8 lookups
const people = seeds.map((seed) => {
  const person = {
    id: assignId(seed.name),
    name: seed.name,
    photo: stripPhotoPrefix(seed.photo),
    xUrl: seed.xUrl || '',
    tagline: seed.tagline || '',
    role: seed.role || '',
    orgName: seed.orgName || '',
    orgUrl: seed.orgUrl || '',
    industries: seed.industries || ['Privacy'],
    speaker2026: false,
    speakerOrder: null,
  };
  const lower = seed.name.trim().toLowerCase();
  if (!peopleByName.has(lower)) peopleByName.set(lower, []);
  peopleByName.get(lower).push({ person, seed });
  return person;
});

// --- Step 6: flag speaker2026 + speakerOrder by matching the grid-order list.
let speakerMatches = 0;
speakerGridNames.forEach((gridName, index) => {
  const lower = gridName.trim().toLowerCase();
  const fixedLower = NAME_FIXES.has(lower) ? NAME_FIXES.get(lower).toLowerCase() : lower;
  const aliasLower = SPEAKER_NAME_ALIASES.get(lower);
  const candidates = peopleByName.get(lower) || peopleByName.get(fixedLower) || (aliasLower && peopleByName.get(aliasLower));
  if (!candidates || !candidates.length) {
    console.warn(`[migrate] WARNING: speaker grid name "${gridName}" did not match any person record`);
    return;
  }
  const { person } = candidates[0];
  person.speaker2026 = true;
  person.speakerOrder = index;
  speakerMatches++;
});

people.sort((a, b) => a.id.localeCompare(b.id));

writeFileSync(join(ROOT, 'data/people.json'), JSON.stringify(people, null, 2) + '\n');

// --- Step 8: emit data/projects.json with memberIds resolved from step 5.

function findPersonIdForProjectMember(memberName, projectSlug) {
  const lower = memberName.trim().toLowerCase();
  const candidates = peopleByName.get(lower) || [];
  const scoped = candidates.find((c) => c.seed.source === 'projects' && c.seed.projectSlug === projectSlug);
  if (scoped) return scoped.person.id;
  // Fallback: any candidate with this name (should not happen given the data,
  // but keeps the script from silently dropping a member).
  return candidates.length ? candidates[0].person.id : null;
}

const projectsNew = projectsOld.map((project) => {
  const memberIds = [];
  for (const member of project.members || []) {
    const id = findPersonIdForProjectMember(member.name, project.slug);
    if (!id) {
      console.warn(`[migrate] WARNING: could not resolve member "${member.name}" in project "${project.slug}"`);
      continue;
    }
    memberIds.push(id);
  }
  const { members, ...rest } = project;
  return { ...rest, memberIds };
});

writeFileSync(join(ROOT, 'data/projects.json'), JSON.stringify(projectsNew, null, 2) + '\n');

// --- Summary ---

const weiDaiRecords = people.filter((p) => p.name.trim().toLowerCase() === 'wei dai');

console.log('--- migrate-people summary ---');
console.log(`People emitted: ${people.length}`);
console.log(`Speaker grid names matched: ${speakerMatches} / ${speakerGridNames.length}`);
console.log(`Hand-entered speakers skipped as duplicates: ${handEnteredSkipped}`);
console.log(`Wei Dai records preserved: ${weiDaiRecords.length} (expect 2)`, weiDaiRecords.map((p) => p.id));
const polLanski = people.find((p) => p.name.trim().toLowerCase() === 'pol lanski');
const paulDylan = people.find((p) => p.name.trim().toLowerCase().includes('dylan-ennis'));
if (polLanski && paulDylan && polLanski.xUrl === paulDylan.xUrl) {
  console.warn(
    `[migrate] KNOWN ISSUE (not fixed, carried over): "${polLanski.name}" and "${paulDylan.name}" share the same xUrl (${polLanski.xUrl}). Flagged as a follow-up, not part of this migration.`
  );
}
console.log(`Projects emitted: ${projectsNew.length}`);
console.log('Wrote data/people.json and data/projects.json');
