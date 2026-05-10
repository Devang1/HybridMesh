# HybridMesh

HybridMesh is a next-generation hybrid messaging platform built with Expo + React Native that combines realtime cloud messaging with offline-first mesh communication architecture.

The platform is designed to work seamlessly in both connected and disconnected environments. When internet access is available, HybridMesh behaves like a modern realtime messaging app using Socket.IO and cloud synchronization. When connectivity is lost, the app automatically switches to an offline relay-based communication system that stores, forwards, and synchronizes messages once the network becomes available again.

The project focuses on creating a resilient communication system inspired by modern messaging platforms like WhatsApp Messenger, Signal, and Telegram while introducing futuristic offline communication concepts commonly used in disaster communication systems and decentralized networking.

HybridMesh is built with a strong focus on:

* realtime communication
* offline-first architecture
* modern messaging UX
* secure communication
* scalable backend systems
* smooth animations
* premium mobile UI
* future-ready mesh networking support

---

## Preview

* Realtime messaging
* Phone number OTP authentication
* WhatsApp-style chat experience
* Offline-first architecture
* Automatic message synchronization
* Contact syncing
* Stories / status updates
* Group chats
* Voice notes
* Emergency communication mode
* Mesh relay simulation
* Premium dark UI
* Modern animations & transitions

---

## Features

### Realtime Messaging

HybridMesh supports modern realtime communication using Socket.IO.

Features include:

* instant one-to-one messaging
* realtime group chats
* typing indicators
* read receipts
* delivery states
* replies & reactions
* message synchronization
* online presence
* unread counters
* chat persistence

Messages update instantly without requiring refreshes, creating a smooth and responsive messaging experience similar to modern commercial messaging apps.

---

### Phone Number Authentication

Authentication is fully based on phone numbers and OTP verification.

Features:

* phone number login
* country code support
* OTP verification
* persistent JWT sessions
* secure authentication flow
* WhatsApp-style onboarding

Users authenticate using their mobile number instead of email/password credentials, creating a more natural messaging-first onboarding flow.

---

### Offline-First Messaging System

One of the core features of HybridMesh is its offline-first communication architecture.

When internet connectivity becomes unavailable:

* outgoing messages are stored locally
* messages are marked as pending
* synchronization automatically resumes later
* message ordering is preserved
* retry logic runs automatically

This allows users to continue interacting with the app even in unstable network conditions.

---

### Hybrid Online / Offline Communication

HybridMesh intelligently switches communication modes based on network availability.

#### Online Mode

When internet is available:

* messages use Socket.IO
* realtime cloud synchronization occurs
* instant delivery is enabled

#### Offline Mode

When internet is unavailable:

* messages enter local relay queue
* store-and-forward architecture activates
* local synchronization handles persistence
* relay simulation system handles delivery abstraction

The transition between modes is automatic and seamless.

---

### Mesh Relay Architecture

HybridMesh introduces a relay-based communication architecture inspired by decentralized mesh networking systems.

Features include:

* nearby peer abstraction
* relay packet simulation
* message propagation system
* packet routing
* duplicate prevention
* TTL-based forwarding
* offline synchronization

This architecture prepares the application for future Bluetooth/WiFi Direct mesh communication support.

---

### Contact Discovery

The app integrates with device contacts using Expo Contacts.

Features:

* fetch phone contacts
* detect registered users
* start chats instantly
* search synced contacts
* invite non-registered users
* WhatsApp-style contact discovery

Users can immediately discover and communicate with people already using the platform.

---

### Stories / Status System

HybridMesh includes a temporary status-sharing system inspired by modern messaging apps.

Features:

* image/video stories
* 24-hour expiration
* story reactions
* viewer tracking
* smooth story transitions
* modern status viewer UI

---

### Group Chats

Users can create and manage realtime groups.

Features:

* create groups
* add/remove members
* group admins
* group descriptions
* realtime group messaging
* media sharing
* notifications
* emergency communication groups

---

### Voice Notes & Media Sharing

The app supports modern media communication features.

Features:

* voice notes
* image sharing
* video sharing
* file uploads
* media previews
* upload progress indicators
* offline-safe uploads
* local media caching

---

### Emergency Communication Mode

HybridMesh includes a dedicated emergency communication system designed for unstable network environments.

Features:

* emergency channels
* priority messages
* offline-safe communication
* relay propagation
* emergency group architecture

This system is inspired by disaster communication platforms and resilient networking concepts.

---

## Tech Stack

### Frontend

* Expo
* React Native
* TypeScript
* Expo Router
* NativeWind
* Zustand
* React Query
* Reanimated
* Socket.IO Client

### Backend

* Node.js
* Express
* PostgreSQL
* Prisma ORM
* Socket.IO

### Expo APIs

* Expo Contacts
* Expo Notifications
* Expo AV
* Expo SecureStore
* Expo FileSystem
* Expo Image
* Expo Haptics

---

## Project Structure

```bash id="ecgxrk"
app/
components/
features/
services/
hooks/
store/
utils/
constants/
types/

backend/
  src/
    controllers/
    routes/
    services/
    middleware/
    prisma/
    sockets/
```

---

## Installation

### Frontend

```bash id="v8ngyj"
npm install
npx expo start
```

### Backend

```bash id="d7nb0g"
cd backend
npm install
npx prisma migrate dev
npm run dev
```

---

## Environment Variables

### Frontend

```env id="c61o8r"
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_SOCKET_URL=
```

### Backend

```env id="n6r2h7"
DATABASE_URL=
JWT_SECRET=
PORT=
```

---

## Core Architecture

### Online Messaging

```text id="qmxz6j"
User → Socket.IO → Server → Receiver
```

### Offline Messaging

```text id="m5wq95"
User → Nearby Relay → Nearby Relay → Receiver
```

Messages automatically synchronize once internet connectivity becomes available again.

---

## UI & Design Philosophy

HybridMesh follows a modern premium dark communication aesthetic inspired by:

* WhatsApp
* Signal
* Telegram
* futuristic cyberpunk interfaces

The UI focuses on:

* smooth animations
* premium transitions
* clean typography
* immersive chat experience
* responsive layouts
* communication-focused UX
* modern dark theme

---

## Current Status

Active development.

Planned future improvements:

* real Bluetooth mesh networking
* WiFi Direct communication
* voice/video calling
* stronger end-to-end encryption
* offline maps
* AI-based relay optimization
* decentralized networking improvements

---

## Vision

HybridMesh aims to push messaging beyond traditional internet limitations by combining:

* realtime cloud communication
* resilient offline-first architecture
* decentralized relay systems
* modern messaging UX

The goal is to create a communication platform capable of functioning reliably even in unstable or disconnected environments.

---

## License

MIT
#   H y b r i d M e s h  
 