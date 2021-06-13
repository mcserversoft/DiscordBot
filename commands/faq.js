const Discord = require("discord.js");
const fs = require("fs")
const utils = require("../utils")

var choices = []

var data = fs.readFileSync("./faq.json")
data = JSON.parse(data)

for (const [key, value] of Object.entries(data)){
    var item = {
        "name": value.cn,
        "value": key
    }
    choices.push(item)
}

module.exports.run = async(bot, interaction, args) => {

    utils.error(bot, interaction, "Not Yet Implemented")
    return;

    var item = data[args[0].value]
    var lang = "en"

    if(args[1]){
        lang = args[1].value
    }

    var message = item.lang[lang]
    if(item.lang[lang]){
        var embed = new Discord.MessageEmbed()
        .setTitle(item.cn)
        .setDescription(message)
        .setColor("0x7ba73f");
        utils.sendEmbed(bot, interaction, embed)
    }else{
        utils.error(bot, interaction, "This language is not yet supported for this topic. Sorry :(")
        return;
    }
};

module.exports.info = {
    "name": "faq",
    "description": "Quick mention FAQ Topics",
    "options": [
        {
            "name": "topic",
            "description": "FAQ topic to mention",
            "type": 3,
            "choices": choices,
            "required": true
        },
        {
            "name": "language",
            "description": "Language to send in.",
            "type": 3,
            "choices": [
                {
                    "name": "English",
                    "value": "en"
                },
                {
                    "name": "Français",
                    "value": "fr"
                },
                {
                    "name": "Italiano",
                    "value": "it"
                }
            ],
            "required": false
        }
    ]
};