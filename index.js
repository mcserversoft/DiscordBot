//Discord API Library
const Discord = require("discord.js");
//File System API
const fs = require("fs");

//Create Discord Bot Varible (Unable to mention everyone)
const bot = new Discord.Client({ disableEveryone: true });

//Import .env Config (removed for final hosting)
require('dotenv').config()

//Creates Command Collection
bot.commands = new Discord.Collection();

//Import Commands
fs.readdir("./commands/", (err, file) => {
    if (err) console.log(err);
    let jsfile = file.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Cant Find Commands.");
    return;
    }
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        bot.commands.set(props.help.name, props);
    });
    console.log("All commands loaded successfully");
});

// D.JS Client listeners
bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on('reconnecting', () => console.log('Reconnecting WS...'));
bot.on('disconnect', () => {
    console.log('Disconnected, trying to restart...');
    process.exit();
});

// NodeJS process listeners
process.on('unhandledRejection', console.error);
process.on('warning', console.warn);

bot.on("ready", async() => {
    console.log("Ready and online.")
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

bot.on("message", async message =>{
    if (message.author.bot) return;
    let messageArray = message.content.split(" ");
    let args = messageArray.slice();
    let cmd = messageArray[0];
    args = messageArray.slice(1);
    if (process.env.PREFIX == cmd.slice(0, 1)) {
        let Commandfile = bot.commands.get(cmd.slice(process.env.PREFIX.length));
        if (Commandfile) Commandfile.run(bot, message, args);
    }
});

bot.login(process.env.TOKEN);