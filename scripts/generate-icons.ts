import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const sizes = [72,96,128,144,152,192,400,512];
  const inputImage = path.join(process.cwd(), 'public', 'cpu-logo.jpg'); // Your original logo

  for (const size of sizes) {
    await sharp(inputImage)
      .resize(size, size)
      .png()
      .toFile(path.join(process.cwd(), 'public/icons/', `cpu-logo-${size}.png`));
  }
}

generateIcons().catch(console.error); 