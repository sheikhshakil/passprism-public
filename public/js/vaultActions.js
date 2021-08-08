function vaultCopyAction() {
  let copyBtns = document.getElementsByClassName("vaultCopyBtn");

  for (let index = 0; index < copyBtns.length; index++) {
    const btn = copyBtns[index];
    btn.addEventListener("click", () => {
      const savedPass = document.getElementById("savedPass" + index);

      if (savedPass.value) {
        savedPass.select();
        savedPass.setSelectionRange(0, 99999); //for mobiles

        document.execCommand("copy"); //copying
        btn.innerHTML = "Copied!";
        btn.disabled = true;
      }
    });
  }
}


vaultCopyAction();

