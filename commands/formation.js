const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

// ─── Module 1 — Introduction & Interface ──────────────────────────────────────
function getModule1() {
  return new EmbedBuilder()
    .setColor(0x010101)
    .setTitle('📱 Module 1 — Introduction à TikTok Ads Manager')
    .setDescription(
      'TikTok Ads Manager est la plateforme publicitaire self-serve de TikTok. ' +
      'Avec **1 milliard+ d\'utilisateurs actifs mensuels** et un algorithme de distribution organique puissant, ' +
      'TikTok offre un potentiel de reach exceptionnel — même pour les petits budgets.'
    )
    .addFields(
      {
        name: '🌐 Accès & création de compte',
        value:
          '**URL :** `ads.tiktok.com`\n' +
          '**Deux types de comptes :**\n' +
          '• **Business Center** — compte "chapeau" pour gérer plusieurs Ad Accounts et collaborateurs. Recommandé pour les agences et entreprises.\n' +
          '• **Ad Account direct** — accès simplifié pour un seul annonceur.\n' +
          'Conseil : créer le Business Center en premier, puis y rattacher l\'Ad Account et inviter les membres par rôle.',
        inline: false,
      },
      {
        name: '🧭 Les 5 sections du tableau de bord',
        value:
          '• **Tableau de bord** — KPIs globaux (dépenses, impressions, conversions) sur la période choisie\n' +
          '• **Campagne** — création, gestion et suivi de toutes vos campagnes/groupes/annonces\n' +
          '• **Actifs (Assets)** — audiences sauvegardées, créatifs, catalogues, TikTok Pixel\n' +
          '• **Rapports** — rapports personnalisés exportables (CSV, PDF)\n' +
          '• **Outils** — Pixel, Catalogue produits, Creative Center, TikTok Shop',
        inline: false,
      },
      {
        name: '📊 Métriques de la page d\'accueil',
        value:
          'Colonnes visibles par défaut : **Impressions · CPM · Clics · CPC · CTR · Conversions · CPA · Dépenses totales**.\n' +
          'Chaque métrique est cliquable pour trier. La période s\'ajuste en haut à droite (Aujourd\'hui / 7j / 30j / Personnalisée).',
        inline: false,
      },
      {
        name: '👤 Rôles & permissions',
        value:
          '• **Admin** — accès total (création, modification, facturation)\n' +
          '• **Opérateur** — création et gestion des campagnes, sans accès à la facturation\n' +
          '• **Analyste** — lecture seule, peut consulter les rapports\n' +
          '• **Finance** — gestion des paiements et de la facturation uniquement',
        inline: false,
      },
      {
        name: '💡 Conseil de démarrage',
        value:
          'Avant de lancer votre première campagne :\n' +
          '1. Installer le **TikTok Pixel** sur votre site (voir Module 8)\n' +
          '2. Vérifier que l\'événement `CompletePayment` remonte correctement\n' +
          '3. Mettre au minimum **50 €** de crédit publicitaire sur le compte\n' +
          '4. Préparer au moins **3 vidéos créatives** en format 9:16 (voir Module 7)',
        inline: false,
      }
    )
    .setFooter({ text: '📚 Formation TikTok Ads Manager • Module 1/10 | Tapez /formation-menu pour le sommaire' })
    .setTimestamp();
}

