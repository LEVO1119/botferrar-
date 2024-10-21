const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");
const { Database } =  require('nukleon');
const  db  =  new  Database("./database/ticket.json")

//TİCET SİL SİSTEMİ



module.exports = async (client) => {
    client.on('interactionCreate', async interaction => {
         if (interaction.commandName === "ticket-sil") {
            if(interaction.member.roles.cache.has(db.get(interaction.guild.id + "+rol"))) {
              const user = interaction.options.getUser("kullanıcı");
              const role = interaction.options.getRole("rol");
          
              if (!user && !role) {
                  interaction.reply({ content: "Lütfen İçinden Bir Tanesini Doldurunuz!", ephemeral: true });
              } else {
                  if (user) {
                    try {
                      interaction.channel.permissionOverwrites.create(user, { ViewChannel: false });
                    } catch (err) {
                      const embed = new EmbedBuilder()
                          .setTitle("Hata İle Karşılaşıldı! Hata Tarihi:" +moment().format('DD MMMM YYYY HH:mm'))
                          .setDescription("````" + err + "```")
                          .setFooter({text: sunucuismi, iconURL: client.user.avatarURL()})
                          .setTimestamp()
            
                          const kanal = client.guilds.cache.get(guildidsi).channels.cache.get(hatakanalidsi);
            
                          await kanal.send({embeds: [embed]})
                    }
                  }
                  if (role) {
                    try {
                      interaction.channel.permissionOverwrites.create(role, { ViewChannel: false });
                    } catch (err) {
                      const embed = new EmbedBuilder()
                          .setTitle("Hata İle Karşılaşıldı! Hata Tarihi:" +moment().format('DD MMMM YYYY HH:mm'))
                          .setDescription("````" + err + "```")
                          .setFooter({text: sunucuismi, iconURL: client.user.avatarURL()})
                          .setTimestamp()
            
                          const kanal = client.guilds.cache.get(guildidsi).channels.cache.get(hatakanalidsi);
            
                          await kanal.send({embeds: [embed]})
                    }
                  }
          
                  interaction.reply({ content: "İlgili Rol ve/veya Üye Silindi!", ephemeral: true });
              }
            } else {
              interaction.reply({content: "Bu Komutu Kullanabilmek İçin Yetkin Yok!", ephemeral: true})
            }
            
         }},
         console.log(chalk.greenBright(`[BİLGİ] Ticket Sil Sistemi Başarıyla Yüklendi!`)) 
        )};
