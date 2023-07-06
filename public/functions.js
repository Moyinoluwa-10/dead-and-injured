// This function checks for repeating numbers
export function repeatingNums(Num) {
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
}
