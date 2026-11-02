import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

// Deploy the built Worker with the installed, lockfile-pinned Wrangler.
// Never invoke framework autoconfiguration or create resources implicitly.
const configPath = resolve('dist/server/wrangler.json');
if (!existsSync(configPath)) throw new Error('Run npm run build before npm run deploy.');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const databaseId = process.env.CF_D1_DATABASE_ID;
const bucketName = process.env.CF_R2_BUCKET_NAME;
if (!databaseId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(databaseId) || databaseId === '00000000-0000-4000-8000-000000000000') {
  throw new Error('Set CF_D1_DATABASE_ID to the real D1 database UUID in Cloudflare build variables. Local placeholder IDs cannot be deployed.');
}
if (!bucketName || !/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucketName) || bucketName === 'site-creator-r2') {
  throw new Error('Set CF_R2_BUCKET_NAME to an existing R2 bucket in Cloudflare build variables.');
}
config.name = process.env.CF_WORKER_NAME || 'cabinet-aggregator-chatgpt';
config.d1_databases = [{binding:'DB',database_id:databaseId,...(process.env.CF_D1_DATABASE_NAME ? {database_name:process.env.CF_D1_DATABASE_NAME} : {})}];
config.r2_buckets = [{binding:'BUCKET',bucket_name:bucketName}];
// Keep this beside the generated config so relative asset/module paths are valid.
const deployConfig = resolve('dist/server/wrangler.deploy.json');
writeFileSync(deployConfig, JSON.stringify(config,null,2)+'\n');
const result = spawnSync(process.execPath,[resolve('node_modules/wrangler/bin/wrangler.js'),'deploy','--config',deployConfig,...process.argv.slice(2)],{stdio:'inherit'});
if(result.error) throw result.error;
process.exit(result.status ?? 1);
