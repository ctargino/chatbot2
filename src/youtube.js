const Youtube = require('youtube-node')
const config = require('./configs/yt-config.json')

const youtube = new Youtube()
youtube.setKey(config.key)

function searchVideoURL(message, queryText) {
  return new Promise((resolve, reject) => {
    youtube.search(`Exercicio em casa para ${queryText}`, 50, function (error, result) {
      if (!error) {
        const videoIds = result.items.flatMap(item => {
          return item ? item.id.videoId : []
        })
        const youtubeLinks = videoIds.map(videoId => `https://www.youtube.com/watch?v=${videoId}`)[~~(Math.random() * videoIds.length)]
        resolve(`${message} ${youtubeLinks}`)
      } else {
        reject('Deu erro')
      }
    })
  })

}

module.exports.searchVideoURL = searchVideoURL