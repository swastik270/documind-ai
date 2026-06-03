const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const archiveFile = path.join(__dirname, 'project_archive.json');

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
  'src/app/api/auth/forgot-password/route.ts',
  'src/app/api/auth/reset-password/route.ts',
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
  const archive = [];
  for (const relPath of files) {
    const filePath = path.join(srcDir, relPath);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      archive.push({ path: relPath, content });
    } else {
      console.warn(`File not found: ${relPath}`);
    }
  }

  fs.writeFileSync(archiveFile, JSON.stringify(archive, null, 2), 'utf8');
  console.log(`Successfully archived ${archive.length} files into project_archive.json`);
} catch (err) {
  console.error('Archiving failed:', err.message);
  process.exit(1);
}
