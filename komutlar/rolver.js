const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");

//ROL VER SİSTEMİ


module.exports = async (client) => {
client.on('interactionCreate', async (interaction) => {
    if (interaction.commandName === 'rol-ver') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'Yetkiniz yok! Bu komutu kullanamazsınız.', ephemeral: true });
        }
        const user = interaction.options.getUser('kullanıcı');
        const role = interaction.options.getRole('rol');

        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply({ content: 'Bu kullanıcı bu sunucuda bulunmuyor.', ephemeral: true });
        }

        if (member.roles.cache.has(role.id)) {
            return interaction.reply({ content: 'Bu kullanıcı zaten bu role sahip.', ephemeral: true });
        }

        await member.roles.add(role.id);
        return interaction.reply({ content: `<@${member.id}> adlı kullanıcıya ${role.name} rolü verildi.`, ephemeral:true });
    }
});
console.log(chalk.greenBright(`[BİLGİ] Rolver Sistemi Başarıyla Yüklendi!`)); 
}