/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

//Discord API Library
const Discord = require("discord.js");
//File System API
const fs = require("fs");
//Get package.json
const pjson = require('./package.json');
//Slash command initializer
const init_commands = require("./init_commands")
//node fetch for http requests
const fetch = require("node-fetch")
//Express for empty page on heroku app
var express = require('express');
var app = express();
//Load custom links file
let rawdata = fs.readFileSync('./Links.json');
const linksList = JSON.parse(rawdata);
//require('dotenv').config()

//Express stuff
var port = process.env.PORT || 8080;
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//Set the home page route
app.get('/', function(req, res) {
	res.render('index');
});

app.listen(port, function() {});

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

bot.on("message", async message => {
    if(message.author.bot){
        return;
    }
    var urls = detectURLs(message.content)

    if(urls != null){
        var res = await scanLinks(urls)
        if(res[1] == true){
            console.log(`Removed ${res[3].link} by ${message.author.username}#${message.author.discriminator}`)
            var embed = new Discord.MessageEmbed()
            .setTitle("Link Removed")
            .setDescription(`
                <@${message.author.id}>, Your message has been removed,

                **This link was removed for** \`${res[0]}\`
            `)
            .setThumbnail("https://www.lineex.es/wp-content/uploads/2018/06/alert-icon-red-11.png")
            .setFooter("If you believe this is a false positive please contact a staff member.", bot.user.avatarURL())
            .setColor("0xd93d3d");
            await message.channel.send(embed)
            await message.delete();
        }else if (res[2] != null){
            console.log(`Warned ${res[3].link} by ${message.author.username}#${message.author.discriminator}`)
            var embed = new Discord.MessageEmbed()
            .setTitle("Link Warning")
            .setDescription(`
                <@${message.author.id}>, A link in the your message has been identified as suspicious,

                **Please proceed with caution!**
            `)
            .setThumbnail("https://www.lineex.es/wp-content/uploads/2018/06/alert-icon-red-11.png")
            .setFooter("If you believe this is a false positive please contact a staff member.", bot.user.avatarURL())
            .setColor("0xdba72e");
            await message.channel.send(embed)
        }
    }
})

function detectURLs(message) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.match(urlRegex)
}

async function scanLinks(links){

    var results = []

    for(const link of links) {
        let res = await fetch(`https://ipqualityscore.com/api/json/url/${process.env.LINKTOKEN}/${encodeURIComponent(link)}`, {
            method: "post"
        })

        var json = await res.json()
        
        if(!linksList.Whitelist.includes(json.domain)){
            json.link = link
            results.push(json)
        }
    }

    var reason = null
    var doDelete = false
    var warning = null
    var flaggedLink = null

    for(const link of results){

        if(reason != null){ 
        }else if (linksList.Blacklist.includes(link.domain)){
            reason = "Blacklisted Link"
            doDelete = true
            flaggedLink = link
        }else if(link.phishing == true){
            reason = "Phishing"
            doDelete = true
            flaggedLink = link
        }else if(link.malware == true){
            reason = "Malware"
            doDelete = true
            flaggedLink = link
        }else if(link.spamming == true){
            reason = "Spamming"
            doDelete = true
            flaggedLink = link
        }else if(link.adult == true){
            reason = "Adult Content"
            doDelete = true
            flaggedLink = link
        }else if(link.status_code == 0){
            reason = "Invalid URL"
            doDelete = true
            flaggedLink = link
        }else if(link.risk_score >= 70){
            reason = `High Risk (${link.risk_score}/100)`
            doDelete = true
            flaggedLink = link
        }else if(link.risk_score >= 25){
            warning = link.risk_score
            flaggedLink = link
        }
    }

    return [reason, doDelete, warning, flaggedLink]
}


//Message handler
bot.ws.on("INTERACTION_CREATE", async interaction => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    //Load all the commands
    const info = require("./commands/info")
    const lmgt = require("./commands/lmgt")
    const ping = require("./commands/ping")
    const faq = require("./commands/faq")

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
        case "faq":
            await faq.run(bot, interaction, args)
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