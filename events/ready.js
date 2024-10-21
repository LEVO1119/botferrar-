const { Client, ActivityType, Collection, Events , DateTime , Permissions,InteractionType , GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Embed } = require("discord.js");
const chalk = require("chalk");

module.exports = async (client) => {


//Oynuyor Kısmı
client.once('ready', async () => {
  

    console.log(chalk.yellow(`
╭━━━┳━━━┳━━━┳━━━┳━━━┳━━━┳━━╮
┃╭━━┫╭━━┫╭━╮┃╭━╮┃╭━╮┃╭━╮┣┫┣╯
┃╰━━┫╰━━┫╰━╯┃╰━╯┃┃╱┃┃╰━╯┃┃┃
┃╭━━┫╭━━┫╭╮╭┫╭╮╭┫╰━╯┃╭╮╭╯┃┃
┃┃╱╱┃╰━━┫┃┃╰┫┃┃╰┫╭━╮┃┃┃╰┳┫┣╮
╰╯╱╱╰━━━┻╯╰━┻╯╰━┻╯╱╰┻╯╰━┻━━╯`))
    console.log(chalk.red( `${client.user.tag} olarak giriş yapıldı!`));

    setInterval(async () => {
        // Tüm sunuculardaki üye sayılarını toplar
        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        
        const activities = [
            `🐱‍👤${totalMembers} kullanıcıya hizmet veriyorum!🐱‍👤`, 
            "🏎️discord.gg/ferrari🏎️"
        ];
        
        const random = activities[Math.floor(Math.random() * activities.length)];
        
        client.user.setPresence({
            activities: [{ name: random, status: "dnd", type: ActivityType.Custom }]
        });
    
    }, 10000);


    // Komutlar
    client.guilds.cache.forEach(async element => {
        const guild = client.guilds.cache.get("725315232129482853");
    await element.commands.set([
        {
            name: 'ticket-kur',
            description: 'Ticket sistemi kur',
            options: [
                {
                    type: 7, // Channel type
                    channel_types: [4],
                    name: 'ticket-katagori',
                    description: 'Ticket kategorisi',
                    required: true,
                },
                {
                    type: 7, // Channel type
                    channel_types: [0],
                    name: 'ticket-log-kanalı',
                    description: 'Log kanalı',
                    required: true,
                },
                {
                    type: 8, // Role type
                    name: 'ticket-rol',
                    description: 'Ticket Yetkili Rolü',
                    required: true,
                },
            ],
        },
        {
            name: "ticket-isim",
            description: "Ticket'ın ismini değiştirir.",
            type: 1,
            options: [
              {
                name: "isim",
                description: "Ticket'ın ismi",
                type: 3,
                required: true
              }
            ]
          },
          {
            name: 'log',
            description: 'Log ayarlarını yapar.',
            options: [
                {
                    type: 1, // SUB_COMMAND tipi
                    name: 'set',
                    description: 'Log ayarlarını yapar.',
                    options: [
                        {
                            type: 3, // STRING tipi
                            name: 'type',
                            description: 'Log türü (messageDelete, roleAdd, roleRemove, memberJoin, memberLeave, activity)',
                            required: true,
                            choices: [
                                { name: 'Mesaj Silme', value: 'messageDelete' },
                                { name: 'Rol Ekleme', value: 'roleAdd' },
                                { name: 'Rol Çıkarma', value: 'roleRemove' },
                                { name: 'Üye Giriş', value: 'memberJoin' },
                                { name: 'Üye Çıkış', value: 'memberLeave' },
                                { name: 'Oyun Aktivitesi', value: 'activity' } // Yeni eklenen seçenek
                            ]
                        },
                        {
                            type: 7, // CHANNEL tipi
                            name: 'channel',
                            description: 'Log kanalını seçin.',
                            required: true
                        }
                    ]
                },
                {
                    type: 1, // SUB_COMMAND tipi
                    name: 'show',
                    description: 'Ayarlanmış log kanallarını gösterir.'
                }
            ],
            async execute(interaction) {
                const subcommand = interaction.options.getSubcommand();
        
                if (subcommand === 'set') {
                    const logType = interaction.options.getString('type');
                    const logChannel = interaction.options.getChannel('channel');
        
                    db.set(`log_${logType}_${interaction.guild.id}`, {
                        logChannelId: logChannel.id
                    });
        
                    await interaction.reply({ content: `${logType} logları ${logChannel} kanalına gönderilecek şekilde ayarlandı.`, ephemeral: true });
                } else if (subcommand === 'show') {
                    const messageDeleteChannel = db.get(`log_messageDelete_${interaction.guild.id}`)?.logChannelId;
                    const roleAddChannel = db.get(`log_roleAdd_${interaction.guild.id}`)?.logChannelId;
                    const roleRemoveChannel = db.get(`log_roleRemove_${interaction.guild.id}`)?.logChannelId;
                    const memberJoinChannel = db.get(`log_memberJoin_${interaction.guild.id}`)?.logChannelId;
                    const memberLeaveChannel = db.get(`log_memberLeave_${interaction.guild.id}`)?.logChannelId;
                    const activityChannel = db.get(`log_activity_${interaction.guild.id}`)?.logChannelId;
        
                    const response = `
        **Log Kanalları:**
        Mesaj Silme: <#${messageDeleteChannel || 'Yok'}>
        Rol Ekleme: <#${roleAddChannel || 'Yok'}>
        Rol Çıkarma: <#${roleRemoveChannel || 'Yok'}>
        Üye Giriş: <#${memberJoinChannel || 'Yok'}>
        Üye Çıkış: <#${memberLeaveChannel || 'Yok'}>
        Oyun Aktivitesi: <#${activityChannel || 'Yok'}>
                    `;
        
                    await interaction.reply({ content: response, ephemeral: true });
                }
            }
        },
        
        
          {
            name: "restart",
            description: "Botu Yeniden Başlatır.",
            type: 1
          },
          {
            name: "rolbilgi",
            description: "Rol Bilgisini Gösterir.",
            type: 1,
            options: [
              {
                name: "rol",
                description: "Rol Bilgisini İstediğiniz Rol",
                type: 8,
                required: true,
              }
            ],
          },    
   {
            name: "uyarı",
            description: "Kullanıcıya Uyarı Vermeye Yarar",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Uyarı  Verilcek Kullanıcı",
                    type: 6,
                    required: true,
                  },
              {
                name: "sebep",
                description: "Uyarı  Sebep`i",
                type: 3,
                required: true,
              },
              {
                name: "adet",
                description: "Uyarı  Adet`i",
                type: 4,
                required: true,
              }
            ],
          },
        {
            name: "ticket-ekle",
            description: "Ticket'a Birini Ekler.",
            type: 1,
            options: [
              {
                name: "kullanıcı",
                description: "Ticket'a eklemek istediğiniz kullanıcı",
                type: 6,
              },
              {
                name: "rol",
                description: "Ticket'a eklemek istediğiniz rol",
                type: 8, 
              }
             
            ]
          },
          {
            name: "ticket-sil",
            description: "Ticket'a Birini Ekler.",
            options: [
              {
                name: "kullanıcı",
                description: "Ticket'dan silmek istediğiniz kullanıcı",
                type: 6,
              },
              {
                name: "rol",
                description: "Ticket'dan silmek istediğiniz rol",
                type: 8,
              }
           
            ]
          },
        {
            name: 'sil',
            description: 'Belirli sayıda mesajı siler.',
            type: 1,
            options: [
                {
                    name: 'mesaj_sayısı',
                    description: 'Silinecek mesaj sayısını girin.',
                    type: 4, 
                    required: true,
                },
            ],
        },
        {
            name: 'istatislik',
            description: 'Bot İstatisliğini Verir',
            type: 1,
        },
        {
            name: 'avatar',
            description: 'Bir kullanıcının profil fotoğrafını gösterir.',
            type: 1,
            options: [
                {
                    name: 'kullanıcı',
                    description: 'Profil fotoğrafını görmek istediğiniz kullanıcıyı seçin.',
                    type: 6, 
                    required: false,
                },
            ],
        },          
        {
            name: 'ban',
            description: 'Bir kullanıcıyı banlar.',
            type: 1,
            options: [
                {
                    name: 'kullanıcı',
                    description: 'Banlanacak kullanıcıyı seçin.',
                    type: 6,
                    required: true,
                },
                {
                    name: 'sebep',
                    description: 'Ban sebebini girin.',
                    type: 3, // 3: STRING
                    required: false,
                },
            ],
        },
            {
                name: 'unban',
                description: 'Bir kullanıcının yasaklamasını kaldırır.',
                type: 1,
                options: [
                    {
                        name: 'kullanıcı_id',
                        description: 'Yasaklaması kaldırılacak kullanıcının ID\'sini girin.',
                        type: 3, // STRING
                        required: true,
                    },
                ],
            },
            {
                name: 'bansorgu',
                description: 'Bir kullanıcının yasaklanma nedenini sorgular.',
                type: 1,
                options: [
                    {
                        name: 'kullanıcı_id',
                        description: 'Yasaklanma nedenini sorgulamak için kullanıcı ID\'sini girin.',
                        type: 3, // STRING
                        required: true,
                    },
                ],
            },
            {
            name: 'rol-ver',
            description: 'Belirtilen kullanıcıya belirtilen rolü verir.',
            type: 1,
            options: [
                {
                    name: 'kullanıcı',
                    description: 'Rol verilecek kullanıcıyı seçin.',
                    type: 6, // 6: USER
                    required: true,
                },
                {
                    name: 'rol',
                    description: 'Verilecek rolü seçin.',
                    type: 8, // 8: ROLE
                    required: true,
                },
            ],
        },
        {
            name: 'kick',
            description: 'Bir kullanıcıyı sunucudan atar.',
            type: 1,
            options: [
                {
                    name: 'kullanıcı',
                    description: 'Atılacak kullanıcıyı seçin.',
                    type: 6, // 6: USER
                    required: true,
                },
                {
                    name: 'sebep',
                    description: 'Atılma sebebini girin.',
                    type: 3, // 3: STRING
                    required: false,
                },
            ],
        },
        {
            name: "mesajgönder",
            description: "Embed İçinde Mesaj Göndermeye Yarar",
            type: 1,
            options: [
              {
                name: "mesaj",
                description: "Yazıcağınız Mesajı Buraya Girin",
                type: 3,
                required: true,
              },
            ],
        },
        {
            name: 'timeout',
            description: 'Bir kullanıcıyı belirli bir süre için zaman aşımına alır.',
            type: 1,
            options: [
                {
                    name: 'kullanıcı',
                    description: 'Zaman aşımına alınacak kullanıcıyı seçin.',
                    type: 6, // 6: USER
                    required: true,
                },
                {
                    name: 'süre',
                    description: 'Kullanıcının zaman aşımında kalacağı süre (örneğin, "10m" veya "1h").',
                    type: 3, // 3: STRING
                    required: true,
                },
            ],
        },
        {
            name: 'slowmode',
            description: 'Kanalın slowmode süresini ayarla.',
            options: [
                {
                    type: 4, // INTEGER
                    name: 'duration',
                    description: 'Slowmode süresi (saniye olarak).',
                    required: true,
                },
            ],
        },
        {
            name: 'untimeout',
            description: 'Bir kullanıcının zaman aşımını kaldırır.',
            type: 1,
            options: [
                {
                    name: 'kullanıcı',
                    description: 'Zaman aşımı kaldırılacak kullanıcıyı seçin.',
                    type: 6, // 6: USER
                    required: true,
                },
            ],
        },
        {
            name: 'kilit',
            description: 'Bir kanalı kilitler veya kilidini açar.',
            type: 1, // 1: Chat Input (Slash) Command
            options: [
                {
                    name: 'kanal',
                    description: 'Kilitlenecek/açılacak kanalı seçin',
                    type: 7, // 7: CHANNEL
                    required: true,
                },
                {
                    name: 'kilitle',
                    description: 'Kanalı kilitle veya aç (kilitlemek için true, açmak için false)',
                    type: 5, // 5: BOOLEAN
                    required: true,
                },
            ],
        },
        {
            name: 'backup',
            description: 'Creates a backup of the server',
            options: [] // Bu komut için seçenekler yok
        },
        {
            name: 'restore',
            description: 'Restores the server from a backup',
            options: [] // Bu komut için seçenekler yok
        },
        { 
            
            name: 'otorol',
            description: 'Yeni üyelere otomatik olarak verilecek rolü ayarlar.',
            type: 1,
            options: [
                {
                    name: 'rol',
                    description: 'Otorol olarak ayarlanacak rolü seçin.',
                    type: 8, // 8: ROLE
                    required: true,
                },
            ],
        },
        {
            name: 'herkeserolver',
            description: 'Belirtilen rolü sunucudaki herkese verir.',
            type: 1,
            options: [
                {
                    name: 'rol',
                    description: 'Verilecek rolü seçin.',
                    type: 8, // 8: ROLE
                    required: true,
                },
            ],
            
        },
    ])
        
    });
    
    console.log(chalk.blue(`/Komutları Başarıyla Yüklendi!`)); 
});

}