// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: "public/uploads",
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const filename = `${uniqueSuffix}-${file.originalname}`;
//     cb(null, filename);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 50,
//   },
// });

// module.exports = upload;

const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION, //eg. 'us-east-1'
});

// create s3 instance
const s3 = new aws.S3();

// configure multer middleware file upload

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read", // // Set the file access permissions to private
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `${uniqueSuffix}-${file.originalname}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

module.exports = upload