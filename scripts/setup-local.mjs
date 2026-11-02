import {existsSync,writeFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
if(existsSync('.dev.vars')){
 console.log('Local credentials already exist. Preserved .dev.vars.');
}else{
 writeFileSync('.dev.vars',`ADMIN_PASSWORD="${randomBytes(24).toString('base64url')}"\n`,{mode:0o600});
 console.log('Created a random local admin password in .dev.vars. Email: admin@local. Keep this file private.');
}
