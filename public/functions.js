// function to select a player
function selectPlayer(id, playerObj, readyBtn, playerList) {
  // get selected player
  const player = document.querySelector(`div#${id}`);
  const playerName = document.querySelector(`p#${id}`);
  playerObj.yourOpponent = playerName.innerText;
  document.querySelector(
    ".opponent-username"
  ).textContent = `Opponent: ${playerObj.yourOpponent}`;
  document.querySelector(
    ".opponent-status"
  ).textContent = `Opponent-status: not-ready`;
  readyBtn.disabled = false;

  // make sure player isn't currently selected
  if (!player.classList.contains("player--selected")) {
    // remove previously highlighted player
    const prevUser = document.getElementsByClassName("player--selected")[0];
    if (prevUser) prevUser.classList.remove("player--selected");

    // highlight player clicked
    player.classList.add("player--selected");
    document.querySelector(`span#${id}`).textContent = "playing";
    playerObj.sendTo = id;
    playerObj.playing = true;
  }
  playerList.classList.add("hidden");
}

// This function checks for repeating numbers
const repeatingNumbers = (Num) => {
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

// function to create a player
function createNewPlayer(data, sendRequest, playerList) {
  // create a new player
  const divEl = document.createElement("div");
  const paraEl = document.createElement("p");
  const spanEl = document.createElement("span");

  // add player attributes
  divEl.id = data.id;
  paraEl.id = data.id;
  spanEl.id = data.id;
  divEl.className = "player";
  paraEl.className = "player-name";
  spanEl.className = "player-tag";
  paraEl.innerText = data.username;
  if (data.playing) {
    spanEl.innerText = "playing";
  } else {
    spanEl.innerText = "available";
  }

  // append elements to player
  divEl.appendChild(paraEl);
  divEl.appendChild(spanEl);

  // add click event handler
  divEl.addEventListener("click", sendRequest);

  // update player list with new player
  playerList.appendChild(divEl);
}

// exporting variables and functions
export { selectPlayer, repeatingNumbers, createNewPlayer };
