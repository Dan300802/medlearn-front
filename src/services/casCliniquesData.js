export const casCliniques = [
  {
    id: 1,
    titre: "Douleur thoracique aiguë",
    specialite: "Cardiologie",
    difficulte: "moyen",
    icon: "❤️",
    patient: {
      nom: "M. Kofi Mensah",
      age: 58,
      sexe: "Homme",
      profession: "Comptable",
      avatar: "👨‍💼",
    },
    presentation: "M. Mensah, 58 ans, consulte aux urgences pour une douleur thoracique intense apparue il y a 2 heures, irradiant dans le bras gauche et la mâchoire. Il est diabétique et hypertendu.",
    constantes: {
      pa: "155/95 mmHg",
      fc: "98 bpm",
      spo2: "94%",
      temperature: "37.2°C",
      fr: "22/min",
    },
    etapes: [
      {
        id: "anamnese",
        titre: "Anamnèse",
        icon: "💬",
        question: "Quelles informations complémentaires recherchez-vous en priorité ?",
        options: [
          { texte: "Caractère, durée et facteurs déclenchants de la douleur", correct: true, points: 3 },
          { texte: "Antécédents familiaux cardiovasculaires et traitements en cours", correct: true, points: 2 },
          { texte: "Signes associés : sueurs, nausées, dyspnée", correct: true, points: 2 },
          { texte: "Régime alimentaire des dernières 24h", correct: false, points: 0 },
        ],
        feedback: {
          bien: "Excellent ! La douleur thoracique typique de l'IDM est constrictive, rétrosternale, irradiant au bras gauche et à la mâchoire, accompagnée de sueurs et nausées.",
          erreur: "Les antécédents cardiovasculaires et les caractéristiques de la douleur sont essentiels au diagnostic. Le régime alimentaire n'est pas prioritaire ici."
        }
      },
      {
        id: "examen",
        titre: "Examen clinique",
        icon: "🩺",
        question: "Quel examen complémentaire demandez-vous en URGENCE ?",
        options: [
          { texte: "ECG 12 dérivations immédiat", correct: true, points: 3 },
          { texte: "Troponines I et T ultra-sensibles", correct: true, points: 3 },
          { texte: "Radio du thorax", correct: false, points: 1 },
          { texte: "Scanner thoracique", correct: false, points: 0 },
        ],
        feedback: {
          bien: "L'ECG est l'examen clé en urgence. Il montre ici un sus-décalage ST en V1-V4 signant un IDM antérieur. Les troponines confirmeront la nécrose myocardique.",
          erreur: "Dans une suspicion d'IDM, l'ECG est L'URGENCE absolue. Chaque minute compte — 'Time is muscle' !"
        }
      },
      {
        id: "diagnostic",
        titre: "Diagnostic",
        icon: "🔍",
        question: "Quel est votre diagnostic principal ?",
        options: [
          { texte: "Infarctus du myocarde avec sus-décalage ST (STEMI)", correct: true, points: 4 },
          { texte: "Angor instable", correct: false, points: 1 },
          { texte: "Dissection aortique", correct: false, points: 0 },
          { texte: "Péricardite aiguë", correct: false, points: 0 },
        ],
        feedback: {
          bien: "Parfait ! Le tableau clinique (douleur typique + sus-décalage ST + facteurs de risque) signe un STEMI. La prise en charge doit être immédiate.",
          erreur: "Le sus-décalage ST en V1-V4 chez un patient avec douleur thoracique typique et facteurs de risque signe un STEMI — pas un simple angor."
        }
      },
      {
        id: "traitement",
        titre: "Traitement",
        icon: "💊",
        question: "Quelle est la prise en charge thérapeutique immédiate ?",
        options: [
          { texte: "Aspirine 250mg + Héparine IV + Appel cardiologie pour angioplastie", correct: true, points: 4 },
          { texte: "Morphine IV pour la douleur en attendant le bilan", correct: false, points: 1 },
          { texte: "Thrombolyse IV en première intention", correct: false, points: 1 },
          { texte: "Bêtabloquants IV en urgence", correct: false, points: 0 },
        ],
        feedback: {
          bien: "Excellent ! L'angioplastie primaire (PPCI) est le traitement de référence du STEMI si disponible dans les 120 minutes. Aspirine + anticoagulation en pont.",
          erreur: "La thrombolyse n'est indiquée que si l'angioplastie n'est pas disponible dans les 120 min. La PPCI est le gold standard."
        }
      },
    ]
  },
  {
    id: 2,
    titre: "Céphalées brutales",
    specialite: "Neurologie",
    difficulte: "difficile",
    icon: "🧠",
    patient: {
      nom: "Mme Ama Asante",
      age: 42,
      sexe: "Femme",
      profession: "Enseignante",
      avatar: "👩‍🏫",
    },
    presentation: "Mme Asante, 42 ans, consulte pour une céphalée d'apparition brutale, décrite comme 'la pire douleur de sa vie', survenue il y a 3 heures lors d'un effort. Elle présente une raideur de nuque et une photophobie.",
    constantes: {
      pa: "148/88 mmHg",
      fc: "88 bpm",
      spo2: "98%",
      temperature: "37.8°C",
      fr: "18/min",
    },
    etapes: [
      {
        id: "anamnese",
        titre: "Anamnèse",
        icon: "💬",
        question: "Quel signe clinique oriente immédiatement vers une urgence neurologique ?",
        options: [
          { texte: "Céphalée en 'coup de tonnerre' d'installation brutale", correct: true, points: 4 },
          { texte: "Raideur de nuque et photophobie", correct: true, points: 3 },
          { texte: "Céphalée survenue à l'effort", correct: true, points: 2 },
          { texte: "Antécédent de migraines", correct: false, points: 0 },
        ],
        feedback: {
          bien: "La céphalée en coup de tonnerre (thunderclap headache) est une urgence jusqu'à preuve du contraire. Elle évoque une hémorragie méningée.",
          erreur: "La céphalée brutale maximale d'emblée associée à une raideur de nuque est une urgence absolue évoquant une hémorragie sous-arachnoïdienne."
        }
      },
      {
        id: "examen",
        titre: "Examens complémentaires",
        icon: "🔬",
        question: "Quel est l'examen de première intention ?",
        options: [
          { texte: "Scanner cérébral sans injection en urgence", correct: true, points: 4 },
          { texte: "IRM cérébrale", correct: false, points: 1 },
          { texte: "Ponction lombaire immédiate", correct: false, points: 1 },
          { texte: "EEG", correct: false, points: 0 },
        ],
        feedback: {
          bien: "Le scanner cérébral sans injection est l'examen de première intention. Il détecte l'hyperdensité spontanée dans les citernes en cas d'HSA dans 95% des cas dans les 6 premières heures.",
          erreur: "La ponction lombaire ne se fait qu'APRÈS le scanner pour éviter un engagement cérébral en cas d'hypertension intracrânienne."
        }
      },
      {
        id: "diagnostic",
        titre: "Diagnostic",
        icon: "🔍",
        question: "Le scanner montre une hyperdensité dans les citernes de la base. Quel est le diagnostic ?",
        options: [
          { texte: "Hémorragie sous-arachnoïdienne (HSA)", correct: true, points: 4 },
          { texte: "Méningite bactérienne", correct: false, points: 1 },
          { texte: "Hématome sous-dural aigu", correct: false, points: 0 },
          { texte: "Migraine ophtalmique", correct: false, points: 0 },
        ],
        feedback: {
          bien: "Correct ! L'hyperdensité spontanée dans les citernes de la base signe une HSA. La cause la plus fréquente est la rupture d'un anévrisme intracrânien.",
          erreur: "L'hyperdensité dans les citernes de la base au scanner est pathognomonique de l'hémorragie sous-arachnoïdienne."
        }
      },
      {
        id: "traitement",
        titre: "Traitement",
        icon: "💊",
        question: "Quelle est la prise en charge immédiate de cette HSA ?",
        options: [
          { texte: "Transfert en neurochirurgie + Nimodipine + Repos strict", correct: true, points: 4 },
          { texte: "Antibiothérapie probabiliste IV", correct: false, points: 0 },
          { texte: "Antalgiques et surveillance ambulatoire", correct: false, points: 0 },
          { texte: "Corticothérapie IV", correct: false, points: 1 },
        ],
        feedback: {
          bien: "Parfait ! L'HSA nécessite un transfert urgent en neurochirurgie pour traitement de l'anévrisme (clip ou coil). La nimodipine prévient le vasospasme.",
          erreur: "L'HSA est une urgence neurochirurgicale absolue. Les antibiotiques sont réservés à la méningite bactérienne."
        }
      },
    ]
  },
  {
    id: 3,
    titre: "Fièvre et altération de l'état général",
    specialite: "Infectiologie",
    difficulte: "facile",
    icon: "🦠",
    patient: {
      nom: "M. Kwame Boateng",
      age: 25,
      sexe: "Homme",
      profession: "Étudiant",
      avatar: "👨‍🎓",
    },
    presentation: "M. Boateng, 25 ans, consulte pour une fièvre à 39.5°C évoluant depuis 5 jours, avec frissons, céphalées, myalgies et une éruption cutanée pétéchiale. Retour d'un voyage au Mali il y a 10 jours.",
    constantes: {
      pa: "105/65 mmHg",
      fc: "112 bpm",
      spo2: "97%",
      temperature: "39.5°C",
      fr: "20/min",
    },
    etapes: [
      {
        id: "anamnese",
        titre: "Anamnèse",
        icon: "💬",
        question: "Quel élément de l'anamnèse est le plus important ?",
        options: [
          { texte: "Notion de voyage en zone d'endémie palustre", correct: true, points: 4 },
          { texte: "Prise d'une chimioprophylaxie antipaludéenne", correct: true, points: 3 },
          { texte: "Piqûres de moustiques signalées", correct: true, points: 2 },
          { texte: "Régime alimentaire pendant le voyage", correct: false, points: 0 },
        ],
        feedback: {
          bien: "Toute fièvre au retour d'une zone d'endémie palustre est un paludisme jusqu'à preuve du contraire. La chimioprophylaxie réduit mais n'élimine pas le risque.",
          erreur: "La notion de voyage en zone tropicale est l'élément clé ! Toute fièvre au retour d'Afrique sub-saharienne doit faire évoquer le paludisme."
        }
      },
      {
        id: "examen",
        titre: "Examens complémentaires",
        icon: "🔬",
        question: "Quel examen est indispensable en urgence ?",
        options: [
          { texte: "Frottis sanguin + goutte épaisse", correct: true, points: 4 },
          { texte: "Test de diagnostic rapide (TDR) paludisme", correct: true, points: 3 },
          { texte: "NFS, CRP, hémocultures", correct: true, points: 2 },
          { texte: "Sérologie VIH", correct: false, points: 0 },
        ],
        feedback: {
          bien: "Le frottis + goutte épaisse est le gold standard pour diagnostiquer et identifier l'espèce plasmodiale. Le TDR est plus rapide mais moins précis.",
          erreur: "Le frottis sanguin et la goutte épaisse sont les examens de référence pour le diagnostic du paludisme."
        }
      },
      {
        id: "diagnostic",
        titre: "Diagnostic",
        icon: "🔍",
        question: "Le frottis retrouve Plasmodium falciparum à 2% de parasitémie. Quelle forme clinique ?",
        options: [
          { texte: "Paludisme simple à P. falciparum", correct: true, points: 3 },
          { texte: "Paludisme grave (critères OMS non remplis)", correct: false, points: 1 },
          { texte: "Paludisme à P. vivax", correct: false, points: 0 },
          { texte: "Fièvre typhoïde", correct: false, points: 0 },
        ],
        feedback: {
          bien: "Avec 2% de parasitémie et l'absence de critères de gravité OMS (troubles conscience, détresse respi, insuffisance rénale...), il s'agit d'un paludisme simple.",
          erreur: "Une parasitémie > 4% ou des signes de défaillance viscérale définissent le paludisme grave. Ici 2% sans signe de gravité = paludisme simple."
        }
      },
      {
        id: "traitement",
        titre: "Traitement",
        icon: "💊",
        question: "Quel traitement prescrivez-vous pour ce paludisme simple à P. falciparum ?",
        options: [
          { texte: "Artéméther-Luméfantrine (Coartem®) pendant 3 jours", correct: true, points: 4 },
          { texte: "Chloroquine pendant 3 jours", correct: false, points: 0 },
          { texte: "Quinine IV en hospitalisation", correct: false, points: 1 },
          { texte: "Doxycycline en monothérapie", correct: false, points: 0 },
        ],
        feedback: {
          bien: "Les combinaisons à base d'artémisinine (ACT) sont le traitement de référence du paludisme simple à P. falciparum. La chloroquine est inefficace sur P. falciparum résistant.",
          erreur: "La chloroquine est inefficace (résistances). La quinine IV est réservée au paludisme grave. L'ACT (Coartem) est le traitement de choix."
        }
      },
    ]
  },
]