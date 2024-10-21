const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const { Database } =  require('nukleon');
const  db  =  new  Database("./database/otorol.json")
const chalk = require("chalk");
 
//REBOOT SİSTEMİ

module.exports = async (client) => {
client.on(Events.InteractionCreate, async (interaction) => {
if(interaction.commandName === "restart") {
    if(interaction.user.id != "852630437415354398") return interaction.reply({ content: 'Yetkiniz yok! Bu komutu kullanamazsınız.', ephemeral: true });
      interaction.reply("5 Saniye İçinde Reboot Atılıyor!").then(async () => {
        setTimeout(async() => {
          await interaction.deleteReply();
          await process.exit(0);
        }, 5000)
      })
      console.log(chalk.greenBright(`[BİLGİ] Reboot Sistemi Başarıyla Yüklendi!`));
    }
   
  }

)}
