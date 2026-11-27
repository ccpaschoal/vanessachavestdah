// Monta a pasta dist só com o que é público (README, configurações e .git ficam de fora).
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
for (const item of ['index.html', 'sitemap.xml', 'assets', 'scripts', 'styles']) {
  cpSync(item, `dist/${item}`, { recursive: true });
}
// Imagens sem número de versão no nome: cache de 1 dia
writeFileSync('dist/_headers', `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Strict-Transport-Security: max-age=31536000
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/img/*
  Cache-Control: public, max-age=86400

/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
`);
console.log('dist pronta');
