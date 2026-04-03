const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

// ─── Module 6 — Budget & Enchères ─────────────────────────────────────────────
function getModule6() {
  return new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle('💰 Module 6 — Budget & Stratégies d\'enchères')
    .setDescription(
      'Le budget et la stratégie d\'enchère déterminent **combien vous dépensez** et **comment TikTok achète les impressions** pour vous. ' +
      'Un mauvais paramétrage peut gaspiller tout votre budget en quelques heures.'
    )
    .addFields(
      {
        name: '💵 Budget journalier vs budget total',
        value:
          '• **Budget journalier (Daily Budget)** : dépense max par jour. Min **20 €/jour** par Ad Group. L\'algo peut dépenser jusqu\'à 120% certains jours pour compenser les jours creux.\n' +
          '• **Budget total (Lifetime Budget)** : montant max sur toute la durée de la campagne, réparti automatiquement. Idéal pour les promos à dates fixes.\n' +
          '• **CBO (Campaign Budget Optimization)** : budget défini au niveau campagne, TikTok le répartit entre les Ad Groups selon les performances en temps réel.',
        inline: false,
      },
      {
        name: '🎯 Les 4 stratégies d\'enchères',
        value:
          '**1. Lowest Cost (auto)** — TikTok maximise les résultats avec le budget donné, sans contrainte. Idéal pour démarrer et calibrer.\n' +
          '**2. Bid Cap** — Plafond d\'enchère fixé manuellement (CPC ou CPM). Contrôle total mais risque de sous-dépense si le bid est trop bas.\n' +
          '**3. Cost Cap** — TikTok vise un CPA cible. Peut dépasser en phase d\'apprentissage. Recommandé pour les conversions.\n' +
          '**4. ROAS Minimum** — Optimise vers un retour sur dépenses minimum. Requiert l\'événement `Purchase` avec valeur transmise.',
        inline: false,
      },
      {
        name: '📊 Modèles de facturation',
        value:
          '• **CPM** — Coût pour 1 000 impressions. Utilisé pour Reach et Brand Awareness.\n' +
          '• **CPC** — Coût par clic. Utilisé pour Traffic.\n' +
          '• **CPV** — Coût par vue (déclenchée à 6s ou 100%). Utilisé pour Video Views.\n' +
          '• **oCPM** — Optimized CPM : facturation aux impressions, optimisation vers l\'action cible. Le plus courant pour les campagnes Conversions.',
        inline: false,
      },
      {
        name: '⚙️ Phase d\'apprentissage — Ne pas toucher !',
        value:
          'Dure **7-14 jours** ou jusqu\'à **50 conversions par Ad Group**.\n' +
          'Pendant cette phase : **ne pas modifier** le ciblage, le budget (max ±20%), ni l\'enchère.\n' +
          'Les résultats sont instables — c\'est normal. Après la phase : les performances se stabilisent et le CPA baisse.',
        inline: false,
      },
      {
        name: '💡 Règles budgétaires pratiques',
        value:
          '• **Budget de test initial :** 3× votre CPA cible en budget journalier\n' +
          '  Exemple : CPA cible 20 € → budget test **60 €/jour**\n' +
          '• **Scaling :** augmenter le budget de **max 20-30%** par modification, espacer les changements de 48h minimum pour ne pas relancer la phase d\'apprentissage\n' +
          '• **Budget minimum viable :** 50 €/jour pour qu\'un Ad Group Conversions sorte de la phase d\'apprentissage en 7 jours',
        inline: false,
      }
    )
    .setFooter({ text: '📚 Formation TikTok Ads Manager • Module 6/10 | Tapez /formation-menu pour le sommaire' })
    .setTimestamp();
}

