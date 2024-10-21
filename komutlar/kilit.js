const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");


//KİLİT SİSTEMİ


module.exports = async (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'kilit') {
            const channel = interaction.options.getChannel('kanal');
            const lock = interaction.options.getBoolean('kilitle');

            if (!channel.isTextBased()) {
                return interaction.reply({ content: 'Lütfen bir metin kanalı seçin.', ephemeral: true });
            }

          
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return interaction.reply({ content: 'Bu komutu kullanma izniniz yok.', ephemeral: true });
            }

            try {
                let embed = new EmbedBuilder()
                    .setColor('#eaff00') 
                    .setTitle(`Kanal ${lock ? 'Kilitlendi' : 'Kilidi Açıldı'}`)
                    .setDescription(`${channel} ${lock ? 'kilitlendi.' : 'kilidi açıldı.'}`)
                    .setTimestamp();

                if (lock) {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
                    await interaction.reply({ embeds: [embed] });
                } else {
                    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: true });
                    await interaction.reply({ embeds: [embed] });
                }
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Bu komutu çalıştırırken bir hata oluştu.', ephemeral: true });
            }
        }
    });
    console.log(chalk.greenBright(`[BİLGİ] Kilit Sistemi Başarıyla Yüklendi!`)); 
}