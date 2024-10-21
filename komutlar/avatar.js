const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");
module.exports = async (client) => {


//AVATAR SİSTEMİ
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'avatar') {
        try {
          
            const user = interaction.options.getUser('kullanıcı') || interaction.user;

        
            const embed = new EmbedBuilder()
                .setColor('#eaff00')
                .setTitle(`${user.tag}'ın Avatarı`)
                .setDescription(`<@${user.id}>`)
                .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
                .setTimestamp();

        
            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Komut işleme hatası:', error);
            await interaction.reply({ content: 'Bir hata oluştu. Lütfen tekrar deneyin.', ephemeral: true });
        }
    }
});
console.log(chalk.greenBright(`[BİLGİ] Avatar Sistemi Başarıyla Yüklendi!`)); 
 }