const { post, get } = require("snekfetch");
const config = require("../config.json");

const ServerStats = (client) => {
    if (client.user.id !== "303181184718995457") return;
    post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
        .set("Authorization", config.DBL)
        .send({
            server_count: client.guilds.size,
            shard_id: client.shard.id,
            shard_count: client.shard.count
        }).catch(console.log);
};

const isDJ = (msg) => {
    if (!msg.guild) return false;
    if (msg.guild.roles.exists("name", "DJPengu-Bot")) {
        const roleid = msg.guild.roles.find("name", "DJPengu-Bot").id;
        return msg.member.roles.has(roleid);
    }
};

const isPatreon = async (msg) => {
    const [rows] = await msg.client.db.query(`SELECT * FROM patreons WHERE id = '${msg.author.id}'`);
    if (!rows || !rows.length) return false;
    return rows[0].id === msg.author.id;
};

const isUpvoter = (id) => new Promise((resolve, reject) => {
    get(`https://discordbots.org/api/bots/303181184718995457/votes`)
        .set("Authorization", config.DBL)
        .then(r => resolve(r.body.map(c => c.id).includes(id))).catch(err => reject(err));
});


const isAdmin = (msg) => {
    if (!msg.guild) return false;
    if (msg.guild.settings.get(`${msg.author.id}.admin`) || msg.member.hasPermission("ADMINISTRATOR")) return true;
    else return false;
};

const IsDev = (msg) => {
    if (msg.author.id === "136549806079344640") {
        return true;
    } else {
        return false;
    }
};

const dbErr = (client, err) => {
    client.channels.get("385976096061128704").send(`❌ __**DATABASE ERROR**__ ❌
\`\`\`${err.stack}\`\`\``);
};

const haste = (input, extension) => new Promise((res, rej) => {
    if (!input) rej("Input argument is required.");
    post("https://hastebin.com/documents").send(input).then(body => {
        res(`https://hastebin.com/${body.body.key}${extension ? `.${extension}` : ""}`);
    }).catch(e => rej(e));
});

module.exports.updateServercount = ServerStats;
module.exports.isDJ = isDJ;
module.exports.isPatreon = isPatreon;
module.exports.isUpvoter = isUpvoter;
module.exports.isAdmin = isAdmin;
module.exports.IsDev = IsDev;
module.exports.dbErr = dbErr;
module.exports.haste = haste;
