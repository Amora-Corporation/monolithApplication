import axios from 'axios';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

faker.setLocale('fr');

// Configuration des constantes
const API_BASE_URL = 'http://localhost:3002';
const BATCH_SIZE = 10; // Nombre d'utilisateurs à créer en parallèle
const DELAY_BETWEEN_BATCHES = 100; // Délai entre les lots en ms
const INTERESTS = [
  'Musique', 'Cinéma', 'Voyage', 'Sport', 'Cuisine', 'Lecture', 'Art',
  'Photographie', 'Danse', 'Théâtre', 'Mode', 'Technologie', 'Nature',
  'Animaux', 'Yoga', 'Méditation', 'Jeux vidéo', 'Jardinage', 'Peinture'
] as const;

const LOOKING_FOR_OPTIONS = [
  'Relation sérieuse', 'Amitié', 'Casual', 'Mariage', 'Non spécifié'
] as const;

const DRINKER_OPTIONS = [
  'Jamais', 'Occasionnellement', 'Socialement', 'Régulièrement'
] as const;

const CHILDREN_OPTIONS = [
  'Je n\'en veux pas', 'Je veux des enfants', 'J\'ai des enfants',
  'Je ne sais pas encore', 'Non spécifié'
] as const;
 // Start of Selection

// Configuration du client axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
 

// Types améliorés
interface UserProfile {
  first_name: string;
  gender_ID: Types.ObjectId;
  popularity: number;
  birthdate: Date;
  interests: typeof INTERESTS[number][];
  photos: string[];
  age_range: {
    min: number;
    max: number;
  };
  interested_genre: Types.ObjectId[];
  verification_status: boolean;
  last_active: Date;
  preferred_distance_range: {
    min: number;
    max: number;
  };
  looking_for: typeof LOOKING_FOR_OPTIONS[number];
  smoker: boolean;
  drinker: typeof DRINKER_OPTIONS[number];
  children: typeof CHILDREN_OPTIONS[number];
  social_media_links: {
    [key: string]: string;
  };
  bio: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface GeolocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  address: string;
  accuracy: number;
}

interface UserResponse {
  _id: string;
  email: string;
  // autres champs si nécessaire
}

interface GenderData {
  _id: string;
  name: string;
}

const generateUserProfile = (gendersData: GenderData[]): UserProfile => {
  const birthdate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
  const firstName = faker.name.firstName();
  const randomGender = faker.helpers.arrayElement(gendersData);
  
  return {
    first_name: firstName,
    gender_ID: new Types.ObjectId(randomGender._id),
    popularity: faker.datatype.number({ min: 0, max: 100 }),
    birthdate,
    interests: faker.helpers.arrayElements(INTERESTS, faker.datatype.number({ min: 3, max: 8 })),
    photos: Array.from(
      { length: faker.datatype.number({ min: 1, max: 5 }) }, 
      () => faker.image.imageUrl()
    ),
    age_range: {
      min: faker.datatype.number({ min: 18, max: 30 }),
      max: faker.datatype.number({ min: 31, max: 65 })
    },
    interested_genre: faker.helpers.arrayElements(
      gendersData.map(gender => new Types.ObjectId(gender._id)), 
      faker.datatype.number({ min: 1, max: 3 })
    ),
    verification_status: faker.datatype.boolean(),
    last_active: faker.date.recent(),
    preferred_distance_range: {
      min: faker.datatype.number({ min: 0, max: 20 }),
      max: faker.datatype.number({ min: 21, max: 100 })
    },
    looking_for: faker.helpers.arrayElement(LOOKING_FOR_OPTIONS),
    smoker: faker.datatype.boolean(),
    drinker: faker.helpers.arrayElement(DRINKER_OPTIONS),
    children: faker.helpers.arrayElement(CHILDREN_OPTIONS),
    social_media_links: {
      instagram: faker.internet.userName(),
      facebook: faker.internet.userName(),
      twitter: faker.internet.userName()
    },
    bio: faker.lorem.paragraphs(2)
  };
};

