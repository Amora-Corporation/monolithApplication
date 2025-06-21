import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProfileSuggestion, ProfileSuggestionDocument } from './schemas/profileSuggestion.schema';
import { CreateProfileSuggestionDto, UpdateProfileSuggestionDto, GetProfileSuggestionsFilterDto } from './dtos/profileSuggestion.dto';
import { User, UserDocument } from '../Profil/User/schemas/user.schema';
import { MatchPreference, MatchPreferenceDocument } from './schemas/matchPreference.schemas';
import { TokenDto } from 'src/auth/common/dto/token.dto';
import { Geolocation, GeolocationDocument } from 'src/Profil/Geolocation/schemas/geolocation.schema';
@Injectable()
export class ProfileSuggestionService {
  constructor(
    @InjectModel(ProfileSuggestion.name)
    private profileSuggestionModel: Model<ProfileSuggestionDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(MatchPreference.name)
    private matchPreferenceModel: Model<MatchPreferenceDocument>,
    @InjectModel(Geolocation.name)
    private geolocationModel: Model<GeolocationDocument>,
  ) { }

  async createProfileSuggestion(
    createProfileSuggestionDto: CreateProfileSuggestionDto,
  ): Promise<ProfileSuggestion> {
    const createdSuggestion = new this.profileSuggestionModel(
      createProfileSuggestionDto,
    );
    return createdSuggestion.save();
  }

