/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

/* --- Done, No Further Changes Needed --- */

//Imports!
const { Client, Collection, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const ConfigHandler = require('./utils/Config Handler');


//Init the client with discord.js
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

//Load the config file
let Config = ConfigHandler.loadConfig();

//Create a collection of commands and commandData
const commands = new Collection();
//Command data is a list of JSON objects that need to be sent to register the slash commands
const commandsData = [];

//We load all the command files and save the command and the commandData
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    //Load the file
	const command = require(`./commands/${file}`);
    //Add to command collection
	commands.set(command.info.name, command);

    //Load the commandData
    const commandData = require(`./commands/${file}`);
    var json = commandData.info.toJSON()
    //Merge it with the extra data and save it
    json = Object.assign({}, json, commandData.extraJSON)
    commandsData.push(json);
}

//Load the rest API for registering slash commands, auto deals with rate limits
const rest = new REST({ version: '9' }).setToken(Config.Token);

//Send all the slash commandData to the discord API to register the commands for the guild only
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(Config.ClientID, Config.GuildID),
			{ body: commandsData },
		);
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

//All loaded and ready
client.once('ready', async () => {
	console.log('Ready!');

    //Makes sure the owner always has access to the permission command
    const command = await client.guilds.cache.get(Config.GuildID)?.commands.fetch(Config.Commands.Perms.ID);

    const permissions = [
        {
            id: Config.OwnerID,
            type: 'USER',
            permission: true,
        },
    ]
    
    await command.permissions.add({ permissions });
});

//Listen for commands coming from chat and context menus
client.on('interactionCreate', async interaction => {
	if (!(interaction.isCommand() || interaction.isContextMenu())) return;
    if(!interaction.inGuild()){
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        return;
    }

    //Find the commands we want to run
	const command = commands.get(interaction.commandName);

	if (!command) return;

	try {
        //Run the command
		await command.run(interaction, Config, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Listen for button clicks
client.on('interactionCreate', async interaction => {
	if (!(interaction.isButton() || interaction.isSelectMenu())) return;
    if(!interaction.inGuild()){
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        return;
    }

    //Find the command the button originates from, this is using a custom routing system based on the button ID
    const command = commands.get(interaction.customId.split('.')[0]);

    if (!command) return;

	try {
        //Run the button data
		await command.callButton(interaction, Config, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Listen for autocomplete
client.on('interactionCreate', async interaction => {
	if (!interaction.isAutocomplete()) return;

    //Find the commands we want to auto complete for
	const command = commands.get(interaction.commandName);

    if (!command) return;

	try {
        //Run the autocomplete resolver
		await command.autocomplete(interaction, Config);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//All Good!
client.login(Config.Token);