function clearFields() {
  document.getElementById("charsOnly").checked = false;
  document.getElementById("charsWithSymbols").checked = false;
  document.getElementById("length").value = "";
  document.getElementById("genPassword").value = "";
  document.getElementById("note").value = "";
  document.getElementById("checkboxError").innerHTML = ""
  document.getElementById("lengthError").innerHTML = ""
  document.getElementById("copied").innerHTML = ""
}

function copyPass() {
  const copyPass = document.getElementById("genPassword");
  if (copyPass.value) {
    //selecting text
    copyPass.select();
    copyPass.setSelectionRange(0, 99999); //for mobiles

    document.execCommand("copy"); //copying

    document.getElementById("copied").innerHTML = "Copied!";
  }
}
