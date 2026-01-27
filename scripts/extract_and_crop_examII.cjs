#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const mapPath = path.join(__dirname, 'exam2_figs_map.json');
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

const pdfs = {
  Bachelors: path.join(__dirname, '..', 'public', 'BU_Exam-II_Skills-Bachelors_BW.pdf'),
  Masters: path.join(__dirname, '..', 'public', 'BU_Exam-II_Skills-Masters_BW.pdf'),
  Doctorate: path.join(__dirname, '..', 'public', 'BU_Exam-II_Skills-Doctorate_BW.pdf'),
};

function checkTool(cmd) {
  const res = spawnSync(cmd, ['-version'], { encoding: 'utf8' });
  return res.status === 0 || res.stdout || res.stderr;
}

function hasMagick() {
  const res = spawnSync('magick', ['-version'], { encoding: 'utf8' });
  return res.status === 0 || (res.stdout && res.stdout.includes('ImageMagick')) || (res.stderr && res.stderr.includes('ImageMagick'));
}

function hasConvert() {
  const res = spawnSync('convert', ['-version'], { encoding: 'utf8' });
  return res.status === 0 || (res.stdout && res.stdout.includes('ImageMagick')) || (res.stderr && res.stderr.includes('ImageMagick'));
}

if (!spawnSync('pdftoppm', ['-v'], { encoding: 'utf8' }).stderr) {
  // pdftoppm available check is fuzzy; assume installed
}

const useMagick = hasMagick() ? 'magick' : hasConvert() ? 'convert' : null;
if (!useMagick) {
  console.error('ImageMagick not found (magick or convert). Please install ImageMagick.');
  process.exit(1);
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

const tmpDir = path.join(__dirname, '..', 'tmp', 'exam2_extract');
ensureDir(tmpDir);
ensureDir(path.join(__dirname, '..', 'public', 'exam2_images'));

Object.keys(map).forEach((level) => {
  const pdf = pdfs[level];
  if (!fs.existsSync(pdf)) {
    console.warn(`PDF not found for ${level} at ${pdf} — skipping`);
    return;
  }

  const outDir = path.join(__dirname, '..', 'public', 'exam2_images', level);
  ensureDir(outDir);

  Object.keys(map[level]).forEach((skill) => {
    const info = map[level][skill];
    const page = info.page;
    const prefix = path.join(tmpDir, `${level}_${skill}`);

    // Render page at 300 DPI
    const pdftoArgs = ['-png', '-r', '300', '-f', String(page), '-l', String(page), pdf, prefix];
    console.log(`[${level}] pdftoppm page ${page} -> tmp`);
    const pdfr = spawnSync('pdftoppm', pdftoArgs, { stdio: 'inherit' });
    if (pdfr.status !== 0) {
      console.error(`pdftoppm failed for ${level} page ${page}`);
      return;
    }

    // find generated file (prefix-1.png or prefix-01.png or prefix-1.png variant)
    const candidates = fs.readdirSync(tmpDir).filter((f) => f.startsWith(`${level}_${skill}`) && f.endsWith('.png'));
    if (candidates.length === 0) {
      console.warn(`No image produced for ${level} ${skill}`);
      return;
    }
    const src = path.join(tmpDir, candidates[0]);

    // If crop info in percent provided, compute pixels from image size
    const stat = spawnSync(useMagick, ['identify', '-format', '%w %h', src], { encoding: 'utf8' });
    if (stat.status !== 0) {
      console.warn(`Failed to get size for ${src}`);
      return;
    }
    const [w, h] = stat.stdout.trim().split(' ').map(Number);

    let cropGeometry = null;
    if (info.crop && info.crop.xPct != null) {
      const x = Math.round(w * info.crop.xPct);
      const y = Math.round(h * info.crop.yPct);
      const cw = Math.round(w * info.crop.wPct);
      const ch = Math.round(h * info.crop.hPct);
      cropGeometry = `${cw}x${ch}+${x}+${y}`;
    } else {
      // default: central 84x80% (fallback)
      const x = Math.round(w * 0.08);
      const y = Math.round(h * 0.10);
      const cw = Math.round(w * 0.84);
      const ch = Math.round(h * 0.80);
      cropGeometry = `${cw}x${ch}+${x}+${y}`;
    }

    const out = path.join(outDir, `${skill}.png`);
    console.log(`[${level}] cropping ${src} -> ${out} (${cropGeometry})`);
    const cropRes = spawnSync(useMagick, [src, '-crop', cropGeometry, '+repage', '-quality', '90', out], { stdio: 'inherit' });
    if (cropRes.status !== 0) {
      console.error(`ImageMagick crop failed for ${src}`);
    } else {
      console.log(`Wrote ${out}`);
    }

    // optional: remove tmp file
    fs.unlinkSync(src);
  });
});

console.log('extract_and_crop_examII completed.');
