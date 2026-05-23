const { execSync } = require('child_process');
const path = require('path');

// This tells Playwright exactly where to put the browsers
// so the Python engine can find them later.
const browserDir = path.join(process.env.APPDATA, 'SortingSource', 'browsers');
process.env.PLAYWRIGHT_BROWSERS_PATH = browserDir;

console.log(`> Targeting Browser Directory: ${browserDir}`);

try {
  console.log("> Downloading Chromium... This may take a minute.");
  // This command triggers the actual download
  execSync('npx playwright install chromium', { stdio: 'inherit' });
  console.log("> Installation successful.");
} catch (error) {
  console.error("> Error installing browsers:", error.message);
  process.exit(1);
}