// ─── Module 7 — Création de publicités ────────────────────────────────────────
function getModule7() {
  return new EmbedBuilder()
    .setColor(0xFF6B6B)
    .setTitle('🎨 Module 7 — Création de publicités performantes')
    .setDescription(
      'Sur TikTok, **le créatif est roi**. Une bonne vidéo peut surpasser un ciblage parfait. ' +
      'L\'authenticité et le format natif "TikTok style" surpassent systématiquement les productions léchées.'
    )
    .addFields(
      {
        name: '⏱️ La règle des 3 premières secondes',
        value:
          'Si vous ne captez pas l\'attention dans les **3 premières secondes**, l\'utilisateur swipe. Techniques éprouvées :\n' +
          '• **Question choc** : "Tu paies encore trop cher ta mutuelle ?"\n' +
          '• **Affirmation contre-intuitive** : "Arrête d\'économiser de l\'argent."\n' +
          '• **Action visuelle forte** : démonstration produit immédiate dès l\'image 1\n' +
          '• **Texte overlay accrocheur** : grande police, couleur contrastée, dès la première frame',
        inline: false,
      },
      {
        name: '📋 Structure d\'une pub e-commerce efficace',
        value:
          '• **0-3s** → Hook (accrocher l\'attention)\n' +
          '• **3-8s** → Problème / douleur (identifier le pain point du client)\n' +
          '• **8-20s** → Solution / produit (présenter votre offre)\n' +
          '• **20-25s** → Preuve / témoignage (social proof, avant/après, avis)\n' +
          '• **25-30s** → CTA clair (appel à l\'action explicite avec urgence)',
        inline: false,
      },
      {
        name: '✍️ Copywriting (texte publicitaire)',
        value:
          '• Limite affichée : **100 caractères** (150 max mais coupés sur mobile)\n' +
          '• Toujours inclure : **bénéfice principal** + **urgence ou rareté**\n' +
          '• 1 à 3 emojis maximum pour attirer l\'œil\n' +
          '• Exemples performants :\n' +
          '  — "🚚 Livraison offerte aujourd\'hui seulement — 2 000 clients satisfaits"\n' +
          '  — "⭐ -30% jusqu\'à minuit • Stock limité"',
        inline: false,
      },
      {
        name: '📐 Spécifications vidéo complètes',
        value:
          '• **Ratio :** 9:16 vertical (obligatoire)\n' +
          '• **Résolution :** 1080 × 1920 px minimum\n' +
          '• **Format :** MP4 ou MOV recommandé\n' +
          '• **Taille max :** 500 MB\n' +
          '• **Durée :** 5-60s (optimal : **15-30s**)\n' +
          '• **Frame rate :** max 60 fps (recommandé : 30 fps)\n' +
          '• **Zone safe :** éviter les 150px en haut et 250px en bas (UI TikTok)',
        inline: false,
      },
      {
        name: '🎵 Son & musique',
        value:
          '• **88%** des utilisateurs TikTok regardent avec le son activé → le son est crucial\n' +
          '• Utiliser la **Commercial Music Library** de TikTok (gratuit, sans droits)\n' +
          '• Voix-off recommandée pour l\'e-commerce : explique le produit clairement\n' +
          '• Musique énergique pour mode / sport, musique douce pour lifestyle / bien-être',
        inline: false,
      },
      {
        name: '🧪 Combien de créatifs lancer ?',
        value:
          '• **3-5 vidéos différentes** par Ad Group au démarrage\n' +
          '• Fatigue créative moyenne TikTok : **7-14 jours**\n' +
          '• Renouveler dès que le CTR chute de 30%+ par rapport à la moyenne\n' +
          '• Garder les hooks qui fonctionnent, changer la partie centrale\n' +
          '• **UGC** (smartphone, style naturel) surpasse souvent les productions studio — budget UGC : 100-500 € via Billo, Insense ou micro-créateurs',
        inline: false,
      }
    )
    .setFooter({ text: '📚 Formation TikTok Ads Manager • Module 7/10 | Tapez /formation-menu pour le sommaire' })
    .setTimestamp();
}

