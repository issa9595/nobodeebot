# Instruction.md - Analyse du Bot Discord "nobodeebot"

## Résumé des actions effectuées

### Analyse initiale du projet (05/12/2025)
- Exploration de la structure du projet
- Lecture et analyse de toutes les commandes
- Identification des fonctionnalités principales
- Détermination des permissions Discord nécessaires

---

## 📋 Fonctionnalités du Bot

Le bot **nobodeebot** est un bot Discord multifonctionnel qui propose **3 grandes catégories** de fonctionnalités :

### 1. 🔧 Commandes Basiques (`commands/basics/`)

| Commande | Description | Permissions utilisées |
|----------|-------------|----------------------|
| `/ping` | Répond "Pong!" | Aucune spéciale |
| `/server` | Affiche le nom du serveur et le nombre de membres | Accès aux infos du guild |
| `/user` | Affiche les infos de l'utilisateur (nom, date d'arrivée) | Accès aux infos membres |

### 2. 🎲 Commandes Random (`commands/random/`)

| Commande | Description | Permissions utilisées |
|----------|-------------|----------------------|
| `/pick` | Sélectionne aléatoirement un membre dans le canal vocal | **GuildVoiceStates** (voir membres dans vocal) |
| `/rank` | Classe aléatoirement les membres d'un canal vocal (avec option de filtre par rôle) | **GuildVoiceStates**, accès aux rôles |

### 3. 📰 Daily News (`commands/daily/`)

Système de newsletter quotidienne avec intégration **News API** + **OpenAI** :

| Commande | Description | Permissions utilisées |
|----------|-------------|----------------------|
| `/setup-daily-news-server` | Configure le canal actuel pour recevoir les news | Accès aux canaux |
| `/subscribe-daily-news` | S'abonner aux alertes quotidiennes | Aucune spéciale |
| `/unsubscribe-daily-news` | Se désabonner des alertes | Aucune spéciale |
| `/add-daily-news-topic` | Ajouter un sujet aux news | Aucune spéciale |
| `/list-daily-news-topics` | Lister les sujets configurés | Aucune spéciale |
| `/remove-daily-news-topic` | Supprimer un sujet | Aucune spéciale |

#### Fonctionnement du Daily News :
- Récupère des articles via News API selon les topics configurés
- Génère une chronique via OpenAI (GPT-3.5-turbo)
- Envoie automatiquement dans le canal configuré avec mentions des abonnés
- Déclenché via une route HTTP POST (`/send-daily-news`)

### 4. 🌐 API HTTP (Express)

Le bot expose une API REST sur le port 3001 :

| Route | Méthode | Description |
|-------|---------|-------------|
| `/send-daily-news` | POST | Envoie les daily news (body: `{guildId, channelId}`) |
| `/ping` | GET | Health check |

---

## 🔐 Permissions Discord Requises

### Intents (Gateway Intents)

Définis dans `index.js` :

```javascript
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
```

| Intent | Raison | Privilégié ? |
|--------|--------|--------------|
| `Guilds` | Accès aux infos serveurs, canaux, rôles | Non |
| `GuildVoiceStates` | Voir les membres dans les canaux vocaux (pick/rank) | Non |

### Bot Permissions (OAuth2)

| Permission | Valeur | Raison |
|------------|--------|--------|
| **View Channels** | `1024` | Voir les canaux textuels et vocaux |
| **Send Messages** | `2048` | Répondre aux commandes et envoyer les daily news |
| **Embed Links** | `16384` | Afficher les embeds (peopleEmbed pour pick/rank) |
| **Read Message History** | `65536` | Lire l'historique des messages |

### 📊 Permission Integer Calculé

**Permission Integer minimal : `84992`**

> `1024 + 2048 + 16384 + 65536 = 84992`

### Scopes OAuth2 requis

- `bot` - Pour ajouter le bot au serveur
- `applications.commands` - Pour les slash commands

---

## 🔗 URL d'invitation recommandée

Modèle d'URL OAuth2 :

```
https://discord.com/api/oauth2/authorize?client_id=VOTRE_CLIENT_ID&permissions=84992&scope=bot%20applications.commands
```

---

## 🏗️ Architecture Technique

```
nobodeebot/
├── index.js              # Point d'entrée (Client Discord + Express)
├── firebase.js           # Configuration Firebase/Firestore
├── commands/
│   ├── index.js          # Loader des commandes
│   ├── basics/           # Commandes basiques (ping, server, user)
│   ├── daily/            # Commandes daily news
│   └── random/           # Commandes pick et rank
├── events/
│   ├── index.js          # Loader des événements
│   ├── ready.js          # Event client prêt
│   └── interactionCreate.js  # Handler des interactions
├── routes/
│   ├── index.js          # Router principal
│   ├── dailyNews.js      # Route POST /send-daily-news
│   └── ping.js           # Route health check
├── utils/
│   ├── dailyNews.js      # Logique génération des news
│   ├── newsApi.js        # Client News API
│   └── openAi.js         # Client OpenAI
├── embeds/
│   └── people.js         # Embed pour afficher un membre
└── deploy-*.js / delete-*.js  # Scripts de déploiement des commandes
```

### Dépendances clés
- **discord.js** v14.13.0 - Client Discord
- **express** v4.18.2 - API HTTP
- **firebase/firebase-admin** - Base de données Firestore
- **axios** - Requêtes HTTP (News API, OpenAI)
- **node-cron** - Potentiellement pour tâches planifiées (non utilisé dans le code actuel)

---

## ⚙️ Configuration requise (variables d'environnement)

```env
TOKEN=                    # Token du bot Discord
PORT=3001                 # Port de l'API Express (optionnel)
NEWS_API_KEY=             # Clé API News API
OPENAI_API_KEY=           # Clé API OpenAI
# Configuration Firebase (voir firebase.js)
```

---

## ✅ Récapitulatif des permissions à cocher dans le Developer Portal

### Page "Bot" :
- [x] **Privileged Gateway Intents** : Aucun requis (les intents utilisés ne sont pas privilégiés)

### Page "OAuth2" > URL Generator :

**Scopes :**
- [x] `bot`
- [x] `applications.commands`

**Bot Permissions :**
- [x] View Channels
- [x] Send Messages
- [x] Embed Links
- [x] Read Message History

**Permission Integer : `84992`**

