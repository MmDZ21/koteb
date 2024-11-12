import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.LIARA_ACCESS_KEY_ID,
  secretAccessKey: process.env.LIARA_SECRET_ACCESS_KEY,
  endpoint: process.env.LIARA_ENDPOINT, // Replace with your Liara endpoint
});

export { s3 };
