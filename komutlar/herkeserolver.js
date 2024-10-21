const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");


//HERKESE ROL VER SİSTEMİ


module.exports = async (client) => {
    const chalk = require("chalk");
client.on('interactionCreate', async (interaction) => {
    if (interaction.commandName === 'herkeserolver') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'Yetkiniz yok! Bu komutu kullanamazsınız.', ephemeral: true });
        }

        const role = interaction.options.getRole('rol');
        const members = await interaction.guild.members.fetch(); 
        interaction.reply("Herkese Rol Vermeye Başlandı");

        for (const member of members) { 
            if (!member[1].roles.cache.has(role.id)) {
                const guildMember = member[1]; 
                await guildMember.roles.add(role.id);
                await interaction.channel.send(`<@${guildMember.id}> adlı kişiye rol verildi.`);
            }
        }

        interaction.followUp("Rol verme işlemi tamamlandı.");
    }
})
console.log(chalk.greenBright(`[BİLGİ] Herkeserolver Sistemi Başarıyla Yüklendi!`)); 
}