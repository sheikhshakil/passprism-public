exports.decrypt = (hash) => {
  let plainText = "";
  for (const char of hash) {
    if (char.charCodeAt() <= 122) {
      let temp = char.charCodeAt() + 4;
      let oldChar = String.fromCharCode(temp);
      plainText = plainText + oldChar;
    } else {
      plainText = plainText + char;
    }
  }
  return plainText;
};

