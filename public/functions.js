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

// exporting variables and functions
export { selectPlayer };
