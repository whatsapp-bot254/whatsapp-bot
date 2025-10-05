const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

cmd({
    pattern: "obfuscate",
    alias: ["obf", "jscramble"],
    desc: "Obfuscate JavaScript code",
    category: "coding",
    react: "🔐",
    filename: __filename,
    use: '<code> | [low/medium/high]'
}, async (conn, mek, m, { from, quoted, reply, args }) => {
    try {
        let text = args.join(' ');
        let level = 'medium'; // Default obfuscation level
        
        // Check for level specification
        if (text.includes('|')) {
            const parts = text.split('|').map(p => p.trim());
            text = parts[0];
            if (['low', 'medium', 'high'].includes(parts[1].toLowerCase())) {
                level = parts[1].toLowerCase();
            }
        }

        // Get code from quoted message if no text provided
        if (!text && quoted) {
            text = quoted.message?.extendedTextMessage?.text || 
                   quoted.message?.conversation || 
                   quoted.message?.imageMessage?.caption;
        }

        if (!text) return reply('❌ Please provide code to obfuscate or quote a message containing code');

        // Check if code is already obfuscated
        if (text.includes('obfuscated by') || text.includes('obfuscate')) {
            return reply('⚠️ This code appears to be already obfuscated');
        }

        const apiUrl = `https://apis.davidcyriltech.my.id/obfuscate?code=${encodeURIComponent(text)}&level=${level}`;
        
        await reply('⏳ Obfuscating code...');
        const response = await axios.get(apiUrl, { timeout: 15000 });
        
        if (!response.data?.obfuscated) {
            return reply('❌ Failed to obfuscate code. API returned invalid response');
        }

        const result = `/* Obfuscated with ${level} security level */\n\n${response.data.obfuscated}\n\n🔒 Obfuscated by ${config.BOT_NAME}`;
        
        // Send as file if too long
        if (result.length > 1000) {
            await conn.sendMessage(from, { 
                document: { url: `data:text/plain;base64,${Buffer.from(result).toString('base64')}` }, 
                fileName: 'obfuscated.js',
                mimetype: 'application/javascript',
                caption: `🔐 Your obfuscated code (${level} level)`
            }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { 
                text: result,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "Code Obfuscator",
                        body: "Secured your JavaScript",
                        thumbnailUrl: "https://files.catbox.moe/tpzqtm.jpg",
                        sourceUrl: "https://github.com/betingrich3/Mercedes"
                    }
                }
            }, { quoted: mek });
        }
    } catch (e) {
        console.error('Obfuscate Error:', e);
        reply(`❌ Error: ${e.response?.data?.message || e.message}`);
    }
});
