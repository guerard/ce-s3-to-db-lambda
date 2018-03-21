export const padFn = (w: number) => {
  return (n: number): string => {
    let asString = n.toString();
    let leadingZeroes = w - asString.length;
    if (leadingZeroes < 0) {
      throw new Error("Width cannot be less than string length");
    }
    while (leadingZeroes !== 0) {
      leadingZeroes--;
      asString = "0" + asString;
    }
    return asString;
  }
};