// ─── Module 8 — TikTok Pixel ───────────────────────────────────────────────────
function getModule8() {
  return new EmbedBuilder()
    .setColor(0x2C3E50)
    .setTitle('🔍 Module 8 — TikTok Pixel : Installation & Configuration')
    .setDescription(
      'Le TikTok Pixel est un **snippet JavaScript** installé sur votre site qui envoie des données d\'événements à TikTok. ' +
      'Sans Pixel, impossible d\'optimiser les conversions, de créer des audiences retargeting ou de mesurer votre ROAS réel.'
    )
    .addFields(
      {
        name: '⚙️ Les 3 méthodes d\'installation',
        value:
          '**1. Installation manuelle** — copier-coller le code de base dans le `<head>` de chaque page. Simple mais fragile.\n' +
          '**2. Intégration partenaire** — Shopify, WooCommerce, BigCommerce, Magento : installation en 1 clic depuis les paramètres TikTok. **Recommandé** pour le e-commerce.\n' +
          '**3. API Conversions (CAPI)** — server-side, contourne les ad-blockers et restrictions iOS 14.5+. Plus précis. Requiert un accès backend ou un outil comme Elevar, Stape.',
        inline: false,
      },
      {
        name: '📋 Événements standards à installer',
        value:
          '• `ViewContent` — page produit visitée\n' +
          '• `AddToCart` — produit ajouté au panier\n' +
          '• `InitiateCheckout` — début du processus de paiement\n' +
          '• `AddPaymentInfo` — infos de paiement saisies\n' +
          '• `CompletePayment` — **achat confirmé** ← événement le plus important\n' +
          '• `Lead` — formulaire soumis\n' +
          '• `Subscribe` — abonnement\n' +
          '• `Search` — recherche sur le site',
        inline: false,
      },
      {
        name: '🔧 Paramètres à transmettre avec chaque événement',
        value:
          'Pour chaque événement, passer ces paramètres :\n' +
          '```js\nttq.track("CompletePayment", {\n  value: 49.99,\n  currency: "EUR",\n  content_id: "SKU123",\n  content_type: "product",\n  quantity: 1\n});\n```\n' +
          'Le paramètre `value` est **obligatoire** pour l\'optimisation ROAS.',
        inline: false,
      },
      {
        name: '✅ Vérification & Diagnostics',
        value:
          '• **TikTok Pixel Helper** : extension Chrome pour vérifier les événements en temps réel sur votre site\n' +
          '• **Test Events** dans Ads Manager (Actifs → Événements → Test Events) : simuler des événements sans données réelles\n' +
          '• **Match Rate** : viser >60% (envoyer email/téléphone hashés avec chaque événement pour améliorer le matching)',
        inline: false,
      },
      {
        name: '⏳ Fenêtre d\'attribution',
        value:
          '• **Par défaut :** 7 jours après un clic + 1 jour après une vue\n' +
          '• **E-commerce standard :** 7 jours clic / 0 jour vue\n' +
          '• **Produits à cycle long** (B2B, immobilier) : 28 jours clic\n' +
          '• Configurable au niveau du Ad Group dans les paramètres d\'optimisation',
        inline: false,
      }
    )
    .setFooter({ text: '📚 Formation TikTok Ads Manager • Module 8/10 | Tapez /formation-menu pour le sommaire' })
    .setTimestamp();
}

