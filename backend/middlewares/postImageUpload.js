const multer = require("multer");
const storage = multer.memoryStorage();
  const fileFilter = (req,file,cb)=>{

    if(file.mimetype=== "application/image"){
        cb(null,true)
    }else{
        cb(new Error("image is not upload"),false)
    }

  }
   const postUpload = multer({
        storage:storage,
        fileFilter:fileFilter,
        limits:{
            fileSize:10*1024*1024
        }

    })

  module.exports = postUpload;