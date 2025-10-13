const config = require('../config');
const { cmd } = require('../command');
const moment = require('moment-timezone');

// Track bot start time
const BOT_START_TIME = process.hrtime.bigint();
const formatCache = new Map();

// Emoji presets
const EMOJI = {
    reactions: ['⚡', '🚀', '💨', '🎯', '🌟', '💎', '🔥', '✨', '🌀', '🔹'],
    statuses: [
        { threshold: 0.3, label: '🚀 Ultra Fast' },
        { threshold: 0.6, label: '⚡ Fast' },
        { threshold: 1.0, label: '⚠️ Moderate' },
        { threshold: Infinity, label: '🐢 Slow' }
    ]
};

cmd({
    pattern: 'ping',
    alias: ['speed', 'pong', 'p'],
    desc: 'Stylish system status panel',
    category: 'main',
    react: '⚡',
    filename: __filename
}, async (cmd, mek, m, { from, sender, reply }) => {
    try {
        const startTime = process.hrtime.bigint();

        // Pick random reaction
        const reactionEmoji = EMOJI.reactions[Math.floor(Math.random() * EMOJI.reactions.length)];

        // React with emoji
        await cmd.sendMessage(from, { react: { text: reactionEmoji, key: mek.key } }).catch(() => {});

        // Calculate response time
        const responseTime = Number(process.hrtime.bigint() - startTime) / 1e9;
        const status = EMOJI.statuses.find(s => responseTime < s.threshold)?.label || '🐢 Slow';

        // Format time & date
        const timezone = config.TIMEZONE || 'Africa/Harare';
        const cacheKey = `${timezone}:${moment().format('YYYY-MM-DD HH:mm:ss')}`;
        let time, date;
        if (formatCache.has(cacheKey)) {
            ({ time, date } = formatCache.get(cacheKey));
        } else {
            time = moment().tz(timezone).format('HH:mm:ss');
            date = moment().tz(timezone).format('DD/MM/YYYY');
            formatCache.set(cacheKey, { time, date });
            if (formatCache.size > 100) formatCache.clear();
        }

        // Uptime
        const uptimeSeconds = Number(process.hrtime.bigint() - BOT_START_TIME) / 1e9;
        const uptime = moment.duration(uptimeSeconds, 'seconds').humanize();

        // Memory usage
        const mem = process.memoryUsage();
        const memoryUsage = `${(mem.heapUsed / 1024 / 1024).toFixed(2)} / ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`;

        // Bot info
        const nodeVersion = process.version;
        const ownerName = config.OWNER_NAME || 'popkid';
        const botName = config.BOT_NAME || 'popkid';
        const repoLink = config.REPO || 'https://github.com/mrpopkid/POPKID-XTR';

        // FANCY BOX STYLE OUTPUT ✨
        const output = `
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ✨ *${botName} Status Panel* ✨   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━┛

📡 *Status*       : ${status}
⚡ *Latency*      : ${responseTime.toFixed(2)}s
⏰ *Time*         : ${time} (${timezone})
📅 *Date*         : ${date}
⏱️ *Uptime*       : ${uptime}
💾 *Memory*       : ${memoryUsage}
🖥️ *Node.js*      : ${nodeVersion}

👨‍💻 *Developer*   : ${ownerName}
🤖 *Bot Name*     : ${botName}

┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🌟 Support & Contribute 🌟   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━┛
🔗 ${repoLink}
        `.trim();

        // Send styled message
        await cmd.sendMessage(from, {
            text: output,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

        // Success reaction
        await cmd.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (err) {
        console.error('❌ Ping Command Error:', err);
        await reply(`❌ Error: ${err.message || 'Ping command failed'}`);
        await cmd.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});
