"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImgPath = exports.saveAlbum = exports.saveImage = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const uid = new short_unique_id_1.default({ length: 10 });
const saveImage = (image) => __awaiter(void 0, void 0, void 0, function* () {
    const extension = path_1.default.extname(image.name);
    const imageName = uid.rnd() + extension;
    const uploadPath = path_1.default.join(__dirname, "../../uploads", imageName);
    yield promises_1.default.writeFile(uploadPath, image.data);
    return imageName;
});
exports.saveImage = saveImage;
const saveAlbum = (albumPhotos) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = albumPhotos.map((photo) => saveImage(photo));
    const albumNames = yield Promise.all(promises);
    return albumNames;
});
exports.saveAlbum = saveAlbum;
const getImgPath = (imageName) => {
    if (imageName) {
        return path_1.default.join(__dirname, "../../uploads", imageName);
    }
    else {
        return null;
    }
};
exports.getImgPath = getImgPath;
//# sourceMappingURL=uploadService.js.map