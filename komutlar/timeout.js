const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");

//TİMEOUT SİSTEMİ 

module.exports = async (client) => {

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'timeout') {
       
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yönetici yetkisine sahip olmalısın.', ephemeral: true });
        }

        const user = interaction.options.getUser('kullanıcı');
        const duration = interaction.options.getString('süre');

        if (!duration.match(/^\d+[mhd]$/)) {
            return interaction.reply({ content: 'Geçersiz süre formatı. Geçerli formatlar: "10m" (10 dakika), "1h" (1 saat).', ephemeral: true });
        }

        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply({ content: 'Bu kullanıcı bu sunucuda bulunmuyor.', ephemeral: true });
        }

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: 'Kendini zaman aşımına almazsın!', ephemeral: true });
        }

        if (user.id === client.user.id) {
            return interaction.reply({ content: 'Botu zaman aşımına alamazsın!', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: 'Bu kullanıcıyı zaman aşımına almak için yetkin yok.', ephemeral: true });
        }

       
        let timeoutDuration;
        if (duration.endsWith('m')) {
            timeoutDuration = parseInt(duration) * 60000; // Dakika
        } else if (duration.endsWith('h')) {
            timeoutDuration = parseInt(duration) * 3600000; // Saat
        } else if (duration.endsWith('d')) {
            timeoutDuration = parseInt(duration) * 86400000; // Gün
        }

        try {
            // Kullanıcıyı zaman aşımına al
            await member.timeout(timeoutDuration, `Zaman aşımı sebebi: ${interaction.user.tag} tarafından`);
            await interaction.reply({ content: `${user.tag} adlı kullanıcı ${duration} süreyle zaman aşımına alındı.`, ephemeral: true });
        } catch (error) {
            console.error('Timeout hatası:', error);
            await interaction.reply({ content: 'Kullanıcıyı zaman aşımına alırken bir hata oluştu.', ephemeral: true });
        }
    }
});
console.log(chalk.greenBright(`[BİLGİ] Timeout Sistemi Başarıyla Yüklendi!`));
}