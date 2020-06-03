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

    if(message.content.startsWith(`${prefix}kick`)) {
        if(!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send('You don\'t have permissions to use that command!')
        const user = message.mentions.members.first()
        if(!user) return message.channel.send('You need to mention somebody!')
        const member = message.guild.member(user)
        if(!member) return message.channel.send('I couldn\'t find that member.')
        if(!member.kickable) return message.channel.send('I can\'t kick that user.')
        const reason = args.splice(2).join(' ')
        member.send(`You were kicked from Keerat_Law's Server. \nReason: ${reason}`)
        member.kick(reason)
        message.channel.send('**Successfully Kicked ' + member.user.username + '**')
        
    }

    if(message.content.startsWith(`${prefix}ban`)) {
        if(!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('You don\'t have permissions to use that command!')
        const user = message.mentions.members.first()
        if(!user) return message.channel.send('You need to mention somebody!')
        const member = message.guild.member(user)
        if(!member) return message.channel.send('I couldn\'t find that member.')
        if(!member.bannable == true) return message.channel.send('I cannot ban that user.')
        const reason = args.splice(2).join(' ')
        member.send(`You were banned from Keerat_Law's Server. \nReason: ${reason}`)
        member.ban(reason)
        message.channel.send('**Successfully Kicked ' + member.user.username + '**')
        
    }

    if(message.content.startsWith(`${prefix}mute`)) {
        const ms = require('ms')
        const user = message.mentions.members.first()
        if(!user) return message.channel.send('You need to mention somebody!')
        const member = message.guild.member(user)
        if(!member) return message.channel.send('I couldn\'t find that member.')
        const muteRole = message.guild.roles.cache.find(r => r.name == 'Muted')
        if(!muteRole) return message.channel.send('Please create a role with the name "Muted"')
        const time = args[1]
        if(!time) return message.channel.send('Please specify a time.')
        const reason = args.splice(2).join(' ')
        member.roles.add(muteRole)
        member.send(`You have been muted in Keerat\'s server. \nTime: ${ms(ms(time), {long: true})} \nReason: ${reason}`)
        setTimeout(function() {
            member.roles.remove(muteRole)
            member.send('You have been unmuted in Keerat\'s server.')
        }, ms(time))
        
    }
    
})
bot.login(process.env.BOT_TOKEN)
