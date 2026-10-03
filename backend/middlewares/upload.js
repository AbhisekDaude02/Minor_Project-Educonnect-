// Making the middleware to upload the image in the multer

const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const {cloudinary} = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
   cloudinary:cloudinary,
   params:{
    folder:"educonnect/profilepic",
    allowed_formats:["jpg","jpeg","png","webp"]
   }
});

const upload = multer({
    storage:storage
});

module.exports = upload;