  async getProfileSuggestions(user: TokenDto): Promise<User[]> {
    const userGeo = await this.geolocationModel
      .findOne({ userId: new Types.ObjectId(user._id) })
      .exec();
    if (!userGeo) return [];

    const userPreference = await this.matchPreferenceModel
      .findOne({ userId: user._id })
      .exec();
    console.log("userPreference", userPreference)
    // Configuration des préférences par défaut si non existantes
    const defaultPreferences = {
      distanceRange: { max: 50 }, // 50 km par défaut
      ageRange: { min: 18, max: 100 },
      genderPreference: [],
      interestsPreference: []
    };

    const preferences = userPreference || defaultPreferences;
    const userId = typeof user._id === 'string' ? new Types.ObjectId(user._id) : user._id;
    // Construction de la requête unique avec aggregation
    const suggestions = await this.geolocationModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: userGeo.location.coordinates // déjà [lng, lat]
          },
          distanceField: "distance",
          maxDistance: preferences.distanceRange.max * 1000, // en mètres
          spherical: true,
          query: {
            userId: { $ne: userId },
          },
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      }
      ,
      { $unwind: '$user' },
      {
        $lookup: {
          from : 'interactions',
          let : {candidateId: '$user._id'},
          pipeline : [
            {
              $match : {
                $expr : {
                  $and : [
                    {$eq : ['$sender_user_ID', userId]},
                    {$eq : ['$receiver_user_ID', '$$candidateId']}
                  ],
                },
              },
            },
          ],
          as : 'existingInteraction'
        },
      },
      {
        $match : {
          'existingInteraction' : {
            $size : 0
          }
        }
      },
      {
        $addFields: {
          'user.age': {
            $dateDiff: {
              startDate: '$user.birthdate',
              endDate: '$$NOW',
              unit: 'year'
            }
          }
        }
      },
      {
        $match: {
          'user.age': {
            $gte: preferences.ageRange.min,
            $lte: preferences.ageRange.max
          },
          'user.gender_ID': preferences.genderPreference?.length > 0
            ? { $in: preferences.genderPreference }
            : { $exists: true }
          //   ,
          // 'user.interests': preferences.interestsPreference?.length > 0
          //   ? { $in: preferences.interestsPreference }
          //   : { $exists: true }
        }
      },
      { $limit: 10 },
      // {
      //   $lookup: {
      //     from: 'genders',
      //     localField: 'user.gender_ID',
      //     foreignField: '_id',
      //     as: 'gender'
      //   }
      // },
      // { $unwind: { path: '$gender', preserveNullAndEmptyArrays: true } },
      // {
      //   $project : {
      //     _id : '$user._id',
      //     first_name : '$user.first_name',
      //     age : '$age',
      //     interests : '$user.interests',
      //     distance : '$distance',
      //     gender : '$user.gender_ID'
          
      //   }
      // }
      
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$user',
              { distance: '$distance' }
            ]
          }
        }
      }
    ]);
    return suggestions;
  }
  

  async getSuggestionById(id: string): Promise<ProfileSuggestion> {
    return this.profileSuggestionModel.findById(id).exec();
  }

  async updateSuggestion(
    id: string,
    updateProfileSuggestionDto: UpdateProfileSuggestionDto,
  ): Promise<ProfileSuggestion> {
    return this.profileSuggestionModel
      .findByIdAndUpdate(id, updateProfileSuggestionDto, { new: true })
      .exec();
  }

  async deleteSuggestion(id: string): Promise<boolean> {
    const result = await this.profileSuggestionModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async markSuggestionAsViewed(id: string): Promise<ProfileSuggestion> {
    return this.profileSuggestionModel
      .findByIdAndUpdate(id, { isViewed: true }, { new: true })
      .exec();
  }

  async generateSuggestionsForUser(userId: string): Promise<ProfileSuggestion[]> {
    // Récupérer les préférences de l'utilisateur
    const userPreference = await this.matchPreferenceModel.findOne({ userId }).exec();

    if (!userPreference) {
      return [];
    }

    // Récupérer l'utilisateur
    const user = await this.userModel.findById(userId).exec();

    // Construire la requête pour trouver des utilisateurs correspondants
    const matchQuery: any = {};

    // Filtre par genre
    if (userPreference.genderPreference && userPreference.genderPreference.length > 0) {
      matchQuery.gender_ID = { $in: userPreference.genderPreference };
    }

    // Filtre par âge
    if (userPreference.ageRange) {
      const currentDate = new Date();
      const minBirthYear = new Date(currentDate.getFullYear() - userPreference.ageRange.max, currentDate.getMonth(), currentDate.getDate());
      const maxBirthYear = new Date(currentDate.getFullYear() - userPreference.ageRange.min, currentDate.getMonth(), currentDate.getDate());

      matchQuery.birthdate = { $gte: minBirthYear, $lte: maxBirthYear };
    }

    // Trouver les utilisateurs correspondants
    const potentialMatches = await this.userModel.find(matchQuery).exec();

    // Créer des suggestions avec des scores de compatibilité
    const suggestions = [];

    for (const potentialMatch of potentialMatches) {
      // Ne pas suggérer l'utilisateur lui-même
      if (potentialMatch._id.toString() === userId) {
        continue;
      }

      // Calculer un score de compatibilité basé sur les intérêts communs
      let compatibilityScore = 0;
      const matchingInterests = [];

      if (user.interests && potentialMatch.interests) {
        for (const interest of user.interests) {
          if (potentialMatch.interests.includes(interest)) {
            matchingInterests.push(interest);
            compatibilityScore += 5; // +5 points pour chaque intérêt en commun
          }
        }
      }

      // Ajustement de score pour d'autres facteurs
      // Intérêts en commun
      compatibilityScore += matchingInterests.length * 5;

      // Vérifier si une suggestion existe déjà
      const existingSuggestion = await this.profileSuggestionModel.findOne({
        userId,
        suggestedUserId: potentialMatch._id,
      }).exec();

      if (existingSuggestion) {
        // Mettre à jour la suggestion existante
        await this.updateSuggestion(existingSuggestion._id.toString(), {
          compatibilityScore,
        });
        suggestions.push(existingSuggestion);
      } else {
        // Créer une nouvelle suggestion
        const newSuggestion = await this.createProfileSuggestion({
          userId: new Types.ObjectId(userId),
          suggestedUserId: potentialMatch._id,
          compatibilityScore,
          matchingInterests,
          // Calcul de distance fictif pour l'exemple
          distance: Math.floor(Math.random() * 50),
          isViewed: false,
        });

        suggestions.push(newSuggestion);
      }
    }

    // Trier par score de compatibilité
    return suggestions.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
} 