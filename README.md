# MCSS Discord Bot

This bot allows you to interact with your MCSS servers remotely. 

This is a simple NodeJs bot, but it requires basic knowledge of NodeJs to get working. 

**Make sure the API is enabled in MCSS and that you have created a user**

## Installation

Download the repository, extract it if necessary. Make sure you have NodeJs installed, then open a command line in the bot's folder and run

`npm install`

## Setting it up

A few items in the config require you to put discord in developer mode. To do so go to discord's settings, then scroll down to "advanced". Enable developer mode. 
Go to the server you want to add the bot to, right click on its name then "copy id". Now go to the bot's config and paste the id into the `GuildID` field.
Right click on your username, copy the id, and paste it into the `OwnerID` field.


You will need to get a token from [discord's developer portal](https://discord.com/developers/applications). Create a new application, open it then click on the "bot" tab. Copy your bot's token and paste it in the `config.yml` file. 

Open the OAuth2 tab, copy the client id and paste it into the `ClientID` field.

Set the `DefaultStatusGuid` value to the guid of the minecraft server you want to be displayed as status by default (leave blank for none)
You can get the Guid with the /servers command.
`StatusInterval` is the delay, in seconds, between status updates

Add the MCSS related information (endpoint should be your IP) - Note that if you run MCSS and the bot on the same machine, you can use `localhost` as the endpoint.

If SSL is enabled in the API settings, set `secure` to true


You're ready to start using the bot! To do so, type `npm start` and it should work !
if not feel free to join our [Discord](https://discord.gg/DEn89PB)
