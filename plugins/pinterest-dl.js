const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pindl",
    alias: ["pinterestdl", "pin", "pins", "pindownload"],
    desc: "Download media from Pinterest",
    category: "download",
    filename: __filename,
    use: '<Pinterest URL>'
}, async (conn, mek, m, { args, quoted, from, reply }) => {
    try {
        if (!args[0]) {
            return reply('❎ Please provide a Pinterest URL.\nExample: .pindl https://pin.it/example');
        }

        const pinterestUrl = args[0];
        if (!pinterestUrl.includes('pinterest.com') && !pinterestUrl.includes('pin.it')) {
            return reply('❎ Invalid Pinterest URL. Please provide a valid Pinterest link.');
        }

        // Show waiting message
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        const processingMsg = await reply('⏳ Downloading from Pinterest...');

        const apiUrl = `https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(pinterestUrl)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });

        if (!response.data?.success) {
            await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
            return reply('❎ Failed to download media. The link may be invalid or private.');
        }

        const media = response.data.result.media;
        const title = response.data.result.title || 'Pinterest Media';
        const description = response.data.result.description || 'No description available';

        // Prepare the caption in the exact same format as your list command
        const desc = `*╭┈───────────────•*
*〈 Pinterest Downloader 〉*   
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* 📌 *Title:* ${title}
*│  ◦* 📝 *Description:* ${description}
*│  ◦* 🎞️ *Media Type:* ${media[0].type}
*╰┈───────────────•*
*╭┈───────────────•*
*│* 🌐 *Channel:* https://whatsapp.com/channel/0029VbB4nox4Y9lqVl2X8n3m
*│* 💻 *Github:* https://github.com/whatsapp-bot254
*│* 📞 *Contact:* https://wa.me/254717263689
*╰┈───────────────•*
*◆─〈 ✦Made by Marisel✦ 〉─◆*`;

        // Find best quality media
        const video = media.find(item => item.type.includes('video'));
        const image = media.find(item => item.type.includes('image') || item.type.includes('Thumbnail'));

        // Send the media with enhanced features
        if (video) {
            await conn.sendMessage(from, { 
                video: { url: video.download_url }, 
                caption: desc,
                gifPlayback: true,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363299029326322@newsletter',
                        newsletterName: 'sir bravine',
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "Pinterest Downloader",
                        body: title,
                        mediaType: 2,
                        thumbnailUrl: 'https://files.catbox.moe/56lp6n.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029VbB4nox4Y9lqVl2X8n3m',
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: mek });
        } else if (image) {
            await conn.sendMessage(from, { 
                image: { url: image.download_url }, 
                caption: desc,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "Pinterest Downloader",
                        body: title,
                        thumbnailUrl: image.download_url,
                        sourceUrl: 'https://whatsapp.com/channel/0029VbB4nox4Y9lqVl2X8n3m',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: mek });
        }

    } catch (e) {
        console.error('Pinterest Download Error:', e);
        await conn.sendMessage(from, { 
            text: `*╭┈───────────────•*\n*┋* Pinterest Download Error!\n*┋* ${e.message}\n*╰┈───────────────•*`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });
    }
});
