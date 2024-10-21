const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const { Database } =  require('nukleon');
const  db  =  new  Database("./database/otorol.json")
const chalk = require("chalk");

  //OTOROL SİSTEMİ


module.exports = async (client) => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === 'otorol') {
            try {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                    return interaction.reply({ content: 'Yetkiniz yok! Bu komutu kullanamazsınız.', ephemeral: true });
                }
    
                const role = interaction.options.getRole('rol');
                const bot = interaction.guild.members.me;
    
                if (!bot.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                    return interaction.reply({ content: 'Botun rol ekleme yetkisi yok!', ephemeral: true });
                }
    
               
                if (role.position >= bot.roles.highest.position) {
                    return interaction.reply({ content: 'Bu rolü eklemeye Botun Yetkisi yok!', ephemeral: true });
                }
    
                db.set(interaction.guild.id, role.id)
    
              
                await interaction.reply({ content: `Oto-rol olarak ${role.name} rolü ayarlandı.`, ephemeral: true });
    
            } catch (error) {
                console.error('Komut işleme hatası:', error);
                await interaction.reply({ content: 'Bir hata oluştu. Lütfen tekrar deneyin.', ephemeral: true });
            }
        }
    });
    
    client.on(Events.GuildMemberAdd, async (member) => {
        try {
            if (db.get(member.guild.id)) {
             
                const bot = member.guild.members.me;
    
                if (!bot) {
                    console.error('Botun üyesi bulunamadı.');
                    return;
                }
    
             
                if (!bot.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                    console.error('Botun rol ekleme yetkisi yok.');
                    return;
                }
    
             
                const role = member.guild.roles.cache.get(db.get(member.guild.id));
                if (!role) {
                    console.error('Oto-rol rolü bulunamadı.');
                    return;
                }
    
                if (role.position >= bot.roles.highest.position) {
                    console.error('Botun rol ekleme yetkisi yok veya rol pozisyonu çok yüksek.');
                    return;
                }
    
           
                await member.roles.add(db.get(member.guild.id));
                const systemChannel = member.guild.systemChannel;
    
                if (systemChannel) {
                    await systemChannel.send(`<@${member.id}> adlı kullanıcıya otomatik olarak ${role.name} rolü verildi.`);
                } else {
                    console.warn('Sistem kanalı bulunamadı.');
                }
            }
        } catch (error) {
            console.error('Rol ekleme hatası:', error);
        }
    });
    console.log(chalk.greenBright(`[BİLGİ] Otorol Sistemi Başarıyla Yüklendi!`)); 
}