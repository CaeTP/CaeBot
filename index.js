const fs = require('fs');
const Discord = require('discord.js');
const botSettings = require('./botSettings.json');
const prefix = botSettings.prefix;


const bot = new Discord.Client({
  disableEveryone: true
})
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}





bot.on("ready", async() => {
  console.log(`${bot.user.username} is up and running!`);
});

/*bot.on('guildMemberAdd', member => {
  let banned = ['fuck', 'nig', 'nigger', 'shit', 'cum', 'sex', 'nibba', 'anal', 'anus', 'arse', 'ass', 'blowjob', 'bitch', 'vagina', 'penis', 'nigga', 'whore', 'slut', 'motherfuck', 'faggot', 'fag', 'faggots', 'sluts', 'whores', 'niggas', 'niggers'];
  const MemberUser = member.user.username;
  const MemberNick = member.user.nickname;
  const bannedToString = banned.toString()
  const channel = member.guild.channels.find("name", "welcome");
  const channelRule = member.guild.channels.find("name", "rules");
  const channelRole = member.guild.channels.find("name", "role-hierarchy");
  let channelRoleid = channelRule.id;
  let channelRuleid = channelRole.id;

  for(var i = 0; i < banned.length; i++) {
    if(MemberUser.toLowerCase().indexOf(banned[i]) !== -1 || (MemberNick !== undefined && MemberNick.toLowerCase().indexOf(banned[i]) !== -1)) {
      member.send("**Your username has racial, sexual or offending words, Please change your username!** \n"); //ruleChannel
      member.kick('Your username contains sexual or offending words, Please change your username.')
      break;
    }
  }
  if(channel !== undefined) {
    channel.send("Welcome to the server " + member + ", Please read out the " + "<#" + channelRuleid +"> and the <#" + channelRoleid + ">!");
    member.addRole(member.guild.roles.find("name", "Members"));
  }
});*/