// ─── Module 2 — Structure des campagnes ───────────────────────────────────────
function getModule2() {
  return new EmbedBuilder()
    .setColor(0x69C9D0)
    .setTitle('🏗️ Module 2 — Structure des campagnes TikTok')
    .setDescription(
      'TikTok Ads Manager est organisé en **3 niveaux hiérarchiques** : ' +
      'Campagne → Groupe d\'annonces → Annonce. Chaque niveau contrôle un aspect différent.'
    )
    .addFields(
      {
        name: '📐 Hiérarchie en 3 niveaux',
        value:
          '```\nCampagne\n  └─ Objectif publicitaire (1 seul par campagne)\n  └─ Budget global (optionnel via CBO)\n     └─ Groupe d\'annonces\n        └─ Ciblage audience\n        └─ Budget & calendrier\n        └─ Placements & enchère\n           └─ Annonce\n              └─ Vidéo créative\n              └─ Texte + CTA + URL\n```',
        inline: false,
      },
      {
        name: '🎯 Niveau 1 — Campagne',
        value:
          '• **Un seul objectif** par campagne (impossible à changer après création)\n' +
          '• Option **Campaign Budget Optimization (CBO)** : TikTok répartit le budget entre les Ad Groups automatiquement selon les performances\n' +
          '• **Nommage recommandé :** `[Pays]_[Objectif]_[Produit]_[Date]`\n' +
          '  Exemple : `FR_Conversions_Sneakers_2025-03`',
        inline: false,
      },
      {
        name: '👥 Niveau 2 — Groupe d\'annonces (Ad Group)',
        value:
          '• **Placement** : automatique (recommandé) ou manuel (TikTok feed, Pangle, Global App Bundle)\n' +
          '• **Budget** : journalier (min **20 €/jour**) ou total sur la durée\n' +
          '• **Calendrier** : dates de début/fin ou diffusion continue\n' +
          '• **Ciblage** : démographie, intérêts, audiences personnalisées\n' +
          '• **Stratégie d\'enchère** : Lowest Cost, Bid Cap, Cost Cap, ROAS min',
        inline: false,
      },
      {
        name: '🎬 Niveau 3 — Annonce (Ad)',
        value:
          '• **Vidéo créative** : upload direct ou depuis la Bibliothèque créative\n' +
          '• **Texte publicitaire** : max **100 caractères** affichés sous la vidéo\n' +
          '• **Call-to-Action (CTA)** : 28 options disponibles — Shop Now, Learn More, Sign Up, Download, Contact Us, Book Now, Get Quote…\n' +
          '• **URL de destination** : landing page, App Store, ou page TikTok',
        inline: false,
      },
      {
        name: '🔁 Logique de test avec la structure',
        value:
          '• **Tester des audiences différentes** → créer plusieurs Ad Groups dans une même campagne\n' +
          '• **Tester des créatifs différents** → créer plusieurs Annonces dans un même Ad Group\n' +
          '• **Ne jamais mélanger plusieurs objectifs** dans la même campagne\n' +
          '• **Règle pratique :** 1 campagne = 1 objectif = 3 Ad Groups (audiences) = 3 Annonces chacun',
        inline: false,
      },
      {
        name: '⚠️ Erreur fréquente à éviter',
        value:
          'Modifier le ciblage, le budget ou l\'enchère pendant la **phase d\'apprentissage** (7-14 premiers jours) relance l\'algorithme à zéro. Résultat : les performances chutent et les coûts augmentent. Observer pendant 7 jours avant d\'optimiser.',
        inline: false,
      }
    )
    .setFooter({ text: '📚 Formation TikTok Ads Manager • Module 2/10 | Tapez /formation-menu pour le sommaire' })
    .setTimestamp();
}

