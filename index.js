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
                collector.stop()
                if (m.content.toLowerCase == 'cancel') return msg.channel.send('Cancellled Prompt')
                const channel = message.guild.channels.cache.find(c => c.name == 'suggestions' && c.type == 'text')
                channel.send(`Username: ${message.author.username} \nSuggestion: ${m.content}`)
            })
        })
    }

    if(message.content.startsWith(`${prefix}approve`)) {
        const chan = message.mentions.channels.first()
        if(!chan) return message.channel.send('That is not a valid text channel')
        const msg = chan.messages.cache.find(m => m.id == args[2])
        if(!msg) return message.channel.send('That is not a valid message id')
        msg.pin()
        msg.react('👍')
        msg.author.send('Your suggestion has been approved! It will be in a later video.')
    }

    if(message.content.startsWith(`${prefix}kick`)) {
        if(!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send('You don\'t have permissions to use that command!')
        const user = message.mentions.members.first()
        if(!user) return message.channel.send('You need to mention somebody!')
        const member = message.guild.member(user)
        if(!member) return message.channel.send('I couldn\'t find that member.')
        const reason = args.splice(2).join(' ')
        member.send(`You were kicked from Keerat_Law's Server. \nReason: ${reason}`)
        member.kick(reason)
        message.channel.send('**Successfully Kicked ' + member.user.username + '**')
        
    }

    
})
bot.login(process.env.BOT_TOKEN)
