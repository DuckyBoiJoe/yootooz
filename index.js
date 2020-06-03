const Discord = require('discord.js')
const bot = new Discord.Client()
const prefix = '?'

bot.on('guildMemberAdd', member => {
    const c = member.guild.channels.cache.find(c => c.name == 'welcome' && c.type == 'text')
    c.send(`Welcome to the official Keerat_Law server <@${member.user.id}>`)
})

bot.on('message', message => {
    let args = message.content.substring(prefix.length).split(/ +/)

    if(message.content.startsWith(`${prefix}poll`)) {
        const channel = message.guild.channels.cache.find(c => c.name == 'polls' && c.type == 'text')
        channel.send(`@everyone Poll: ${args.splice(1).join(' ')}`).then(msg => {
            msg.react('👍')
            msg.react('👎')
        })
    }
})
bot.login(process.env.BOT_TOKEN)