const generateGeolocation = (): GeolocationData => {
  const centerLat = 50.365564; // Paris
  const centerLng = 3.080273;
  const radiusInKm = 100;

  // Générer un rayon et angle aléatoires
  const radius = Math.random() * radiusInKm;
  const angle = Math.random() * 2 * Math.PI;

  // Calculer les offsets de latitude et longitude
  const dx = radius * Math.cos(angle);
  const dy = radius * Math.sin(angle);

  // Approximation : 1 degré latitude ≈ 111 km
  const newLat = centerLat + (dy / 111);
  const newLng = centerLng + (dx / (111 * Math.cos(centerLat * Math.PI / 180)));

  return {
    latitude: newLat,
    longitude: newLng,
    city: faker.address.city(),
    country: 'France',
    address: faker.address.streetAddress(),
    accuracy: faker.datatype.number({ min: 1, max: 100 })
  };
};

async function createCompleteUser(index: number, gendersData: GenderData[], accessToken?: string): Promise<{ success: boolean; email: string }> {
  const email = faker.internet.email();
  const password = 'Password123!';
  const userProfile = generateUserProfile(gendersData);
  const geolocationData = generateGeolocation();

  try {
    let token = accessToken;
    if (!token) {
      const authResponse = await apiClient.post<AuthResponse>('/auth-classique/SignInOrUp', {
        email,
        password
      });
      token = authResponse.data.accessToken;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Exécution parallèle des requêtes
    const [userResponse, geolocationResponse] = await Promise.all([
      apiClient.put<UserResponse>('/User', userProfile, { headers }),
      apiClient.post('/geolocation', geolocationData, { headers })
    ]);

    return { success: true, email };
  } catch (error: any) {
    console.error(`❌ ${index} Erreur lors de la création de l'utilisateur ${email}:`);
    if (error?.response) {
      console.error(`   - Status: ${error.response.status}`);
      console.error(`   - Message: ${error.response.data?.message || error.message}`);
    } else {
      console.error(`   - Message: ${error?.message || String(error)}`);
    }
    return { success: false, email };
  }
}

async function processBatch(startIndex: number, batchSize: number, totalCount: number, gendersData: GenderData[]): Promise<{ success: boolean; email: string }[]> {
  const batchPromises = Array.from({ length: batchSize }, (_, i) => 
    createCompleteUser(startIndex + i, gendersData)
  );
  return Promise.all(batchPromises);
}

async function seed(count: number = 10) {
  console.log('🚀 Démarrage de la génération des utilisateurs...');
  console.log('-----------------------------------');

  try {
    const { data: gendersData } = await apiClient.get<GenderData[]>('/gender');
    console.log(`📊 ${gendersData.length} genres trouvés`);

    const results: { success: boolean; email: string }[] = [];
    const batches = Math.ceil(count / BATCH_SIZE);

    for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
      const startIndex = batchIndex * BATCH_SIZE;
      const currentBatchSize = Math.min(BATCH_SIZE, count - startIndex);
      
      const batchResults = await processBatch(startIndex, currentBatchSize, count, gendersData);
      results.push(...batchResults);

      // Afficher la progression
      const currentCount = startIndex + currentBatchSize;
      if (currentCount % 100 === 0 || currentCount === count) {
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;
        console.log(`\n📊 Progression: ${currentCount}/${count} utilisateurs créés`);
        console.log(`   - Succès: ${successCount}`);
        console.log(`   - Échecs: ${failCount}`);
        console.log('-----------------------------------');
      }

      // Attendre entre les lots pour éviter de surcharger l'API
      // if (batchIndex < batches - 1) {
      //   await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      // }
    }

    // Résumé final
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    console.log('\n📊 Résumé final de la génération:');
    console.log(`   - Total: ${count} utilisateurs`);
    console.log(`   - Succès: ${successCount}`);
    console.log(`   - Échecs: ${failCount}`);
    console.log('-----------------------------------');

  } catch (error) {
    console.error('❌ Erreur lors de la génération des utilisateurs:', error);
  }
}

// Lancer la génération
seed(10000); 