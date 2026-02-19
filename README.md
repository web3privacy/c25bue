# c25bue

Public repository of the code for the 2025 Web3Privacy Now Congress held in Mumbai -  built with simple web-standard HTML and CSS

## CONTENTS

- [ ] /fonts/            =  folder that holds all the fonts used by the website
- [ ] /img/              =  folder that holds all images used by the website
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

## COMMENTS

- This repository is automatically deployed on Github Pages 
- The website has a unique subdomain: [c25bue.web3privacy.info](https://c25bue.web3privacy.info/)
- [congress.web3privacy.info](https://congress.web3privacy.info/) redirects to this deployment
 
## LICENSE

All HTML is licensed [Creative Commons Zero v1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

The CSS used leverages TailwindCSS which is licensed under [MIT](https://github.com/tailwindlabs/tailwindcss/blob/next/LICENSE)

Please note that even though the code is open-sourced - the names, content, and images within may well have their own licenses from their respective owners.
