const Discord = require('discord.js')
const bot = new Discord.Client()
const prefix = '?'

bot.on('guildMemberAdd', member => {
    const c = member.guild.channels.cache.find(c => c.name == 'welcome' && c.type == 'text')
    c.send(`Welcome to the official Keerat_Law server <@${member.user.id}>`)
})

bot.on('message', message => {
    let args = message.content.substring(prefix.length).split(/ +/)

    if(message.content == `${prefix}poll`) {
        const channel = message.guild.channels.cache.find(c => c.name == 'polls' && c.type == 'text')
        channel.send(`@everyone Poll: ${args.splice(1).join(' ')}`).then(msg => {
            msg.react('👍')
            msg.react('👎')
        })
    }

    if(message.content.startsWith(`${prefix}suggest`)) {
        message.author.send('What would you like your suggestion to be?').then(msg => {
            const filter = m => m.author.id == message.author.id
            const collector = msg.channel.createMessageCollector(filter, { time: 180000, max: 1 })
            collector.on('collect', m => {
                if (m.content.toLowerCase == 'cancel') return msg.channel.send('Cancellled Prompt')
                const channel = message.guild.channels.cache.find(c => c.name == 'suggestions' && c.type == 'text')
                channel.send(`Username: ${message.author.username} \nSuggestion: ${m.content}`)
            })
        })
    }
})
bot.login(process.env.BOT_TOKEN)
