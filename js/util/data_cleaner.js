const jsonfile = require('jsonfile');
const lyrics = require('../../data/billboard_lyrics_1964-2015.json');
const removePunctation = require('data_formatter.js');

for (i=0; i < parseInt(lyrics.length); i++){
  const curr = lyrics[i];
  curr.Lyrics = removePunctuation(curr.Lyrics);
}

jsonfile.writeFile('lyrics_no_punctuation.json', lyrics);
