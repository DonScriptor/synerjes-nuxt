const imgFileTypes = ["jpg", "jpeg", "png", "svg", "gif", "JPG", "JPEG", "PNG", "GIF", "SVG"];

export const getFileExtension = message => {
  let msgExt = message.slice(((message.lastIndexOf(".") - 1) >>> 0) + 2);
  return imgFileTypes.includes(msgExt) ? "image" : "notValid";
};


export default { getFileExtension };
