import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../Profil/User/schemas/user.schema';
import { MatchPreference, MatchPreferenceDocument } from './schemas/matchPreference.schemas';
import { ProfileSuggestion, ProfileSuggestionDocument } from './schemas/profileSuggestion.schema';
import { Interaction, InteractionDocument } from './schemas/Interaction.schemas';
import { GeolocationService } from '../Profil/Geolocation/geolocation.service';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(MatchPreference.name)
    private matchPreferenceModel: Model<MatchPreferenceDocument>,
    @InjectModel(ProfileSuggestion.name)
    private profileSuggestionModel: Model<ProfileSuggestionDocument>,
    @InjectModel(Interaction.name)
    private interactionModel: Model<InteractionDocument>,
    private geolocationService: GeolocationService,
  ) {}

  // async generateRecommendations(userId: string): Promise<ProfileSuggestion[]> {
  //   // Récupérer l'utilisateur et ses préférences
  //   const user = await this.userModel.findById(userId).exec();
  //   const userPreference = await this.matchPreferenceModel.findOne({ userId }).exec();

  //   if (!user || !userPreference) {
  //     return [];
  //   }

  //   // Construire la requête de base pour trouver des utilisateurs correspondants
  //   const matchQuery: any = {
  //     _id: { $ne: new Types.ObjectId(userId) }, // Exclure l'utilisateur lui-même
  //   };

  //   // Filtre par genre
  //   if (userPreference.genderPreference && userPreference.genderPreference.length > 0) {
  //     matchQuery.gender_ID = { $in: userPreference.genderPreference.map(g => g._id) };
  //   }

  //   // Filtre par âge
  //   if (userPreference.ageRange) {
  //     const currentDate = new Date();
  //     const minBirthYear = new Date(currentDate.getFullYear() - userPreference.ageRange.max, currentDate.getMonth(), currentDate.getDate());
  //     const maxBirthYear = new Date(currentDate.getFullYear() - userPreference.ageRange.min, currentDate.getMonth(), currentDate.getDate());
      
  //     matchQuery.birthdate = { $gte: minBirthYear, $lte: maxBirthYear };
  //   }

  //   // Filtres supplémentaires basés sur d'autres préférences
  //   if (userPreference.bodyTypePreference && userPreference.bodyTypePreference.length > 0) {
  //     matchQuery.body_type = { $in: userPreference.bodyTypePreference };
  //   }

  //   if (userPreference.educationLevelPreference && userPreference.educationLevelPreference.length > 0) {
  //     matchQuery.education = { $in: userPreference.educationLevelPreference };
  //   }

  //   if (userPreference.relationshipStatusPreference && userPreference.relationshipStatusPreference.length > 0) {
  //     matchQuery.relationship_status = { $in: userPreference.relationshipStatusPreference };
  //   }

  //   // Trouver les utilisateurs correspondants
  //   const potentialMatches = await this.userModel.find(matchQuery).exec();

  //   // Récupérer les interactions précédentes pour exclure les utilisateurs déjà "dislikés"
  //   const previousInteractions = await this.interactionModel.find({
  //     sender_user_ID: userId,
  //   }).exec();

  //   const dislikedUserIds = previousInteractions
  //     .filter(interaction => interaction.likeType === 'dislike')
  //     .map(interaction => interaction.receiver_user_ID.toString());

  //   // Filtrer les utilisateurs déjà dislikés
  //   const filteredMatches = potentialMatches.filter(
  //     match => !dislikedUserIds.includes(match._id.toString())
  //   );

  //   // Calculer les scores de compatibilité et créer des suggestions
  //   const suggestions = [];

  //   for (const potentialMatch of filteredMatches) {
  //     // Calculer un score de compatibilité de base
  //     let compatibilityScore = 0;
  //     const matchingInterests = [];

  //     // Intérêts communs
  //     if (user.interests && potentialMatch.interests) {
  //       for (const interest of user.interests) {
  //         if (potentialMatch.interests.includes(interest)) {
  //           matchingInterests.push(interest);
  //           compatibilityScore += 5; // +5 points pour chaque intérêt en commun
  //         }
  //       }
  //     }

  //     // Langues communes
  //     // if (user.languages && potentialMatch.languages) {
  //     //   const commonLanguages = user.languages.filter(lang => 
  //     //     potentialMatch.languages.includes(lang)
  //     //   );
  //     //   compatibilityScore += commonLanguages.length * 3; // +3 points par langue commune
  //     // }

  //     // // Bonus pour niveau d'éducation similaire
  //     // if (user.education && potentialMatch.education && user.education === potentialMatch.education) {
  //     //   compatibilityScore += 10;
  //     // }

  //     // // Bonus pour statut relationnel similaire
  //     // if (user.relationship_status && potentialMatch.relationship_status && 
  //     //     user.relationship_status === potentialMatch.relationship_status) {
  //     //   compatibilityScore += 8;
  //     // }

  //     // Calculer la distance si la géolocalisation est disponible
  //     let distance = null;
  //     try {
  //       const userGeo = await this.geolocationService.getGeolocationByUserId(userId);
  //       const matchGeo = await this.geolocationService.getGeolocationByUserId(potentialMatch._id.toString());
        
  //       if (userGeo && matchGeo) {
  //         // Utiliser le service de géolocalisation pour calculer la distance
  //         const usersWithinRadius = await this.geolocationService.getNearbyUsers(
  //           userGeo.location.coordinates[1],
  //           userGeo.location.coordinates[0],
  //           userPreference.distanceRange.max
  //         );
          
  //         // Vérifier si l'utilisateur potentiel est dans le rayon
  //         const isWithinRadius = usersWithinRadius.some(u => 
  //           u._id.toString() === potentialMatch._id.toString()
  //         );
          
  //         if (isWithinRadius) {
  //           // Calculer la distance exacte
  //           const R = 6371; // Rayon de la Terre en km
  //           const dLat = this.deg2rad(matchGeo.location.coordinates[1] - userGeo.location.coordinates[1]);
  //           const dLon = this.deg2rad(matchGeo.location.coordinates[0] - userGeo.location.coordinates[0]);
  //           const a =
  //             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //             Math.cos(this.deg2rad(userGeo.location.coordinates[1])) * Math.cos(this.deg2rad(matchGeo.location.coordinates[1])) *
  //             Math.sin(dLon / 2) * Math.sin(dLon / 2);
  //           const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //           distance = R * c; // Distance en km
            
  //           // Ajuster le score en fonction de la distance
  //           // Plus proche = meilleur score
  //           const distanceScore = Math.max(0, 50 - Math.floor(distance / 2));
  //           compatibilityScore += distanceScore;
  //         } else {
  //           // Hors du rayon de recherche, passer au suivant
  //           continue;
  //         }
  //       }
  //     } catch (error) {
  //       // Gérer l'erreur silencieusement, continuer sans ajustement de distance
  //       console.error('Erreur lors du calcul de la distance:', error);
  //     }

  //     // Vérifier si une suggestion existe déjà
  //     const existingSuggestion = await this.profileSuggestionModel.findOne({
  //       userId,
  //       suggestedUserId: potentialMatch._id,
  //     }).exec();
      
  //     if (existingSuggestion) {
  //       // Mettre à jour la suggestion existante
  //       existingSuggestion.compatibilityScore = compatibilityScore;
  //       existingSuggestion.matchingInterests = matchingInterests;
  //       if (distance !== null) {
  //         existingSuggestion.distance = distance;
  //       }
  //       await existingSuggestion.save();
  //       suggestions.push(existingSuggestion);
  //     } else {
  //       // Créer une nouvelle suggestion
  //       const newSuggestion = new this.profileSuggestionModel({
  //         userId: new Types.ObjectId(userId),
  //         suggestedUserId: potentialMatch._id,
  //         compatibilityScore,
  //         matchingInterests,
  //         distance: distance !== null ? distance : undefined,
  //         isViewed: false,
  //       });
        
  //       await newSuggestion.save();
  //       suggestions.push(newSuggestion);
  //     }
  //   }
    
  //   // Trier par score de compatibilité (du plus élevé au plus bas)
  //   return suggestions.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  // }

  // private deg2rad(deg: number): number {
  //   return deg * (Math.PI / 180);
  // }
} 