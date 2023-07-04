/* Get the value from the input box */
let a = document.querySelector("#box-1");
let b = document.querySelector("#box-2");
let c = document.querySelector("#box-3");
let d = document.querySelector("#box-4");
// let e = document.querySelector("#box-5");
const guessmsg = document.querySelector(".alert");
const winmsg = document.querySelector(".win");
const closeBtn = document.querySelector(".close-btn");
const guessBtn = document.querySelector(".guess-btn");
const getNumBtn = document.querySelector(".get-number");
const numberInputs = document.querySelectorAll(".number-input");
let hiddenNumber;

const getNewNumber = () => {
  let v = getRandomNumber();
  let w = getRandomNumber(v);
  let x = getRandomNumber(w, v);
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
  winmsg.classList.remove("active");
  guessmsg.textContent = "";

  console.log(hiddenNumber);
};

numberInputs.forEach((input) => {
  // move to the next input field when a number is entered
  input.addEventListener("input", (e) => {
    if (e.target.value.length === 1) {
      e.target.parentElement.nextElementSibling.children[0].focus();
    }
  });
});

getNewNumber();

function getRandomNumber(a, b, c, d) {
  let number = Math.floor(Math.random() * 10);
  while (number === a || number === b || number === c || number === d) {
    number = Math.floor(Math.random() * 10);
  }

  return number;
}

function confirmAnswer() {
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

  let deadArrComp = [];
  let injuredArrComp = [];

  hiddenNumber.forEach((i, idx) => {
    let deadArr = refineNumbers.filter((el, index) => {
      return i === el && idx === index;
    });
    let injuredArr = refineNumbers.filter((el, index) => {
      return i === el && idx !== index;
    });

    deadArrComp.push(deadArr);
    injuredArrComp.push(injuredArr);
  });

  let deadNum = deadArrComp.flat().length;
  let injuredNum = injuredArrComp.flat().length;

  console.log(deadNum);
  console.log(injuredNum);
  console.log(refineNumbers);

  guessmsg.classList.add("active");

  //  checking if there a number is recurring in the input
  if (refineNumbers.length < 4 || refineNumbers.length === 0) {
    guessmsg.textContent = `Insufficient Numbers!`;
  } else if (
    refineNumbers[0] === refineNumbers[1] ||
    refineNumbers[0] === refineNumbers[2] ||
    refineNumbers[0] === refineNumbers[3] ||
    refineNumbers[1] === refineNumbers[2] ||
    refineNumbers[1] === refineNumbers[3] ||
    refineNumbers[2] === refineNumbers[3]
  ) {
    guessmsg.textContent = `Repeating Numbers detected!`;
  } else {
    guessmsg.textContent = `${deadNum} Dead, ${injuredNum} Injured`;
  }

  // if the player wins
  if (guessmsg.textContent === `4 Dead, 0 Injured`) {
    winmsg.classList.add("active");
    numberInputs.forEach((input) => {
      input.classList.add("won-game");
    });

    setTimeout(() => {
      guessBtn.classList.add("active");
      getNumBtn.classList.add("active");
    }, 600);
  }

  closeBtn.addEventListener("click", () => {
    winmsg.classList.remove("active");
  });
}

getNumBtn.addEventListener("click", getNewNumber);

// code to check for max length
document.querySelectorAll('input[type="number"]').forEach((input) => {
  console.log(input.maxLength);

  input.oninput = () => {
    if (input.value.length > input.maxLength) {
      input.value = input.value.slice(0, input.maxLength);
    }
  };
});
