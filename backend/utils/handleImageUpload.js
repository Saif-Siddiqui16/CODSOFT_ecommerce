import { handleUpload } from "./cloudinary.js";

const handleImageUpload = async (file) => {
  try {
    if (!file || !file.buffer || !file.mimetype) {
      throw new Error("Invalid file provided");
    }
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);

    return cldRes;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw new Error("Image upload failed");
  }
};
export default handleImageUpload;