// ─── Module 9 — Analyse & Optimisation ────────────────────────────────────────
function getModule9() {
  return new EmbedBuilder()
    .setColor(0x1DB954)
    .setTitle('📊 Module 9 — Analyse & Optimisation des campagnes')
    .setDescription(
      'Savoir lire les données est aussi important que de savoir créer des campagnes. ' +
      'L\'optimisation est un processus continu : **observer → analyser → décider → tester**.'
    )
    .addFields(
      {
        name: '📈 KPIs essentiels et benchmarks TikTok',
        value:
          '• **CTR** (Click-Through Rate) : moyen 1-3%, bon >3%, excellent >6%\n' +
          '• **CPM** : varie par niche, moyen Europe 3-8 €\n' +
          '• **CPC** : e-commerce 0,20-1,50 €\n' +
          '• **VCR** (Video Completion Rate) : % qui regardent jusqu\'à la fin — bon >30%\n' +
          '• **CPA** : à comparer à votre marge produit\n' +
          '• **ROAS** : objectif minimum 2-3x pour la rentabilité e-commerce',
        inline: false,
      },
      {
        name: '🔍 Créer un rapport personnalisé',
        value:
          'Rapports → Rapport personnalisé → choisir les colonnes :\n' +
          '`Impressions · Reach · CPM · Clics · CTR · CPC · Dépenses · Conversions · CPA · ROAS`\n\n' +
          '• **Filtrer par Ad Group** : identifier les audiences rentables\n' +
          '• **Filtrer par Annonce** : identifier les créatifs gagnants\n' +
          '• Exporter en CSV pour une analyse avancée (Excel, Google Sheets)',
        inline: false,
      },
      {
        name: '🧪 A/B Testing natif (Split Test)',
        value:
          '• Fonction intégrée dans Ads Manager → tester **1 seule variable** à la fois (ciblage, placement OU créatif)\n' +
          '• Budget minimum : **50 €/variation/jour**\n' +
          '• Durée minimum : **7 jours**\n' +
          '• TikTok divise l\'audience de façon aléatoire et exclusive (pas de chevauchement)\n' +
          '• Le gagnant est désigné avec un niveau de confiance statistique affiché',
        inline: false,
      },
      {
        name: '⚡ Quand agir et quand attendre ?',
        value:
          '**Augmenter le budget si :** CPA < objectif pendant 3 jours consécutifs ✅\n' +
          '**Couper une annonce si :** CTR <0,5% après 2 000 impressions ❌\n' +
          '**Couper un Ad Group si :** CPA >3× l\'objectif après 5 000 impressions ❌\n' +
          '**Élargir le ciblage si :** taille d\'audience <50 000 personnes ↔️\n' +
          '**Renouveler les créatifs si :** fréquence >3 et CTR en baisse ♻️',
        inline: false,
      },
      {
        name: '🗓️ Cadence d\'optimisation recommandée',
        value:
          '• **Jours 1-7 (apprentissage)** : observer uniquement, aucune modification majeure\n' +
          '• **Semaine 2** : couper les Ad Groups et annonces sous-performants\n' +
          '• **Semaine 3+** : scaler les gagnants, tester de nouveaux créatifs, élargir les audiences rentables\n\n' +
          '**Règle des 3-3-3 :** 3 Ad Groups × 3 annonces = 9 combinaisons testées. Après 7 jours : garder le top 3, couper le reste.',
        inline: false,
      }
    )
    .setFooter({ text: '📚 Formation TikTok Ads Manager • Module 9/10 | Tapez /formation-menu pour le sommaire' })
    .setTimestamp();
}

