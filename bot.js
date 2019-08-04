const roblox = require('noblox.js')
const Discord = require('discord.js')
const client = new Discord.Client();
var token = "NTMwNjM0NTQ3MTA1MzY2MDM2.DxCQHQ.E58NqDfg7Sj83lBvqA3AScREaQM";

client.login(token)

var cookie = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_C82EE141A9CF387C760749C106327645A4EF99B2CACA6831F90BE24BAFC6004844C2ECC49C5C0A3F1800D56BBC81B3FEDDA290A7BA34C2DDFF7706E57EB7285E3118AF53CA2A0B598EC794466AAC5154351D28DCBF07D9E09F631807477A15921569ABF9627DD460DFE9F5F5A34104050704790E3AA263E73C8D9BAF987883BAA337ADD4AC2EEA65DF5F1F4F6BB6548DAC62C2F08B4DD8FE88681F0CAD43F5E32154007815F07CCF9127A29EA4520A69D37DDA4070C5A727719160EC22A51F476CAE407FCDF99856E6D9F1E446596BF4E2C9971080D8CFA3C434CA841CEE06B402D7BEB9365ADF6CD3894602E7E312B91C144C41A6B388504704BA28988823845B2C165BDC1617904EF4C6566B8F8B151C7342F6D524AD4393E1FD1A42D91231BB3F1DDF";
var prefix = '.';
var groupId = 4239894;
var maximumRank = 254;

function login() {
    return roblox.cookieLogin(cookie);
}

login() // Log into ROBLOX
    .then(function() { // After the function has been executed
        console.log('Logged in.') // Log to the console that we've logged in
    })
    .catch(function(error) { // This is a catch in the case that there's an error. Not using this will result in an unhandled rejection error.
        console.log(`Login error: ${error}`) // Log the error to console if there is one.
    });
 
function isCommand(command, message){
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
}
 
client.on('message', (message) => {
    if (message.author.bot) return; // Dont answer yourself.
    var args = message.content.split(/[ ]+/)
   
    if(isCommand('rank', message)){
       if(!message.member.roles.some(r=>["Officers"].includes(r.name)) ) // OPTIONAL - Checks if the sender has the specified roles to carry on further
        return message.reply("You can't use this command.");
        var username = args[1]
        var rankIdentifier = Number(args[2]) ? Number(args[2]) : args[2];
        if (!rankIdentifier) return message.channel.send("Please enter a rank");
        if (username){
            message.channel.send(`Checking ROBLOX for ${username}`)
            roblox.getIdFromUsername(username)
            .then(function(id){
                roblox.getRankInGroup(groupId, id)
                .then(function(rank){
                    if(maximumRank <= rank){
                        message.channel.send(`${id} is rank ${rank} and not promotable.`)
                    } else {
                        message.channel.send(`${id} is rank ${rank} and promotable.`)
                        roblox.setRank(groupId, id, rankIdentifier)
                        .then(function(newRole){
                            message.channel.send(`Changed rank to ${newRole.Name}`)
                        }).catch(function(err){
                            console.error(err)
                            message.channel.send("Failed to change rank.")
                        });
                    }
                }).catch(function(err){
                    message.channel.send("Couldn't get that player in the group.")
                });
            }).catch(function(err){
                message.channel.send(`Sorry, but ${username} doesn't exist on ROBLOX.`)
           });
       } else {
           message.channel.send("Please enter a username.")
       }
       return;
   }
})