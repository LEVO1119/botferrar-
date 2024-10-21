const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");


//İSTATİSTİK SİSTEMİ

module.exports = async (client) => {
    const chalk = require("chalk");
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'istatislik') {
        try {
           
            const guild = interaction.guild;
            const memberCount = guild.memberCount;
            const channelCount = guild.channels.cache.size;
            const roleCount = guild.roles.cache.size;
            const botUptime = client.uptime; 
            const botCreationDate = client.user.createdAt; 

         
            const memoryUsage = process.memoryUsage();
            const cpuUsage = process.cpuUsage();

         
            const embed = new EmbedBuilder()
                .setColor('#eaff00')
                .setTitle('Bot İstatistikleri')
                .addFields(
                    { name: '👤Toplam Üye Sayısı', value: `${memberCount}`, inline: true },
                    { name: '💬Toplam Kanal Sayısı', value: `${channelCount}`, inline: true },
                    { name: '📜Toplam Rol Sayısı', value: `${roleCount}`, inline: true },
                    { name: '⏲️Botun Çalışma Süresi', value: `${Math.floor(botUptime / 1000 / 60)} dakika`, inline: true },
                    { name: '📅Botun Oluşturulma Tarihi', value: botCreationDate.toDateString(), inline: true },
                    { name: '🎞RAM Kullanımı', value: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`, inline: true },
                    { name: '🔲 CPU Kullanımı (Kullanıcı)', value: `${(cpuUsage.user / 1000000).toFixed(2)} ms`, inline: true },
                    { name: '🔲 CPU Kullanımı (Sistem)', value: `${(cpuUsage.system / 1000000).toFixed(2)} ms`, inline: true },
                )
                .setImage("https://cdn.discordapp.com/attachments/793169492103921718/1296111194394071081/FerrariProfilGif.gif?ex=6711191d&is=670fc79d&hm=22515344b48ae3967f17ff7320cb3c828429434373b09c08494a1740962b1864&")
                .setTimestamp()
                .setFooter({ text: 'Ferrari #OFFİCİAL' });

          
            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Komut işleme hatası:', error);
            await interaction.reply({ content: 'Bir hata oluştu. Lütfen tekrar deneyin.', ephemeral: true });
        }
    }
});
console.log(chalk.greenBright(`[BİLGİ] İstatistik Sistemi Başarıyla Yüklendi!`)); 
}