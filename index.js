/* Get the value from the input box */
let a = document.querySelector("#box-1");
// let b = document.querySelector("#box-2");
// let c = document.querySelector("#box-3");
// let d = document.querySelector("#box-4");
// let e = document.querySelector("#box-5");
const guessmsg = document.querySelector('.alert')

let v = getRandomNumber()
let w = getRandomNumber(v)
let x = getRandomNumber(w,v)
let y = getRandomNumber(v,w,x)
// let z = getRandomNumber(v,w,y,x)

let hiddenNumber = [v, w, x, y]
console.log(hiddenNumber);

function getRandomNumber(a, b, c, d) {
  let number = Math.floor(Math.random() * 10);
  while(number === a || number === b || number === c || number === d){
   number =  Math.floor(Math.random() * 10)
  }

  return number;
}


function confirmAnswer() {
// let numbers = [Number(a.value), Number(b.value), Number(c.value), Number(d.value)];
let numbers = a.value.split('')
const newNumbers = numbers.map((curr)=> Number(curr))

let deadArrComp = []
let injuredArrComp = []

hiddenNumber.forEach((i, idx)=> {
 let deadArr = newNumbers.filter((el, index)=>{
return i === el && idx === index
})
 let injuredArr = newNumbers.filter((el, index)=>{
return i === el && idx !== index
})


deadArrComp.push(deadArr)
injuredArrComp.push(injuredArr)

});

let deadNum = deadArrComp.flat().length
let injuredNum = injuredArrComp.flat().length

  console.log(deadNum)
  console.log(injuredNum)
  console.log(newNumbers);
  console.log(numbers);

  guessmsg.classList.add("active")

//  checking if there a number is recurring in the input
  if(newNumbers[0] === newNumbers[1] || newNumbers[0] === newNumbers[2] || newNumbers[0] === newNumbers [3]
    || newNumbers[1] === newNumbers[2] || newNumbers[1] === newNumbers [3] || newNumbers[2] === newNumbers [3]
    ) {
        guessmsg.textContent = `Repeating Numbers detected!`
    } else {
        guessmsg.textContent = `${deadNum} Dead, ${injuredNum} Injured`
    }

}

// code to check for max length
document.querySelectorAll('input[type="number"]').forEach((input)=>{

    console.log(input.maxLength)

    input.oninput = () =>{
        if(input.value.length > input.maxLength){
            input.value = input.value.slice(0, input.maxLength)
        }
    }
})
