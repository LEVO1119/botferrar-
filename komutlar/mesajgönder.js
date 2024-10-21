const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");

//EMBED MESAJ GÖNDERME SİSTEMİ

module.exports = async (client) => {  
    client.on("interactionCreate",async(interaction) => {
if(interaction.commandName === "mesajgönder") {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return interaction.reply({ content: 'Yetkiniz yok! Bu komutu kullanamazsınız.', ephemeral: true });
    }
    const embed = new EmbedBuilder()
    .setDescription(interaction.options.getString("mesaj"))
    .setColor("#eaff00")
    .setThumbnail("https://cdn.discordapp.com/attachments/793169492103921718/1296111194394071081/FerrariProfilGif.gif?ex=6711191d&is=670fc79d&hm=22515344b48ae3967f17ff7320cb3c828429434373b09c08494a1740962b1864&")
    .setFooter({text: "Ferrari", iconURL: client.user.avatarURL()})

    interaction.channel.send({embeds: [embed]});
    return interaction.reply({content: "Mesaj Gönderildi", ephemeral: true });
}
    })
 
    console.log(chalk.greenBright(`[BİLGİ] Mesaj Gönder Sistemi Başarıyla Yüklendi!`)); 
}
