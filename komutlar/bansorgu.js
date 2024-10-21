const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const { Database } =  require('nukleon');
const db = new Database("./database/ban.json");

//BAN SORGU SİSTEMİ

module.exports = async (client) => {
    const chalk = require("chalk");
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'bansorgu') {
          
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                return interaction.reply({ content: 'Bu komutu kullanmak için `Kullanıcıları Banla` iznine sahip olmalısın.', ephemeral: true });
            }

            const userId = interaction.options.getString('kullanıcı_id');

            try {
            
                const banEntry = await interaction.guild.bans.fetch(userId).catch(error => {
                    if (error.code === 10026) {
                        return null; 
                    }
                    throw error; 
                });
                
                if (banEntry) {
                    const reason = banEntry.reason || 'Sebep belirtilmemiş';

               
                    const embed = new EmbedBuilder()
                        .setColor('#eaff00')
                        .setTitle('Yasaklama Bilgisi')
                        .setDescription(`Kullanıcı ID: ${userId}
                        
Banlandığı Tarih: \`${db.get(userId)}\` `)
                        .addFields(
                            { name: 'Yasaklama Nedeni', value: reason, inline: false },
                        )
                        .setTimestamp();

                    return interaction.reply({ embeds: [embed] });
                } else {
                    return interaction.reply({ content: `Kullanıcı ID: ${userId} bu sunucuda yasaklı değil.`, ephemeral: true });
                }
            } catch (error) {
                console.error('Yasak sorgulama hatası:', error);
                return interaction.reply({ content: 'Kullanıcının yasaklanma durumunu sorgularken bir hata oluştu. Lütfen ID\'nin doğru olduğundan emin olun.', ephemeral: true });
            }
        }
    });

    console.log(chalk.greenBright(`[BİLGİ] Ban Sorgu Sistemi Başarıyla Yüklendi!`)); 
}
