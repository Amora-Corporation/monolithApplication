# Service de Messagerie et Notification en Temps Réel

Ce document explique comment utiliser les services de messagerie en temps réel et de notifications push dans l'application.

## Architecture

L'application utilise une architecture basée sur WebSocket pour les communications en temps réel et un système de notification push pour les alertes.

- **WebSocket** : Utilisé pour la messagerie instantanée, les indicateurs de frappe, et les statuts en ligne
- **Notifications** : Système de notification pour alerter les utilisateurs des nouveaux messages, matchs, etc.

## Configuration Requise

- Socket.io client pour les connexions WebSocket
- Device token pour les notifications push (Firebase ou Apple Push Notification)

## Intégration Côté Client

### Connexion WebSocket

```typescript
import { io } from 'socket.io-client';

// Connexion au serveur WebSocket avec authentification
const socket = io('http://votre-api.com/notifications', {
  query: { token: 'votre-token-jwt' },
  // OU
  extraHeaders: { Authorization: `Bearer ${votre-token-jwt}` }
});

// Gestion des événements
socket.on('connect', () => {
  console.log('Connecté au serveur WebSocket');
});

socket.on('disconnect', () => {
  console.log('Déconnecté du serveur WebSocket');
});

// Écoute des notifications
socket.on('notification', (notification) => {
  console.log('Nouvelle notification:', notification);
  // Afficher la notification à l'utilisateur
});
```

### Rejoindre une Conversation

```typescript
// Rejoindre une salle de conversation
socket.emit('joinConversation', 'conversation-id');

// Écouter les nouveaux messages
socket.on('newMessage', (message) => {
  console.log('Nouveau message:', message);
  // Ajouter le message à la conversation
});

// Écouter les statuts de frappe
socket.on('typingStatus', ({ userId, isTyping }) => {
  console.log(`Utilisateur ${userId} est ${isTyping ? 'en train d\'écrire' : 'a arrêté d\'écrire'}`);
  // Mettre à jour l'UI
});

// Écouter les confirmations de lecture
socket.on('messageRead', ({ messageId, readBy, conversationId }) => {
  console.log(`Message ${messageId} lu par ${readBy}`);
  // Mettre à jour l'UI
});
```

### Envoyer un Message

```typescript
// Utiliser l'API REST pour envoyer un message
async function sendMessage(conversationId, content) {
  const response = await fetch('http://votre-api.com/messages-realtime', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${votre-token-jwt}`
    },
    body: JSON.stringify({
      conversationId,
      senderId: 'votre-user-id',
      content
    })
  });
  
  return response.json();
}

// Envoyer un message de statut de frappe
function sendTypingStatus(conversationId, userId, isTyping) {
  socket.emit('typingStatus', { conversationId, userId, isTyping });
}
```

### Gestion des Notifications Push

```typescript
// Enregistrer un token d'appareil pour les notifications push
async function registerDeviceToken(userId, deviceToken) {
  const response = await fetch(`http://votre-api.com/notifications/settings/${userId}/device-token`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${votre-token-jwt}`
    },
    body: JSON.stringify({ deviceToken })
  });
  
  return response.json();
}

// Mettre à jour les préférences de notification
async function updateNotificationSettings(userId, settings) {
  const response = await fetch(`http://votre-api.com/notifications/settings/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${votre-token-jwt}`
    },
    body: JSON.stringify(settings)
  });
  
  return response.json();
}
```

## API REST

### Messages

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /messages-realtime | Créer un nouveau message |
| GET | /messages-realtime/conversation/:id | Obtenir les messages d'une conversation |
| PUT | /messages-realtime/:id | Mettre à jour un message |
| DELETE | /messages-realtime/:id | Supprimer un message |
| PUT | /messages-realtime/:id/read | Marquer un message comme lu |
| POST | /messages-realtime/typing-status | Envoyer un statut de frappe |

### Notifications

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /notifications/user/:userId | Obtenir les notifications d'un utilisateur |
| PUT | /notifications/:id/mark-as-read | Marquer une notification comme lue |
| PUT | /notifications/user/:userId/mark-all-read | Marquer toutes les notifications comme lues |
| GET | /notifications/settings/:userId | Obtenir les paramètres de notification |
| PUT | /notifications/settings/:userId | Mettre à jour les paramètres de notification |
| PUT | /notifications/settings/:userId/device-token | Mettre à jour le token d'appareil |

## Types de Notifications

- `message` : Nouveau message reçu
- `match` : Nouveau match avec un autre utilisateur
- `like` : Quelqu'un a aimé votre profil
- `profile_view` : Quelqu'un a vu votre profil
- `suggestion` : Nouvelle suggestion de profil
- `system` : Notification système

## Bonnes Pratiques

1. **Gestion de la Connexion** : Toujours vérifier l'état de la connexion WebSocket et implémenter une logique de reconnexion.
2. **Optimisation Battery** : Pour les applications mobiles, fermez la connexion WebSocket lorsque l'application est en arrière-plan.
3. **Traitement des Erreurs** : Implémentez une gestion robuste des erreurs pour les appels API et les connexions WebSocket.
4. **Mise en Cache** : Mettez en cache les messages localement pour permettre une visualisation hors ligne.

## Limitations et Considérations

- Les connexions WebSocket peuvent être interrompues par des problèmes réseau. Implémentez une logique de reconnexion.
- Les notifications push peuvent être retardées ou ne pas être délivrées selon les paramètres de l'appareil.
- Considérez l'ajout de chiffrement de bout en bout pour les messages sensibles. 