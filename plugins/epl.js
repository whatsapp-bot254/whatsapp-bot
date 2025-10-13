const axios = require('axios');
const { cmd } = require('../command');

// EPL Standings Command
cmd({
    pattern: 'eplstandings',
    alias: ['epltable', 'standings'],
    react: '🏆',
    desc: 'fetch epl standings 📊',
    category: 'sports',
    use: '.eplstandings',
    filename: __filename
}, async (cmd, mek, m, { from, reply }) => {
    try {
        await cmd.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = 'https://apis-keith.vercel.app/epl/standings';
        const { data } = await axios.get(apiUrl, { timeout: 15000 });

        if (!data?.status || !data?.result?.standings) {
            await reply('❌ failed to fetch epl standings 😔');
            await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
            return;
        }

        const { competition, standings } = data.result;
        const standingsList = standings
            .map(team => `
├ *${team.position}.* ${team.team} 📊
├ *ᴘʟᴀʏᴇᴅ*: ${team.played} | *ᴡᴏɴ*: ${team.won} | *ᴅʀᴀᴡ*: ${team.draw} | *ʟᴏsᴛ*: ${team.lost}
├ *ɢᴏᴀʟs*: ${team.goalsFor}/${team.goalsAgainst} (ᴅɪғғ: ${team.goalDifference})
├ *ᴘᴏɪɴᴛs*: ${team.points}`)
            .join('\n\n');

        const caption = `
╭━━〔*ᴇᴘʟ sᴛᴀɴᴅɪɴɢs* 〕━━┈⊷
├ *ᴄᴏᴍᴘᴇᴛɪᴛɪᴏɴ*: ${competition} 🏆
${standingsList}
╰──────────────┈⊷
> *ᴘᴏᴘᴋɪᴅ ᴇᴘʟ sᴛᴀᴛs*`;

        await cmd.sendMessage(from, {
            text: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        await cmd.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('❌ eplstandings error:', error);
        const errorMsg = error.message.includes('timeout')
            ? '❌ request timed out ⏰'
            : '❌ failed to fetch standings 😞';
        await reply(errorMsg);
        await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// Finished EPL Matches Command
cmd({
    pattern: 'finishedeplmatches',
    alias: ['eplfinished', 'eplresults'],
    react: '⚽',
    desc: 'fetch finished epl matches 📅',
    category: 'sports',
    use: '.finishedeplmatches',
    filename: __filename
}, async (cmd, mek, m, { from, reply }) => {
    try {
        await cmd.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = 'https://apis-keith.vercel.app/epl/matches';
        const { data } = await axios.get(apiUrl, { timeout: 15000 });

        if (!data?.status || !data?.result?.matches) {
            await reply('❌ failed to fetch finished matches 😔');
            await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
            return;
        }

        const { competition, matches } = data.result;
        const finishedMatches = matches.filter(match => match.status === 'FINISHED');

        if (!finishedMatches.length) {
            await reply('✅ no finished matches found 😊');
            await cmd.sendMessage(from, { react: { text: '✅', key: m.key } });
            return;
        }

        const matchList = finishedMatches
            .map((match, index) => `
├ *ᴍᴀᴛᴄʜ ${index + 1}:*
├ *ʜᴏᴍᴇ*: ${match.homeTeam} 🏠
├ *ᴀᴡᴀʏ*: ${match.awayTeam} 🛫
├ *sᴄᴏʀᴇ*: ${match.score} ⚽
├ *ᴡɪɴɴᴇʀ*: ${match.winner || 'Draw'} 🏆
├ *ᴍᴀᴛᴄʜᴅᴀʏ*: ${match.matchday}`)
            .join('\n\n');

        const caption = `
╭───[ *ғɪɴɪsʜᴇᴅ ᴇᴘʟ ᴍᴀᴛᴄʜᴇs* ]───
├ *ᴄᴏᴍᴘᴇᴛɪᴛɪᴏɴ*: ${competition} ⚽
├ *ᴛᴏᴛᴀʟ*: ${finishedMatches.length} matches
${matchList}
╰──────────────┈⊷
> *ᴍᴀᴅᴇ ʙʏ ᴘᴏᴘᴋɪᴅ*`;

        await cmd.sendMessage(from, {
            text: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        await cmd.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('❌ finishedeplmatches error:', error);
        const errorMsg = error.message.includes('timeout')
            ? '❌ request timed out ⏰'
            : '❌ failed to fetch matches 😞';
        await reply(errorMsg);
        await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// Upcoming EPL Matches Command
cmd({
    pattern: 'upcomingeplmatches',
    alias: ['eplmatches', 'epl'],
    react: '⚽',
    desc: 'fetch upcoming epl matches 📅',
    category: 'sports',
    use: '.upcomingeplmatches',
    filename: __filename
}, async (cmd, mek, m, { from, reply }) => {
    try {
        await cmd.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = 'https://apis-keith.vercel.app/epl/upcomingmatches';
        const { data } = await axios.get(apiUrl, { timeout: 15000 });

        if (!data?.status || !data?.result?.upcomingMatches) {
            await reply('❌ failed to fetch upcoming matches 😔');
            await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
            return;
        }

        const { competition, upcomingMatches } = data.result;

        if (!upcomingMatches.length) {
            await reply('✅ no upcoming matches found 😊');
            await cmd.sendMessage(from, { react: { text: '✅', key: m.key } });
            return;
        }

        const matchList = upcomingMatches
            .map((match, index) => `
├ *ᴍᴀᴛᴄʜ ${index + 1}:*
├ *ʜᴏᴍᴇ*: ${match.homeTeam} 🏠
├ *ᴀᴡᴀʏ*: ${match.awayTeam} 🛫
├ *ᴅᴀᴛᴇ*: ${match.date} 📅
├ *ᴍᴀᴛᴄʜᴅᴀʏ*: ${match.matchday}`)
            .join('\n\n');

        const caption = `
╭───[ *ᴜᴘᴄᴏᴍɪɴɢ ᴇᴘʟ ᴍᴀᴛᴄʜᴇs* ]───
├ *ᴄᴏᴍᴘᴇᴛɪᴛɪᴏɴ*: ${competition} ⚽
├ *ᴛᴏᴛᴀʟ*: ${upcomingMatches.length} matches
${matchList}
╰──────────────┈⊷
> *ᴍᴀᴅᴇ ʙʏ ᴘᴏᴘᴋɪᴅ*`;

        await cmd.sendMessage(from, {
            text: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        await cmd.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('❌ upcomingeplmatches error:', error);
        const errorMsg = error.message.includes('timeout')
            ? '❌ request timed out ⏰'
            : '❌ failed to fetch matches 😞';
        await reply(errorMsg);
        await cmd.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
