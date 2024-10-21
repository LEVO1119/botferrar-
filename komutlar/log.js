const { Client, ActivityType, Collection, Events , DateTime , Permissions, InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");

const { Database } = require('nukleon');
const db = new Database("./database/log.json");

// LOG SİSTEMİ
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.MessageContent ,GatewayIntentBits.GuildPresences,  GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] });

module.exports = async (client) => {

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'log') {
            const subcommand = interaction.options.getSubcommand();
            const logChannel = interaction.options.getChannel('channel');
            const logType = interaction.options.getString('type');

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({ content: 'Bu komutu kullanmak için yeterli yetkiniz yok.', ephemeral: true });
            }

            if (subcommand === 'set') {
                if (['messageDelete', 'roleAdd', 'roleRemove', 'memberJoin', 'memberLeave', 'activity'].includes(logType)) {
                    db.set(`log_${logType}_${interaction.guild.id}`, { logChannelId: logChannel.id });
                    interaction.reply({ content: `${logType} logu için kanal <#${logChannel.id}> olarak ayarlandı.`, ephemeral: true });
                }
            } else if (subcommand === 'show') {
                const logTypes = ['messageDelete', 'roleAdd', 'roleRemove', 'memberJoin', 'memberLeave', 'activity'];
                let replyMessage = '';

                logTypes.forEach(logType => {
                    const logSettings = db.get(`log_${logType}_${interaction.guild.id}`);
                    replyMessage += logSettings ? `${logType} Log Kanalı: <#${logSettings.logChannelId}>\n` : `${logType} Log Kanalı: Henüz ayarlanmadı.\n`;
                });

                interaction.reply({ content: replyMessage, ephemeral: true });
            }
        }
    });

    // Mesaj Silme Logu
    client.on('messageDelete', async message => {
        const logSettings = db.get(`log_messageDelete_${message.guild.id}`);
        if (logSettings) {
            const logChannel = message.guild.channels.cache.get(logSettings.logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('Mesaj Silindi')
                    .setColor("#eaff00")
                    .addFields(
                        { name: 'Silinen Mesaj', value: message.content ? message.content : '*Mesaj içeriği yok*', inline: false },
                        { name: 'Mesaj Sahibi', value: message.author ? `${message.author.tag} (${message.author.id})` : '*Bilinmiyor*', inline: true },
                        { name: 'Kanal', value: `${message.channel.name} (${message.channel.id})`, inline: true }
                    )
                    .setDescription(`${message.author ? message.author.username : 'Bilinmeyen kullanıcı'}(\`${message.author ? message.author.id : 'Bilinmiyor'}\`) bir mesaj sildi.\n Sildiği Kanal : <#${message.channel.id}>`)
                    .setThumbnail(message.author ? message.author.displayAvatarURL({ dynamic: true }) : "https://cdn.discordapp.com/attachments/793169492103921718/1296111194394071081/FerrariProfilGif.gif?ex=6711191d&is=670fc79d&hm=22515344b48ae3967f17ff7320cb3c828429434373b09c08494a1740962b1864&")
                    .setTimestamp();

                logChannel.send({ embeds: [embed] }).catch(console.error);
            }
        }
    });

    // Rol Ekleme ve Çıkarma Logu
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        const roleAddLogSettings = db.get(`log_roleAdd_${newMember.guild.id}`);
        const roleRemoveLogSettings = db.get(`log_roleRemove_${newMember.guild.id}`);
        
        // Rol Ekleme
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        if (roleAddLogSettings && addedRoles.size > 0) {
            const logChannel = newMember.guild.channels.cache.get(roleAddLogSettings.logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('Rol Eklendi')
                    .setColor(0x00ff00)
                    .setThumbnail(newMember.user.avatarURL() || "https://images-ext-1.discordapp.net/external/z_UlqYdI1WSjZU3vY-NuKjH0zdGrc6o0uiKqlDTxsrM/%3Fformat%3Dwebp%26quality%3Dlossless/https/images-ext-1.discordapp.net/external/2dZVVL6feMSM7lxfFkKVW__LToSOzmToSEmocJV5vcA/https/cdn.discordapp.com/embed/avatars/0.png?format=webp&quality=lossless")
                    .addFields(
                        { name: 'Kullanıcı', value: `${newMember.user.tag} (${newMember.user.id})`, inline: true },
                        { name: 'Ekleme Tarihi', value: new Date().toLocaleString(), inline: true },
                        { name: 'Eklenen Roller', value: addedRoles.map(role => role.name).join(', '), inline: false }
                    )
                    .setTimestamp();

                try {
                    await logChannel.send({ embeds: [embed] });
                    console.log((chalk.magenta)`Rol ekleme logu gönderildi: ${newMember.user.tag}`);
                } catch (error) {
                    console.error('Rol ekleme logu gönderilirken hata oluştu:', error);
                }
            }
        }

        // Rol Alma
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        if (roleRemoveLogSettings && removedRoles.size > 0) {
            const logChannel = newMember.guild.channels.cache.get(roleRemoveLogSettings.logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('Rol Alındı')
                    .setColor(0xff0000)
                    .setThumbnail(newMember.user.avatarURL() || "https://images-ext-1.discordapp.net/external/z_UlqYdI1WSjZU3vY-NuKjH0zdGrc6o0uiKqlDTxsrM/%3Fformat%3Dwebp%26quality%3Dlossless/https/images-ext-1.discordapp.net/external/2dZVVL6feMSM7lxfFkKVW__LToSOzmToSEmocJV5vcA/https/cdn.discordapp.com/embed/avatars/0.png?format=webp&quality=lossless")
                    .addFields(
                        { name: 'Kullanıcı', value: `${newMember.user.tag} (${newMember.user.id})`, inline: true },
                        { name: 'Alınma Tarihi', value: new Date().toLocaleString(), inline: true },
                        { name: 'Çıkarılan Roller', value: removedRoles.map(role => role.name).join(', '), inline: false }
                    )
                    .setTimestamp();

                try {
                    await logChannel.send({ embeds: [embed] });
                    console.log((chalk.magenta)`Rol Alma logu gönderildi: ${newMember.user.tag}`);
                } catch (error) {
                    console.error('Rol Alma logu gönderilirken hata oluştu:', error);
                }
            }
        }
    });

    // Giriş Logu
    client.on('guildMemberAdd', async (member) => {
        const logSettings = db.get(`log_memberJoin_${member.guild.id}`);
        if (logSettings) {
            const logChannel = member.guild.channels.cache.get(logSettings.logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('Üye Giriş')
                    .setThumbnail(member.user.avatarURL() || "https://images-ext-1.discordapp.net/external/z_UlqYdI1WSjZU3vY-NuKjH0zdGrc6o0uiKqlDTxsrM/%3Fformat%3Dwebp%26quality%3Dlossless/https/images-ext-1.discordapp.net/external/2dZVVL6feMSM7lxfFkKVW__LToSOzmToSEmocJV5vcA/https/cdn.discordapp.com/embed/avatars/0.png?format=webp&quality=lossless")
                    .setDescription(`${member.user.tag} sunucuya katıldı.
                        
                                 
                             **Kullanıcı ID'si:** ${member.user.id}
                           
                           
                             **Kuruluş Tarihi:** ${member.user.createdAt.toLocaleDateString()}
                     
                     
                             **Katılım Tarihi:** ${member.joinedAt.toLocaleDateString()}`)
                    .setColor(0x00FF00)
                    .setTimestamp();
                try {
                    await logChannel.send({ embeds: [embed] });
                    console.log((chalk.magenta)`Giriş logu gönderildi: ${member.user.tag}`);
                } catch (error) {
                    console.error('Giriş logu gönderilirken hata oluştu:', error);
                }
            }
        }
    });

    // Çıkış Logu
    client.on('guildMemberRemove', async (member) => {
        const logSettings = db.get(`log_memberLeave_${member.guild.id}`);
        if (logSettings) {
            const logChannel = member.guild.channels.cache.get(logSettings.logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('Üye Çıkış')
                    .setThumbnail(member.user.avatarURL() || "https://images-ext-1.discordapp.net/external/z_UlqYdI1WSjZU3vY-NuKjH0zdGrc6o0uiKqlDTxsrM/%3Fformat%3Dwebp%26quality%3Dlossless/https/images-ext-1.discordapp.net/external/2dZVVL6feMSM7lxfFkKVW__LToSOzmToSEmocJV5vcA/https/cdn.discordapp.com/embed/avatars/0.png?format=webp&quality=lossless")
                    .setDescription(`${member.user.tag} sunucudan ayrıldı.
                        
                                
                            **Kullanıcı ID'si:** ${member.user.id}
                          
                          
                            **Kuruluş Tarihi:** ${member.user.createdAt.toLocaleDateString()}
                    
                    
                            **Ayrılma Tarihi:** ${new Date().toLocaleDateString()}`)
                    .setColor(0xFF0000)
                    .setTimestamp();

                try {
                    await logChannel.send({ embeds: [embed] });
                    console.log((chalk.magenta)`Çıkış logu gönderildi: ${member.user.tag}`);
                } catch (error) {
                    console.error('Çıkış logu gönderilirken hata oluştu:', error);
                }
            }
        }
        const activityStatus = new Map(); // Kullanıcıların oyun durumlarını takip etmek için


        
})}
