import { saveFakeDataToJson } from './auth.faker';

async function seed() {
  try {
    // Générer 10 utilisateurs par défaut (incluant admin et user)
    await saveFakeDataToJson(10);
    console.log('Génération des données factices terminée avec succès !');
  } catch (error) {
    console.error('Erreur lors de la génération des données factices:', error);
    process.exit(1);
  }
}

seed(); 