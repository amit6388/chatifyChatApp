export const getMediaType = (fileName) => {
    const ext = fileName.split('.')[1]
    const imageFormat = ["png", "jpg", "jpeg", "PNG", "JPG", "JPEG"];
    const videoFormat = [
      "mp4",
      "MP4",
      "mov",
      "MOV",
      "WMV",
      "wmv",
      "WebM",
      "webm",
      "AVI",
      "avi",
      "FLV",
      "flv",
      "MKV",
      "mkv",
    ];
    if (imageFormat.includes(ext)) {
      return "IMAGE";
    }
    if (videoFormat.includes(ext)) {
      return "VIDEO";
    }
    return "OTHER";
  };
  


export const copyTextMessage=(text)=>{
  let tempInput = document.createElement("input");
  tempInput.value = text;

  // Append the input element to the document
  document.body.appendChild(tempInput);

  // Select the text in the input
  tempInput.select();

  // Copy the selected text to the clipboard
  document.execCommand("copy");

  // Remove the input element from the document
  document.body.removeChild(tempInput);
}