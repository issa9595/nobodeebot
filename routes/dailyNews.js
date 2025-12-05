const router = require("express").Router();
const { sendDailyNewsInChannel } = require("../utils/dailyNews");

router.post("/send-daily-news", async (req, res) => {
  try {
    const body = req.body;
    console.log("body", body);
    const { guildId, channelId } = body;
    console.log("guildId", guildId);
    console.log("channelId", channelId);

    const guild = await req.client.guilds.fetch(guildId);
    if (!guild) {
      return res.status(404).send("Serveur non trouvé.");
    }
    const channel = await guild.channels.fetch(channelId);
    if (!channel) {
      return res.status(404).send("Canal non trouvé.");
    }
    await sendDailyNewsInChannel(channel);
    return res.status(200).send("Message envoyé avec succès!");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Une erreur est survenue");
  }
});

module.exports = router;
