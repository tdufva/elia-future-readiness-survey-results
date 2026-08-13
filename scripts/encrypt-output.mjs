import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const password = process.env.ELIA_SURVEY_PASSWORD;
if (!password) throw new Error("ELIA_SURVEY_PASSWORD is required to protect the Pages build.");

const root = process.cwd();
const outDir = path.join(root, "out");
const config = JSON.parse(await fs.readFile(path.join(root, "public", "access-config.json"), "utf8"));
const key = pbkdf2Sync(password, Buffer.from(config.salt, "base64"), config.iterations, 32, "sha256");

async function filesBelow(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(target) : [target];
  }));
  return nested.flat();
}

function encryptedShell(clearHtml) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(clearHtml, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  const payload = {
    iv: iv.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
    tag: tag.toString("base64"),
  };

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Protected survey results · ELIA</title>
<style>:root{color-scheme:light;--paper:#f0f0f0;--light:#fff;--ink:#000;--soft:#2d3c41;--signal:#db0962;--mint:#00fdcb;--rule:#a7a9ac}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:28px;color:var(--ink);background:radial-gradient(circle at 82% 14%,rgba(0,253,203,.24),transparent 34rem),var(--paper);font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.gate{width:min(720px,100%);padding:clamp(32px,6vw,66px);background:rgba(255,255,255,.92);border:1px solid rgba(45,60,65,.18);border-radius:26px}.mark{display:grid;width:46px;height:46px;place-items:center;color:var(--light);background:var(--ink);border-radius:14px;font-family:ui-rounded,"Arial Rounded MT Bold","Avenir Next Rounded",sans-serif;font-weight:900}.eyebrow{margin:34px 0 12px;color:var(--signal);font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase}h1{margin:0;font-family:ui-rounded,"Arial Rounded MT Bold","Avenir Next Rounded",Inter,sans-serif;font-size:clamp(2.4rem,7vw,5rem);font-weight:900;letter-spacing:-.055em;line-height:.94}p{max-width:580px;color:var(--soft);line-height:1.65}form{margin-top:36px}label{display:block;margin-bottom:8px;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.row{display:flex;gap:10px}input{min-width:0;flex:1;padding:14px 16px;color:var(--ink);background:white;border:1px solid var(--rule);border-radius:999px;font:inherit}button{padding:14px 22px;color:var(--light);background:var(--ink);border:0;border-radius:999px;font:inherit;font-weight:800;cursor:pointer}button:hover{background:var(--signal)}input:focus,button:focus{outline:3px solid #006699;outline-offset:2px}.error{min-height:24px;margin:10px 0 0;color:var(--signal);font-size:.84rem}@media(max-width:520px){.row{flex-direction:column}button{width:100%}}</style></head>
<body><main class="gate"><div class="mark" aria-hidden="true">E·F</div><p class="eyebrow">Protected survey results</p><h1>Enter the password to continue.</h1><p>The ELIA Future Readiness Survey Results contain respondent-linked answers and are available only to readers who have been given the password.</p><form id="gate-form"><label for="gate-password">Password</label><div class="row"><input id="gate-password" type="password" autocomplete="current-password" autofocus required><button type="submit">Unlock site</button></div><p class="error" id="gate-error" role="alert"></p></form></main>
<script>(()=>{const C=${JSON.stringify(config)},P=${JSON.stringify(payload)},F=document.getElementById("gate-form"),I=document.getElementById("gate-password"),E=document.getElementById("gate-error"),D=v=>Uint8Array.from(atob(v),c=>c.charCodeAt(0)),B=v=>btoa(String.fromCharCode(...new Uint8Array(v)));async function K(p){const m=await crypto.subtle.importKey("raw",new TextEncoder().encode(p),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:D(C.salt),iterations:C.iterations,hash:"SHA-256"},m,{name:"AES-GCM",length:256},true,["decrypt"])}async function O(k,s){const c=D(P.ciphertext),t=D(P.tag),a=new Uint8Array(c.length+t.length);a.set(c);a.set(t,c.length);const h=await crypto.subtle.decrypt({name:"AES-GCM",iv:D(P.iv),tagLength:128},k,a);if(s){const r=await crypto.subtle.exportKey("raw",k);sessionStorage.setItem(C.keyStorage,B(r))}document.open();document.write(new TextDecoder().decode(h));document.close()}async function A(){const s=sessionStorage.getItem(C.keyStorage);if(!s)return;try{await O(await crypto.subtle.importKey("raw",D(s),{name:"AES-GCM"},true,["decrypt"]),false)}catch{sessionStorage.removeItem(C.keyStorage)}}F.addEventListener("submit",async e=>{e.preventDefault();E.textContent="";F.querySelector("button").disabled=true;try{await O(await K(I.value),true)}catch{E.textContent="Incorrect password. Please try again.";I.select();F.querySelector("button").disabled=false}});A()})();</script></body></html>`;
}

const files = await filesBelow(outDir);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const clearHtml = await fs.readFile(file, "utf8");
  await fs.writeFile(file, encryptedShell(clearHtml));
}

for (const file of files.filter((candidate) => candidate.endsWith(".txt"))) await fs.rm(file);

console.log(`Protected ${htmlFiles.length} HTML documents and removed exported page-data files.`);
