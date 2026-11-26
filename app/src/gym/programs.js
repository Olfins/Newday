// Les programmes de l'app Salle, repris tels quels.
// Chaque exercice : nom, consigne (séries × répétitions), repos en secondes, muscles travaillés.
// Pour modifier tes séances, change ce fichier.
export const LEVELS = [
  {
    "name": "Pleine",
    "full": "Pleine énergie",
    "energy": 3,
    "duration": "60-75 min",
    "unit": "exercices",
    "tip": "Repos de 45 s à 2 min 30 · marche inclinée en fin de séance",
    "sessions": [
      {
        "name": "Push · Pecs",
        "exercises": [
          {
            "name": "Développé couché barre",
            "plan": "4 × 8-12 · repos 2 min",
            "rest": 120,
            "muscles": [
              "pec",
              "delt",
              "tri"
            ]
          },
          {
            "name": "Développé incliné haltères",
            "plan": "4 × 8-12 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "pec",
              "delt"
            ]
          },
          {
            "name": "Écartés poulie (crossover)",
            "plan": "3 × 10-12 · repos 1 min",
            "rest": 60,
            "muscles": [
              "pec"
            ]
          },
          {
            "name": "Développé épaules haltères",
            "plan": "3 × 10-12 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "delt",
              "tri"
            ]
          },
          {
            "name": "Élévations latérales",
            "plan": "3 × 12-15 · repos 45 s",
            "rest": 45,
            "muscles": [
              "delt"
            ]
          },
          {
            "name": "Extension triceps au-dessus de la tête",
            "plan": "3 × 10-12 · repos 1 min",
            "rest": 60,
            "muscles": [
              "tri"
            ]
          },
          {
            "name": "Marche inclinée",
            "plan": "20-30 min",
            "rest": 0,
            "muscles": []
          }
        ]
      },
      {
        "name": "Push · Épaules",
        "exercises": [
          {
            "name": "Développé militaire barre",
            "plan": "4 × 6-8 · repos 2 min 30",
            "rest": 150,
            "muscles": [
              "delt",
              "tri",
              "trap"
            ]
          },
          {
            "name": "Développé incliné haltères",
            "plan": "3 × 10 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "pec",
              "delt"
            ]
          },
          {
            "name": "Élévations latérales",
            "plan": "4 × 12-15 · repos 45 s",
            "rest": 45,
            "muscles": [
              "delt"
            ]
          },
          {
            "name": "Dips (ou machine à dips)",
            "plan": "3 × 8-12 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "pec",
              "tri",
              "delt"
            ]
          },
          {
            "name": "Oiseau haltères ou machine",
            "plan": "3 × 15 · repos 45 s",
            "rest": 45,
            "muscles": [
              "rdelt",
              "trap"
            ]
          },
          {
            "name": "Triceps poulie",
            "plan": "3 × 12-15 · repos 1 min",
            "rest": 60,
            "muscles": [
              "tri"
            ]
          },
          {
            "name": "Marche inclinée",
            "plan": "20-30 min",
            "rest": 0,
            "muscles": []
          }
        ]
      },
      {
        "name": "Pull · Largeur",
        "exercises": [
          {
            "name": "Tractions (lestées si facile)",
            "plan": "4 × 8 · repos 2 min",
            "rest": 120,
            "muscles": [
              "lat",
              "bic"
            ]
          },
          {
            "name": "Tirage vertical prise serrée",
            "plan": "3 × 10-12 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "lat",
              "bic"
            ]
          },
          {
            "name": "Rowing haltère un bras",
            "plan": "3 × 10 par bras · repos 1 min",
            "rest": 60,
            "muscles": [
              "lat",
              "mid",
              "bic"
            ]
          },
          {
            "name": "Pullover poulie ou haltère",
            "plan": "3 × 10-12 · repos 1 min",
            "rest": 60,
            "muscles": [
              "lat",
              "pec"
            ]
          },
          {
            "name": "Curl barre",
            "plan": "3 × 8-10 · repos 1 min",
            "rest": 60,
            "muscles": [
              "bic",
              "fore"
            ]
          },
          {
            "name": "Curl marteau",
            "plan": "3 × 12 · repos 45 s",
            "rest": 45,
            "muscles": [
              "bic",
              "fore"
            ]
          },
          {
            "name": "Marche inclinée",
            "plan": "20-30 min",
            "rest": 0,
            "muscles": []
          }
        ]
      },
      {
        "name": "Pull · Épaisseur",
        "exercises": [
          {
            "name": "Rowing barre",
            "plan": "4 × 8-10 · repos 2 min",
            "rest": 120,
            "muscles": [
              "mid",
              "lat",
              "bic"
            ]
          },
          {
            "name": "Rowing poitrine appuyée",
            "plan": "3 × 10-12 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "mid",
              "rdelt"
            ]
          },
          {
            "name": "Tirage horizontal poulie",
            "plan": "3 × 10-12 · repos 1 min",
            "rest": 60,
            "muscles": [
              "mid",
              "lat"
            ]
          },
          {
            "name": "Face pulls",
            "plan": "3 × 15 · repos 45 s",
            "rest": 45,
            "muscles": [
              "rdelt",
              "trap",
              "mid"
            ]
          },
          {
            "name": "Curl incliné haltères",
            "plan": "3 × 10-12 · repos 1 min",
            "rest": 60,
            "muscles": [
              "bic"
            ]
          },
          {
            "name": "Haussements d’épaules",
            "plan": "3 × 12 · repos 45 s",
            "rest": 45,
            "muscles": [
              "trap"
            ]
          },
          {
            "name": "Marche inclinée",
            "plan": "20-30 min",
            "rest": 0,
            "muscles": []
          }
        ]
      },
      {
        "name": "Corps fonctionnel",
        "exercises": [
          {
            "name": "Tractions",
            "plan": "4 × 6-8 · repos 2 min",
            "rest": 120,
            "muscles": [
              "lat",
              "bic"
            ]
          },
          {
            "name": "Pompes lestées ou dips",
            "plan": "3 × 8-12 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "pec",
              "tri",
              "delt"
            ]
          },
          {
            "name": "Rowing haltère un bras",
            "plan": "3 × 10 par bras · repos 1 min",
            "rest": 60,
            "muscles": [
              "lat",
              "mid"
            ]
          },
          {
            "name": "Marche du fermier (farmer’s walk)",
            "plan": "4 × 30-40 m · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "fore",
              "trap",
              "abs"
            ]
          },
          {
            "name": "Marche valise (un seul haltère)",
            "plan": "3 × 30 m par côté · repos 1 min",
            "rest": 60,
            "muscles": [
              "abs",
              "fore",
              "trap"
            ]
          },
          {
            "name": "Relevés de jambes suspendu",
            "plan": "3 × 8-12 · repos 1 min",
            "rest": 60,
            "muscles": [
              "abs"
            ]
          },
          {
            "name": "Planche",
            "plan": "3 × 45 s · repos 45 s",
            "rest": 45,
            "muscles": [
              "abs"
            ]
          },
          {
            "name": "Marche inclinée",
            "plan": "20 min",
            "rest": 0,
            "muscles": []
          }
        ]
      },
      {
        "name": "Bras + épaules + abdos",
        "exercises": [
          {
            "name": "Développé épaules assis haltères",
            "plan": "4 × 8-10 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "delt",
              "tri"
            ]
          },
          {
            "name": "Superset : curl barre EZ + barre au front",
            "plan": "4 × 10-12 · repos 1 min",
            "rest": 60,
            "muscles": [
              "bic",
              "tri"
            ]
          },
          {
            "name": "Élévations latérales (série 21)",
            "plan": "3 × 7/7/7 · repos 1 min",
            "rest": 60,
            "muscles": [
              "delt"
            ]
          },
          {
            "name": "Superset : curl marteau + triceps poulie",
            "plan": "3 × 12-15 · repos 45 s",
            "rest": 45,
            "muscles": [
              "bic",
              "tri",
              "fore"
            ]
          },
          {
            "name": "Oiseau machine",
            "plan": "3 × 15 · repos 45 s",
            "rest": 45,
            "muscles": [
              "rdelt",
              "trap"
            ]
          },
          {
            "name": "Abdos poulie",
            "plan": "3 × 12-15 · repos 45 s",
            "rest": 45,
            "muscles": [
              "abs"
            ]
          },
          {
            "name": "Marche inclinée",
            "plan": "20-30 min",
            "rest": 0,
            "muscles": []
          }
        ]
      }
    ]
  },
  {
    "name": "Moyenne",
    "full": "Énergie moyenne",
    "energy": 2,
    "duration": "45 min",
    "unit": "exercices",
    "tip": "Repos de 45 s à 1 min 30 · marche inclinée en fin de séance",
    "sessions": [
      {
        "name": "Haut du corps A",
        "exercises": [
          {
            "name": "Développé incliné haltères",
            "plan": "3 × 10 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "pec",
              "delt"
            ]
          },
          {
            "name": "Tirage vertical",
            "plan": "3 × 10 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "lat",
              "bic"
            ]
          },
          {
            "name": "Développé épaules machine",
            "plan": "3 × 12 · repos 1 min",
            "rest": 60,
            "muscles": [
              "delt",
              "tri"
            ]
          },
          {
            "name": "Rowing assis poulie",
            "plan": "3 × 12 · repos 1 min",
            "rest": 60,
            "muscles": [
              "mid",
              "lat"
            ]
          },
          {
            "name": "Élévations latérales",
            "plan": "2 × 15 · repos 45 s",
            "rest": 45,
            "muscles": [
              "delt"
            ]
          },
          {
            "name": "Marche inclinée",
            "plan": "15-20 min",
            "rest": 0,
            "muscles": []
          }
        ]
      },
      {
        "name": "Haut du corps B",
        "exercises": [
          {
            "name": "Développé couché haltères",
            "plan": "3 × 10 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "pec",
              "tri"
            ]
          },
          {
            "name": "Rowing haltère un bras",
            "plan": "3 × 10 par bras · repos 1 min",
            "rest": 60,
            "muscles": [
              "lat",
              "mid"
            ]
          },
          {
            "name": "Dips ou pompes",
            "plan": "3 × 10-12 · repos 1 min",
            "rest": 60,
            "muscles": [
              "pec",
              "tri"
            ]
          },
          {
            "name": "Face pulls",
            "plan": "3 × 15 · repos 45 s",
            "rest": 45,
            "muscles": [
              "rdelt",
              "trap"
            ]
          },
          {
            "name": "Superset : curl + triceps poulie",
            "plan": "3 × 12 · repos 45 s",
            "rest": 45,
            "muscles": [
              "bic",
              "tri"
            ]
          },
          {
            "name": "Marche inclinée",
            "plan": "15-20 min",
            "rest": 0,
            "muscles": []
          }
        ]
      },
      {
        "name": "Circuit push / pull",
        "exercises": [
          {
            "name": "Chest press machine",
            "plan": "2 tours : 12-16 reps puis 6-10 reps · repos 1 min",
            "rest": 60,
            "muscles": [
              "pec",
              "tri"
            ]
          },
          {
            "name": "Rowing assis",
            "plan": "2 tours : 12-16 reps puis 6-10 reps · repos 1 min",
            "rest": 60,
            "muscles": [
              "mid",
              "lat"
            ]
          },
          {
            "name": "Développé incliné barre",
            "plan": "2 tours : 12-16 reps puis 6-10 reps · repos 1 min",
            "rest": 60,
            "muscles": [
              "pec",
              "delt"
            ]
          },
          {
            "name": "Rowing poulie haute",
            "plan": "2 tours : 12-16 reps puis 6-10 reps · repos 1 min",
            "rest": 60,
            "muscles": [
              "lat",
              "mid"
            ]
          },
          {
            "name": "Développé épaules machine",
            "plan": "2 tours : 12-16 reps puis 6-10 reps · repos 1 min",
            "rest": 60,
            "muscles": [
              "delt",
              "tri"
            ]
          },
          {
            "name": "Tirage vertical",
            "plan": "2 tours : 12-16 reps puis 6-10 reps · repos 1 min",
            "rest": 60,
            "muscles": [
              "lat",
              "bic"
            ]
          },
          {
            "name": "Marche inclinée",
            "plan": "15 min",
            "rest": 0,
            "muscles": []
          }
        ]
      },
      {
        "name": "Fonctionnel + core",
        "exercises": [
          {
            "name": "Tractions",
            "plan": "3 × max − 1 · repos 1 min 30",
            "rest": 90,
            "muscles": [
              "lat",
              "bic"
            ]
          },
          {
            "name": "Pompes",
            "plan": "3 × 12-15 · repos 1 min",
            "rest": 60,
            "muscles": [
              "pec",
              "tri",
              "delt"
            ]
          },
          {
            "name": "Rowing haltère un bras",
            "plan": "3 × 10 par bras · repos 1 min",
            "rest": 60,
            "muscles": [
              "lat",
              "mid"
            ]
          },
          {
            "name": "Marche du fermier",
            "plan": "3 × 30 m · repos 1 min",
            "rest": 60,
            "muscles": [
              "fore",
              "trap",
              "abs"
            ]
          },
          {
            "name": "Relevés de jambes suspendu",
            "plan": "3 × 10 · repos 45 s",
            "rest": 45,
            "muscles": [
              "abs"
            ]
          },
          {
            "name": "Pallof press",
            "plan": "3 × 10 par côté · repos 45 s",
            "rest": 45,
            "muscles": [
              "abs"
            ]
          },
          {
            "name": "Marche inclinée",
            "plan": "15 min",
            "rest": 0,
            "muscles": []
          }
        ]
      }
    ]
  },
  {
    "name": "Repos actif",
    "full": "Repos actif",
    "energy": 1,
    "duration": "20-50 min",
    "unit": "étapes",
    "tip": "Sans charge lourde · tu bouges sans te fatiguer",
    "sessions": [
      {
        "name": "Marche + mobilité",
        "exercises": [
          {
            "name": "Marche inclinée avec variations",
            "plan": "30-50 min",
            "rest": 0,
            "muscles": []
          },
          {
            "name": "Mobilité épaules",
            "plan": "5 min",
            "rest": 0,
            "muscles": []
          },
          {
            "name": "Mobilité dos",
            "plan": "5 min",
            "rest": 0,
            "muscles": []
          },
          {
            "name": "Mobilité hanches",
            "plan": "5 min",
            "rest": 0,
            "muscles": []
          },
          {
            "name": "Gainage ou abdos léger (option)",
            "plan": "2-3 séries",
            "rest": 0,
            "muscles": [
              "abs"
            ]
          }
        ]
      }
    ]
  }
];