// ─── Module 10 — Stratégies avancées ──────────────────────────────────────────
function getModule10() {
  return new EmbedBuilder()
    .setColor(0x9B59B6)
    .setTitle('🚀 Module 10 — Stratégies avancées TikTok Ads')
    .setDescription(
      'Une fois les bases maîtrisées, ces stratégies avancées permettent de **scaler** vos campagnes, ' +
      'de **maximiser le ROAS** et de construire un funnel publicitaire complet sur TikTok.'
    )
    .addFields(
      {
        name: '🔄 Retargeting par niveau d\'intention',
        value:
          '**Niveau 1 — Visiteurs du site** (ViewContent, 30j) : message de découverte, mettre en avant les bénéfices\n' +
          '**Niveau 2 — Ajouts au panier sans achat** (AddToCart sans CompletePayment, 14j) : offre incitative (livraison offerte, -10%)\n' +
          '**Niveau 3 — Checkouts abandonnés** (InitiateCheckout sans CompletePayment, 7j) : urgence maximale (-20%, stock limité, garantie)',
        inline: false,
      },
      {
        name: '📊 Optimisation ROAS (Value Optimization)',
        value:
          '• Activer **"Value Optimization"** dans la stratégie d\'enchère\n' +
          '• Transmettre la valeur de commande avec `CompletePayment` → TikTok optimise vers les paniers élevés\n' +
          '• Requiert **50+ achats/semaine** par Ad Group pour fonctionner\n' +
          '• Résultat : augmentation du panier moyen de 15-30% selon les niches',
        inline: false,
      },
      {
        name: '⚡ Scaling horizontal vs vertical',
        value:
          '**Scaling vertical** : augmenter le budget de l\'Ad Group actuel\n' +
          '→ Max **+20-30%** par modification, espacer de 48h minimum\n\n' +
          '**Scaling horizontal** : dupliquer l\'Ad Group gagnant avec une nouvelle audience\n' +
          '→ Plus stable, ne relance pas la phase d\'apprentissage\n' +
          '→ Tester : même audience dans un autre pays, Lookalike 5% sur les acheteurs, intérêts adjacents',
        inline: false,
      },
      {
        name: '🌐 Structure Full Funnel recommandée',
        value:
          '```\nHaut du funnel  → Campagne Reach / TopView\n                   (notoriété, nouvelle audience)\n                        ↓\nMilieu de funnel → Campagne Traffic / Video Views\n                   (cibler viewers 75%+ de la vidéo awareness)\n                        ↓\nBas du funnel    → Campagne Conversions\n                   (retargeter visiteurs + AddToCart)\n```\n' +
          'Chaque étape alimente la suivante via les Custom Audiences TikTok.',
        inline: false,
      },
      {
        name: '🤝 TikTok Creator Marketplace',
        value:
          '• Plateforme officielle pour trouver des créateurs/influenceurs\n' +
          '• Filtres : niche, localisation, taille d\'audience, taux d\'engagement, prix\n' +
          '• **Combo gagnant :** collaboration organique + Spark Ads pour amplifier la portée en paid\n' +
          '• Les posts UGC de créateurs convertissent en moyenne **3× mieux** qu\'une pub de marque classique',
        inline: false,
      },
      {
        name: '🎓 Certifications & ressources officielles',
        value:
          '• **TikTok Academy** (`academy.tiktok.com`) : certification gratuite "TikTok Advertising Fundamentals"\n' +
          '• **TikTok Creative Center** (`ads.tiktok.com/business/creativecenter`) : top ads par niche, pays, secteur, musiques tendance\n' +
          '• **TikTok Business Help Center** : documentation officielle mise à jour régulièrement\n' +
          '• La plateforme évolue vite — vérifier les nouveautés chaque mois',
        inline: false,
      }
    )
    .setFooter({ text: '📚 Formation TikTok Ads Manager • Module 10/10 — Formation complète ! | /formation-menu' })
    .setTimestamp();
}

// ─── Map modules ──────────────────────────────────────────────────────────────
const MODULES = {
  '6':  getModule6,
  '7':  getModule7,
  '8':  getModule8,
  '9':  getModule9,
  '10': getModule10,
};

// ─── Export ───────────────────────────────────────────────────────────────────
module.exports = {
  data: new SlashCommandBuilder()
    .setName('formation2')
    .setDescription('Formation TikTok Ads Manager — Modules 6 à 10')
    .addStringOption(option =>
      option
        .setName('module')
        .setDescription('Choisir un module de la formation')
        .setRequired(true)
        .addChoices(
          { name: '6 — Budget & Enchères',        value: '6'  },
          { name: '7 — Création de publicités',   value: '7'  },
          { name: '8 — TikTok Pixel',             value: '8'  },
          { name: '9 — Analyse & Optimisation',   value: '9'  },
          { name: '10 — Stratégies avancées',     value: '10' },
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
