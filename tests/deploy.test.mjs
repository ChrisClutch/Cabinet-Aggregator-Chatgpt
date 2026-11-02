import test from 'node:test';
import assert from 'node:assert/strict';
import {realpathSync,mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
const script=resolve('scripts/deploy-cloudflare.mjs');
test('deploy rejects local resources and uses installed Wrangler with built asset paths',()=>{
 const cwd=realpathSync(mkdtempSync(join(tmpdir(),'cabinet-deploy-test-')));
 try {
 mkdirSync(join(cwd,'dist/server'),{recursive:true});
 mkdirSync(join(cwd,'node_modules/wrangler/bin'),{recursive:true});
 writeFileSync(join(cwd,'dist/server/wrangler.json'),JSON.stringify({main:'index.js',assets:{directory:'../client'}}));
 writeFileSync(join(cwd,'node_modules/wrangler/bin/wrangler.js'),'console.log(JSON.stringify(process.argv.slice(2)))');
 const env={...process.env,CF_D1_DATABASE_ID:'',CF_R2_BUCKET_NAME:''};
 let r=spawnSync(process.execPath,[script],{cwd,env,encoding:'utf8'});
 assert.notEqual(r.status,0);assert.match(r.stderr,/CF_D1_DATABASE_ID/);
 env.CF_D1_DATABASE_ID='12345678-1234-4234-8234-123456789abc';
 r=spawnSync(process.execPath,[script],{cwd,env,encoding:'utf8'});
 assert.notEqual(r.status,0);assert.match(r.stderr,/CF_R2_BUCKET_NAME/);
 env.CF_R2_BUCKET_NAME='test-cabinet-plans';env.CF_WORKER_NAME='test-cabinet-worker';
 r=spawnSync(process.execPath,[script,'--dry-run'],{cwd,env,encoding:'utf8'});
 assert.equal(r.status,0,r.stderr);
 const config=JSON.parse(readFileSync(join(cwd,'dist/server/wrangler.deploy.json'),'utf8'));
 assert.equal(config.assets.directory,'../client');assert.equal(config.main,'index.js');
 assert.equal(config.name,'test-cabinet-worker');assert.equal(config.d1_databases[0].binding,'DB');assert.equal(config.r2_buckets[0].binding,'BUCKET');
 assert.deepEqual(JSON.parse(r.stdout),['deploy','--config',join(cwd,'dist/server/wrangler.deploy.json'),'--dry-run']);
 }finally{rmSync(cwd,{recursive:true,force:true});}
});
