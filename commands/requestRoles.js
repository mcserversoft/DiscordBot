const Discord = require("discord.js");
//Import .env Config (removed for final hosting)
//require('dotenv').config()
module.exports.run = async(bot, message, args) => {
    //Make sure its in the mcss server
    if(message.guild.id == process.env.GUILDID){
        //lots of checks to check what role they want
        if(args[0].toLowerCase() == "release-news"){
            var ReleaseRole = message.guild.roles.cache.find(role => role.id == process.env.RELEASESROLEID);
            //do they have the role?
            if(message.member.roles.cache.has(process.env.RELEASESROLEID)){
                //remove role
                message.member.roles.remove(ReleaseRole,"BOT - Request Command").catch(console.error);
                let embed = new Discord.MessageEmbed()
                .addField("Main Release Role Removed","You will no longer be mentioned when there is a new release.")
                .setColor("0x7ba73f");
                message.channel.send(embed);       
            }else{
                //add role
                message.member.roles.add(ReleaseRole,"BOT - Request Command");
                let embed = new Discord.MessageEmbed()
                .addField("Main Release Role Added","You will now be mentioned when there is a new release.")
                .setColor("0x7ba73f");
                message.channel.send(embed); 
            }
        }else if(args[0].toLowerCase() == "dev-news"){
            var DevRole = message.guild.roles.cache.find(role => role.id == process.env.DEVROLEID);
            if(message.member.roles.cache.has(process.env.DEVROLEID)){
                message.member.roles.remove(DevRole,"BOT - Request Command").catch(console.error);
                let embed = new Discord.MessageEmbed()
                .addField("Dev Release Role Removed","You will no longer be mentioned when there is a new dev release.")
                .setColor("0x7ba73f");
                message.channel.send(embed);   
            }else{
                message.member.roles.add(DevRole,"BOT - Request Command");
                let embed = new Discord.MessageEmbed()
                .addField("Dev Release Role Added","You will now be mentioned when there is a new dev release.")
                .setColor("0x7ba73f");
                message.channel.send(embed); 
            }
        }else if(args[0].toLowerCase() == "all-news"){
            var DevRole = message.guild.roles.cache.find(role => role.id == process.env.DEVROLEID);
            var ReleaseRole = message.guild.roles.cache.find(role => role.id == process.env.RELEASESROLEID);
            if(message.member.roles.cache.has(process.env.DEVROLEID) || message.member.roles.cache.has(process.env.RELEASESROLEID)){
                message.member.roles.remove(DevRole,"BOT - Request Command").catch(console.error);
                message.member.roles.remove(ReleaseRole,"BOT - Request Command").catch(console.error);
                let embed = new Discord.MessageEmbed()
                .addField("All Release Role Removed","You will no longer be mentioned when there is a new release of any kind.")
                .setColor("0x7ba73f");
                message.channel.send(embed); 
            }else{
                message.member.roles.add(DevRole,"BOT - Request Command");
                message.member.roles.add(ReleaseRole,"BOT - Request Command");
                let embed = new Discord.MessageEmbed()
                .addField("All Release Role Added","You will now be mentioned when there is a new release or any kind.")
                .setColor("0x7ba73f");
                message.channel.send(embed);
            }
        }
    }
};

module.exports.help = {
    name: "request"
};
