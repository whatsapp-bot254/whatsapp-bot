const { cmd } = require('../command');

cmd({
    pattern: "delete",
    alias: ["trash", "remove"],
    desc: "Delete the replied/tagged message (for everyone)",
    category: "utility",
    react: "🗑️",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, quoted }) => {
    try {
        if (!m.quoted && !mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            return reply("❎ Please reply to or tag a message to delete.");
        }

        const key = {
            remoteJid: from,
            fromMe: m.quoted?.key?.fromMe || false,
            id: m.quoted?.key?.id || mek.message.extendedTextMessage.contextInfo.stanzaId,
            participant: m.quoted?.key?.participant || sender
        };

        // First try deleting
        await conn.sendMessage(from, { delete: key });

        // Wait 2 seconds to verify deletion
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check if message still exists by trying to quote it
        try {
            await conn.sendMessage(from, { 
                text: "⚠️ Delete verification failed - message may still exist",
                contextInfo: { 
                    mentionedJid: [sender],
                    quotedMessage: {
                        key: key,
                        message: { conversation: "verification" }
                    }
                }
            });
            
            // If we get here, message still exists
            return reply("❌ Failed to delete message (no permission/too old)");
            
        } catch (e) {
            // If error quoting, message was likely deleted
            return reply("✅ Message deleted successfully!");
        }

    } catch (e) {
        console.error('Delete Command Error:', e);
        return reply(`❌ Delete failed: ${e.message.includes("404") ? "Message not found" : e.message}`);
    }
});
