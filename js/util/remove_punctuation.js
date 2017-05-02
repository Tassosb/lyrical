const jsonfile = require('jsonfile');
const lyrics = require('../../data/billboard_lyrics_1964-2015.json');

for (i=0; i < parseInt(lyrics.length); i++){
  const curr = lyrics[i];
  curr.Lyrics = removePunctation(curr.Lyrics);
}

function removePunctation(string) {
  let newString = "";
  for (let i = 0; i < string.length; i++) {
    if (string[i] === " " || (65 <= string[i].charCodeAt() && string[i].charCodeAt() <= 122))
    newString += string[i];
  }
  return newString;
}

jsonfile.writeFile('lyrics_no_punctuation.json', lyrics);
