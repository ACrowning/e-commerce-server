const fs = require("fs").promises;
const path = require("path");
const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

const saveImage = async (image) => {
  const extension = path.extname(image.name);
  const imageName = uid.rnd() + extension;
  const uploadPath = path.join(__dirname, "../../uploads", imageName);

  await fs.writeFile(uploadPath, image.data);

  return imageName;
};

const saveAlbum = async (albumPhotos) => {
  const promises = albumPhotos.map((photo) => saveImage(photo));
  const albumNames = await Promise.all(promises);
  return albumNames;
};

const getImgPath = (imageName) => {
  if (imageName) {
    return path.join(__dirname, "../../uploads", imageName);
  } else {
    return null;
  }
};

module.exports = {
  saveImage,
  saveAlbum,
  getImgPath,
};
