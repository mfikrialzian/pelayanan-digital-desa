const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function resizeIcons() {
    const inputPath = path.join(__dirname, '..', 'favicon.png');
    const outputDir = path.join(__dirname, '..', 'icons');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        console.log('Resizing to 192x192...');
        await sharp(inputPath)
            .resize(192, 192)
            .toFile(path.join(outputDir, 'icon-192.png'));
        
        console.log('Resizing to 512x512...');
        await sharp(inputPath)
            .resize(512, 512)
            .toFile(path.join(outputDir, 'icon-512.png'));

        // Maskable icon (usually just padded or same if no specific maskable provided)
        console.log('Generating maskable 512x512...');
        await sharp(inputPath)
            .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .toFile(path.join(outputDir, 'icon-maskable-512.png'));
        
        console.log('Icons generated successfully.');
    } catch (err) {
        console.error('Error resizing icons:', err);
    }
}

resizeIcons();
