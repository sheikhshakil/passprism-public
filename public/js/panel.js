function handleDiv() {
  let createDiv = document.getElementById("create");
  let dbDiv = document.getElementById("db");
  let profileDiv = document.getElementById("profile");

  let buttons = document.getElementsByClassName("nav-option");

  if (dbDiv.classList.contains("show")) {
    createDiv.style.display = "none";
    profileDiv.style.display = "none";

    dbDiv.style.display = "block";
    buttons[1].classList.add("selectedOption");

    buttons[0].classList.remove("selectedOption");
    buttons[2].classList.remove("selectedOption");
  } 
  else if(profileDiv.classList.contains("show")) {
    profileDiv.style.display = "block";
    createDiv.style.display = "none";
    dbDiv.style.display = "none";

    buttons[2].classList.add("selectedOption");

    buttons[0].classList.remove("selectedOption");
    buttons[1].classList.remove("selectedOption");
  }
  else {
    profileDiv.style.display = "none";
    createDiv.style.display = "block";
    dbDiv.style.display = "none";

    buttons[0].classList.add("selectedOption");

    buttons[1].classList.remove("selectedOption");
    buttons[2].classList.remove("selectedOption");
  }

  buttons[0].addEventListener("click", () => {
    if (createDiv.style.display == "none") {
      createDiv.style.display = "block";
      buttons[0].classList.add("selectedOption");

      buttons[1].classList.remove("selectedOption");
      buttons[2].classList.remove("selectedOption");
      dbDiv.style.display = "none";
      profileDiv.style.display = "none";
    }
  });

  buttons[1].addEventListener("click", () => {
    if (dbDiv.style.display == "none") {
      dbDiv.style.display = "block";
      buttons[1].classList.add("selectedOption");

      buttons[0].classList.remove("selectedOption");
      buttons[2].classList.remove("selectedOption");
      createDiv.style.display = "none";
      profileDiv.style.display = "none";
    }
  });

  buttons[2].addEventListener("click", () => {
    if (profileDiv.style.display == "none") {
      profileDiv.style.display = "block";
      buttons[2].classList.add("selectedOption");

      buttons[0].classList.remove("selectedOption");
      buttons[1].classList.remove("selectedOption");
      createDiv.style.display = "none";
      dbDiv.style.display = "none";
    }
  });
}
