const fs = require("fs").promises;
const path = require("path");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

const uploadDir = path.join(__dirname, "../../uploads");

const ensureUploadDirExists = async () => {
  try {
    await fs.access(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir);
  }
};

const saveImage = async (image) => {
  await ensureUploadDirExists();

  const extension = path.extname(image.name);
  const imageName = uid.rnd() + extension;
  const uploadPath = path.join(uploadDir, imageName);

  await fs.writeFile(uploadPath, image.data);

  return imageName;
};

const saveAlbum = async (albumPhotos) => {
  const albumNames = [];

  for (const photo of albumPhotos) {
    const imageName = await saveImage(photo);
    albumNames.push(imageName);
  }

  return albumNames;
};

module.exports = {
  saveImage,
  saveAlbum,
};
