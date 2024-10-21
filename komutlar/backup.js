const { Client, PermissionsBitField, EmbedBuilder } = require("discord.js");
const chalk = require("chalk");
const { Database } = require('nukleon');
const db = new Database("./database/backup.json");

// BACKUP SYSTEM
module.exports = async (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'backup') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({
                    embeds: [new EmbedBuilder().setColor(0xFF0000).setDescription("Bu Komutu Kullanmak İçin Yönetici Yetkisine Sahip Olmalısınız.")], 
                    ephemeral: true 
                });
            }

            await interaction.deferReply({ ephemeral: true });

            try {
                const backupData = {
                    guild: interaction.guild.id,
                    channels: interaction.guild.channels.cache
                        .sort((a, b) => a.position - b.position)
                        .map(channel => ({
                            id: channel.id,
                            name: channel.name,
                            type: channel.type,
                            parent: channel.parentId || null,
                            position: channel.position,
                            permissionOverwrites: channel.permissionOverwrites.cache.map(overwrite => ({
                                id: overwrite.id,
                                allow: overwrite.allow.bitfield.toString(),
                                deny: overwrite.deny.bitfield.toString(),
                            })),
                            topic: channel.topic,
                            nsfw: channel.nsfw,
                            rateLimitPerUser: channel.rateLimitPerUser,
                        })),
                    emojis: interaction.guild.emojis.cache.map(emoji => emoji.toJSON()),
                    voiceStates: interaction.guild.members.cache.map(member => ({
                        id: member.id,
                        channelId: member.voice.channelId,
                    })),
                    roles: interaction.guild.roles.cache
                        .sort((a, b) => a.position - b.position)
                        .map(role => ({
                            id: role.id,
                            name: role.name,
                            color: role.color,
                            hoist: role.hoist,
                            position: role.position,
                            permissions: role.permissions.bitfield.toString(),
                            mentionable: role.mentionable,
                        })),
                };

                // Kullanıcıya bağlı olmadan global yedek al
                await db.set("global_backup", backupData);

                return interaction.editReply({ embeds: [new EmbedBuilder().setColor(0x00FF00).setDescription("Sunucu yedeği başarıyla alındı!")] });
            } catch (error) {
                console.error("Error creating backup:", error);
                return interaction.editReply({ embeds: [new EmbedBuilder().setColor(0xFF0000).setDescription("Yedek alınırken bir hata oluştu. Lütfen konsolu kontrol edin.")], ephemeral: true });
            }
        }

        if (interaction.commandName === 'restore') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({
                    embeds: [new EmbedBuilder().setColor(0xFF0000).setDescription("Bu Komutu Kullanmak İçin Yönetici Yetkisine Sahip Olmalısınız.")], 
                    ephemeral: true 
                });
            }

            await interaction.deferReply({ ephemeral: true });

            try {
                // Kullanıcı kimliği olmadan global yedeği yükle
                const backupData = await db.get("global_backup");

                if (!backupData) {
                    return interaction.editReply({ embeds: [new EmbedBuilder().setColor(0xFF0000).setDescription("Geri yüklenecek yedek bulunamadı.")] });
                }

                const channels = interaction.guild.channels.cache;
                for (const channel of channels.values()) {
                    await channel.delete();
                }

                const roles = interaction.guild.roles.cache.filter(role => role.id !== interaction.guild.id);
                for (const role of roles.values()) {
                    try { 
                        await role.delete();
                    } catch (error) {
                        console.log("Error deleting role:", error);
                    }
                }

                const roleCreationPromises = backupData.roles.sort((a, b) => b.position - a.position).map(roleData => {
                    return interaction.guild.roles.create({
                        name: roleData.name,
                        color: roleData.color,
                        hoist: roleData.hoist,
                        permissions: new PermissionsBitField(roleData.permissions),
                        mentionable: roleData.mentionable,
                    });
                });

                const categories = new Map();
                for (const channelData of backupData.channels) {
                    if (channelData.type === 4) {
                        const category = await interaction.guild.channels.create({
                            name: channelData.name,
                            type: channelData.type,
                            position: channelData.position,
                        });
                        categories.set(channelData.id, category.id);
                    }
                }

                for (const channelData of backupData.channels) {
                    if (channelData.type === 0 || channelData.type === 2) {
                        const parent = channelData.parent ? categories.get(channelData.parent) : null;
                        await interaction.guild.channels.create({
                            name: channelData.name,
                            type: channelData.type,
                            parent: parent,
                            topic: channelData.topic,
                            nsfw: channelData.nsfw,
                            rateLimitPerUser: channelData.rateLimitPerUser,
                            position: channelData.position,
                        });
                    }
                }

                await Promise.all(roleCreationPromises);

                return interaction.editReply({ embeds: [new EmbedBuilder().setColor(0x00FF00).setDescription("Yedekten başarıyla geri yüklendi!")] });
            } catch (error) {
                console.error("Error restoring backup:", error);
                return interaction.editReply({ embeds: [new EmbedBuilder().setColor(0xFF0000).setDescription("Yedek geri yüklenirken bir hata oluştu. Lütfen konsolu kontrol edin.")], ephemeral: true });
            }
        }
    });

    console.log(chalk.greenBright(`[BİLGİ] Backup Sistemi Başarıyla Yüklendi!`)); 
}
