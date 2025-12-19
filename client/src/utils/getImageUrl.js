// client/src/utils/getImageUrl.js
const BACKEND_URL = "http://localhost:5000";

export const getImageUrl = (img) => {
  if (!img) return "/default-avatar.png";

  // prevent base64 header overflow (431 error fix)
  if (img.startsWith("data:image")) {
    return "/default-avatar.png";
  }

  // already full URL
  if (img.startsWith("http")) {
    return img;
  }

  // backend uploads
  return `${BACKEND_URL}/${img}`;
};
