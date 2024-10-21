const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");
module.exports = async (client) => {

client.setMaxListeners(40); 
console.log(chalk.yellow( `
    ███████╗███████╗██████╗░██████╗░░█████╗░██████╗░██╗
    ██╔════╝██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║
    █████╗░░█████╗░░██████╔╝██████╔╝███████║██████╔╝██║
    ██╔══╝░░██╔══╝░░██╔══██╗██╔══██╗██╔══██║██╔══██╗██║
    ██║░░░░░███████╗██║░░██║██║░░██║██║░░██║██║░░██║██║
    ╚═╝░░░░░╚══════╝╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚═╝`));




await require("./ready")(client)
await require("../komutlar/avatar")(client)
await require("../komutlar/sil")(client)
await require("../komutlar/ban")(client)
await require("../komutlar/bansorgu")(client)
await require("../komutlar/istatistik")(client)
await require("../komutlar/otorol")(client)
await require("../komutlar/kick")(client)
await require("../komutlar/mesajgönder")(client)
await require("../komutlar/rolver")(client)
await require("../komutlar/slowmod")(client)
await require("../komutlar/ticketsistemi")(client)
await require("../komutlar/timeout")(client)
await require("../komutlar/unban")(client)
await require("../komutlar/untimeout")(client)
await require("../komutlar/herkeserolver")(client)
await require("../komutlar/kilit")(client)
await require("../komutlar/backup")(client)
await require("../komutlar/ticketekle")(client)
await require("../komutlar/ticketsil")(client)
await require("../komutlar/ticketisim")(client)
await require("../komutlar/restart")(client)
await require("../komutlar/rolbilgi")(client)
await require("../komutlar/log")(client)
await require("../komutlar/uyarı")(client)
}