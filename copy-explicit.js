const fs = require('fs');
const path = require('path');

const srcDir = '/Users/swastikdey/document';
const destDir = '/Users/swastikdey/.gemini/antigravity-ide/scratch/documind';

const files = [
  'package.json',
  'tsconfig.json',
  'postcss.config.js',
  'tailwind.config.ts',
  'next.config.ts',
  'prisma/schema.prisma',
  'src/types/index.ts',
  'src/lib/ai.ts',
  'src/lib/auth.ts',
  'src/lib/db.ts',
  'src/lib/prisma.ts',
  'src/lib/utils.ts',
  'src/components/shared/MermaidRenderer.tsx',
  'src/components/shared/PageTransition.tsx',
  'src/components/shared/Providers.tsx',
  'src/components/shared/ThemeToggle.tsx',
  'src/app/globals.css',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/api/auth/[...nextauth]/route.ts',
  'src/app/api/auth/signup/route.ts',
  'src/app/api/notifications/route.ts',
  'src/app/api/notifications/[id]/route.ts',
  'src/app/api/notifications/read/route.ts',
  'src/app/api/projects/route.ts',
  'src/app/api/projects/[id]/route.ts',
  'src/app/api/projects/[id]/chat/route.ts',
  'src/app/api/projects/[id]/comments/route.ts',
  'src/app/api/projects/[id]/diagrams/route.ts',
  'src/app/api/projects/[id]/documents/route.ts',
  'src/app/api/projects/[id]/files/route.ts',
  'src/app/api/projects/[id]/review/route.ts',
  'src/app/auth/forgot-password/page.tsx',
  'src/app/auth/reset-password/page.tsx',
  'src/app/auth/signin/page.tsx',
  'src/app/auth/signup/page.tsx',
  'src/app/dashboard/layout.tsx',
  'src/app/dashboard/page.tsx',
  'src/app/dashboard/admin/page.tsx',
  'src/app/dashboard/profile/page.tsx',
  'src/app/dashboard/projects/page.tsx',
  'src/app/dashboard/projects/[id]/layout.tsx',
  'src/app/dashboard/projects/[id]/page.tsx',
  'src/app/dashboard/projects/[id]/chat/page.tsx',
  'src/app/dashboard/projects/[id]/comments/page.tsx',
  'src/app/dashboard/projects/[id]/diagrams/page.tsx',
  'src/app/dashboard/projects/[id]/documentation/page.tsx',
  'src/app/dashboard/projects/[id]/review/page.tsx'
];

try {
  let copiedCount = 0;
  for (const relPath of files) {
    const srcPath = path.join(srcDir, relPath);
    const destPath = path.join(destDir, relPath);

    if (fs.existsSync(srcPath)) {
      const parentDir = path.dirname(destPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      const content = fs.readFileSync(srcPath, 'utf8');
      fs.writeFileSync(destPath, content, 'utf8');
      copiedCount++;
    } else {
      console.warn(`File does not exist: ${srcPath}`);
    }
  }

  // Ensure node_modules is symlinked to the external node_modules folder
  const claudModules = '/Users/swastikdey/claud/node_modules';
  const modulesDest = path.join(destDir, 'node_modules');
  if (fs.existsSync(modulesDest)) {
    fs.unlinkSync(modulesDest);
  }
  fs.symlinkSync(claudModules, modulesDest);
  console.log(`Linked node_modules -> ${claudModules}`);

  console.log(`Successfully copied ${copiedCount} files to ${destDir}`);
} catch (err) {
  console.error(`Error during copy operation: ${err.message}`);
  process.exit(1);
}
