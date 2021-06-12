//Discord API Library
const Discord = require("discord.js");
//File System API
const fs = require("fs");
//Get package.json
const pjson = require('./package.json');
//Slash command initializer
const init_commands = require("./init_commands")

//Create Discord Bot Variable (Unable to mention everyone)
const bot = new Discord.Client({ disableEveryone: true , partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
//Slash commands calls
let calls = []

//Creates Command Collection
bot.commands = new Discord.Collection();

//Create calls for slash commands
fs.readdir("./commands/", (err, file) => {

    if (err) console.log(err);

    let jsfile = file.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Cant Find Commands");
        return;
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        let data = props.info
        calls.push(data)
    });
});

// D.JS Client listeners
bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
//bot.on('reconnecting', () => console.log('Reconnecting WS...'));
bot.on('disconnect', () => {
    console.log('Disconnected, trying to restart...');
    process.exit();
});

// NodeJS process listeners
process.on('unhandledRejection', console.error);
process.on('warning', console.warn);

bot.on("ready", async() => {

    await init_commands.sendCalls(bot, calls)

    console.log("Ready and online.")
    console.log("MCSS-Bot Version "+pjson.version);
    await bot.user.setPresence({activity: {name: "People Not Read The FAQ", type: "WATCHING"}});
});

//Disabled For Now
//bot.on("guildMemberAdd", member => {
//    if(member.guild.id == process.env.GUILDID){
//        let embed = new Discord.MessageEmbed()
//        .addField("Welcome To The MCSS Discord",`Thanks for joining the MCSS Discord Server.
//        Make sure you read the FAQ before asking questions as most questions are answered there.
//        If you cant find your answer there then be sure to ask out helpful community members`)
//        .setColor("0x7ba73f");
//        member.send(embed)
//    }
//});


//Message handler
bot.ws.on("INTERACTION_CREATE", async interaction => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    //Load all the commands
    const info = require("./commands/info")
    const lmgt = require("./commands/lmgt")
    const ping = require("./commands/ping")

    switch(command){
        case "info":
            await info.run(bot, interaction, args)
            break;
        case "lmgt":
            await lmgt.run(bot, interaction, args)
            break;
        case "ping":
            await ping.run(bot, interaction, args)
            break;
    }
})

//Message Reaction system for adding roles
bot.on("messageReactionAdd",(reaction,user)=>{
    //get all the roles
    const ReleaseRole = reaction.message.guild.roles.cache.find(role => role.id == process.env.RELEASESROLEID);
    const DevRole = reaction.message.guild.roles.cache.find(role => role.id == process.env.DEVROLEID);
    //find user as member of guild
    const member = reaction.message.guild.members.cache.find(member => member.id == user.id);
    //Bot, message id and emoji checks
    if(user.bot){return};
    if(reaction.message.id != process.env.MESSAGEID) return;
    if(reaction.emoji.name == process.env.DEVEMOJI){
        try{
            member.roles.add(DevRole,"BOT - Request Command");
        }catch(err){
            console.log(err)
        }
    }
    if(reaction.emoji.name == process.env.RELEASEEMOJI){
        try{
            member.roles.add(ReleaseRole,"BOT - Request Command");
        }catch(err){
            console.log(err)
        }
    }
    
});
  
//Message Reaction system for removing roles
bot.on("messageReactionRemove",(reaction,user)=>{
    //get all the roles
    const ReleaseRole = reaction.message.guild.roles.cache.find(role => role.id == process.env.RELEASESROLEID);
    const DevRole = reaction.message.guild.roles.cache.find(role => role.id == process.env.DEVROLEID);
    //find user as member of guild
    const member = reaction.message.guild.members.cache.find(member => member.id == user.id);
    //Bot, message id and emoji checks
    if(user.bot) return ;
    if(reaction.message.id != process.env.MESSAGEID) return;
    if(reaction.emoji.name == process.env.DEVEMOJI){
        try{
            member.roles.remove(DevRole,"BOT - Request Command");
        }catch(err){
            console.log(err)
        }
    }
    if(reaction.emoji.name == process.env.RELEASEEMOJI){
        try{
            member.roles.remove(ReleaseRole,"BOT - Request Command");
        }catch(err){
            console.log(err)
        }
    }
});


//And login...
bot.login(process.env.TOKEN);