const axios = require('axios');
const fs = require('fs');

const postLyric = (lyric) => {
  return axios({
    method: 'post',
    url: 'http://localhost:3000/lyrics',
    data: lyric
  }).then((res) => {
    console.log('status', res.status);
  })
  .catch((err) => {
    console.log('error',err)
    //Really hacky way to get around the ECONNRESET error that sometimes happens
    //and make sure all lyrics get posted to database: recurse until it works.
    postLyric(lyric)
  })
}

const getTotalWordCount = (lyric) => (
  Object.values(lyric.Lyrics).reduce((sum, a) => (sum + a), 0)
);

let lyrics;
fs.readFile(__dirname+'/data/compressed_data.json', 'utf8', (err, data) => {
  if (err) throw err;
  lyrics = JSON.parse(data);

  lyrics.forEach((lyric) => {
    lyric.total = getTotalWordCount(lyric);
    postLyric(lyric)
  });
});
