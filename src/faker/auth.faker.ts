const { faker } = require('@faker-js/faker');
faker.setLocale('fr');
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface FakeAuth {
  _id: Types.ObjectId;
  email: string;
  password: string;
  roles: string[];
  isBlocked: boolean;
  lastLogin: Date | null;
}

export interface FakeUser {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  nickname: string;
  email: string;
  popularity: number;
  birthdate: Date;
  location: string;
  interests: string[];
  photos: string[];
  age_range: {
    min: number;
    max: number;
  };
  education: string;
  occupation: string;
  bio: string;
  hobbies: string[];
  relationship_status: string;
  languages: string[];
  height: number;
  weight: number;
  ethnicity: string;
  religion: string;
  interested_genre: number[];
  verification_status: boolean;
  last_active: Date;
  preferred_distance_range: {
    min: number;
    max: number;
  };
  looking_for: string;
  zodiac_sign: string;
  personality_type: string;
  smoker: boolean;
  drinker: string;
  children: string;
}

const generateFakeUser = (authId: Types.ObjectId, email: string): FakeUser => {
  const birthdate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    _id: authId,
    first_name: firstName,
    last_name: lastName,
    nickname: faker.internet.userName(firstName, lastName),
    email,
    popularity: faker.datatype.number({ min: 0, max: 100 }),
    birthdate,
    location: `${faker.address.city()}, ${faker.address.country()}`,
    interests: faker.helpers.arrayElements([
      'Musique', 'Cinéma', 'Voyage', 'Sport', 'Cuisine', 'Lecture', 'Art',
      'Photographie', 'Danse', 'Théâtre', 'Mode', 'Technologie', 'Nature',
      'Animaux', 'Yoga', 'Méditation', 'Jeux vidéo', 'Jardinage', 'Peinture'
    ], { min: 3, max: 8 }),
    photos: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () => 
      faker.image.avatar()
    ),
    age_range: {
      min: faker.datatype.number({ min: 18, max: 30 }),
      max: faker.datatype.number({ min: 31, max: 65 })
    },
    education: faker.helpers.arrayElement([
      'Baccalauréat', 'Licence', 'Master', 'Doctorat', 'Autre formation'
    ]),
    occupation: faker.name.jobTitle(),
    bio: faker.lorem.paragraphs(2),
    hobbies: faker.helpers.arrayElements([
      'Randonnée', 'Natation', 'Cyclisme', 'Course à pied', 'Tennis',
      'Football', 'Basketball', 'Yoga', 'Méditation', 'Peinture',
      'Photographie', 'Cuisine', 'Jardinage', 'Lecture', 'Écriture'
    ], { min: 2, max: 6 }),
    relationship_status: faker.helpers.arrayElement([
      'Célibataire', 'Divorcé(e)', 'Veuf(ve)', 'En couple', 'Compliqué'
    ]),
    languages: faker.helpers.arrayElements([
      'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien',
      'Portugais', 'Arabe', 'Chinois', 'Japonais', 'Russe'
    ], { min: 1, max: 3 }),
    height: faker.datatype.number({ min: 150, max: 200 }),
    weight: faker.datatype.number({ min: 45, max: 120 }),
    ethnicity: faker.helpers.arrayElement([
      'Africain', 'Asiatique', 'Caucasien', 'Hispanique', 'Métis', 'Autre'
    ]),
    religion: faker.helpers.arrayElement([
      'Athée', 'Bouddhiste', 'Chrétien', 'Hindou', 'Islam', 'Juif', 'Autre'
    ]),
    interested_genre: faker.helpers.arrayElements([0, 1, 2], { min: 1, max: 3 }),
    verification_status: faker.datatype.boolean(0.8),
    last_active: faker.date.recent(),
    preferred_distance_range: {
      min: faker.datatype.number({ min: 0, max: 20 }),
      max: faker.datatype.number({ min: 21, max: 100 })
    },
    looking_for: faker.helpers.arrayElement([
      'Relation sérieuse', 'Amitié', 'Casual', 'Mariage', 'Non spécifié'
    ]),
    zodiac_sign: faker.helpers.arrayElement([
      'Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge',
      'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'
    ]),
    personality_type: faker.helpers.arrayElement([
      'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ]),
    smoker: faker.datatype.boolean(0.2),
    drinker: faker.helpers.arrayElement([
      'Jamais', 'Occasionnellement', 'Socialement', 'Régulièrement'
    ]),
    children: faker.helpers.arrayElement([
      'Je n\'en veux pas', 'Je veux des enfants', 'J\'ai des enfants',
      'Je ne sais pas encore', 'Non spécifié'
    ])
  };
};

export const generateFakeAuth = async (): Promise<{ auth: FakeAuth; user: FakeUser }> => {
  const authId = new Types.ObjectId();
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const email = faker.internet.email();
  
  const auth: FakeAuth = {
    _id: authId,
    email,
    password: hashedPassword,
    roles: faker.helpers.arrayElement([['user'], ['admin'], ['user', 'admin']]),
    isBlocked: faker.datatype.boolean(0.1),
    lastLogin: faker.datatype.boolean(0.8) ? faker.date.recent() : null,
  };

  const user = generateFakeUser(authId, email);

  return { auth, user };
};

export const generateFakeAuths = async (count: number): Promise<{ auths: FakeAuth[]; users: FakeUser[] }> => {
  const auths: FakeAuth[] = [];
  const users: FakeUser[] = [];
  
  // Créer un admin par défaut
  const adminId = new Types.ObjectId();
  const adminAuth: FakeAuth = {
    _id: adminId,
    email: 'admin@example.com',
    password: await bcrypt.hash('Admin123!', 10),
    roles: ['admin'],
    isBlocked: false,
    lastLogin: new Date(),
  };
  auths.push(adminAuth);
  users.push(generateFakeUser(adminId, 'admin@example.com'));

  // Créer un utilisateur par défaut
  const userId = new Types.ObjectId();
  const userAuth: FakeAuth = {
    _id: userId,
    email: 'user@example.com',
    password: await bcrypt.hash('User123!', 10),
    roles: ['user'],
    isBlocked: false,
    lastLogin: new Date(),
  };
  auths.push(userAuth);
  users.push(generateFakeUser(userId, 'user@example.com'));

  // Générer les autres utilisateurs aléatoires
  for (let i = 0; i < count - 2; i++) {
    const { auth, user } = await generateFakeAuth();
    auths.push(auth);
    users.push(user);
  }

  return { auths, users };
};

export const saveFakeDataToJson = async (count: number = 10): Promise<void> => {
  const { auths, users } = await generateFakeAuths(count);
  const fs = require('fs');
  const path = require('path');

  const data = {
    auths: auths.map(auth => ({
      ...auth,
      _id: auth._id.toString(),
      lastLogin: auth.lastLogin?.toISOString() || null,
    })),
    users: users.map(user => ({
      ...user,
      _id: user._id.toString(),
      birthdate: user.birthdate.toISOString(),
      last_active: user.last_active.toISOString(),
    })),
  };

  const filePath = path.join(__dirname, 'seed.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Données sauvegardées dans ${filePath}`);
}; 