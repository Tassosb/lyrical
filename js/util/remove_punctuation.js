function removePunctuation(string) {
  let newString = "";
  for (let i = 0; i < string.length; i++) {
    if (string[i] === " " || (65 <= string[i].charCodeAt() && string[i].charCodeAt() <= 122))
    newString += string[i];
  }
  return newString;
}

module.exports = removePunctuation;
