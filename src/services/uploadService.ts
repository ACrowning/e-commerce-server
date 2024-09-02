import fs from "fs/promises";
import path from "path";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 10 });

const saveImage = async (image: {
  name: string;
  data: Buffer;
}): Promise<string> => {
  const extension = path.extname(image.name);
  const imageName = uid.rnd() + extension;
  const uploadPath = path.join(__dirname, "../../uploads", imageName);

  await fs.writeFile(uploadPath, image.data);

  return imageName;
};

const saveAlbum = async (
  albumPhotos: { name: string; data: Buffer }[]
): Promise<string[]> => {
  const promises = albumPhotos.map((photo) => saveImage(photo));
  const albumNames = await Promise.all(promises);
  return albumNames;
};

const getImgPath = (imageName: string | null): string | null => {
  if (imageName) {
    return path.join(__dirname, "../../uploads", imageName);
  } else {
    return null;
  }
};

export { saveImage, saveAlbum, getImgPath };
