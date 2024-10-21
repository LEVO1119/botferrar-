const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");
  
//UNTİMEOUT SİSTEMİ


module.exports = async (client) => {
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'untimeout') {
     
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yönetici yetkisine sahip olmalısın.', ephemeral: true });
        }

        const user = interaction.options.getUser('kullanıcı');

        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply({ content: 'Bu kullanıcı bu sunucuda bulunmuyor.', ephemeral: true });
        }

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: 'Kendinin zaman aşımını kaldırmazsın!', ephemeral: true });
        }

        if (user.id === client.user.id) {
            return interaction.reply({ content: 'Botun zaman aşımını kaldırmak mümkün değil!', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: 'Bu kullanıcının zaman aşımını kaldırmak için yetkin yok.', ephemeral: true });
        }

        try {
          
            await member.timeout(null, `Zaman aşımı kaldırıldı: ${interaction.user.tag} tarafından`);     
            await interaction.reply({ content: `${user.tag} adlı kullanıcının zaman aşımı kaldırıldı.`, ephemeral: true });


        } catch (error) {
            console.error('Zaman aşımını kaldırma hatası:', error);
            await interaction.reply({ content: 'Kullanıcının zaman aşımını kaldırırken bir hata oluştu.', ephemeral: true });
        }
    }
});
console.log(chalk.greenBright(`[BİLGİ] Untimeout Sistemi Başarıyla Yüklendi!`));
}