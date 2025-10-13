const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const os = require('os');
const { getPrefix } = require('../lib/prefix');

// Stylish Uppercase Conversion
function toUpperStylized(str) {
  const stylized = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 'ꜱ', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.split('').map(c => stylized[c.toUpperCase()] || c).join('');
}

// Normalize Categories
const normalize = (str) => str.toLowerCase().replace(/\s+menu$/, '').trim();

// Emojis for Categories
const emojiByCategory = {
  ai: '🤖', anime: '🍥', audio: '🎧', bible: '📖', download: '⬇️',
  downloader: '📥', fun: '🎮', game: '🕹️', group: '👥', img_edit: '🖌️',
  info: 'ℹ️', information: '🧠', logo: '🖼️', main: '🏠', media: '🎞️',
  menu: '📜', misc: '📦', music: '🎵', other: '📁', owner: '👑',
  privacy: '🔒', search: '🔎', settings: '⚙️', sticker: '🌟', tools: '🛠️',
  user: '👤', utilities: '🧰', utility: '🧮', wallpapers: '🖼️', whatsapp: '📱',
};

// Main Command
cmd({
  pattern: 'menu',
  alias: ['allmenu'],
  desc: 'Show all bot commands',
  category: 'menu',
  react: '👌',
  filename: __filename
}, async (cmd, mek, m, { from, sender, reply }) => {
  try {
    const prefix = getPrefix();
    const timezone = config.TIMEZONE || 'Africa/Nairobi';
    const time = moment().tz(timezone).format('HH:mm:ss');
    const date = moment().tz(timezone).format('dddd, DD MMMM YYYY');

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    // Header
    let menu = `
╔═══❖•ೋ° °ೋ•❖═══╗
        𝕏𝕋ℝ 𝕄𝔼ℕ𝕌
╚═══❖•ೋ° °ೋ•❖═══╝

👤 *User:* @${sender.split("@")[0]}
⏱️ *Runtime:* ${uptime()}
⚙️ *Mode:* ${config.MODE}
📌 *Prefix:* ${config.PREFIX}
👑 *Owner:* ${config.OWNER_NAME}
📦 *Plugins:* ${commands.length}
💻 *Developer:* ᴘᴏᴘᴋɪᴅ
🆚 *Version:* 2.0.0
─────────────────`;

    // Group Commands by Category
    const categories = {};
    for (const c of commands) {
      if (c.category && !c.dontAdd && c.pattern) {
        const normalizedCategory = normalize(c.category);
        categories[normalizedCategory] = categories[normalizedCategory] || [];
        categories[normalizedCategory].push(c.pattern.split('|')[0]);
      }
    }

    // Add Categories
    for (const cat of Object.keys(categories).sort()) {
      const emoji = emojiByCategory[cat] || '💫';
      menu += `\n\n┏━❰ ${emoji} ${toUpperStylized(cat)} ${toUpperStylized('Menu')} ❱━┓\n`;
      for (const c of categories[cat].sort()) {
        menu += `┃ ❍⁠⁠ ${prefix}${c}\n`;
      }
      menu += `┗━━━━━━━━━━━━━━━┛`;
    }

    menu += `\n\n✨ ${config.DESCRIPTION || toUpperStylized('Explore the bot commands!')}`;

    // Context Info
    const imageContextInfo = {
      mentionedJid: [sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: config.NEWSLETTER_JID || '120363420342566562@newsletter',
        newsletterName: config.OWNER_NAME || toUpperStylized('popkid'),
        serverMessageId: 143
      }
    };

    // Send Menu with Image
    await cmd.sendMessage(
      from,
      {
        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/tbdd5d.jpg' },
        caption: menu,
        contextInfo: imageContextInfo
      },
      { quoted: mek }
    );

    // Optional Audio
    if (config.MENU_AUDIO_URL) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await cmd.sendMessage(
        from,
        {
          audio: { url: config.MENU_AUDIO_URL },
          mimetype: 'audio/mp4',
          ptt: true,
          contextInfo: imageContextInfo
        },
        { quoted: mek }
      );
    }

  } catch (e) {
    console.error('Menu Error:', e.message);
    await reply(`❌ ${toUpperStylized('Error')}: Failed to show menu.\n${toUpperStylized('Details')}: ${e.message}`);
  }
});
