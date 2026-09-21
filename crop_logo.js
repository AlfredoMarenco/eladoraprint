import Jimp from 'jimp';

async function cropLogo() {
    try {
        const image = await Jimp.read('public/images/logo.png');
        image.autocrop();
        await image.writeAsync('public/images/logo.png');
        console.log('Logo cropped successfully.');
    } catch (error) {
        console.error('Error cropping logo:', error);
    }
}

cropLogo();
