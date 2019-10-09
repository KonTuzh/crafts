const imageDownload = require('image-download');
const sharp = require('sharp');
const slugify = require('slugify');

const jpeg = {
  quality: 90,
  progressive: true,
  chromaSubsampling: '4:4:4'
};

const resizeAndSave = async (buffer, path, sizes) => {
  await Promise.all(
    sizes.map(async size => {
      if (size.webp) {
        await sharp(buffer)
          .resize(size.width, size.height)
          .webp()
          .toFile(`${path}_${size.width}.webp`);
      }

      if (size.jpeg) {
        await sharp(buffer)
          .resize(size.width, size.height)
          .toFormat('jpeg')
          .jpeg(jpeg)
          .toFile(`${path}_${size.width}.jpeg`);
      }
    })
  );
};

exports.uploadPictureByUrl = async (file, path, sizes) => {
  imageDownload(file).then(async buffer => {
    resizeAndSave(buffer, path, sizes);
  });
};

exports.uploadPictureByBuffer = async (buffer, path, sizes) => {
  resizeAndSave(buffer, path, sizes);
};

exports.uploadMultiplePicturesFromForm = async (files, folder, width) => {
  const galery = [];
  await Promise.all(
    files.map(async file => {
      // eslint-disable-next-line no-useless-escape
      const originalname = slugify(file.originalname.replace(/[\.\/]/g, '-'), {
        lower: true
      });
      const filename = `${originalname}-${Date.now()}`;

      await sharp(file.buffer)
        .resize({ width })
        .webp()
        .toFile(`${folder}/${filename}.webp`);

      await sharp(file.buffer)
        .resize({ width })
        .toFormat('jpeg')
        .jpeg(jpeg)
        .toFile(`${folder}/${filename}.jpeg`);

      galery.push(filename);
    })
  );
  return galery;
};
