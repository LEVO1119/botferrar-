const { Client, ActivityType, Collection, Events, DateTime, Permissions, InteractionType, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const { Database } = require('nukleon');
const db = new Database("./database/ban.json");
const chalk = require("chalk");

// UNBAN SİSTEMİ
module.exports = async (client) => {

    client.on("guildBanRemove", async (member) => {
        console.log(member);
        if (db.get(member.id)) return db.remove(member.id);
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'unban') {

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                return interaction.reply({ content: 'Bu komutu kullanmak için `Kullanıcıları Banla` iznine sahip olmalısın.', ephemeral: true });
            }

            const userId = interaction.options.getString('kullanıcı_id');

            try {
                // Yasaklı kullanıcıları al ve verilen ID'yi kontrol et
                const banList = await interaction.guild.bans.fetch();
                const bannedUser = banList.get(userId);

                if (!bannedUser) {
                    return interaction.reply({ content: `Bu ID'ye sahip kullanıcı bu sunucuda yasaklı değil. ID: ${userId}`, ephemeral: true });
                }

                if (db.get(userId)) db.remove(userId);
                await interaction.guild.bans.remove(userId);
                return interaction.reply({ content: `Kullanıcının banı başarıyla kaldırıldı. ID: ${userId}`, ephemeral: true });
            } catch (error) {
                console.error('Ban kaldırma hatası:', error);
                return interaction.reply({ content: 'Kullanıcının banını kaldırırken bir hata oluştu. Lütfen ID\'nin doğru olduğundan ve kullanıcının bu sunucudan yasaklanmış olduğundan emin olun.', ephemeral: true });
            }
        }
    });

    console.log(chalk.greenBright(`[BİLGİ] Unban Sistemi Başarıyla Yüklendi!`));
};
