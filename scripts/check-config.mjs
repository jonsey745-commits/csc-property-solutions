import {loadEnv} from 'vite';
const env=loadEnv('production',process.cwd(),'VITE_');
const value=process.env.VITE_SITE_URL||env.VITE_SITE_URL;
let u;try{u=new URL(value)}catch{throw new Error('Set VITE_SITE_URL to your final HTTPS domain in Vercel or .env.production (see README.md).')}
if(u.protocol!=='https:'||u.pathname!=='/'||u.search||u.hash||u.username||u.password||u.hostname.endsWith('.example')||u.hostname.endsWith('.invalid')||u.hostname.includes('chatgpt.site'))throw new Error('VITE_SITE_URL must be your own valid HTTPS origin, without a path, credentials, query or placeholder.');
console.log('Canonical domain configuration checked.');
