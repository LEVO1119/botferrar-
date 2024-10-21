const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const { Database } =  require('nukleon');
const  db  =  new  Database("./database/ban.json")
const moment = require("moment");
module.exports = async (client) => {
moment.locale("tr");
const chalk = require("chalk");

//BAN SİSTEMİ
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ban') {
     
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yönetici yetkisine sahip olmalısın.', ephemeral: true });
        }

        const user = interaction.options.getUser('kullanıcı');
        const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';

        const member = await interaction.guild.members.fetch(user.id);

        if (!member) {
            return interaction.reply({ content: 'Bu kullanıcı bu sunucuda bulunmuyor.', ephemeral: true });
        }

        if (user.id === interaction.user.id) {
            return interaction.reply({ content: 'Kendini banlayamazsın!', ephemeral: true });
        }

        if (user.id === client.user.id) {
            return interaction.reply({ content: 'Botu banlayamazsın!', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: 'Bu kullanıcıyı banlamak için yetkin yok.', ephemeral: true });
        }

        try {
            await member.ban({ reason });
            db.set(member.id, moment().format('LLL'));

            // Log kanalını belirle
            const systemChannel = interaction.guild.systemChannel;

            if (systemChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('Kullanıcı Banlandı')
                    .setColor('#eaff00')
                    .addFields(
                        { name: 'Kullanıcı', value: `${user.tag} (${user.id})`, inline: true },
                        { name: 'Banlayan', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                        { name: 'Sebep', value: reason, inline: true },
                        { name: 'Tarih', value: moment().format('LLL'), inline: true }
                    )
                    .setTimestamp();

                await systemChannel.send({ embeds: [embed] });
            } else {
                console.log('Sistem kanalı bulunamadı.');
            }

            return interaction.reply({ content: `${user.tag} adlı kullanıcı banlandı. Sebep: ${reason}`, ephemeral: true});
        } catch (error) {
            console.error('Ban hatası:', error);
            return interaction.reply({ content: 'Kullanıcıyı banlarken bir hata oluştu.', ephemeral: true });
        }
    }
});
console.log(chalk.greenBright(`[BİLGİ] Ban Sistemi Başarıyla Yüklendi!`)); 
}