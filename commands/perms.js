/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

/* --- Done, No Further Changes Needed --- */
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.run = async(interaction, Config, Client) => {
    switch (interaction.options.getSubcommand()){
        case 'get': {

            await interaction.deferReply({ ephemeral: true });

            const row = new MessageActionRow()
            
            var options = []

            var commands = await interaction.guild.commands.fetch()
            .catch(error => {
                interaction.editReply({content: 'Unknown Error', ephemeral: true})
            })

            await Promise.all(commands.map(async (command) => {
                options.push({
                    label: command.name,
                    description: command.id,
                    value: command.id,
                })
            }))

            row.addComponents(
                new MessageSelectMenu()
                .setCustomId('perms.list')
                .setPlaceholder('Nothing selected')
                .addOptions(options)
            );

            interaction.editReply({content: 'Select the command:', ephemeral: true, components: [row] })

            break;
        }
        case 'set': {
            const user = interaction.options.getUser('user')
            const id = interaction.options.getString('command')
            const value = interaction.options.getBoolean('value')

            if (!interaction.client.application?.owner) await interaction.client.application?.fetch();

            var command;
            try{
                command = await interaction.client.guilds.cache.get(Config.GuildID)?.commands.fetch(id);
            }catch{
                interaction.reply({content: "Command Not Found!", ephemeral: true})
                return;
            }

            const permissions = [
                {
                    id: user.id,
                    type: 'USER',
                    permission: value,
                },
            ];
        
            await command.permissions.add({ permissions });

            interaction.reply({content: `Set Permission For <@${user.id}> To \`${value}\``, ephemeral: true})
            break;
        }
    }
}

module.exports.callButton = async (interaction, Config, Client) => {
    var action = interaction.customId.split('.')[1]

    switch (action){
        case 'list': {

            const command = await interaction.client.guilds.cache.get(Config.GuildID)?.commands.fetch(interaction.values[0]);

            try {
                const perms = await interaction.guild.commands.permissions.fetch({command: command.id})
                var string = `> Default: \`${command.defaultPermission}\`\n`

                for(perm of perms){
                    string += `> <@${perm.id}>: \`${perm.permission}\`\n`
                }

                var embed = new MessageEmbed()
                .setTitle(`• ${command.name} \`${command.id}\``)
                .setDescription(string)

                interaction.update({content: '\u200B', embeds: [embed], components: []})
            }
            catch(e) {
                var embed = new MessageEmbed()
                .setTitle(`• ${command.name} \`${command.id}\``)
                .setDescription(`> Default: \`${command.defaultPermission}\`\n`)

                interaction.update({content: '\u200B', embeds: [embed], components: []})
            }

            break;
        }
    }
}

module.exports.autocomplete = async (interaction, Config, Client) => {
    var value = interaction.options.getFocused(true);
    var res = []
    switch(value.name){
        case 'command': {
            var commands = await interaction.guild.commands.fetch()
            await Promise.all(commands.map(async (command) => {
                if(command.name.toLowerCase().includes(value.value.toLowerCase()) || value == ""){
                    res.push({
                        name: command.name,
                        value: command.id
                    })
                }
            }))
            break;
        }
    }
    
    interaction.respond(res)
}

module.exports.info = new SlashCommandBuilder()
    .setName('perms')
    .setDefaultPermission(false)
    .setDescription('Admin only command for managing command permissions')
    .addSubcommand(subCommand =>
        subCommand.setName('get')
        .setDescription('Get permissions for a command')
    )
    .addSubcommand(subCommand =>
        subCommand.setName('set')
        .setDescription('Set a users permission')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Which user to set the permissions for')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('command')
            .setDescription('The command to set the permission for')
            .setRequired(true)
            )
        .addBooleanOption(option => 
            option.setName('value')
            .setDescription('Value of the permission')
            .setRequired(true)
            )
    )

//Temp while i wait fot builder update
module.exports.extraJSON = {
    default_permission: false,
    options: [
        {
            type: 1,
            name: 'get',
            description: 'Get permissions for a command',
            options: []
        },
        {
            type: 1,
            name: 'set',
            description: 'Set a users permission',
            options: [
                {
                    type: 6,
                    name: 'user',
                    description: 'Which user to set the permissions for',
                    required: true
                },  
                {
                    type: 3,
                    name: 'command',
                    description: 'The command to set the permission for',
                    required: true,
                    autocomplete: true
                },
                {
                    type: 5,
                    name: 'value',
                    description: 'Value of the permission',
                    required: true
                }
            ]
        }
    ]
}