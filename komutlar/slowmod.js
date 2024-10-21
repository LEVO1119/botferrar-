const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");

const chalk = require("chalk");

//SLOWMOD SİSTEMİ


module.exports = async (client) => {
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    if (commandName === 'slowmode') {
 if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
    return interaction.reply({ content: 'Bu komutu kullanma izniniz yok.', ephemeral: true });
}
  
        
        const duration = interaction.options.getInteger('duration');
        
        if (isNaN(duration) || duration <= 0) {
            await interaction.reply({ content: 'Geçerli bir süre belirtmelisiniz.', ephemeral: true });
            return;
        }

        try {
            await interaction.channel.setRateLimitPerUser(duration);
            await interaction.reply({ content: `Slowmode ${duration} saniye olarak ayarlandı.`, ephemeral: true });
        } catch (error) {
            console.error('Slowmode ayarlanırken hata oluştu:', error);
            await interaction.reply({ content: 'Slowmode ayarlanırken bir hata oluştu.', ephemeral: true });
        }
    }
});
console.log(chalk.greenBright(`[BİLGİ] Slowmod Sistemi Başarıyla Yüklendi!`)); 

}