// ─── Module 3 — Objectifs de campagne ─────────────────────────────────────────
function getModule3() {
  return new EmbedBuilder()
    .setColor(0xFF0050)
    .setTitle('🎯 Module 3 — Objectifs de campagne TikTok')
    .setDescription(
      'L\'objectif est le paramètre le plus important d\'une campagne. ' +
      'Il détermine **comment TikTok optimise la diffusion** et **quels utilisateurs** voient vos annonces. ' +
      'Choisissez toujours l\'objectif correspondant à l\'action finale souhaitée.'
    )
    .addFields(
      {
        name: '🗺️ Les 3 catégories d\'objectifs',
        value:
          '**1. Notoriété (Awareness)** → faire connaître la marque\n' +
          '**2. Considération (Consideration)** → générer de l\'intérêt et du trafic\n' +
          '**3. Conversion** → déclencher une action à forte valeur (achat, inscription)',
        inline: false,
      },
      {
        name: '📣 Notoriété — Reach',
        value:
          '• Maximise les impressions uniques (personnes différentes touchées)\n' +
          '• Facturation en **CPM** (coût pour 1 000 impressions)\n' +
          '• Contrôle de **fréquence** possible : ex. max 2 impressions / 7 jours / personne\n' +
          '• Idéal pour : lancement de marque, événements, grande campagne saisonnière',
        inline: false,
      },
      {
        name: '🚦 Trafic (Traffic)',
        value:
          '• Optimise vers les **clics** sur le lien ou les **vues de la landing page**\n' +
          '• Préférer **"Landing Page Views"** plutôt que "Clics" : exclut les clics accidentels et mesure les vraies visites\n' +
          '• Facturation en **CPC** ou **CPM optimisé**\n' +
          '• Requiert min. ~50 événements/semaine pour que l\'algorithme se calibre',
        inline: false,
      },
      {
        name: '🎥 Vues de la vidéo (Video Views)',
        value:
          '• Optimise vers les utilisateurs qui regardent la vidéo jusqu\'au bout (6s ou 100%)\n' +
          '• Facturation en **CPV** (coût par vue)\n' +
          '• Idéal pour le brand storytelling, les teasers produits, les tutoriels',
        inline: false,
      },
      {
        name: '📋 Génération de leads (Lead Generation)',
        value:
          '• Formulaires natifs **dans l\'app TikTok** — aucune redirection externe\n' +
          '• Taux de complétion moyen : **15-20%** vs 5-8% sur une landing page externe\n' +
          '• Champs personnalisables : Prénom, Email, Téléphone, question à choix multiples\n' +
          '• Les leads sont exportables en CSV ou connectables via Zapier/CRM',
        inline: false,
      },
      {
        name: '💰 Conversions — L\'objectif ROI',
        value:
          '• Requiert le **TikTok Pixel** installé et un événement de conversion défini\n' +
          '• Événements cibles recommandés : `CompletePayment`, `Lead`, `Subscribe`\n' +
          '• **Phase d\'apprentissage** : 50 conversions/semaine/Ad Group nécessaires pour que l\'algo optimise pleinement\n' +
          '• Facturation en **oCPM** (optimized CPM) — TikTok facture les impressions mais optimise vers l\'action',
        inline: false,
      },
      {
        name: '📦 Ventes du catalogue (Product Sales)',
        value:
          '• Requiert un **catalogue produits** connecté à l\'Ad Account\n' +
          '• Affiche des publicités dynamiques personnalisées selon le comportement de l\'utilisateur\n' +
          '• Idéal pour les boutiques avec **50+ produits** (mode, beauté, home, tech)\n' +
          '• Fonctionne en prospection (nouveau client) et en retargeting (panier abandonné)',
        inline: false,
      }
    )
    .setFooter({ text: '📚 Formation TikTok Ads Manager • Module 3/10 | Tapez /formation-menu pour le sommaire' })
    .setTimestamp();
}

