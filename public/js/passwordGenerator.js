// program to generate random strings
function generateRandomString() {
  //get the values
  const choiceCharsOnly = document.getElementById("charsOnly").checked;
  const choiceCharsWithSymbols = document.getElementById("charsWithSymbols")
    .checked;
  const checkboxError = document.getElementById("checkboxError");
  const lengthError = document.getElementById("lengthError");

  let length = document.getElementById("length").value;
  length = parseInt(length)

  // declare all characters
  const charactersOnly =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersWithSymbols =
    "ABCDEFGHINOPQRSabcdefghinopqrs0123456789%&+<>#:$-?";

  let result = "";

  if (choiceCharsOnly) {
    if (length >= 5 && length <= 80) {
      const charactersLength = charactersOnly.length;
      checkboxError.innerHTML = "";
      lengthError.innerHTML = "";
      for (let i = 0; i < length; i++) {
        result += charactersOnly.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
    } else {
      lengthError.innerHTML = "Provide password length (5-80)!";
    }
  } else if (choiceCharsWithSymbols) {
    if (length >= 5 && length <= 80) {
      const charactersLength = charactersWithSymbols.length;
      checkboxError.innerHTML = "";
      lengthError.innerHTML = "";
      for (let i = 0; i < length; i++) {
        result += charactersWithSymbols.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
    } else {
      lengthError.innerHTML = "Provide password length (5-80)!";
    }
  } else {
    checkboxError.innerHTML = "Please select a generate method!";
  }

  //write in page
  document.getElementById("genPassword").value = result;
}
