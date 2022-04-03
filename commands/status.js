
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const MCSS = require('../utils/MCSS API');
const commons = require('../utils/commons');
var timer = null;

module.exports.init = async(Config, Client) => {
	//verify that a default status is set
	if (!Config.DefaultStatusGuid) {
		Client.user.setActivity(null)
		return;
	}
	if (await MCSS.getServer(Config.DefaultStatusGuid)) {
		//set the default status
		refreshStatus(Config.DefaultStatusGuid, Client)
		timer = setInterval(refreshStatus, Config.StatusInterval*1000, Config.DefaultStatusGuid, Client)
		console.log('Default status set')
	} else {
		clearInterval(timer)
		timer = null
		console.log('Failed to set the default status, make sure the guid is correct')
	}
}

module.exports.run = async(interaction, Config, Client) => {
	switch (interaction.options.getSubcommand()) {
		case 'set':
			{
				//fetch the server to watch
				var guid = interaction.options.getString('server');

				//make sure the guid is valid
				if (guid == "-1") {
					commons.error(interaction, "Unable to connect to MCSS");
					return;
				}

				//fetching the server so we have its name
				var server = await MCSS.getServer(guid)

				//if a status is already set, ask the user what to do
				if (timer) {
					const row = new MessageActionRow()
					row.addComponents(
						new MessageButton()
						.setLabel("Replace")
						.setCustomId(`status.yes.${guid}`)
						.setStyle('SUCCESS')
					)
					row.addComponents(
						new MessageButton()
						.setLabel("Cancel")
						.setCustomId(`status.no.${guid}`)
						.setStyle('DANGER')
					)

					//Send the confirmation message
					interaction.reply({content: `**A status is already set.**\n\nDo you wish to replace it with ${server.Name}?`, components: [row], ephemeral: true})
					return;
				}

				//refresh the status a first time and set an interval
				refreshStatus(guid, Client)
				timer = setInterval(refreshStatus, Config.StatusInterval*1000, guid, Client)
				
				commons.success(interaction, `Set ${server.Name} as the status!`);
				break;
			}
		case 'remove':
			{
				if (!timer) {
					commons.error(interaction, 'No status is currently set. You can add one with `/status set`');
					return;
				}
				clearInterval(timer);
				timer = null;
				Client.user.setActivity(null);
				commons.success(interaction, 'The status was cleared!');
				break;
			}
	}
}

module.exports.callButton = async(interaction, Config, Client, button) => {

	//Fetch the action and the guid from the custom id
    var action = interaction.customId.split('.')[1]
    var guid = interaction.customId.split('.')[2]

    switch(action) {
    	case 'yes': {
    		//Clear the old interval and create a new one
    		clearInterval(timer)
    		refreshStatus(guid, Client)
    		timer = setInterval(refreshStatus, Config.StatusInterval*1000, guid, Client)
    		commons.success(interaction, 'The status was updated')
    		break;
    	}
    	case 'no': {
    		commons.error(interaction, 'The status was left untouched')
    		break;
    	}
    }
}

module.exports.autocomplete = async (interaction) => {
	commons.serverAutoComplete(interaction)
}

module.exports.info = new SlashCommandBuilder()
	.setName('status')
	.setDefaultPermission(false)
	.setDescription('Modifies the bot\'s status')
	.addSubcommand(subcommand => 
		subcommand.setName('set')
		.setDescription('Add a server as status')
		.addStringOption(option => 
			option.setName('server')
			.setDescription('The server to watch')
			.setRequired(true)
			//setAutocomplete(true)
		)
	)
	.addSubcommand(subCommand => 
		subCommand.setName('remove')
		.setDescription('Remove the current status')
	)

module.exports.extraJSON = {
	default_permission: false,
	options: [{
		type: 1,
		name: 'set',
		description: 'Add a server as status',
		options: [{
			type: 3,
			name: 'server',
			description: 'The server to watch',
			required: true,
			autocomplete: true
		}]
	}, {
		type: 1,
		name: 'remove',
		description: 'Remove the current status'
	}]
}

async function refreshStatus(guid, Client) {
	//fetch the server's data and resolve the status
	var server = await MCSS.getServer(guid)
	var status = await MCSS.resolveStatus(server.Status)

	//update the bot's status
	Client.user.setActivity(`${status.Emoji} ${server.Name} : ${status.Message}`, {type : 'WATCHING'})
}