// ─── Module 4 — Ciblage d'audience ────────────────────────────────────────────
function getModule4() {
  return new EmbedBuilder()
    .setColor(0x25F4EE)
    .setTitle('👥 Module 4 — Ciblage d\'audience TikTok')
    .setDescription(
      'TikTok offre des options de ciblage avancées, mais la plateforme recommande souvent un ciblage **large** ' +
      'pour laisser l\'algorithme trouver les utilisateurs les plus réceptifs. ' +
      'La clé : **tester différentes combinaisons** et laisser les données guider vos choix.'
    )
    .addFields(
      {
        name: '🌍 Ciblage démographique',
        value:
          '• **Localisation** : pays, région, ville (niveau granulaire selon le pays)\n' +
          '• **Âge** : 13-17 / 18-24 / 25-34 / 35-44 / 45-54 / 55+\n' +
          '• **Genre** : Homme / Femme / Tous\n' +
          '• **Langue de l\'appareil** : très utile pour cibler une diaspora (ex: francophones en Belgique/Suisse)\n' +
          '• **Type de connexion** : WiFi, 4G, 3G — utile pour les apps (exclure 2G)',
        inline: false,
      },
      {
        name: '🎮 Centres d\'intérêt & comportements',
        value:
          '• **200+ catégories** : Beauté, Gaming, Finance, Voyage, Sport, Cuisine, Éducation…\n' +
          '• **Comportements récents (30 jours)** : a regardé des vidéos sur [sujet], a liké des contenus [niche], a suivi des créateurs [catégorie]\n' +
          '• **Conseil :** max 3-5 intérêts cohérents par Ad Group. Créer des Ad Groups séparés pour comparer les performances par intérêt.',
        inline: false,
      },
      {
        name: '👤 Custom Audiences — 5 sources',
        value:
          '• **Fichier client** : import CSV emails/téléphones (hashés automatiquement). Taux de correspondance : ~40-60%. Taille min recommandée : 1 000 contacts.\n' +
          '• **Trafic web** : visiteurs de votre site via Pixel (fenêtre : 1-180 jours)\n' +
          '• **Activité app** : utilisateurs de votre app mobile\n' +
          '• **Engagement TikTok** : personnes ayant vu vos vidéos (25/50/75/100%), liké, commenté, partagé ou suivi votre profil\n' +
          '• **Formulaires Lead Gen** : personnes ayant soumis un formulaire',
        inline: false,
      },
      {
        name: '🔮 Lookalike Audiences',
        value:
          '• Créées depuis une Custom Audience source (**min 1 000 personnes**, idéalement 10 000+)\n' +
          '• **3 niveaux de similarité :**\n' +
          '  — Narrow (1%) : très similaire, audience petite\n' +
          '  — Balanced (5%) : compromis portée/pertinence ← recommandé pour débuter\n' +
          '  — Broad (20%) : large portée, moins similaire\n' +
          '• Meilleure source : Lookalike basée sur vos acheteurs (`CompletePayment`)',
        inline: false,
      },
      {
        name: '⚡ Ciblage large (Broad Targeting)',
        value:
          '• TikTok recommande un ciblage **très large** pour les campagnes Conversions avec Pixel bien calibré\n' +
          '• Lorsque le Pixel a **500+ événements de conversion**, l\'algorithme identifie seul les acheteurs potentiels\n' +
          '• Tester : même ciblage intérêts VS ciblage large → souvent le large gagne sur le ROAS',
        inline: false,
      },
      {
        name: '🚫 Exclusions — Étape souvent oubliée',
        value:
          '• **Toujours exclure les acheteurs récents** (Custom Audience `CompletePayment` 30 jours) des campagnes acquisition → évite de dépenser sur des gens ayant déjà acheté\n' +
          '• Exclure les audiences retargeting des campagnes prospection pour éviter la cannibalisation\n' +
          '• Exclure les employés si vous utilisez un fichier CRM',
        inline: false,
      }
    )
    .setFooter({ text: '📚 Formation TikTok Ads Manager • Module 4/10 | Tapez /formation-menu pour le sommaire' })
    .setTimestamp();
}

