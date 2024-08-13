import Jimp from "jimp";
import jsQR from "jsqr";
import QRCode from "qrcode";

export const decodeQR = async (path: string) => {
  const image = await Jimp.read(path);

  const imageData = {
    data: new Uint8ClampedArray(image.bitmap.data),
    width: image.bitmap.width,
    height: image.bitmap.height,
  };

  const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);

  if (!decodedQR) {
    throw new Error("未找到二维码");
  }

  return decodedQR.data;
};

export const generateQRtoTerminal = (text: string) => {
  return QRCode.toString(
    text,
    { type: "terminal", small: true },
    function (err) {
      if (err) throw err;
    }
  );
};
