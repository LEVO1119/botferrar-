const { Client, ActivityType, Collection, Events, DateTime, Permissions, InteractionType, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Database } = require('nukleon');
const db = new Database("./database/ticket.json");
const chalk = require("chalk");

module.exports = async (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.commandName === "ticket-kur") {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({ content: 'Yetkiniz yok! Bu komutu kullanamazsınız.', ephemeral: true });
            }
            const categoryChannel = interaction.options.getChannel("ticket-katagori");
            const logChannel = interaction.options.getChannel("ticket-log-kanalı");
            const role = interaction.options.getRole("ticket-rol");

            if (!categoryChannel || !logChannel || !role) {
                return interaction.reply({ content: "Lütfen tüm gerekli seçenekleri doldurduğunuzdan emin olun.", ephemeral: true });
            }

            db.set(interaction.guild.id + "+katagori", categoryChannel.id);
            db.set(interaction.guild.id + "+log", logChannel.id);
            db.set(interaction.guild.id + "+rol", role.id);

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "Ticket System",
                    iconURL: client.user.avatarURL()
                })
                .setDescription(`If you want to get support on any issue or if you want to purchase one of the services, click the button below.

Disrespect is prohibited in ticket channels!   
                    
                    **:link: Linkler**:
                    [Discord](https://discord.gg/Ferrari)`)
                .setImage("https://cdn.discordapp.com/attachments/793169492103921718/1296111194394071081/FerrariProfilGif.gif?ex=6711191d&is=670fc79d&hm=22515344b48ae3967f17ff7320cb3c828429434373b09c08494a1740962b1864&")
                .setThumbnail(client.user.avatarURL())
                .setColor("#eaff00")
                .setFooter({
                    text: "Ferrari #OFFICIAL",
                    iconURL: client.user.avatarURL()
                });

            const button = new ButtonBuilder()
                .setLabel('Open Ticket')
                .setCustomId('ticket-ac')
                .setEmoji("<a:ferrarigif:1274785625605673021>")
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder()
                .addComponents(button);

            interaction.channel.send({ embeds: [embed], components: [row] });

            interaction.reply({ content: "Ticket Sistemi Kuruldu", ephemeral: true });
        }
        else if (interaction.customId === "ticket-ac") {
            const roleId = db.get(interaction.guild.id + "+rol");

            if (!roleId) {
                return interaction.reply({ content: "Rol bulunamadı. Lütfen tekrar bilet oluşturmayı deneyin.", ephemeral: true });
            }

            // Kullanıcının daha önce ticket açıp açmadığını kontrol et
            const existingTicket = interaction.guild.channels.cache.find(channel => 
                channel.topic === interaction.user.id && channel.name.startsWith("ticket-")
            );

            if (existingTicket) {
                return interaction.reply({ content: "You already have an open ticket. You cannot open a new ticket.", ephemeral: true });
            }

            // Eğer açık ticket yoksa yeni ticket aç
            interaction.guild.channels.create({
                name: "ticket-" + interaction.user.tag,
                type: ChannelType.GuildText,
                topic: interaction.user.id,
                parent: db.get(interaction.guild.id + "+katagori"),
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: roleId,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            }).then(async (channel) => {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: "Ticket System",
                        iconURL: client.user.avatarURL(),
                    })
                    .setDescription("Your Support Request Has Been Created Successfully and Will Get Back As Soon As Possible")
                    .setThumbnail(client.user.avatarURL())
                    .setColor("#eaff00")
                    .setFooter({
                        text: "Ferrari #OFFICIAL",
                        iconURL: client.user.avatarURL(),
                    });

                const button = new ButtonBuilder()
                    .setLabel('Close Ticket')
                    .setCustomId('ticket-kapat')
                    .setEmoji("<a:ferrarigif:1274785625605673021>")
                    .setStyle(ButtonStyle.Danger);
                const row = new ActionRowBuilder()
                    .addComponents(button);

                channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });

                let date = new Date();
                let trDate = date.toLocaleDateString("tr-TR", {
                    "month": "long",
                    "year": "numeric",
                    "day": "numeric"
                });
                const ticketolusturdun = new EmbedBuilder()
                    .setAuthor({ name: `Ferrari - Support System`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setColor("#eaff00")
                    .setDescription(`
                    ☕ ・ \`Support Opened:\` <@${interaction.user.id}>
                    🔒 ・ \`Support Channel:\` <#${channel.id}>
                    🕗 ・ \`History: ${trDate} ${date.getHours()}:${date.getMinutes()}\``);

                interaction.reply({ embeds: [ticketolusturdun], ephemeral: true });
            });
        }
        else if (interaction.customId === "ticket-kapat") {

            const roleId = db.get(interaction.guild.id + "+rol");
            if (!interaction.member.roles.cache.has(roleId) && interaction.user.id !== interaction.guild.ownerId) {
                return interaction.reply({ content: "Bu komutu kullanmak için gerekli role sahip olmanız gerekmektedir.", ephemeral: true });
            }
            let mesaj = interaction.channel.messages.cache.filter(x => !x.author.bot).map(x => `${x.author.tag} : ${x.content}`).join("\n");
            await client.channels.cache.get(db.get(interaction.guild.id + "+log")).send({ files: [{ attachment: Buffer.from(mesaj), name: `${interaction.channel.name}-destek-talebi.txt` }] });

            const logEmbed = new EmbedBuilder()
                .setAuthor({
                    name: "Ticket Kapatıldı",
                    iconURL: client.user.avatarURL()
                })
                .setColor("#eaff00")
                .setDescription(`
                    📤 ・ \`Ticket'i Kapatan:\` <@${interaction.user.id}>
                     📤 ・ \`Ticket'i Açan:\` <@${interaction.channel.topic}>
                    🔒 ・ \`Ticket Kanalı:\` <#${interaction.channel.id}>
                    🕗 ・ \`Kapatılma Tarihi:\` ${new Date().toLocaleString("tr-TR")}
                `);

            const logChannel = client.channels.cache.get(db.get(interaction.guild.id + "+log"));
            if (logChannel) {
                logChannel.send({ embeds: [logEmbed] });
            }

            interaction.reply("Ticket Closes in 5 Seconds!")
                .then(msg => {
                    try { setTimeout(() => interaction.channel.delete(), 5000); } catch { }
                });
        }
    });

    console.log(chalk.greenBright(`[BİLGİ] Ticket Sistemi Başarıyla Yüklendi!`));
};
