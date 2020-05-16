const Discord = require("discord.js");
module.exports.run = async(bot, message, args) => {
    //is an explanation really needed?
    message.channel.send("Pong :ping_pong:");
};

module.exports.help = {
    name: "ping"
};
