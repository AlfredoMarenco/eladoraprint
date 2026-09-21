const { Jimp } = require('jimp');

async function cropLogo() {
    try {
        const image = await Jimp.read('public/images/logo.png');
        image.autocrop();
        await image.write('public/images/logo.png');
        console.log('Logo cropped successfully.');
    } catch (error) {
        console.error('Error cropping logo:', error);
    }
}

cropLogo();
