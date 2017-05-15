const jsonfile = require('jsonfile');
const lyrics = require('../../data/billboard_lyrics_1964-2015.json');
const removePunctation = require('data_formatter.js');

for (i=0; i < parseInt(lyrics.length); i++){
  const curr = lyrics[i];
  curr.Lyrics = removePunctuation(curr.Lyrics);
}

const compressedLyrics = [];
for (i=0; i < parseInt(lyrics.length); i++) {
  const curr = lyrics[i];
  const words = curr.Lyrics.split(' ');
  curr.Lyrics = compress(words);
  console.log(curr.Lyrics);
}

function compress(words) {
  const dict = {};
  words.forEach((wrd) => {
    if (wrd === "") return;
    if (dict[wrd]) {
      dict[wrd]++;
    } else {
      dict[wrd] = 1;
    }
  });
  return dict;
}

jsonfile.writeFile('compressed_data.json', lyrics);
