const { Client, Intents, MessageEmbed, InteractionType, EmbedBuilder } = require('discord.js');
const { Database } =  require('nukleon');
const  db  =  new  Database("./database/uyarı.json")
const client = new (require("discord.js").Client)({disableeveryone: false, intents: [require("discord.js").GatewayIntentBits.Guilds, require("discord.js").GatewayIntentBits.GuildMembers, require("discord.js").GatewayIntentBits.GuildEmojisAndStickers, require("discord.js").GatewayIntentBits.GuildIntegrations, require("discord.js").GatewayIntentBits.GuildWebhooks, require("discord.js").GatewayIntentBits.GuildInvites, require("discord.js").GatewayIntentBits.GuildVoiceStates, require("discord.js").GatewayIntentBits.GuildPresences, require("discord.js").GatewayIntentBits.GuildMessages, require("discord.js").GatewayIntentBits.GuildMessageReactions, require("discord.js").GatewayIntentBits.GuildMessageTyping, require("discord.js").GatewayIntentBits.DirectMessages, require("discord.js").GatewayIntentBits.DirectMessageReactions, require("discord.js").GatewayIntentBits.DirectMessageTyping, require("discord.js").GatewayIntentBits.MessageContent], shards: "auto", partials: [require("discord.js").Partials.Message, require("discord.js").Partials.Channel, require("discord.js").Partials.GuildMember, require("discord.js").Partials.Reaction, require("discord.js").Partials.GuildScheduledEvent, require("discord.js").Partials.User, require("discord.js").Partials.ThreadMember] });




module.exports = async (client) => {
    

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
    
        const { commandName, options } = interaction;
    
        if (commandName === 'uyarı') {
            const user = options.getUser('user');
            const reason = options.getString('sebep');
            const warningAmount = options.getInteger('adet');
    
            if (!user) return interaction.reply('Geçerli bir kullanıcı belirtmelisiniz.');
            if (isNaN(warningAmount) || warningAmount < 1) {
                return interaction.reply('Uyarı adeti geçersiz. Lütfen 1 veya daha yüksek bir sayı girin.');
            }
    
            // Veritabanından uyarı verilerini al veya oluştur
            const userId = user.id;
            let userWarnings = db.get(`warnings_${userId}`);
    
            if (!userWarnings) {
                userWarnings = {
                    totalWarnings: 0,
                    warningList: []
                };
            }
    
            // Uyarı ekleme
            for (let i = 0; i < warningAmount; i++) {
                userWarnings.totalWarnings += 1;
                userWarnings.warningList.push({ reason: reason, date: new Date() });
            }
    
            // Güncellenmiş uyarı verilerini veritabanına kaydet
            db.set(`warnings_${userId}`, userWarnings);
    
            // Uyarı tablosu oluştur
            const warningEmbed = new EmbedBuilder()
            .setTitle('Uyarı Tablosu')
            .addFields({ name: 'Uyarı Alan Kişi', value: `\`\`\`${user.username}\`\`\``, inline: true })
            .addFields({ name: 'Uyarı Adeti', value: `\`\`\`${warningAmount.toString()}\`\`\``, inline: true })
            .addFields({ name: 'Toplam Uyarı', value: `\`\`\`${userWarnings.totalWarnings.toString()}\`\`\``, inline: true })
            .addFields({ name: 'Uyarı Sebebi', value: `\`\`\`${reason}\`\`\``, inline: true })
            .setColor('#850303')
            .setThumbnail("https://cdn.discordapp.com/attachments/793169492103921718/1296111194394071081/FerrariProfilGif.gif?ex=6711191d&is=670fc79d&hm=22515344b48ae3967f17ff7320cb3c828429434373b09c08494a1740962b1864&")
           
            .setTimestamp();

    
            await interaction.reply({ content: `<@${interaction.user.id}> adlı yetkili, <@${user.id}> adlı kişiye "${reason}" sebebinden \`${warningAmount}\` adet uyarı verdi.` , embeds: [warningEmbed] });
        }
    });

}

