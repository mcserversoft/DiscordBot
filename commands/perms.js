/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */


//This manages perms for the commands, you should not need to edit this, if you do contact me on discord
const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu
} = require('discord.js')
const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports.run = async (interaction, Config, Client) => {
    switch (interaction.options.getSubcommand()) {
        case 'get':
            {
                const command = await interaction.client.guilds.cache.get(Config.GuildID)?.commands.fetch(interaction.options.getString('command'));

                try {
                    const perms = await interaction.guild.commands.permissions.fetch({
                        command: command.id
                    })
                    
                    var string = `> Default: \`${command.defaultPermission}\`\n`

                    for (perm of perms) {
                        string += `> <@${perm.type == 'USER'?'':'&'}${perm.id}>: \`${perm.permission}\`\n`
                    }

                    var embed = new MessageEmbed()
                        .setTitle(`• ${command.name} \`${command.id}\``)
                        .setDescription(string)

                    interaction.reply({
                        content: '\u200B',
                        embeds: [embed],
                        components: [],
                        ephemeral: true
                    })
                }
                catch (e) {
                    var embed = new MessageEmbed()
                        .setTitle(`• ${command.name} \`${command.id}\``)
                        .setDescription(`> Default: \`${command.defaultPermission}\`\n`)

                    interaction.reply({
                        content: '\u200B',
                        embeds: [embed],
                        components: [],
                        ephemeral: true
                    })
                }
                
                break;
            }
        case 'set':
            {
                const target = interaction.options.getMentionable('target')
                const id = interaction.options.getString('command')
                const value = interaction.options.getBoolean('value')

                if (!interaction.client.application?.owner) await interaction.client.application?.fetch();

                var command;
                try {
                    command = await interaction.client.guilds.cache.get(Config.GuildID)?.commands.fetch(id);
                }
                catch {
                    interaction.reply({
                        content: "Command Not Found!",
                        ephemeral: true
                    })
                    return;
                }

                //MENTIONABLE option returns a user/guildmember/role so we have to check what it is
                let targetType = target.hasOwnProperty('avatar') ? 'USER' : 'ROLE' //checking for avatar bc both users and members have 1 and I don't know another way

                const permissions = [{
                    id: target.id,
                    type: targetType,
                    permission: value,
                }, ];

                await command.permissions.add({
                    permissions
                 });

                interaction.reply({
                    content: `Set Permission For <@${targetType == 'USER' ? '' : '&'}${target.id}> To \`${value}\` on command *${command.name}*`,
                    ephemeral: true
                })
                

                break;
            }
    }
}

module.exports.autocomplete = async (interaction, Config, Client) => {
    var value = interaction.options.getFocused(true);
    var res = []
    switch (value.name) {
        case 'command':
            {
                var commands = await interaction.guild.commands.fetch()
                await Promise.all(commands.map(async (command) => {
                    if (command.name.toLowerCase().includes(value.value.toLowerCase()) || value == "") {
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
        .addMentionableOption(option =>
            option.setName('target')
            .setDescription('Which user or role to set the permissions for')
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
    options: [{
        type: 1,
        name: 'get',
        description: 'Get permissions for a command',
        options: [{
            type: 3,
            name: 'command',
            description: 'The command to get the permissions of',
            required: true,
            autocomplete: true
        }]
    }, {
        type: 1,
        name: 'set',
        description: 'Set a users permission',
        options: [{
            type: 9,
            name: 'target',
            description: 'Which user or role to set the permissions for',
            required: true
        }, {
            type: 3,
            name: 'command',
            description: 'The command to set the permission for',
            required: true,
            autocomplete: true
        }, {
            type: 5,
            name: 'value',
            description: 'Value of the permission',
            required: true
        }]
    }]
}