# Reading the Label — GitHub Pages tutorial

Static CS663 Project 1 tutorial for Sean Farmer. No build step or dependencies required.

## Publish to GitHub Pages

1. Create or select a GitHub repository for this tutorial.
2. Upload the **contents** of this folder to the repository root, preserving `assets/` and `resources/`.
3. In repository Settings → Pages, select **Deploy from a branch**, the branch containing the files, and **/(root)**. Save.
4. Wait for the Pages deployment. Open the URL shown in Settings → Pages while signed out.

Alternatively, if integrating into another repository, put the contents in its `docs/` folder and select `/docs` as the Pages source. Relative asset paths support project repository URLs.

## Before final submission

- Set `PRESENTATION_URL` in `site.js` to your YouTube URL; the page will embed the video automatically.
- Add actual app screenshots and confirm the OCR implementation. The current page explicitly identifies those stages as unverified in this workspace.
- Align the title/research focus with your approved proposal and check the full course rubric.
- Verify both public links and submit them to both required Canvas discussions.

The website includes saved model evaluation images and project records. It excludes model binaries, private credentials, and the full dataset. Dataset redistribution rights should be checked separately before publishing the full training archive.

## Local preview

From this folder, run `python -m http.server 8000`, then visit http://localhost:8000 . Opening `index.html` directly also works.
