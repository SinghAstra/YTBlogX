import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Destination function called");
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    console.log("File received:", file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
