/* Get the value from the input box */
let a = document.querySelector("#box-1");
let b = document.querySelector("#box-2");
let c = document.querySelector("#box-3");
let d = document.querySelector("#box-4");
// let e = document.querySelector("#box-5");
const guessMsg = document.querySelector(".alert");
const winMsg = document.querySelector(".win");
const closeBtn = document.querySelector(".close-btn");
const guessBtn = document.querySelector(".guess-btn");
const getNumBtn = document.querySelector(".get-number");
const numberInputs = document.querySelectorAll(".number-input");
const customInput = document.querySelector(".custom-number-input");
const backGame = document.querySelector(".back-game");
const customInpErr = document.querySelector(".custom-number-error");
const customNumCont = document.querySelector(".custom-number-container");
const historyTable1 = document.querySelector(".history-table");
const historyTable2 = document.querySelector(".history-table-2");
const guessHistory = document.querySelector(".guess-history");
const turnState = document.querySelector(".turn-state");
const lastInput = document.querySelector(".last-input");

let el_await; // span element that tells user to wait
let hiddenNumber;
let customNum;
const playerList = document.querySelector(".player-list");
let yourOpponent;

const playerObj = {
  playing: false,
};

// import { repeatingNums } from "./functions.js";

// This function checks for repeating numbers
const repeatingNums = (Num) => {
  if (
    Num[0] === Num[1] ||
    Num[0] === Num[2] ||
    Num[0] === Num[3] ||
    Num[1] === Num[2] ||
    Num[1] === Num[3] ||
    Num[2] === Num[3]
  ) {
    return true;
  } else {
    return false;
  }
};

const players = [];
const socket = io();

let username = sessionStorage.getItem("username");
if (!username) {
  username = prompt("Enter a username: ");
  sessionStorage.setItem("username", username);
}
while (username === null || username === "") {
  username = prompt("Whats your username");
  sessionStorage.setItem("username", username);
}
let sendTo;

// shows player his/her username
document.querySelector(".your-username").textContent = `Username: ${username}`;

socket.on("connect", () => {
  console.log("connected to server");
  socket.emit("user:enter", { id: socket.id, username });
  // create an 4 digit number for the user
  let value = getNewNumber();
  console.log(socket.id);
  playerObj.id = socket.id;

  // code to enter/input custom

  players.push({ id: socket.id, username, value });
  // console.log(players);
});

socket.on("user:enter", (user) => {
  // create new player
  createNewPlayer(user);
});

socket.on("user:dump", (users) => {
  // Add new user to list of connected users
  for (let { id, username } of users) {
    if (id !== socket.id) {
      // create new player
      createNewPlayer({ id, username });
    }
  }
});

socket.on("user:leave", (id) => {
  // remove player from player list
  const player = document.getElementById(id);
  player.remove();
});

socket.on("submitAnswer:get", (msg) => {
  // console.log(msg);
  confirmAnswer(msg);
  guessBtn.disabled = false;
  // it's your turn to guess
  turnState.classList.add("active");
  turnState.textContent = `Your turn`;
  if (!guessBtn.disabled) {
    guessBtn.textContent = "Guess!";
  }
});

socket.on("receiveReport:get", (msg) => {
  // console.log("receiveReport", msg);
  showReport(msg);
});

socket.on("sendRequest:get", (msg) => {
  // console.log("sendRequest", "request sent");
  const response = confirm(`${msg.username} wants to play with you`);
  console.log(response);
  if (response) {
    console.log("testing");
    selectPlayer(msg.userId);
    playerObj.playing = true;
  }
  socket.emit("sendRequestResponse:post", msg.userId, response, socket.id);
});

socket.on("sendRequestResponse:get", (msg, userId) => {
  // console.log("sendRequestResponse", "response received");
  msg && selectPlayer(userId);
  !msg && alert("Player denied request");
  // if(msg){
  //   el_await.innerText = ""
  // }
  // if(!msg){
  //   el_await.innerText = ""
  // }
});

const getNewNumber = () => {
  let v = getRandomNumber();
  let w = getRandomNumber(v);
  let x = getRandomNumber(v, w);
  let y = getRandomNumber(v, w, x);
  // let z = getRandomNumber(v,w,y,x)

  hiddenNumber = [v, w, x, y];
  // clears input values
  numberInputs.forEach((input) => {
    input.value = "";
  });
  lastInput.value = "";
  // removes active classes
  guessBtn.classList.remove("active");
  getNumBtn.classList.remove("active");
  numberInputs.forEach((input) => {
    input.classList.remove("won-game");
  });
  winMsg.classList.remove("active");
  // remove guess history
  guessHistory.classList.remove("active");
  // removes turnState
  turnState.classList.remove("active");
  // undisable guess-btn
  guessBtn.disabled = false;
  guessMsg.textContent = "";

  // clearing history fields
  historyTable1.innerHTML = "";
  historyTable2.innerHTML = "";

  const displayedNumber = hiddenNumber.join("");
  document.querySelector(
    ".your-number"
  ).textContent = `Your number: ${displayedNumber}`;
  return hiddenNumber;
};

