const { db } = require("../firebase");
const { fetchOpenAi } = require("../utils/openAi");
const { fetchNewsApi } = require("../utils/newsApi");
require("dotenv").config();

const getTopArticles = async (topics) => {
  try {
    const today = new Date();
    today.setDate(today.getDate() - 1);

    // Formatage correct de la date
    const formattedDate = today.toISOString().split("T")[0];

    const query = topics.join(" OR ");
    const endpoint = `/everything?q=${encodeURIComponent(
      query
    )}&from=${formattedDate}&sortBy=popularity&pageSize=3`;
    const { articles } = await fetchNewsApi(endpoint);

    if (!articles || articles.length === 0) {
      console.error("Aucun article trouvé pour la requête actuelle.");
      return [];
    }

    return articles;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des articles:",
      JSON.stringify(error, null, 2)
    );
    return [];
  }
};

const generateChronicle = async (articles) => {
  let prompt;
  if (!articles.length) {
    prompt = `Tu realise un post discord quotidien pour une equipe au sein d'une agence de develepement d'applications web et mobile qui s'appelle "InProgress".L'intégralité du message doit absolument être ecrit en Français Utilise la syntaxe Markdown pour rendre le message plus dynamique. Utilise un ton Sympathique et blagueur. N'hesite pas à utiliser des emoticons. Tu dois placer "#InProgress" à la fin du message. En premier lieu rappel que le daily meeting aura lieu dans 5 minutes. Ensuite propose à l'equipe une recette de boisson originale à base de café en une ligne. Normalement tu dois finir avec un résumé de quelque articles mais aujourd'hui tu n'e a malheureusement aucun à proposer.`;
  } else {
    prompt = `Tu realise un post discord quotidien pour une equipe au sein d'une agence de develepement d'applications web et mobile qui s'appelle "InProgress".L'intégralité du message doit absolument être ecrit en Français Utilise la syntaxe Markdown pour rendre le message plus dynamique. Utilise un ton Sympathique et blagueur. N'hesite pas à utiliser des emoticons. Tu dois placer "#InProgress" à la fin du message. En premier lieu rappel que le daily meeting aura lieu dans 5 minutes. Ensuite propose à l'equipe une recette de boisson originale à base de café en une ligne. Tu finis par un résumé de quelques lignes des articles suivants en fournissant le lien de chacuns :
  ${articles
    .map(
      (a) =>
        `Titre: ${a.title}\nContenu: ${a.description || a.content} Lien: ${
          a.url
        }`
    )
    .join("\n\n")}`;
  }

  try {
    const response = await fetchOpenAi("/chat/completions", {
      method: "POST",
      data: {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error.type === "insufficient_quota"
    ) {
      return "Désolé, le service de génération de chronique est temporairement indisponible. Le daily meeting aura lieu dans 5 minutes. Préparez-vous un café en attendant.";
    }
    return "Impossible de générer une chronique. Le daily meeting aura lieu dans 5 minutes. Préparez-vous un café en attendant.";
  }
};

const getMessage = async () => {
  const topicsRes = await db.collection("daily_news_topics").get();
  const topics = topicsRes.docs.map((doc) => {
    const data = doc.data();
    return data.topic;
  });
  const articles = await getTopArticles(topics);
  const message = await generateChronicle(articles);
  return message;
};

const sendDailyNewsInChannel = async (channel) => {
  try {
    const message = await getMessage();
    const serverId = channel.guild.id;
    const subscribersRes = await db
      .collection("daily_news_servers")
      .doc(serverId)
      .collection("subscribers")
      .get();
    if (subscribersRes.docs.length === 0) {
      return;
    }
    const subscriberMentions = subscribersRes.docs.map(
      (doc) => `<@${doc.data().userId}>`
    );
    const finalMessage = subscriberMentions.join(" ") + "\n\n" + message;
    await channel.send({
      content: finalMessage,
      allowedMentions: { parse: ["users"] },
      embeds: [],
      flags: 1 << 2, // Ajoute le drapeau SUPPRESS_EMBEDS
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi des nouvelles quotidiennes:", error);
    await channel.send(
      "Désolé, une erreur s'est produite lors de la préparation des nouvelles. Le daily meeting aura quand même lieu dans 5 minutes !"
    );
  }
};

exports.sendDailyNewsInChannel = sendDailyNewsInChannel;
