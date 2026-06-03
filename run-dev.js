const { spawn } = require('child_process');

const nextBin = '/Users/swastikdey/claud/node_modules/next/dist/bin/next';
const claudModules = '/Users/swastikdey/claud/node_modules';

console.log('Starting Next.js dev server on port 3002 with NODE_PATH set to pre-installed claud modules...');

const child = spawn('node', [nextBin, 'dev', '-p', '3002'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_PATH: claudModules,
    PORT: '3002',
    NEXTAUTH_URL: 'http://localhost:3002',
    NEXTAUTH_SECRET: 'supersecretnextauthsessionkeysecret'
  }
});

child.on('close', (code) => {
  process.exit(code);
});
