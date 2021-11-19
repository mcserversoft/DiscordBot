/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

/*
 * This file is used to store common functions that are used by multiple commands
 * if it is used more than once it will be stored here
*/

const MCSS = require('../utils/MCSS API');
const { MessageEmbed } = require('discord.js')

//Same code is used by lots so it is stored on the commons
module.exports.serverAutoComplete = async(interaction) => {
    //Fetch minimal server info for auto complete
    var data = await MCSS.getServersMinimal();
    if(data == null){
        //Api is unreachable
        interaction.respond([{name: "Unable to connect to MCSS", value: "-1"}]);
    }else{
        var servers = [];
        var value = interaction.options.getFocused(true);
        //Perform a narrow down search on the servers to only get the ones that match the search
        await data.forEach(async (server) => {
            if(server.Name.toLowerCase().includes(value.value.toLowerCase()) || value == ""){
                servers.push({name: server.Name, value: server.Guid});
            }
        });
        //Give the options back to discord
        interaction.respond(servers);
    }
}

module.exports.error = async(interaction, message) => {
    if (interaction.isButton()){
        var embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(message)
        interaction.update({embeds: [embed], ephemeral: true, components: []});
    }else{
        var embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(message)
        interaction.reply({embeds: [embed], ephemeral: true});
    }
}

module.exports.success = async(interaction, message) => {
    if (interaction.isButton()){
        var embed = new MessageEmbed()
            .setColor(0x00AE86)
            .setTitle(message)
        interaction.update({embeds: [embed], ephemeral: true, components: [], content: '\u200B'});
    }else{
        var embed = new MessageEmbed()
            .setColor(0x00AE86)
            .setTitle(message)
        interaction.reply({embeds: [embed], ephemeral: true});
    }
}

module.exports.info = async(interaction, message) => {
    if (interaction.isButton()){
        var embed = new MessageEmbed()
            .setColor('#1c68ff')
            .setTitle(message)
        interaction.update({embeds: [embed], ephemeral: true, components: [], content: '\u200B'});
    }else{
        var embed = new MessageEmbed()
            .setColor('#1c68ff')
            .setTitle(message)
        interaction.reply({embeds: [embed], ephemeral: true});
    }
}