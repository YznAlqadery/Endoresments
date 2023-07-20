import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  push,
  ref,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  databaseURL:
    "https://endoresements-333ce-default-rtdb.europe-west1.firebasedatabase.app/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const endoresementsInDB = ref(database, "endoresements");

const inputField = document.getElementById("input-field");
const fromInputField = document.getElementById("from-input-field");
const toInputField = document.getElementById("to-input-field");
const publishButton = document.getElementById("publish-btn");
const endoresementsUl = document.getElementById("endoresments-list");

function clearInputFields() {
  inputField.value = "";
  toInputField.value = "";
  fromInputField.value = "";
}

function clearList() {
  endoresementsUl.innerHTML = "";
}
publishButton.addEventListener("click", function () {
  let inputValue = inputField.value;
  let toValue = toInputField.value;
  let fromValue = fromInputField.value;
  if (inputValue != "" && toValue != "" && fromValue != "") {
    const fieldValues = {
      message: inputValue,
      to: toValue,
      from: fromValue,
    };
    push(endoresementsInDB, fieldValues);
    clearInputFields();
  }
});

onValue(endoresementsInDB, function (snapshot) {
  if (snapshot.exists()) {
    clearList();
    let endoresementsArray = Object.entries(snapshot.val());
    for (let i = 0; i < endoresementsArray.length; i++) {
      let currentEndoresement = endoresementsArray[i];
      let currentEndoresementID = currentEndoresement[0];
      let currentEndoresementValue = currentEndoresement[1];
      addEndoresementToList(currentEndoresement);
    }
  } else {
    endoresementsUl.innerHTML = "No endoresements...";
  }
});

function addEndoresementToList(endoresement) {
  let endoresementID = endoresement[0];
  let endoresementValue = endoresement[1];
  let endoresementMessage = endoresementValue.message;
  let reciever = endoresementValue.to;
  let messenger = endoresementValue.from;

  let newList = document.createElement("li");
  let recieverElement = document.createElement("span");
  let messengerElement = document.createElement("span");
  let message = document.createElement("p");
  recieverElement.textContent = `TO: ${reciever}`;
  messengerElement.textContent = `FROM: ${messenger}`;
  message.textContent = endoresementMessage;
  newList.append(messengerElement, message, recieverElement);
  newList.addEventListener("click", function () {
    let locationOfDeletedItem = ref(
      database,
      `endoresements/${endoresementID}`
    );
    remove(locationOfDeletedItem);
  });
  endoresementsUl.append(newList);
}
