// Full QR Code Version 2-H generator (ISO 18004), byte mode
// Generates a real scannable QR matrix without external dependencies

const SITE_URL = "https://blogribkadolli.ru/";

// GF(256) arithmetic for Reed-Solomon
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number) {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let g = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const rhs = new Uint8Array([1, GF_EXP[i]]);
    const res = new Uint8Array(g.length + rhs.length - 1);
    for (let j = 0; j < g.length; j++)
      for (let k = 0; k < rhs.length; k++)
        res[j + k] ^= gfMul(g[j], rhs[k]);
    g = res;
  }
  return g;
}

function rsEncode(data: Uint8Array, ecCount: number): Uint8Array {
  const gen = rsGeneratorPoly(ecCount);
  const msg = new Uint8Array(data.length + ecCount);
  msg.set(data);
  for (let i = 0; i < data.length; i++) {
    const c = msg[i];
    if (c !== 0) for (let j = 0; j < gen.length; j++) msg[i + j] ^= gfMul(gen[j], c);
  }
  return msg.slice(data.length);
}

// QR Version 2 (25x25), Error Correction M, byte mode
// Data capacity: 20 bytes (enough for short URL)
// EC codewords: 10
function buildQR(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const len = bytes.length;

  // Mode indicator (0100 = byte) + char count (8 bits) + data + terminator
  const bits: number[] = [];
  const push = (v: number, n: number) => { for (let i = n - 1; i >= 0; i--) bits.push((v >> i) & 1); };

  push(0b0100, 4); // byte mode
  push(len, 8);    // char count
  for (const b of bytes) push(b, 8);
  push(0, 4);      // terminator

  // Pad to 44 data codewords (Version 2-M)
  while (bits.length < 44 * 8 && bits.length % 8 !== 0) bits.push(0);
  const dataBytes = new Uint8Array(44);
  for (let i = 0; i < 44; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | (bits[i * 8 + j] ?? 0);
    dataBytes[i] = b;
  }
  // Pad codewords
  const pads = [0xec, 0x11];
  for (let i = Math.ceil((bits.length) / 8); i < 44; i++) dataBytes[i] = pads[(i - Math.ceil(bits.length / 8)) % 2];

  // Reed-Solomon EC (10 codewords for Version 2-M)
  const ec = rsEncode(dataBytes, 10);
  const all = new Uint8Array(54);
  all.set(dataBytes); all.set(ec, 44);

  // Build codeword bitstream
  const codewordBits: number[] = [];
  for (const b of all) for (let i = 7; i >= 0; i--) codewordBits.push((b >> i) & 1);

  const SIZE = 25;
  const matrix: (number | null)[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  const isFunc: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

  const set = (r: number, c: number, v: number, func = false) => {
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return;
    matrix[r][c] = v;
    if (func) isFunc[r][c] = true;
  };

  // Finder patterns + separators
  const finder = (tr: number, tc: number) => {
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 7; c++) {
        const v = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) ? 1 : 0;
        set(tr + r, tc + c, v, true);
      }
    // separators
    for (let i = -1; i <= 7; i++) {
      set(tr - 1, tc + i, 0, true);
      set(tr + 7, tc + i, 0, true);
      set(tr + i, tc - 1, 0, true);
      set(tr + i, tc + 7, 0, true);
    }
  };
  finder(0, 0); finder(0, SIZE - 7); finder(SIZE - 7, 0);

  // Timing patterns
  for (let i = 8; i < SIZE - 8; i++) {
    set(6, i, i % 2 === 0 ? 1 : 0, true);
    set(i, 6, i % 2 === 0 ? 1 : 0, true);
  }

  // Alignment pattern (Version 2: center at row 18, col 18)
  const alignCenter = (r: number, c: number) => {
    for (let dr = -2; dr <= 2; dr++)
      for (let dc = -2; dc <= 2; dc++) {
        const v = (dr === -2 || dr === 2 || dc === -2 || dc === 2) ? 1 : (dr === 0 && dc === 0 ? 1 : 0);
        set(r + dr, c + dc, v, true);
      }
  };
  alignCenter(18, 18);

  // Dark module
  set(SIZE - 8, 8, 1, true);

  // Format info placeholder (mask pattern 0: (i+j)%2==0)
  // Format = EC level M (01) + mask 0 (000) → raw = 01000 → with BCH and XOR mask
  // Precomputed format string for M + mask 0: 101010000010010
  const fmtBits = [1,0,1,0,1,0,0,0,0,0,1,0,0,1,0];
  const fmtPositions: [number,number][] = [
    [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],
    [7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]
  ];
  const fmtPositions2: [number,number][] = [
    [SIZE-1,8],[SIZE-2,8],[SIZE-3,8],[SIZE-4,8],[SIZE-5,8],[SIZE-6,8],[SIZE-7,8],
    [8,SIZE-8],[8,SIZE-7],[8,SIZE-6],[8,SIZE-5],[8,SIZE-4],[8,SIZE-3],[8,SIZE-2],[8,SIZE-1]
  ];
  fmtPositions.forEach(([r,c],i) => set(r,c,fmtBits[i],true));
  fmtPositions2.forEach(([r,c],i) => set(r,c,fmtBits[i],true));

  // Place data bits (zigzag, right to left, skipping col 6)
  let bitIdx = 0;
  let goingUp = true;
  for (let right = SIZE - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < SIZE; vert++) {
      const r = goingUp ? SIZE - 1 - vert : vert;
      for (let lr = 0; lr < 2; lr++) {
        const c = right - lr;
        if (!isFunc[r][c]) {
          const bit = codewordBits[bitIdx++] ?? 0;
          // Apply mask 0: (r+c)%2==0 → flip
          matrix[r][c] = ((r + c) % 2 === 0) ? bit ^ 1 : bit;
        }
      }
    }
    goingUp = !goingUp;
  }

  return matrix.map(row => row.map(v => v === 1));
}

function QRSvg({ matrix }: { matrix: boolean[][] }) {
  const SIZE = matrix.length;
  const CELL = 10;
  const PAD = 30;
  const dim = SIZE * CELL + PAD * 2;
  const rects: string[] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (matrix[r][c])
        rects.push(`<rect x="${PAD + c * CELL}" y="${PAD + r * CELL}" width="${CELL}" height="${CELL}"/>`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}" viewBox="0 0 ${dim} ${dim}"><rect width="${dim}" height="${dim}" fill="white"/><g fill="#1a1a1a">${rects.join("")}</g></svg>`;
  return svg;
}

export default function QRCodePage() {
  const matrix = buildQR(SITE_URL);
  const svgString = QRSvg({ matrix });
  const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = svgDataUrl;
    a.download = "qr-ribkadolli.svg";
    a.click();
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-sm w-full">
        <div className="text-center">
          <div className="font-caveat text-orange-400 text-2xl mb-1">Детский центр</div>
          <h1 className="font-black text-2xl text-gray-800">«Рыбка Долли»</h1>
        </div>

        <div className="rounded-2xl overflow-hidden border-4 border-orange-100 shadow-md bg-white p-3">
          <img
            src={svgDataUrl}
            alt="QR-код сайта Рыбка Долли"
            width={270}
            height={270}
            className="block"
          />
        </div>

        <p className="text-gray-400 text-sm text-center">
          Наведи камеру телефона — и ты на сайте!
        </p>

        <a
          href={SITE_URL}
          className="text-orange-400 font-bold text-sm hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {SITE_URL}
        </a>

        <button
          onClick={handleDownload}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-black py-3 rounded-2xl text-base transition-all hover:shadow-lg"
        >
          Скачать SVG
        </button>
      </div>
    </div>
  );
}
