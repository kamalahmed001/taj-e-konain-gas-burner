import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientImagesDir = path.resolve(__dirname, '../../client/public/images');
const clientProductsDir = path.join(clientImagesDir, 'products');
const clientCategoriesDir = path.join(clientImagesDir, 'categories');
const serverUploadsDir = path.resolve(__dirname, '../uploads');

[clientImagesDir, clientProductsDir, clientCategoriesDir, serverUploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper to write SVG to both public and uploads
function saveSvg(fileName, content, subDir = '') {
  const publicPath = subDir ? path.join(clientImagesDir, subDir, fileName) : path.join(clientImagesDir, fileName);
  const uploadPath = path.join(serverUploadsDir, fileName);
  fs.writeFileSync(publicPath, content.trim(), 'utf8');
  fs.writeFileSync(uploadPath, content.trim(), 'utf8');
}

// 1. Logo SVG
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 110" width="100%" height="100%">
  <defs>
    <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="50%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#fde047" />
    </linearGradient>
    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <!-- Icon Emblem -->
  <g transform="translate(15, 10)">
    <!-- Outer Shield / Hex Ring -->
    <path d="M 45,5 L 80,25 L 80,68 L 45,88 L 10,68 L 10,25 Z" fill="url(#metalGrad)" stroke="#ea580c" stroke-width="2.5" />
    
    <!-- Stove Burner Trivet Spokes -->
    <circle cx="45" cy="46" r="28" fill="#1e293b" stroke="#64748b" stroke-width="2" />
    <line x1="45" y1="20" x2="45" y2="28" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
    <line x1="45" y1="64" x2="45" y2="72" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
    <line x1="19" y1="46" x2="27" y2="46" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
    <line x1="63" y1="46" x2="71" y2="46" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
    
    <!-- Central Burner Flame -->
    <path d="M 45,26 C 45,26 34,38 34,51 C 34,60 39,64 45,64 C 51,64 56,60 56,51 C 56,38 45,26 45,26 Z" fill="url(#flameGrad)" filter="url(#glow)" />
    <!-- Inner Blue Core -->
    <path d="M 45,39 C 45,39 40,46 40,53 C 40,58 42,61 45,61 C 48,61 50,58 50,53 C 50,46 45,39 45,39 Z" fill="#38bdf8" opacity="0.9" />
  </g>

  <!-- Typography -->
  <g transform="translate(115, 20)">
    <text x="0" y="34" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="900" fill="#0f172a" letter-spacing="1">
      TAJ-E-KONAIN
    </text>
    <text x="0" y="58" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="800" fill="#ea580c" letter-spacing="3.5">
      GAS BURNER
    </text>
    <text x="0" y="78" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10.5" font-weight="600" fill="#64748b" letter-spacing="1.5">
      PREMIUM STOVES &amp; KITCHEN APPLIANCES
    </text>
  </g>
</svg>`;

saveSvg('logo.svg', logoSvg);

// 2. Logo Icon (Square)
const logoIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="iconFlame" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="50%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#fde047" />
    </linearGradient>
    <linearGradient id="iconMetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="url(#iconMetal)" />
  <circle cx="50" cy="50" r="34" fill="none" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="4 3" />
  <!-- Trivet Spokes -->
  <line x1="50" y1="20" x2="50" y2="30" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
  <line x1="50" y1="70" x2="50" y2="80" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
  <line x1="20" y1="50" x2="30" y2="50" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
  <line x1="70" y1="50" x2="80" y2="50" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
  <!-- Flame -->
  <path d="M 50,26 C 50,26 38,40 38,55 C 38,65 43,70 50,70 C 57,70 62,65 62,55 C 62,40 50,26 50,26 Z" fill="url(#iconFlame)" />
  <path d="M 50,42 C 50,42 44,49 44,57 C 44,62 46,65 50,65 C 54,65 56,62 56,57 C 56,49 50,42 50,42 Z" fill="#38bdf8" />
</svg>`;

saveSvg('logo-icon.svg', logoIconSvg);

// Product SVG Builder helper
function generateProductSvg({
  title,
  model,
  badge = 'PREMIUM QUALITY',
  accentColor = '#ea580c',
  type = 'stove-glass', // 'stove-glass', 'stove-steel', 'stove-3b', 'hob-4b', 'portable', 'commercial', 'regulator', 'hose', 'parts', 'knob'
}) {
  let illustration = '';

  if (type === 'stove-glass' || type === 'stove-steel') {
    const isGlass = type === 'stove-glass';
    const bodyFill = isGlass ? '#090d16' : 'url(#steelGrad)';
    const bodyStroke = isGlass ? '#334155' : '#94a3b8';
    illustration = `
      <!-- Gas Stove Double Burner Body -->
      <rect x="80" y="160" width="440" height="190" rx="20" fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="3" />
      ${isGlass ? '<rect x="88" y="168" width="424" height="20" rx="6" fill="#1e293b" opacity="0.6" />' : ''}
      
      <!-- Left Burner -->
      <g transform="translate(190, 245)">
        <circle cx="0" cy="0" r="54" fill="#1e293b" stroke="#475569" stroke-width="3" />
        <circle cx="0" cy="0" r="42" fill="#0f172a" stroke="#d97706" stroke-width="4" stroke-dasharray="6 3" />
        <circle cx="0" cy="0" r="26" fill="#b45309" />
        <circle cx="0" cy="0" r="14" fill="#f59e0b" />
        <!-- Trivet 4 fingers -->
        <rect x="-6" y="-60" width="12" height="20" rx="3" fill="#334155" />
        <rect x="-6" y="40" width="12" height="20" rx="3" fill="#334155" />
        <rect x="-60" y="-6" width="20" height="12" rx="3" fill="#334155" />
        <rect x="40" y="-6" width="20" height="12" rx="3" fill="#334155" />
      </g>

      <!-- Right Burner -->
      <g transform="translate(410, 245)">
        <circle cx="0" cy="0" r="54" fill="#1e293b" stroke="#475569" stroke-width="3" />
        <circle cx="0" cy="0" r="42" fill="#0f172a" stroke="#d97706" stroke-width="4" stroke-dasharray="6 3" />
        <circle cx="0" cy="0" r="26" fill="#b45309" />
        <circle cx="0" cy="0" r="14" fill="#f59e0b" />
        <!-- Trivet 4 fingers -->
        <rect x="-6" y="-60" width="12" height="20" rx="3" fill="#334155" />
        <rect x="-6" y="40" width="12" height="20" rx="3" fill="#334155" />
        <rect x="-60" y="-6" width="20" height="12" rx="3" fill="#334155" />
        <rect x="40" y="-6" width="20" height="12" rx="3" fill="#334155" />
      </g>

      <!-- Front Panel & Knobs -->
      <path d="M 80,330 L 520,330 L 510,360 L 90,360 Z" fill="#0f172a" stroke="#334155" stroke-width="2" />
      <!-- Left Knob -->
      <circle cx="210" cy="345" r="12" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2" />
      <line x1="210" y1="337" x2="210" y2="345" stroke="#ea580c" stroke-width="3" stroke-linecap="round" />
      <!-- Right Knob -->
      <circle cx="390" cy="345" r="12" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2" />
      <line x1="390" y1="337" x2="390" y2="345" stroke="#ea580c" stroke-width="3" stroke-linecap="round" />
      <!-- Brand badge in center -->
      <rect x="275" y="340" width="50" height="12" rx="3" fill="#1e293b" stroke="#ea580c" stroke-width="1" />
      <text x="300" y="349" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#f97316" text-anchor="middle">TAJ-E-KONAIN</text>
    `;
  } else if (type === 'stove-3b') {
    illustration = `
      <!-- 3 Burner Body -->
      <rect x="60" y="160" width="480" height="190" rx="18" fill="#090d16" stroke="#475569" stroke-width="3" />
      <!-- Left Burner (Large) -->
      <g transform="translate(150, 245)">
        <circle cx="0" cy="0" r="50" fill="#1e293b" stroke="#d97706" stroke-width="3" />
        <circle cx="0" cy="0" r="24" fill="#b45309" />
        <rect x="-5" y="-55" width="10" height="16" rx="2" fill="#475569" />
        <rect x="-5" y="39" width="10" height="16" rx="2" fill="#475569" />
        <rect x="-55" y="-5" width="16" height="10" rx="2" fill="#475569" />
        <rect x="39" y="-5" width="16" height="10" rx="2" fill="#475569" />
      </g>
      <!-- Center Burner (Small Simmer) -->
      <g transform="translate(300, 235)">
        <circle cx="0" cy="0" r="35" fill="#1e293b" stroke="#d97706" stroke-width="2.5" />
        <circle cx="0" cy="0" r="16" fill="#b45309" />
        <rect x="-4" y="-40" width="8" height="12" rx="2" fill="#475569" />
        <rect x="-4" y="28" width="8" height="12" rx="2" fill="#475569" />
        <rect x="-40" y="-4" width="12" height="8" rx="2" fill="#475569" />
        <rect x="28" y="-4" width="12" height="8" rx="2" fill="#475569" />
      </g>
      <!-- Right Burner (Medium) -->
      <g transform="translate(450, 245)">
        <circle cx="0" cy="0" r="48" fill="#1e293b" stroke="#d97706" stroke-width="3" />
        <circle cx="0" cy="0" r="22" fill="#b45309" />
        <rect x="-5" y="-53" width="10" height="16" rx="2" fill="#475569" />
        <rect x="-5" y="37" width="10" height="16" rx="2" fill="#475569" />
        <rect x="-53" y="-5" width="16" height="10" rx="2" fill="#475569" />
        <rect x="37" y="-5" width="16" height="10" rx="2" fill="#475569" />
      </g>
      <!-- Front Controls -->
      <circle cx="150" cy="335" r="11" fill="#cbd5e1" stroke="#475569" stroke-width="2" />
      <circle cx="300" cy="335" r="10" fill="#cbd5e1" stroke="#475569" stroke-width="2" />
      <circle cx="450" cy="335" r="11" fill="#cbd5e1" stroke="#475569" stroke-width="2" />
    `;
  } else if (type === 'hob-4b') {
    illustration = `
      <!-- 4 Burner Luxury Hob -->
      <rect x="90" y="140" width="420" height="230" rx="16" fill="#090d16" stroke="#ea580c" stroke-width="3" />
      <!-- Burner 1 Top-Left -->
      <g transform="translate(190, 195)">
        <circle cx="0" cy="0" r="36" fill="#1e293b" stroke="#b45309" stroke-width="3" />
        <circle cx="0" cy="0" r="18" fill="#d97706" />
      </g>
      <!-- Burner 2 Top-Right -->
      <g transform="translate(410, 195)">
        <circle cx="0" cy="0" r="36" fill="#1e293b" stroke="#b45309" stroke-width="3" />
        <circle cx="0" cy="0" r="18" fill="#d97706" />
      </g>
      <!-- Burner 3 Bottom-Left (Triple Flame Wok) -->
      <g transform="translate(190, 290)">
        <circle cx="0" cy="0" r="46" fill="#1e293b" stroke="#ea580c" stroke-width="4" stroke-dasharray="5 3" />
        <circle cx="0" cy="0" r="28" fill="#b45309" />
        <circle cx="0" cy="0" r="14" fill="#fbbf24" />
      </g>
      <!-- Burner 4 Bottom-Right -->
      <g transform="translate(410, 290)">
        <circle cx="0" cy="0" r="38" fill="#1e293b" stroke="#b45309" stroke-width="3" />
        <circle cx="0" cy="0" r="20" fill="#d97706" />
      </g>
      <!-- Center Front Knobs Grid -->
      <g transform="translate(300, 235)">
        <circle cx="-15" cy="-25" r="9" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" />
        <circle cx="15" cy="-25" r="9" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" />
        <circle cx="-15" cy="25" r="9" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" />
        <circle cx="15" cy="25" r="9" fill="#e2e8f0" stroke="#0f172a" stroke-width="2" />
        <line x1="-15" y1="-31" x2="-15" y2="-25" stroke="#ea580c" stroke-width="2" />
        <line x1="15" y1="-31" x2="15" y2="-25" stroke="#ea580c" stroke-width="2" />
        <line x1="-15" y1="19" x2="-15" y2="25" stroke="#ea580c" stroke-width="2" />
        <line x1="15" y1="19" x2="15" y2="25" stroke="#ea580c" stroke-width="2" />
      </g>
    `;
  } else if (type === 'commercial') {
    illustration = `
      <!-- Commercial Heavy-Duty Cast Iron Burner -->
      <g transform="translate(300, 240)">
        <!-- Outer heavy cast iron square frame -->
        <rect x="-130" y="-80" width="260" height="160" rx="12" fill="#18181b" stroke="#52525b" stroke-width="6" />
        <!-- Heavy pan support ribs -->
        <line x1="-130" y1="-80" x2="-60" y2="-20" stroke="#71717a" stroke-width="8" stroke-linecap="round" />
        <line x1="130" y1="-80" x2="60" y2="-20" stroke="#71717a" stroke-width="8" stroke-linecap="round" />
        <line x1="-130" y1="80" x2="-60" y2="20" stroke="#71717a" stroke-width="8" stroke-linecap="round" />
        <line x1="130" y1="80" x2="60" y2="20" stroke="#71717a" stroke-width="8" stroke-linecap="round" />
        <!-- Big Dual Ring Cast Iron Burner Head -->
        <circle cx="0" cy="0" r="65" fill="#27272a" stroke="#ea580c" stroke-width="5" stroke-dasharray="8 4" />
        <circle cx="0" cy="0" r="42" fill="#18181b" stroke="#f97316" stroke-width="4" stroke-dasharray="6 3" />
        <circle cx="0" cy="0" r="22" fill="#ea580c" />
        <!-- Brass Inlet Needle Valve / Pipe -->
        <rect x="-180" y="-8" width="55" height="16" rx="3" fill="#ca8a04" stroke="#854d0e" stroke-width="2" />
        <circle cx="-185" cy="0" r="14" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
      </g>
    `;
  } else if (type === 'portable') {
    illustration = `
      <!-- Portable Single Stove -->
      <g transform="translate(300, 245)">
        <rect x="-140" y="-70" width="280" height="140" rx="16" fill="#0f172a" stroke="#ea580c" stroke-width="3" />
        <circle cx="-35" cy="0" r="48" fill="#1e293b" stroke="#d97706" stroke-width="3" />
        <circle cx="-35" cy="0" r="24" fill="#b45309" />
        <!-- Butane canister compartment door -->
        <rect x="45" y="-55" width="80" height="110" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2" />
        <circle cx="85" cy="20" r="14" fill="#94a3b8" stroke="#475569" stroke-width="2" />
        <line x1="85" y1="10" x2="85" y2="20" stroke="#ea580c" stroke-width="3" stroke-linecap="round" />
      </g>
    `;
  } else if (type === 'regulator') {
    illustration = `
      <!-- Gas Regulator & Gauge -->
      <g transform="translate(300, 240)">
        <!-- Dome Chamber -->
        <circle cx="0" cy="10" r="65" fill="#ca8a04" stroke="#a16207" stroke-width="5" />
        <circle cx="0" cy="10" r="50" fill="#eab308" />
        <!-- Pressure Gauge Dial -->
        <circle cx="0" cy="-60" r="35" fill="#f8fafc" stroke="#334155" stroke-width="4" />
        <line x1="-15" y1="-60" x2="15" y2="-60" stroke="#94a3b8" stroke-width="1" />
        <path d="M 0,-60 L 15,-72" stroke="#dc2626" stroke-width="3" stroke-linecap="round" />
        <circle cx="0" cy="-60" r="5" fill="#0f172a" />
        <text x="0" y="-45" font-family="sans-serif" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">kg/cm²</text>
        <!-- Brass Connectors & Safety Shutoff Knob -->
        <rect x="-105" y="0" width="45" height="20" rx="4" fill="#ca8a04" stroke="#854d0e" stroke-width="2" />
        <rect x="60" y="0" width="45" height="20" rx="4" fill="#ca8a04" stroke="#854d0e" stroke-width="2" />
        <rect x="-14" y="55" width="28" height="25" rx="5" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
      </g>
    `;
  } else if (type === 'hose') {
    illustration = `
      <!-- Gas Hose Reinforced -->
      <g transform="translate(300, 240)">
        <path d="M -130,50 C -70,-80 70,-80 130,50" fill="none" stroke="#ea580c" stroke-width="26" stroke-linecap="round" />
        <path d="M -130,50 C -70,-80 70,-80 130,50" fill="none" stroke="#fed7aa" stroke-width="6" stroke-dasharray="10 8" stroke-linecap="round" />
        <!-- Brass End Fittings -->
        <rect x="-155" y="40" width="30" height="20" rx="4" fill="#ca8a04" stroke="#854d0e" stroke-width="2" transform="rotate(30 -140 50)" />
        <rect x="125" y="40" width="30" height="20" rx="4" fill="#ca8a04" stroke="#854d0e" stroke-width="2" transform="rotate(-30 140 50)" />
        <circle cx="-135" cy="50" r="6" fill="#e2e8f0" />
        <circle cx="135" cy="50" r="6" fill="#e2e8f0" />
      </g>
    `;
  } else if (type === 'knob') {
    illustration = `
      <!-- Stove Knobs Set -->
      <g transform="translate(300, 240)">
        <g transform="translate(-70, 0)">
          <circle cx="0" cy="0" r="50" fill="#0f172a" stroke="#cbd5e1" stroke-width="4" />
          <circle cx="0" cy="0" r="38" fill="#334155" />
          <path d="M -8,-25 L 8,-25 L 12,25 L -12,25 Z" fill="#94a3b8" />
          <line x1="0" y1="-34" x2="0" y2="-15" stroke="#ea580c" stroke-width="4" stroke-linecap="round" />
        </g>
        <g transform="translate(70, 0)">
          <circle cx="0" cy="0" r="50" fill="#0f172a" stroke="#cbd5e1" stroke-width="4" />
          <circle cx="0" cy="0" r="38" fill="#334155" />
          <path d="M -8,-25 L 8,-25 L 12,25 L -12,25 Z" fill="#94a3b8" />
          <line x1="0" y1="-34" x2="0" y2="-15" stroke="#ea580c" stroke-width="4" stroke-linecap="round" />
        </g>
      </g>
    `;
  } else {
    // parts & accessories
    illustration = `
      <!-- Burner Parts & Accessories -->
      <g transform="translate(300, 240)">
        <circle cx="-50" cy="0" r="50" fill="#ca8a04" stroke="#a16207" stroke-width="4" />
        <circle cx="-50" cy="0" r="35" fill="#0f172a" stroke="#f59e0b" stroke-width="4" stroke-dasharray="6 3" />
        <circle cx="-50" cy="0" r="18" fill="#eab308" />
        
        <circle cx="55" cy="0" r="45" fill="#18181b" stroke="#52525b" stroke-width="5" />
        <line x1="15" y1="0" x2="95" y2="0" stroke="#71717a" stroke-width="6" />
        <line x1="55" y1="-40" x2="55" y2="40" stroke="#71717a" stroke-width="6" />
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cbd5e1" />
      <stop offset="50%" stop-color="#f1f5f9" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="450" fill="url(#bgGrad)" />
  <rect x="20" y="20" width="560" height="410" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#shadow)" />

  <!-- Badge / Tag -->
  <g transform="translate(40, 42)">
    <rect x="0" y="0" width="130" height="24" rx="12" fill="${accentColor}" />
    <text x="65" y="16" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">
      ${badge}
    </text>
  </g>

  <!-- Model watermark -->
  <text x="560" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#94a3b8" text-anchor="end" letter-spacing="1">
    SKU: ${model}
  </text>

  <!-- Product Graphic -->
  <g>
    ${illustration}
  </g>

  <!-- Title & Subtitle at bottom -->
  <g transform="translate(300, 395)">
    <text x="0" y="0" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="800" fill="#0f172a" text-anchor="middle">
      ${title}
    </text>
    <text x="0" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="600" fill="#64748b" text-anchor="middle">
      Taj-e-Konain Gas Burner • Reliable Quality
    </text>
  </g>
</svg>`;
}

// 18 Demonstration Products Images
const productsData = [
  { file: 'p1-double-burner-glass.svg', title: 'Premium Tempered Glass Double Burner', model: 'TK-DG-201', type: 'stove-glass', badge: 'BEST SELLER' },
  { file: 'p2-double-burner-steel.svg', title: 'Heavy-Gauge Stainless Steel 2-Burner', model: 'TK-SS-202', type: 'stove-steel', badge: 'HEAVY DUTY' },
  { file: 'p3-triple-burner-glass.svg', title: '3-Burner Elegant Kitchen Glass Stove', model: 'TK-TG-303', type: 'stove-3b', badge: 'POPULAR' },
  { file: 'p4-four-burner-hob.svg', title: 'Luxury 4-Burner Built-In Gas Hob', model: 'TK-4B-404', type: 'hob-4b', badge: 'PREMIUM' },
  { file: 'p5-builtin-hob-stainless.svg', title: 'Stainless Steel 3-Burner Drop-In Hob', model: 'TK-SH-305', type: 'stove-3b', badge: 'DURABLE' },
  { file: 'p6-single-burner-portable.svg', title: 'Single Burner Auto-Ignition Table Stove', model: 'TK-SB-106', type: 'portable', badge: 'COMPACT' },
  { file: 'p7-commercial-cast-iron.svg', title: 'Heavy Cast Iron Commercial Cooking Burner', model: 'TK-CB-707', type: 'commercial', badge: 'COMMERCIAL' },
  { file: 'p8-heavy-duty-catering.svg', title: 'Dual-Ring Hotel & Catering Gas Stove', model: 'TK-DR-808', type: 'commercial', badge: 'HIGH OUTPUT' },
  { file: 'p9-gas-regulator-meter.svg', title: 'Low-Pressure LPG Regulator with Pressure Meter', model: 'TK-RG-909', type: 'regulator', badge: 'SAFETY CERTIFIED' },
  { file: 'p10-high-pressure-regulator.svg', title: 'High-Pressure Heavy Commercial Gas Regulator', model: 'TK-HR-910', type: 'regulator', badge: 'HIGH PRESSURE' },
  { file: 'p11-gas-hose-braided.svg', title: 'Steel-Wire Braided Explosion-Proof Gas Hose (2m)', model: 'TK-GH-111', type: 'hose', badge: 'EXTRA SAFE' },
  { file: 'p12-heavy-brass-burner-cap.svg', title: 'Pure Brass Burner Cap & Flame Ring Set', model: 'TK-BC-112', type: 'parts', badge: 'PURE BRASS' },
  { file: 'p13-cast-iron-pan-trivet.svg', title: 'Non-Slip Heavy Cast Iron Pan Trivet Stand', model: 'TK-TS-113', type: 'parts', badge: 'NON-SLIP' },
  { file: 'p14-stove-knobs-set.svg', title: 'Heat-Resistant Metallic Stove Knobs (Pack of 2)', model: 'TK-KB-114', type: 'knob', badge: 'UNIVERSAL FIT' },
  { file: 'p15-spark-igniter-kit.svg', title: 'Piezo Auto-Ignition Spark Replacement Kit', model: 'TK-IG-115', type: 'parts', badge: 'REPLACEMENT' },
  { file: 'p16-lpg-camping-stove.svg', title: 'Portable LPG Camping & Picnic Gas Stove', model: 'TK-CS-116', type: 'portable', badge: 'PORTABLE' },
  { file: 'p17-stove-maintenance-kit.svg', title: 'Nozzle Clearing Needles & Stove Cleaning Brush Set', model: 'TK-MK-117', type: 'parts', badge: 'MAINTENANCE' },
  { file: 'p18-brass-connector-nipples.svg', title: 'Brass Gas Pipe Connectors & Quick-Nipples (3 Pcs)', model: 'TK-CN-118', type: 'parts', badge: 'LEAK PROOF' },
];

productsData.forEach(p => {
  const content = generateProductSvg({
    title: p.title,
    model: p.model,
    badge: p.badge,
    type: p.type
  });
  saveSvg(p.file, content, 'products');
});

// Category Banners / Cards
const categoriesData = [
  { file: 'cat-double-burners.svg', title: 'Double Burner Stoves', desc: 'Glass & Stainless Steel', type: 'stove-glass' },
  { file: 'cat-triple-burners.svg', title: '3 & 4 Burner Stoves', desc: 'Family Kitchen Cooking', type: 'stove-3b' },
  { file: 'cat-builtin-hobs.svg', title: 'Built-in Gas Hobs', desc: 'Modern Modular Countertops', type: 'hob-4b' },
  { file: 'cat-commercial.svg', title: 'Commercial Burners', desc: 'Restaurant & Heavy Duty', type: 'commercial' },
  { file: 'cat-regulators.svg', title: 'Regulators & Safety Valves', desc: 'LPG & Sui Gas Ready', type: 'regulator' },
  { file: 'cat-accessories.svg', title: 'Hoses, Knobs & Spare Parts', desc: 'Genuine Quality Accessories', type: 'parts' },
];

categoriesData.forEach(c => {
  const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 320" width="100%" height="100%">
    <defs>
      <linearGradient id="catBg_${c.type}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
    </defs>
    <rect width="500" height="320" rx="20" fill="url(#catBg_${c.type})" />
    <circle cx="400" cy="160" r="140" fill="#ea580c" opacity="0.08" />
    <circle cx="100" cy="60" r="80" fill="#f59e0b" opacity="0.05" />
    
    <g transform="translate(40, 110)">
      <rect x="0" y="0" width="80" height="6" rx="3" fill="#ea580c" />
      <text x="0" y="45" font-family="'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="800" fill="#ffffff">${c.title}</text>
      <text x="0" y="75" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#94a3b8">${c.desc}</text>
      <g transform="translate(0, 105)">
        <rect x="0" y="0" width="130" height="36" rx="18" fill="#ea580c" />
        <text x="65" y="23" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">View Products →</text>
      </g>
    </g>
  </svg>`;
  saveSvg(c.file, content, 'categories');
});

// Hero Banner Image
const heroBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="100%" height="100%">
  <defs>
    <linearGradient id="heroDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f17" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="heroFlame" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="60%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#fde047" />
    </linearGradient>
    <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ea580c" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#0b0f17" stop-opacity="0" />
    </radialGradient>
  </defs>
  
  <rect width="1200" height="600" fill="url(#heroDark)" />
  <circle cx="850" cy="300" r="350" fill="url(#flameGlow)" />
  
  <!-- Stylized Gas Stove Visual on Right -->
  <g transform="translate(680, 150)">
    <!-- Stove Platform -->
    <rect x="0" y="80" width="460" height="240" rx="24" fill="#090d16" stroke="#ea580c" stroke-width="3" />
    <!-- Blue Glow Underneath -->
    <ellipse cx="230" cy="320" rx="180" ry="20" fill="#38bdf8" opacity="0.15" />
    
    <!-- Left Burner with Active Blue & Orange Flame -->
    <g transform="translate(130, 190)">
      <circle cx="0" cy="0" r="60" fill="#1e293b" stroke="#f97316" stroke-width="4" />
      <circle cx="0" cy="0" r="45" fill="#0f172a" />
      <!-- Flame spikes -->
      <path d="M 0,-55 C -15,-40 -25,-20 0,-70 C 25,-20 15,-40 0,-55 Z" fill="url(#heroFlame)" />
      <circle cx="0" cy="0" r="30" fill="#38bdf8" opacity="0.85" />
      <circle cx="0" cy="0" r="15" fill="#fde047" />
    </g>
    
    <!-- Right Burner -->
    <g transform="translate(330, 190)">
      <circle cx="0" cy="0" r="60" fill="#1e293b" stroke="#f97316" stroke-width="4" />
      <circle cx="0" cy="0" r="45" fill="#0f172a" />
      <path d="M 0,-55 C -15,-40 -25,-20 0,-70 C 25,-20 15,-40 0,-55 Z" fill="url(#heroFlame)" />
      <circle cx="0" cy="0" r="30" fill="#38bdf8" opacity="0.85" />
      <circle cx="0" cy="0" r="15" fill="#fde047" />
    </g>
    
    <!-- Controls -->
    <circle cx="150" cy="285" r="15" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
    <circle cx="310" cy="285" r="15" fill="#e2e8f0" stroke="#475569" stroke-width="2" />
  </g>
</svg>`;

saveSvg('hero-banner.svg', heroBannerSvg);

console.log('Successfully generated all professional brand assets and 18 demonstration product SVGs!');
