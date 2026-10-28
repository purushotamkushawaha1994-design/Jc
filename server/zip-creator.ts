import fs from 'fs';
import path from 'path';
import { ZipArchive } from 'archiver';

const ROOT_DIR = process.cwd();
const OUTPUT_ZIP = path.resolve(ROOT_DIR, 'public', 'janta-connect-source.zip');

export async function createSourceZip(): Promise<string> {
  const publicDir = path.resolve(ROOT_DIR, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(OUTPUT_ZIP);
    const archive = new ZipArchive({
      zlib: { level: 9 }, // Maximum compression
    });

    output.on('close', () => {
      console.log(`[ZIP] Archive created: ${archive.pointer()} total bytes at ${OUTPUT_ZIP}`);
      resolve(OUTPUT_ZIP);
    });

    output.on('error', (err) => {
      reject(err);
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('[ZIP Warning]', err);
      } else {
        reject(err);
      }
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Exclude heavy/redundant directories like node_modules and .git
    archive.glob('**/*', {
      cwd: ROOT_DIR,
      ignore: [
        'node_modules/**',
        '.git/**',
        '.cache/**',
        'dist/**',
        'public/janta-connect-source.zip',
        '**/*.tmp',
      ],
      dot: true,
    });

    archive.finalize();
  });
}
