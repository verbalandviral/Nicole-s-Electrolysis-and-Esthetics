# Nicole's Electrolysis and Esthetics

A responsive, static website for Nicole's Kelowna practice. The homepage has a fixed left navigation with divider lines. Selecting a section displays it in the right content pane, which scrolls independently on desktop. The pink logo artwork is saved locally from Nicole’s public Vagaro profile.

## Pages

- index.html — homepage with fixed section navigation, an independently scrolling content pane, services, prices, booking, and contact information
- electrolysis.html
- skin-tag-mole-removal.html
- telangiectasia.html
- laser-hair-removal.html
- skin-rejuvenation.html
- tinting.html
- waxing.html
- booking.html — embedded Vagaro booking page
- esthetics.html — general information page retained from the earlier draft

Service prices are transcribed from Nicole's Vagaro menu and can change. The site notes that two menu categories list skin-tag appointments at different prices; Nicole should confirm which listing applies. The header phone number is tap-to-call on mobile.

## Update an existing GitHub Pages site

1. Download the ZIP and extract it on your computer.
2. Upload the extracted files and folders inside the site folder to the root of your existing GitHub repository. Replace the old files with the new ones. Do not upload only the ZIP or put the whole site folder one level down.
3. Commit the updated files to the branch your site publishes from.
4. In **Settings → Pages**, confirm that branch and `/(root)` are selected.

The repository root should contain `index.html`, the service pages, the `assets` folder, and `.nojekyll` together.

## Create a new GitHub Pages site

1. Create a GitHub repository.
2. Extract this folder's contents into the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**, then select the `main` branch and `/(root)`.

GitHub Pages publishes the site at a URL like https://YOUR-USERNAME.github.io/REPOSITORY-NAME/.

## Logo source

The pink logo image in assets/nicole-vagaro-profile.png comes from Nicole’s public Vagaro profile: https://mysite.vagaro.com/nicoleselectrolysisandesthetics . It is bundled with the site so GitHub Pages does not depend on the external image host.
