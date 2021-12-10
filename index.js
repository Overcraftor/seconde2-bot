const discord = require('discord.js');
const myIntents = new discord.Intents();
myIntents.add(discord.Intents.FLAGS.GUILD_PRESENCES, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILDS);
const client = new discord.Client({intents: myIntents});
config = require("./config.json");

client.login(process.env.TOKEN).then();

let channel;
client.on("ready", () => {
    console.log(`Bot connecté ! \nNom : ${client.user.username}#${client.user.discriminator}\nId : ${client.user.id}`);
    client.user.setActivity("By Overcraftor #4841 (Thomas)", {type: "PLAYING"});
    channel = client.channels.cache.get(config.channelToSetName);
});

client.on("guildMemberAdd", (member) => {
    member.user.send("Bienvenue sur le serveur Discord des 2nd2, veuillez donner votre nom dans le salon correspondant avec votre groupe :)").then();
});

client.on("messageCreate", (message) => {
    if(message.member.user.bot || message.channel !== channel)
        return;

    let hasRole = false
    message.member.roles.cache.forEach(role => {
        if(role.id === config.roleOnNameSet)
            hasRole = true;
    });

    if(!hasRole){
        message.delete().then();
        let roleToAssign =  message.guild.roles.cache.find(r => r.id === config.roleOnNameSet);
        message.member.setNickname(message.content, "Nom de la personne").then((member) => {
            member.roles.add(roleToAssign).then().catch();
        }).catch(() => {
            message.member.send("Votre nom ne peux pas être modifié !" +
                "\nSoit vous avez entré un nom trop long, soit le bot n'a pas la permission." +
                "\nSi le problème persiste, veuillez contacter un administrateur").then()
        });
    }
});