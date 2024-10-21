const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");
const { Database } =  require('nukleon');
const  db  =  new  Database("./database/ticket.json")

//TİCKET İSİM SİSTEMİ


module.exports = async (client) => {
    client.on('interactionCreate', async interaction => {
 if(interaction.commandName === "ticket-isim") {
    if(interaction.member.roles.cache.has(db.get(interaction.guild.id + "+rol"))) {
      const isim = interaction.options.getString("isim");
  
      await interaction.channel.setName(isim);
  
      await interaction.reply({content: "Kanalın İsmi Başarılı Şekilde Değişti!", ephemeral: true});
    } else {
      interaction.reply({content: "Bu Komutu Kullanabilmek İçin Yetkin Yok!", ephemeral: true});
    }
  }
    },
    console.log(chalk.greenBright(`[BİLGİ] Ticket İsim Sistemi Başarıyla Yüklendi!`)) 
)}