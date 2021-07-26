require('dotenv/config')
const TelegramBot = require('node-telegram-bot-api')
const dialogflow = require('./dialogflow')
const youtube = require('./youtube')
const fs = require('fs')

const token = process.env.TOKEN

const bot = new TelegramBot(token, {
  polling: true
})

const adminIds = ['seuidaqui']
const userIds = ['seuidaqui']

bot.on('message', async function (msg) {
  const { id } = msg.chat
  const auth = userIds.filter(idx => idx === String(id))
  const adminAuth = adminIds.findIndex(idx => idx === String(id))

  if (auth.length < 1) {
    return bot.sendMessage(id, 'Usuário não autorizado')
  }

  if ((msg.text.substring(0, 5) === 'add @') && adminAuth !== -1) {
    let idString = msg.text.substring(5)
    if (userIds.includes(idString)) {
      return bot.sendMessage(id, 'Usuário já existe no sistema')
    }
    userIds.push(idString)
    return bot.sendMessage(id, 'Usuário adicionado com sucesso')
  }

  if ((msg.text.substring(0, 10) === 'addAdmin @') && adminAuth !== -1) {
    let idString = msg.text.substring(10)
    if (adminIds.includes(idString)) {
      return bot.sendMessage(id, 'Admin já existe no sistema')
    }
    adminIds.push(idString)
    return bot.sendMessage(id, 'Admin adicionado com sucesso')
  }

  if ((msg.text.substring(0, 8) === 'remove @') && adminAuth !== -1) {
    let idString = msg.text.substring(8)
    let foundId = userIds.findIndex(idx => idx === idString)

    if (foundId !== -1) {
      userIds.splice(userIds.indexOf(foundId), 1)
      return bot.sendMessage(id, 'Usuário removido com sucesso')
    }
    return bot.sendMessage(id, 'Não encontrei este usuário')
  }

  if (msg.text === 'audio') {
    bot.sendMessage(id, 'aguarde enquanto o Áudio está carregando, este processo leva aproximadamente 2 minutos...')
    await bot.sendAudio(id, './src/audios/audio.mp3')
    return bot.sendMessage(id, 'Aqui está sua música, obrigado por aguardar')
  }

  const dfResponse = await dialogflow.sendMessage(String(id), msg.text)

  let responseText = dfResponse.text

  if (dfResponse.intent === 'Treino especifico') {
    responseText = await youtube.searchVideoURL(responseText, dfResponse.fields.corpo.stringValue)
  }

  bot.sendMessage(id, responseText)
})