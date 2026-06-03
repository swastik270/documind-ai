const fs = require('fs');
const path = require('path');

const src = '/Users/swastikdey/document';
const dest = '/Users/swastikdey/.gemini/antigravity-ide/scratch/documind';

const { execSync } = require('child_process');

try {
  // Pre-create target dir
  fs.mkdirSync(dest, { recursive: true });

  // Copy files and src folder using system cp
  execSync(`cp -R ${src}/src ${dest}/`);
  execSync(`cp -R ${src}/prisma ${dest}/`);
  execSync(`cp ${src}/package.json ${dest}/`);
  execSync(`cp ${src}/tsconfig.json ${dest}/`);
  execSync(`cp ${src}/postcss.config.js ${dest}/`);
  execSync(`cp ${src}/tailwind.config.ts ${dest}/`);
  execSync(`cp ${src}/next.config.ts ${dest}/`);
  
  // Create empty public directory
  fs.mkdirSync(path.join(dest, 'public'), { recursive: true });

  // Link node_modules
  const claudModules = '/Users/swastikdey/claud/node_modules';
  const modulesDest = path.join(dest, 'node_modules');
  if (fs.existsSync(modulesDest)) {
    fs.unlinkSync(modulesDest);
  }
  fs.symlinkSync(claudModules, modulesDest);
  console.log(`Linked node_modules -> ${claudModules}`);

  console.log('Project successfully copied to shadow workspace!');
} catch (err) {
  console.error('Copy failed:', err.message);
  process.exit(1);
}
