const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");

//KİCK SİSTEMİ


module.exports = async (client) => {
    const chalk = require("chalk");
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'kick') {
        const user = interaction.options.getUser('kullanıcı');
        const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply({ content: 'Bu kullanıcı bu sunucuda bulunmuyor.', ephemeral: true });
        }

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: 'Kendini atamazsın!', ephemeral: true });
        }

        if (user.id === client.user.id) {
            return interaction.reply({ content: 'Botu atamazsın!', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: 'Bu kullanıcıyı atmak için yetkin yok.', ephemeral: true });
        }

        await member.kick(reason);

        return interaction.reply({ content: `${user.tag} adlı kullanıcı sunucudan atıldı. Sebep: ${reason}`, ephemeral: true });
    }
});

console.log(chalk.greenBright(`[BİLGİ] Kick Sistemi Başarıyla Yüklendi!`)); 
}