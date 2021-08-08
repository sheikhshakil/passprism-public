exports.encrypt = (plainText) => {
  let hash = "";
  for (const char of plainText) {
    if (char.charCodeAt() <= 122) {
      let temp = char.charCodeAt();
      temp -= 4;
      let newChar = String.fromCharCode(temp);
      hash = hash + newChar;
    } else {
      hash = hash + char;
    }
  }
  return hash;
};