// ─── Module 5 — Formats publicitaires ─────────────────────────────────────────
function getModule5() {
  return new EmbedBuilder()
    .setColor(0xFE2C55)
    .setTitle('🎬 Module 5 — Formats publicitaires TikTok')
    .setDescription(
      'TikTok propose plusieurs formats publicitaires, du plus accessible au plus premium. ' +
      'Le format **In-Feed Ad** est le point de départ pour 95% des annonceurs. ' +
      'Les autres formats (TopView, Brand Takeover) sont des achats premium réservés aux grandes marques.'
    )
    .addFields(
      {
        name: '📲 In-Feed Ads — Le format standard',
        value:
          '• Apparaissent dans le fil **"Pour toi"** entre les vidéos organiques\n' +
          '• Aspect natif : ressemble à du contenu organique (favori de l\'algorithme)\n' +
          '• **Durée :** 5-60 secondes (optimal : 15-30s)\n' +
          '• Skipable après **6 secondes**\n' +
          '• CTA cliquable redirige vers URL ou App Store\n' +
          '• Disponible pour **tous les objectifs**. Format recommandé pour débuter.',
        inline: false,
      },
      {
        name: '✨ Spark Ads — Booster l\'organique',
        value:
          '• Booste une **publication organique existante** (votre compte ou un créateur avec accord)\n' +
          '• Conserve les **likes, commentaires, partages** déjà existants → preuve sociale puissante\n' +
          '• Autorisation valable 30 ou 365 jours (configurée dans les paramètres créateur)\n' +
          '• **Recommandé pour débuter** : les vidéos déjà performantes organiquement convertissent mieux en paid\n' +
          '• L\'algorithme TikTok favorise les Spark Ads car l\'engagement est authentique',
        inline: false,
      },
      {
        name: '🔝 TopView — Impact maximal',
        value:
          '• Première vidéo vue à **l\'ouverture de l\'app**, impossible à skipper pendant 3 secondes\n' +
          '• **Durée :** jusqu\'à 60 secondes\n' +
          '• Format premium — achat en **CPD** (coût par jour) ou **CPM garanti**\n' +
          '• Idéal pour : lancements de produits, événements nationaux, grandes campagnes saisonnières\n' +
          '• Budget minimum : plusieurs milliers d\'euros',
        inline: false,
      },
      {
        name: '💥 Brand Takeover — Exclusivité totale',
        value:
          '• Plein écran à l\'ouverture de l\'app, **avant** le fil "Pour toi"\n' +
          '• **Durée :** 3-5 secondes (image statique) ou 5-60 secondes (vidéo)\n' +
          '• **1 seul annonceur par jour par pays** → exclusivité totale de la catégorie\n' +
          '• Lien cliquable intégré\n' +
          '• Le format le plus impactant, mais aussi le plus coûteux (réservé aux grandes marques)',
        inline: false,
      },
      {
        name: '🛍️ Collection Ads (Shopping Ads)',
        value:
          '• Combine une **vidéo** avec une **galerie de produits scrollable** en dessous\n' +
          '• Requiert un **catalogue produits** connecté\n' +
          '• L\'utilisateur peut explorer les produits sans quitter TikTok\n' +
          '• Idéal pour : e-commerce mode, beauté, maison, tech\n' +
          '• Disponible avec l\'objectif "Product Sales"',
        inline: false,
      },
      {
        name: '📐 Spécifications techniques (In-Feed)',
        value:
          '• **Ratio :** 9:16 vertical (obligatoire)\n' +
          '• **Résolution :** 1080 × 1920 px minimum\n' +
          '• **Formats :** MP4, MOV, AVI\n' +
          '• **Taille max :** 500 MB\n' +
          '• **Frame rate :** jusqu\'à 60 fps (recommandé : 30 fps)\n' +
          '• **Durée :** 5-60 secondes\n' +
          '• **Audio :** AAC / MP3 — le son est activé par défaut sur TikTok\n' +
          '• **Zone safe :** laisser 80px en haut et en bas (réservés à l\'interface TikTok)',
        inline: false,
      }
    )
    .setFooter({ text: '📚 Formation TikTok Ads Manager • Module 5/10 | Tapez /formation-menu pour le sommaire' })
    .setTimestamp();
}

// ─── Map modules ──────────────────────────────────────────────────────────────
const MODULES = {
  '1': getModule1,
  '2': getModule2,
  '3': getModule3,
  '4': getModule4,
  '5': getModule5,
};

// ─── Export ───────────────────────────────────────────────────────────────────
module.exports = {
  data: new SlashCommandBuilder()
    .setName('formation')
    .setDescription('Formation TikTok Ads Manager — Modules 1 à 5')
    .addStringOption(option =>
      option
        .setName('module')
        .setDescription('Choisir un module de la formation')
        .setRequired(true)
        .addChoices(
          { name: '1 — Introduction & Interface', value: '1' },
          { name: '2 — Structure des campagnes', value: '2' },
          { name: '3 — Objectifs de campagne', value: '3' },
          { name: "4 — Ciblage d'audience", value: '4' },
          { name: '5 — Formats publicitaires', value: '5' },
        )
    ),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const key = interaction.options.getString('module');
    const builder = MODULES[key];

    if (!builder) {
      return interaction.editReply({ content: '❌ Module introuvable. Utilisez `/formation-menu` pour voir la liste.' });
    }

    await interaction.editReply({ embeds: [builder()] });
  },
};
