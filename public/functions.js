/* Get the value from the input box */
// let a = document.querySelector("#box-1");
// let b = document.querySelector("#box-2");
// let c = document.querySelector("#box-3");
// let d = document.querySelector("#box-4");

// let e = document.querySelector("#box-5");
const guessMsg2 = document.querySelector(".alert");
const winMsg2 = document.querySelector(".win");
const closeBtn2 = document.querySelector(".close-btn");
const guessBtn2 = document.querySelector(".guess-btn");
const getNumBtn2 = document.querySelector(".get-number");
const numberInputs2 = document.querySelectorAll(".number-input");
const inputCont2 = document.querySelector(".container");
const customInput2 = document.querySelector(".custom-number-input");
const backGame2 = document.querySelector(".back-game");
const createNum2 = document.querySelector(".create-num");
const readyBtn2 = document.querySelector(".ready-btn");
const customInpErr2 = document.querySelector(".custom-number-error");
const customNumCont2 = document.querySelector(".custom-number-container");
const historyTable12 = document.querySelector(".history-table");
const historyTable22 = document.querySelector(".history-table-2");
const guessHistory2 = document.querySelector(".guess-history");
const turnState2 = document.querySelector(".turn-state");
const lastInput2 = document.querySelector(".last-input");

const sockets = io();
sockets.on("connect", () => {
  console.log("connected to server");
  console.log(socket.id);
});