numberInputs.forEach((input) => {
  // move to the next input field when a number is entered
  input.addEventListener("input", (e) => {
    if (e.target.parentElement.nextElementSibling !== null) {
      if (e.target.value.length === 1) {
        e.target.parentElement.nextElementSibling.children[0].focus();
      }
    }
    if (e.target.parentElement.nextElementSibling === null) {
      e.target.blur();
    }
  });
});

// getNewNumber();

function getRandomNumber(a, b, c, d) {
  let number = Math.floor(Math.random() * 10);
  while (number === a || number === b || number === c || number === d) {
    number = Math.floor(Math.random() * 10);
  }

  return number;
}

// Array that stores guesses and responses
const historyArr = [];

// function to submit answer
function submitAnswer() {
  // let numbers = [Number(a.value), Number(b.value), Number(c.value), Number(d.value)];
  let numbers = [a.value, b.value, c.value, d.value];

  // New array created to avoid undefined inputs being printed as "0"
  const refineNumbers = numbers
    .map((curr) => {
      if (curr === "") {
        curr = undefined;
      } else {
        return Number(curr);
      }
    })
    .filter((curr) => curr !== undefined);

  if (refineNumbers.length < 4 || refineNumbers.length === 0) {
    alert("Insufficient Numbers!, choose another number");
    return;
  } else if (repeatingNums(refineNumbers)) {
    alert("Repeating Numbers detected!, choose another number");
    return;
  }

  const msg = {
    userId: socket.id,
    username,
    value: refineNumbers,
  };

  historyArr.push({
    guess: msg.value,
  });

  // code to append guesses and responses of player
  guessHistory.classList.add("active");
  document.querySelector(
    ".opponent-guess"
  ).textContent = `${yourOpponent}'s guesses`;

  let historyHtml;
  historyArr.forEach((el) => {
    historyHtml = ` <div class="history-row">
        <div class="history-guess">${el.guess.join("")}</div>
        <div class="history-response history-response-1"></div>
      </div>`;
  });
  historyTable1.insertAdjacentHTML("beforeend", historyHtml);

  guessBtn.disabled = true;

  turnState.classList.add("active");
  // your opponent is guessing..
  turnState.textContent = `${yourOpponent}'s turn`;
  // change content of button depending on state
  if (guessBtn.disabled) {
    guessBtn.textContent = "Wait!";
    // clears input fields when you have guessed
    document.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
  }
  // send answer to your opponent
  socket.emit("submitAnswer:post", sendTo, msg);
  console.log("answer submitted");
}

const historyArr2 = [];

// function to confirm answer
function confirmAnswer(msg) {
  console.log(hiddenNumber);
  // code to get how many numbers are dead
  const deadNum = hiddenNumber.flatMap((i, idx) => {
    return msg.value.filter((el, index) => {
      return i === el && idx === index;
    });
  }).length;

  // code to get how many numbers are injured
  const injuredNum = hiddenNumber.flatMap((i, idx) => {
    return msg.value.filter((el, index) => {
      return i === el && idx !== index;
    });
  }).length;

  // OLD CODE TO GET NUMBER OF DEAD AND INJURED VALUES
  // let deadArrComp = [];
  // let injuredArrComp = [];

  // hiddenNumber.forEach((i, idx) => {
  //   let deadArr = msg.value.filter((el, index) => {
  //     return i === el && idx === index;
  //   });
  //   let injuredArr = msg.value.filter((el, index) => {
  //     return i === el && idx !== index;
  //   });

  //   deadArrComp.push(deadArr);
  //   injuredArrComp.push(injuredArr);
  // });

  // let deadNum = deadArrComp.flat().length;
  // let injuredNum = injuredArrComp.flat().length;

  // console.log(msg.value);

  let report;

  report = `${deadNum} Dead, ${injuredNum} Injured`;

  // send the result of the opponents answer back to him
  socket.emit("receiveReport:post", msg.userId, report);

  historyArr2.push({
    guess: msg.value,
    response: report,
  });

  // code to append guesses and responses of opponent
  let historyHtml;
  historyArr2.forEach((el) => {
    historyHtml = ` <div class="history-row">
        <div class="history-guess">${el.guess.join("")}</div>
        <div class="history-response">${report}</div>
      </div>`;
  });
  historyTable2.insertAdjacentHTML("beforeend", historyHtml);

  // if the player loses
  if (report === `4 Dead, 0 Injured`) {
    document.querySelector(".span").textContent = `You Lose!`;
    winMsg.classList.add("active");
    numberInputs.forEach((input) => {
      input.classList.add("won-game");
    });

    // remove turnstate
    turnState.classList.remove("active");

    setTimeout(() => {
      guessBtn.classList.add("active");
      getNumBtn.classList.add("active");
    }, 100);
  }

  closeBtn.addEventListener("click", () => {
    winMsg.classList.remove("active");
  });
}

