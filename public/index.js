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
const customInput = document.querySelector('.custom-number-input')
const backGame = document.querySelector('.back-game')
const customInpErr = document.querySelector('.custom-number-error')
const customNumCont = document.querySelector('.custom-number-container')
let hiddenNumber;
let customNum
const playerList = document.querySelector(".player-list");
let yourOpponent

// This function checks for repeating numbers
const repeatingNums = (Num) =>{
  if(Num[0] === Num[1] ||
    Num[0] === Num[2] ||
    Num[0] === Num[3] ||
    Num[1] === Num[2] ||
    Num[1] === Num[3] ||
    Num[2] === Num[3]) {
      return true
    } else {
      return false
    }
}

const players = [];
const socket = io();
let username = sessionStorage.getItem("username");
if (!username) {
  username = prompt("Enter a username: ");
  sessionStorage.setItem("username", username);
} 
while(username === null || username === ""){
  username = prompt("Whats your username")
}
let sendTo;

// shows player his/her username
document.querySelector('.your-username').textContent = `Username: ${username}`

socket.on("connect", () => {
  console.log("connected to server");
  socket.emit("user:enter", { id: socket.id, username });
  // create an 4 digit number for the user
  let value = getNewNumber();

  // code to enter/input custom 
  backGame.addEventListener('click', ()=>{
    customNum = customInput.value
    const customNumArr = customNum.split('')  

    if (customNumArr.length < 4 ) {
      customInpErr.textContent = `Insufficient Numbers!`;
    } else if (repeatingNums(customNumArr)) {
      customInpErr.textContent = `Repeating Numbers detected!`;
    } else{
      customNumCont.classList.remove('active')
    }
    value = customNumArr
    document.querySelector('.your-number').textContent = `Your number: ${customNumArr.join('')}`
  players.push({ id: socket.id, username, value });

  })

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
  document.querySelector('.turn-state').classList.add('active')
  document.querySelector('.turn-state').textContent = `Your turn`
});

socket.on("receiveReport:get", (msg) => {
  // console.log("receiveReport", msg);
  showReport(msg);
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
  // removes active classes
  guessBtn.classList.remove("active");
  getNumBtn.classList.remove("active");
  numberInputs.forEach((input) => {
    input.classList.remove("won-game");
  });
  winMsg.classList.remove("active");
  guessMsg.textContent = "";
  const displayedNumber = hiddenNumber.join('')
  document.querySelector('.your-number').textContent = `Your number: ${displayedNumber}`
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
const historyArr = []
let report2 = []


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

  const msg = {
    userId: socket.id,
    username,
    value: refineNumbers,
  };

  

  historyArr.push({
    guess: msg.value,
    response: report2
  })

    // code to append guesses and responses
    document.querySelector('.guess-history').classList.add('active')

    setTimeout(() => {
      let historyHtml
      historyArr.forEach((el)=>{
         historyHtml = ` <div class="history-row">
        <div class="history-guess">${el.guess.join('')}</div>
        <div class="history-response">${el.response[0]}</div>
      </div>`;
    
      })
      document.querySelector('.history-table').insertAdjacentHTML('beforeend', historyHtml);
    }, 500);
    
  guessBtn.disabled = true;

  document.querySelector('.turn-state').classList.add('active')
  // your opponent is guessing..
  document.querySelector('.turn-state').textContent = `${yourOpponent}'s turn`
  // send answer to your opponent
  socket.emit("submitAnswer:post", sendTo, msg);
}



// function to confirm answer
function confirmAnswer(msg) {
  let deadArrComp = [];
  let injuredArrComp = [];

  hiddenNumber.forEach((i, idx) => {
    let deadArr = msg.value.filter((el, index) => {
      return i === el && idx === index;
    });
    let injuredArr = msg.value.filter((el, index) => {
      return i === el && idx !== index;
    });

    deadArrComp.push(deadArr);
    injuredArrComp.push(injuredArr);
  });

  let deadNum = deadArrComp.flat().length;
  let injuredNum = injuredArrComp.flat().length;

  console.log(msg.value);

  let report;

  //  checking if there a number is recurring in the input
  if (msg.value.length < 4 || msg.value.length === 0) {
    report = `Insufficient Numbers!`;
  } else if (
    repeatingNums(msg.value)
  ) {
    report = `Repeating Numbers detected!`;
  } else {
    report = `${deadNum} Dead, ${injuredNum} Injured`;
  }

  // send the result of the opponents answer back to him
  socket.emit("receiveReport:post", msg.userId, report);

  // if the player loses
  if (report === `4 Dead, 0 Injured`) {
    document.querySelector(".span").textContent = `You Lose!`;
    winMsg.classList.add("active");
    numberInputs.forEach((input) => {
      input.classList.add("won-game");
    });

    setTimeout(() => {
      guessBtn.classList.add("active");
      getNumBtn.classList.add("active");
    }, 600);
  }

  closeBtn.addEventListener("click", () => {
    winMsg.classList.remove("active");
  });
}

// function to show the result of your answer
function showReport(msg) {
  guessMsg.classList.add("active");
  guessMsg.textContent = msg;

  report2.shift()
  report2.push(msg)

  // if the player wins
  if (msg === `4 Dead, 0 Injured`) {
    winMsg.classList.add("active");
    numberInputs.forEach((input) => {
      input.classList.add("won-game");
    });

    setTimeout(() => {
      guessBtn.classList.add("active");
      getNumBtn.classList.add("active");
    }, 600);
  }

  closeBtn.addEventListener("click", () => {
    winMsg.classList.remove("active");
  });
}

getNumBtn.addEventListener("click", getNewNumber);

// code to check for max length
document.querySelectorAll('.number-input').forEach((input) => {
  console.log(input.maxLength);

  input.oninput = () => {
    if (input.value.length > input.maxLength) {
      input.value = input.value.slice(0, input.maxLength);
    }
  };
});

document.querySelectorAll('.custom-number-input').forEach((input) => {
  console.log(input.maxLength);

  input.oninput = () => {
    if (input.value.length > input.maxLength) {
      input.value = input.value.slice(0, input.maxLength);
    }
  };
});



// function to create a player
function createNewPlayer(data) {
  // create a new player
  const player = document.createElement("div");
  // add player attributes
  player.id = data.id;
  player.className = "player";
  player.innerText = data.username;

  // add click event handler
  player.addEventListener("click", selectPlayer);

  // update player list with new player
  playerList.appendChild(player);
}

// function to select a player
function selectPlayer(e) {
  // get selected player
  const player = e.currentTarget;
  yourOpponent = e.currentTarget.innerText 
document.querySelector('.opponent-username').textContent = `Opponent: ${yourOpponent}`
  // make sure player isn't currently selected
  if (!player.classList.contains("player--selected")) {
    // remove previously highlighted player
    const prevUser = document.getElementsByClassName("player--selected")[0];
    if (prevUser) prevUser.classList.remove("player--selected");

    // Highlight player clicked
    player.classList.add("player--selected");

    sendTo = player.id;
  }
}



// CODE FOR HAMBURGER MENU OF PLAYERS
const showPlayers = document.querySelector('.see-players')
const closeBtn_players = document.querySelector('.close-btn--players')

showPlayers.addEventListener('click', ()=>{
    playerList.classList.toggle("hidden")
})

closeBtn_players.addEventListener('click', ()=>{
    playerList.classList.add("hidden")
})


// CODE TO SHOW CUSTOM INPUT FIELD
const chooseNum = document.querySelector('.choose-number')
chooseNum.addEventListener('click', ()=>{
  customNumCont.classList.add('active')
})