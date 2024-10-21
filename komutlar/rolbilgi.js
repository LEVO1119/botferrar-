const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const { Database } =  require('nukleon');
const  db  =  new  Database("./database/otorol.json")
const chalk = require("chalk");
 

//ROLBİLGİ SİSTEMİ

module.exports = async (client) => {
client.on(Events.InteractionCreate, async (interaction) => {
   if(interaction.commandName === "rolbilgi") {
     if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
       return interaction.reply({ content: 'Bu komutu kullanmak için "Mesajları Yönet" yetkisine sahip olmalısın.', ephemeral: true });
   }
      await interaction.deferReply();
      const rol = interaction.options.getRole("rol");

      let kisiler = "";

      rol.members.forEach(async(member) => {
        kisiler += `<@${member.user.id}> - (\`${member.user.tag}\`)` + "\n";
      })

      let rolrengi;

      if(rol.color === 0) {
        rolrengi = "#000000";
      } else {
        rolrengi = rol.color;
      }

      const embed = new EmbedBuilder()
      .setAuthor({name: "Ferrari Shop" + " - Rol Bilgi", iconURL: client.user.avatarURL()})
      .setDescription(`<@&${rol.id}> ***Rol bilgileri;***

<a:maviyuvarlak:1275442674781917307>  ・ **Rol Rengi:** \`${rolrengi}\`
<a:disli:1275442741223882762> ・ **Rol ID:** \`${rol.id}\`
<a:kraltaci:1275442774652752056>  ・ **Rol Kişi Sayısı:** \`${rol.members.size}\`

**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**

<a:kirmiziyuvarlak:1275442885629706282> ・ ***Roldeki Kişiler;***

${kisiler}`)
      .setFooter({text: "Wasted Roleplay", iconURL: client.user.avatarURL()})
      .setTimestamp()

      await interaction.editReply({embeds: [embed]})
    }
  
}
)}