bot.on("message", async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  let messageArray = message.content.split(/ +/);
  let command = messageArray[0];
  let args = messageArray.slice(1);
  console.log(messageArray);
  console.log(command);
  console.log(args);

  if (command === `${prefix}embed`) {
    bot.commands.get('embed').execute(message, args);
  }

  if (command === `${prefix}prune`) {
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have the permission to use this command!");
    let amount = Number(args[0]);
    let reason = args.slice(1);
    let rJoined = reason.join(" ");
    if(args.length === 1 || !reason || !amount || amount > 100 || amount === 1) return message.channel.send("Incorrect usage! Type `!help <prune>!`");
    let chan = bot.channels.get('389298755460923403');
    let cases = Math.floor(Math.random() * 100 + 1);
    let dateNow = new Date();
    let msgAuth = `${message.author.username}#${message.author.discriminator}`;
    let data = `${message.author.username} pruned ${amount} messages in ${message.guild.name} in ${message.channel.name} at ${dateNow}!\r\n\n`;
    fs.appendFileSync("dat.json", data);
    message.channel.bulkDelete(amount + 1);
    const embed = new Discord.RichEmbed()
    .setThumbnail(message.author.avatarURL)
    .setAuthor(`Case ${cases} | Prune | ${msgAuth}`, message.author.avatarURL)
    .addField(`Pruner:`, `${message.author}`, true)
    .addField(`Amount deleted:`, `${amount}`, true)
    .addField(`Reason:`, `${reason.join(" ")}`, true)
    .addField(`Channel:`, `${message.channel.name}`, true)
    .setFooter(`ID: ${message.author.id}`)
    .setTimestamp()
    chan.send(embed);


  }

  if (command === `${prefix}id`) {
    bot.commands.get('id').execute(message, args);
  }

  if (command === `${prefix}calc`) {
    bot.commands.get('calc').execute(message, args);
  }

  if (command === `${prefix}userinfo`) {
    /*let dateo = new Date();
    let toEmbed = message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
    if(!toEmbed) return message.reply('You did not specify a user or ID!');
    let embed = new Discord.RichEmbed()
    .setColor("#ffffff")
    .addField("Full Username:", `${toEmbed.user.username}#${toEmbed.user.discriminator}`)
    .setThumbnail(toEmbed.user.avatarURL)
    .addField("ID:", toEmbed.user.id)
    .addField("Created At:", dateo.
    message.channel.send(embed);*/
  }

  if (command === `${prefix}mute`) {
    let chan = bot.channels.get('389298755460923403');
    let cases = Math.floor(Math.random() * 1000 + 1);
    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
    let colorOfArray = ["0x633539", "0x5e3563", "0x363563", "0x355863", "0x35633e", "0x4e8478", "0x898643", "0x895f43"];
    let randomChoice = Math.floor(Math.random() * colorOfArray.length);
    let toName = toMute.user.username + "#" + toMute.user.discriminator;
    let toMod = message.author;
    let toMention = `<@${toMute.user.id}>`;
    let argsToSend = args.slice(1);
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have manage messages.");

    if (!argsToSend || !toMute) {
      return message.channel.send("Incorrect usage of the command.\nType `!help`.");
    }
    let roleMember = message.guild.roles.find(r => r.name === "Members");

    // console.log(roleMember) (For logging the whole classes and their values and properties.)

    if (toMute.roles.has(roleMember.id)) {
      toMute.removeRole(roleMember);
    }

    let role = message.guild.roles.find(r => r.name === "Muted");
    if (!role) {
      try {
        role = await message.guild.createRole({
          name: "Muted",
          color: "#7A9703",
          permissions: []
        });

        message.guild.channels.forEach(async(channel, id) => {
          await channel.overwritePermissions(role, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      } catch (e) {
        console.log(e.stack);
      }
    }

    if (toMute.roles.has(role.id)) return message.channel.send("This user is already muted!");

    await toMute.addRole(role);
    message.channel.send("✅ " + toMute + " has been successfully muted!");
    const embed = new Discord.RichEmbed()
      .setColor(colorOfArray[randomChoice])
      .setAuthor(`Case ${cases} | Mute | ${toName}`, "https://cdn.discordapp.com/icons/389193592679170070/4309de2dc4573db27f5aabe02305a408")
      .addField("User:", `${toMention}`, true)
      .addField("Moderator:", toMod, true)
      .addField("Reason:", argsToSend.join(" "))
      .setFooter(`ID: ${toMute.user.id}`)
      .setTimestamp()
    chan.send(embed);


    return;
    // let caseD = 0;
  }

  if (command === `${prefix}unmute`) {

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have manage messages.");

    let toUnmute = message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
    if (!toUnmute) return message.channel.send("You did not specify a user or ID!");

    let role = message.guild.roles.find(r => r.name === "Muted");
    let roleMember = message.guild.roles.find(r => r.name === "Members");

    if (!toUnmute.roles.has(roleMember.id) || !toUnmute.roles == '389632207586852866') {
      toUnmute.addRole(roleMember);
    }


    if (!role || !toUnmute.roles.has(role.id)) return message.channel.send("This user is not muted!");

    await toUnmute.removeRole(role);
    message.channel.send("✅ " + toMute + " has been successfully unmuted!");

    return;

  }

  if (command === `${prefix}gp`) {
    bot.commands.get('gp').execute(message, args);
  }

  if (command === `${prefix}warn`) {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have the permission to use this command.");
    let toWarn = message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
    let reasons = args.slice(1).join(" ")
    let modChannel = bot.channels.get("389298755460923403");
    let cases = Math.floor(Math.random() * 1000 + 1);
    let dateNow = new Date();
    let data = `${toWarn.user.username} got warned by ${message.author.username} in ${message.guild.name} for "${reasons}" at ${dateNow}\r\n\n`
    const embed = new Discord.RichEmbed()
    .setAuthor(`Case ${cases} | Warn | ${toWarn.user.username}#${toWarn.user.discriminator}`,  toWarn.user.avatarURL)
    .setColor(0xafedc4)
    .addField(`User`, `${toWarn}`, true)
    .addField("Moderator", message.author, true)
    .addField("Reason", reasons)
    .setFooter(`ID: ${toWarn.user.id}`)
    .setTimestamp()
    modChannel.send(embed);
    fs.appendFileSync("dat.json", data);

  }

  if (command.toLowerCase() === `${prefix}dltc`) {
    let chan = bot.channels.get(args[0].toString());
    let guildName = message.guild.name;
    let dateNow = new Date();
    let data = (`${message.author.username} have used the delete command in ${guildName}on ${chan.name} for ${reasons} at ${dateNow}!\r\n\n`);
    fs.appendFileSync("dat.json", data);
    if (message.author.id !== "322399270877659136" && message.author.id !== "326879764575158272") return;
      if(args[0]) {
        chan.delete();
      message.channel.send("Channel has been deleted successfully");
    } else {
      message.channel.send("Incorrect usage! Type `!help <delc>`!")

    }
  }

  if (command === `${prefix}help`) {
    bot.commands.get('help').execute(message, args);
  }

  if (command === `${prefix}ping`) {
    d = new Date();
        const embed = new Discord.RichEmbed()
        .setColor(0xffffff)
        .addField('🏓', "Pong!");
        message.channel.send(embed);
  }

  if (command === `${prefix}kick`) {
    bot.commands.get('kick').execute(message, args);
  }
});





bot.login(botSettings.token);



// Save or log all commands.
// Num(m, b)
// Help commands!



/*
const thousand = "K",
tenThousand = "K",
hundredThousand = "K",
million = "M",
billion = "B",
trillion = "T",
quadrillion = "Q",
quintillion = "Qi",
sextillion = "S",
septillion = "SP",
octillion = "O",
nonillion = "N",
decillion = "D",
undecillion = "UD",
duodecillion = "DU";
*/
