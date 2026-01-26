#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pdfs = [
  { level: 'Bachelors', file: path.join(__dirname, '..', 'public', 'BU_Exam-II_Skills-Bachelors_BW.pdf') },
  { level: 'Masters', file: path.join(__dirname, '..', 'public', 'BU_Exam-II_Skills-Masters_BW.pdf') },
  { level: 'Doctorate', file: path.join(__dirname, '..', 'public', 'BU_Exam-II_Skills-Doctorate_BW.pdf') },
];

const skillCodes = ['S1','S2','S3','S4','S5','S6','S7','S8','S9','S10'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function checkPdftoppm() {
  const res = spawnSync('pdftoppm', ['-v'], { encoding: 'utf8' });
  return res.status === 0 || (res.stderr && res.stderr.includes('pdftoppm'));
}

if (!checkPdftoppm()) {
  console.error('pdftoppm not found on PATH. Please install poppler-utils (pdftoppm).');
  process.exit(1);
}

pdfs.forEach(({ level, file }) => {
  if (!fs.existsSync(file)) {
    console.warn(`PDF for ${level} not found at ${file} — skipping`);
    return;
  }

  const outDir = path.join(__dirname, '..', 'public', 'exam2_images', level);
  ensureDir(outDir);

  // Extract pages 1..10
  for (let i = 0; i < skillCodes.length; i++) {
    const page = i + 1;
    const outPrefix = path.join(outDir, `${level}_S${page}`);
    // pdftoppm -png -f PAGE -l PAGE input.pdf outprefix
    const args = ['-png', '-f', String(page), '-l', String(page), file, outPrefix];
    console.log(`[${level}] extracting page ${page} -> ${path.basename(outPrefix)}.png`);
    const res = spawnSync('pdftoppm', args, { stdio: 'inherit' });
    if (res.status !== 0) {
      console.error(`Failed to extract page ${page} for ${level}`);
    } else {
      // pdftoppm appends -1 for single file (outprefix-1.png) on some versions; normalize filename
      const candidate1 = `${outPrefix}.png`;
      const candidate2 = `${outPrefix}-1.png`;
      if (fs.existsSync(candidate2) && !fs.existsSync(candidate1)) {
        fs.renameSync(candidate2, candidate1);
      }
      // rename standardized to S code name: S{n}.png
      const finalPath = path.join(outDir, `S${page}.png`);
      if (fs.existsSync(candidate1)) {
        fs.renameSync(candidate1, finalPath);
      } else if (fs.existsSync(candidate2)) {
        fs.renameSync(candidate2, finalPath);
      } else {
        console.warn(`Neither ${candidate1} nor ${candidate2} exist for page ${page}`);
      }
    }
  }
});

console.log('Extraction completed.');
