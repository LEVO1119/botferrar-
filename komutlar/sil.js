const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");

 
//SİL SİSTEMİ

module.exports = async (client) => {
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'sil') {
        // Yönetici yetkisi kontrolü
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için "Mesajları Yönet" yetkisine sahip olmalısın.', ephemeral: true });
        }

        const deleteCount = interaction.options.getInteger('mesaj_sayısı');

        if (deleteCount < 1 || deleteCount > 100) {
            return interaction.reply({ content: 'Silinecek mesaj sayısı 1 ile 100 arasında olmalıdır.', ephemeral: true });
        }

        try {
            // Mesajları sil
            const messages = await interaction.channel.messages.fetch({ limit: deleteCount });
            await interaction.channel.bulkDelete(messages);
            await interaction.reply({ content: `Başarıyla ${deleteCount} mesaj silindi.`, ephemeral: true });
        } catch (error) {
            console.error('Mesaj silme hatası:', error);
            await interaction.reply({ content: 'Mesajları silerken bir hata oluştu.', ephemeral: true });
        }
    }
});
console.log(chalk.greenBright(`[BİLGİ] Sil Sistemi Başarıyla Yüklendi!`)); 
}