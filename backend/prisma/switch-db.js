const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dbType = process.argv[2];

if (!['mysql', 'sqlite'].includes(dbType)) {
  console.error('Error: Please specify "mysql" or "sqlite". Example: node switch-db.js sqlite');
  process.exit(1);
}

const prismaDir = __dirname;
const backendDir = path.resolve(prismaDir, '..');
const envPath = path.resolve(backendDir, '.env');

console.log(`[DB-Switch] Switching local database configuration to: ${dbType.toUpperCase()}...`);

try {
  // 1. Copy the correct schema file
  const sourceSchema = dbType === 'mysql' ? 'schema.mysql.prisma' : 'schema.sqlite.prisma';
  const targetSchema = 'schema.prisma';

  // Backup MySQL schema if schema.mysql.prisma doesn't exist yet
  const mysqlSchemaBackupPath = path.resolve(prismaDir, 'schema.mysql.prisma');
  if (!fs.existsSync(mysqlSchemaBackupPath)) {
    console.log('[DB-Switch] Backing up schema.prisma to schema.mysql.prisma...');
    fs.copyFileSync(path.resolve(prismaDir, 'schema.prisma'), mysqlSchemaBackupPath);
  }

  console.log(`[DB-Switch] Copying ${sourceSchema} to ${targetSchema}...`);
  fs.copyFileSync(path.resolve(prismaDir, sourceSchema), path.resolve(prismaDir, targetSchema));

  // 2. Update DATABASE_URL in .env
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    let newDbUrl;
    if (dbType === 'sqlite') {
      newDbUrl = 'DATABASE_URL="file:./dev.db"';
    } else {
      newDbUrl = 'DATABASE_URL=mysql://gurubantu_user:gurubantupass@localhost:3306/gurubantu';
    }

    // Replace DATABASE_URL line
    envContent = envContent.replace(/DATABASE_URL=.*/, newDbUrl);
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('[DB-Switch] Updated DATABASE_URL in backend/.env');
  } else {
    console.warn('[DB-Switch] Warning: backend/.env not found. Skipping .env update.');
  }

  // 3. Re-run prisma generate
  console.log('[DB-Switch] Re-generating Prisma Client types...');
  execSync('npx prisma generate', { cwd: backendDir, stdio: 'inherit' });

  console.log(`\n[DB-Switch] SUCCESS! Database switched to ${dbType.toUpperCase()} successfully.`);
  if (dbType === 'sqlite') {
    console.log('[DB-Switch] To run migrations and initialize SQLite, run: npx prisma migrate dev --name init_sqlite');
  } else {
    console.log('[DB-Switch] To run migrations and initialize MySQL, run: npx prisma migrate dev --name init_mysql');
  }

} catch (error) {
  console.error('[DB-Switch] Error switching database:', error.message);
  process.exit(1);
}
