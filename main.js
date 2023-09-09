const passLenBox = document.getElementById("passwordLength");
const passwordBox = document.getElementById("password");
const button = document.querySelector("button");
const resetBtn = document.getElementById("resetBtn");
const copyIcon = document.getElementById("copyIcon");
const msgBox = document.getElementById("notificationBox");

const uppercaseCheckbox = document.getElementById("uppercaseCheckbox");
const lowercaseCheckbox = document.getElementById("lowercaseCheckbox");
const numberCheckbox = document.getElementById("numberCheckbox");
const symbolCheckbox = document.getElementById("symbolCheckbox");

const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_-+=<>?";

// Function to check length
function checkLenth() {
  const length = parseInt(passLenBox.value);
  let msg;
  const MIN_LENGTH = 8;
  const MAX_LENGTH = 32;
  if (isNaN(length)) {
    passLenBox.value = "";
    passwordBox.value = "";
    // handle invalid input, e.g. show an error message
    msg = "Invalid length!";
    createNotification(msg);
    throw new Error(msg); // Throw an error instead of returning nothing
  } else if (length < MIN_LENGTH) {
    passLenBox.value = "";
    passwordBox.value = "";
    // handle invalid input, e.g. show an error message
    msg = "Invalid length! Minimum length is 8.";
    createNotification(msg);
    throw new Error(msg); // Throw an error instead of returning nothing
  } else if (length > MAX_LENGTH) {
    passLenBox.value = "";
    passwordBox.value = "";
    // handle invalid input, e.g. show an error message
    msg = "Invalid length! Maximum length is 32.";
    createNotification(msg);
    throw new Error(msg); // Throw an error instead of returning nothing
  }

  return length;
}

// Function to generate character set
function generateCharacterSet() {
  const charSet = [];

  const checkboxes = [
    { checkbox: uppercaseCheckbox, chars: uppercaseChars },
    { checkbox: lowercaseCheckbox, chars: lowercaseChars },
    { checkbox: numberCheckbox, chars: numberChars },
    { checkbox: symbolCheckbox, chars: symbolChars },
  ];

  for (const { checkbox, chars } of checkboxes) {
    if (checkbox.checked) {
      charSet.push(chars);
    }
  }

  if (charSet.length === 0) {
    msg = "Invalid: No character sets are selected!";
    createNotification(msg);
    throw new Error(msg); // Throw an error instead of returning nothing
  }

  return charSet.join("");
}

// Function to generate password
function createPassword(event) {
  event.preventDefault();

  const length = checkLenth();
  const charSet = generateCharacterSet();

  const passwordArray = [];
  while (passwordArray.length < length) {
    passwordArray.push(charSet[Math.floor(Math.random() * charSet.length)]);
  }
  // Turn passwordArray into a string
  const password = passwordArray.join("");

  passwordBox.value = password;
}

// Function to reset password
function resetInput(event) {
  event.preventDefault();

  if (!passLenBox || !passwordBox) {
    throw new Error("Elements not found");
  }

  passLenBox.value = "";
  passwordBox.value = "";
  const checkboxes = [
    uppercaseCheckbox,
    lowercaseCheckbox,
    numberCheckbox,
    symbolCheckbox,
  ];
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

// Function to copy password
function copyPassword(event) {
  // Checking clipboard API is available or not.
  if (navigator.clipboard) {
    // Check if passwordBox.value is not null before accessing its value.
    if (passwordBox.value !== "") {
      // Prevent the default action of the event.
      event.preventDefault();
      navigator.clipboard
        .writeText(passwordBox.value)
        // Handle Promise returned by `navigator.clipboard`.
        .then(() => {
          let msg = "Success: Copy password to the clipboard.";
          createNotification(msg);
        })
        .catch((error) => {
          let msg = "Error: Failed to copy password to the clipboard.";
          createNotification(msg);
          console.error(error);
        });
    } else {
      // Handle case when passwordBox.value is null.
      let msg = "Error: Password Box is Empty.";
      createNotification(msg);
      throw new Error(msg);
    }
  } else {
    // Handle case when clipboard API is not available.
    let msg = "Error: Clipboard API is not supported in this browser.";
    createNotification(msg);
    throw new Error(msg);
  }
}

function createNotification(msg, duration = 3000) {
  // A temporary notification or a status message in the UI.
  const notification = document.createElement("div");
  notification.classList.add("notification");
  let notifications = msgBox.getElementsByClassName("notification");
  notification.textContent = msg;
  msgBox.appendChild(notification);

  // if (msg.includes("Success")) {
  //   notification.classList.add("success");
  // }
  // if (msg.includes("Error")) {
  //   notification.classList.add("error");
  // }
  // if (msg.includes("Invalid")) {
  //   notification.classList.add("invalid");
  // }

  const messageTypeMap = {
    Success: "success",
    Error: "error",
    Invalid: "invalid",
  };
  const messageType = Object.keys(messageTypeMap).find((key) =>
    msg.includes(key)
  );
  if (messageType) {
    notification.classList.add(messageTypeMap[messageType]);
  }

  if (notifications.length > 2) {
    // msgBox.removeChild(notifications[0]);
    notifications[0].remove();
  }

  setTimeout(() => {
    msgBox.removeChild(notification);
  }, duration);
}

button.addEventListener("click", createPassword);
resetBtn.addEventListener("click", resetInput);
copyIcon.addEventListener("click", copyPassword);
