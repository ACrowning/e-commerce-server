import fs from "fs/promises"
import path from "path";
import ShortUniqueId from "short-unique-id";
const uid = new ShortUniqueId({ length: 10 });

const saveImage = async (image: { name: any; data: any; }) => {
  const extension = path.extname(image.name);
  const imageName = uid.rnd() + extension;
  const uploadPath = path.join(__dirname, "../../uploads", imageName);

  await fs.writeFile(uploadPath, image.data);

  return imageName;
};

const saveAlbum = async (albumPhotos: any[]) => {
  const promises = albumPhotos.map((photo: any) => saveImage(photo));
  const albumNames = await Promise.all(promises);
  return albumNames;
};

const getImgPath = (imageName: any): any => {
  if (imageName) {
    return path.join(__dirname, "../../uploads", imageName);
  } else {
    return null;
  }
};

export {
  saveImage,
  saveAlbum,
  getImgPath,
}