// function to show the result of your answer
function showReport(msg) {
  guessMsg.classList.add("active");
  guessMsg.textContent = msg;

  // showing response in player table
  const histResponsArr = Array.from(
    document.querySelectorAll(".history-response-1")
  );
  histResponsArr.slice(-1)[0].innerText = msg;

  // if the player wins
  if (msg === `4 Dead, 0 Injured`) {
    document.querySelector(".span").textContent = `You Win!`;
    winMsg.classList.add("active");
    numberInputs.forEach((input) => {
      input.classList.add("won-game");
    });

    // remove turnstate
    turnState.classList.remove("active");

    setTimeout(() => {
      guessBtn.classList.add("active");
      getNumBtn.classList.add("active");
    }, 100);
  }

  // close win or lose notification
  closeBtn.addEventListener("click", () => {
    winMsg.classList.remove("active");
  });
}

getNumBtn.addEventListener("click", getNewNumber);

// code to check for max length
document.querySelectorAll(".number-input").forEach((input) => {
  // console.log(input.maxLength);

  input.oninput = () => {
    if (input.value.length > input.maxLength) {
      input.value = input.value.slice(0, input.maxLength);
    }
  };
});

customInput.oninput = () => {
  if (customInput.value.length > customInput.maxLength) {
    customInput.value = customInput.value.slice(0, customInput.maxLength);
  }
};

lastInput.oninput = () => {
  if (lastInput.value.length > lastInput.maxLength) {
    lastInput.value = lastInput.value.slice(0, lastInput.maxLength);
  }
};

// function to create a player
function createNewPlayer(data) {
  // create a new player
  const divEl = document.createElement("div");
  const paraEl = document.createElement("p");
  const spanEl = document.createElement("span");

  // add player attributes
  divEl.id = `${data.id}`;
  paraEl.id = `${data.id}`;
  spanEl.id = `${data.id}`;
  // divEl.id = `div${data.id}`;
  // paraEl.id = `p${data.id}`;
  // spanEl.id = `span${data.id}`;

  divEl.className = "player";
  paraEl.className = "player-name";
  spanEl.className = "player-tag";

  paraEl.innerText = data.username;
  spanEl.innerText = data.username;

  // add click event handler
  divEl.addEventListener("click", sendRequest);

  // append elements to player
  divEl.appendChild(paraEl);
  divEl.appendChild(spanEl);

  // update player list with new player
  playerList.appendChild(divEl);
}

function sendRequest(e) {
  if (playerObj.playing) {
    alert("Please complete the current game");
    return;
  }
  const player = e.currentTarget;
  const msg = {
    userId: socket.id,
    username,
  };
  sendTo = player.id;

  // el_await = document.createElement("span");
  // el_await.className = "player-tag";
  // el_await.innerText = "waiting response";
  // player.appendChild(el_await);
  if (playerObj.playing) {
  }
  socket.emit("sendRequest:post", sendTo, msg);
}

// function to select a player
function selectPlayer(userId) {
  // get selected player
  const player = document.querySelector(`#${userId}`);
  yourOpponent = player.innerText;
  document.querySelector(
    ".opponent-username"
  ).textContent = `Opponent: ${yourOpponent}`;
  // make sure player isn't currently selected
  if (!player.classList.contains("player--selected")) {
    // remove previously highlighted player
    const prevUser = document.getElementsByClassName("player--selected")[0];
    if (prevUser) prevUser.classList.remove("player--selected");

    // Highlight player clicked
    player.classList.add("player--selected");
    const el = document.createElement("span");
    el.innerText = "playing";
    player.appendChild(el);
    sendTo = userId;
    playerObj.playing = true;
  }
  console.log(playerObj);
}

// CODE FOR HAMBURGER MENU OF PLAYERS
const showPlayers = document.querySelector(".see-players");
const closeBtn_players = document.querySelector(".close-btn--players");

showPlayers.addEventListener("click", () => {
  playerList.classList.toggle("hidden");
});

closeBtn_players.addEventListener("click", () => {
  playerList.classList.add("hidden");
});

// CODE TO SHOW CUSTOM INPUT FIELD
const chooseNum = document.querySelector(".choose-number");
chooseNum.addEventListener("click", () => {
  if (playerObj.playing) {
    alert("You can't change numbers during a game");
    return;
  }
  customNumCont.classList.add("active");
});

backGame.addEventListener("click", () => {
  customNum = customInput.value;
  const customNumArr = customNum.split("");
  const value = [];
  customNumArr.forEach((i) => value.push(Number(i)));

  if (customNumArr.length < 4) {
    customInpErr.textContent = `Insufficient Numbers!`;
  } else if (repeatingNums(customNumArr)) {
    customInpErr.textContent = `Repeating Numbers detected!`;
  } else {
    customNumCont.classList.remove("active");
  }
  hiddenNumber = value;
  document.querySelector(
    ".your-number"
  ).textContent = `Your number: ${customNumArr.join("")}`;
  // players.push({ id: socket.id, username, value });
});
