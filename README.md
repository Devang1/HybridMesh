# HybridMesh

HybridMesh is a next-generation hybrid messaging platform built with Expo + React Native that combines realtime cloud messaging with offline-first mesh communication architecture.

The platform is designed to work seamlessly in both connected and disconnected environments.

When internet access is available, HybridMesh behaves like a modern realtime messaging app using Socket.IO and cloud synchronization.

When connectivity is lost, the app automatically switches to an offline relay-based communication system that stores, forwards, and synchronizes messages once the network becomes available again.

The project focuses on creating a resilient communication system inspired by modern messaging platforms like WhatsApp, Signal, and Telegram while introducing futuristic offline communication concepts commonly used in disaster communication systems and decentralized networking.

HybridMesh is built with a strong focus on:
- realtime communication
- offline-first architecture
- modern messaging UX
- secure communication
- scalable backend systems
- smooth animations
- premium mobile UI
- future-ready mesh networking support

---

## Preview

- Realtime messaging
- Phone number OTP authentication
- WhatsApp-style chat experience
- Offline-first architecture
- Automatic message synchronization
- Contact syncing
- Stories / status updates
- Group chats
- Voice notes
- Emergency communication mode
- Mesh relay simulation
- Premium dark UI
- Modern animations & transitions

---

## Features

### Realtime Messaging

HybridMesh supports modern realtime communication using Socket.IO.

Features include:
- instant one-to-one messaging
- realtime group chats
- typing indicators
- read receipts
- delivery states
- replies & reactions
- message synchronization
- online presence
- unread counters
- chat persistence

Messages update instantly without requiring refreshes, creating a smooth and responsive messaging experience similar to modern commercial messaging apps.

---

### Phone Number Authentication

Authentication is fully based on phone numbers and OTP verification.

Features:
- phone number login
- country code support
- OTP verification
- persistent JWT sessions
- secure authentication flow
- WhatsApp-style onboarding

Users authenticate using their mobile number instead of email/password credentials, creating a more natural messaging-first onboarding flow.

---

### Offline-First Messaging System

One of the core features of HybridMesh is its offline-first communication architecture.

When internet connectivity becomes unavailable:
- outgoing messages are stored locally
- messages are marked as pending
- synchronization automatically resumes later
- message ordering is preserved
- retry logic runs automatically

This allows users to continue interacting with the app even in unstable network conditions.

---

### Hybrid Online / Offline Communication

HybridMesh intelligently switches communication modes based on network availability.

#### Online Mode

When internet is available:
- messages use Socket.IO
- realtime cloud synchronization occurs
- instant delivery is enabled

#### Offline Mode

When internet is unavailable:
- messages enter local relay queue
- store-and-forward architecture activates
- local synchronization handles persistence
- relay simulation system handles delivery abstraction

The transition between modes is automatic and seamless.

---

### Mesh Relay Architecture

HybridMesh introduces a relay-based communication architecture inspired by decentralized mesh networking systems.

Features include:
- nearby peer abstraction
- relay packet simulation
- message propagation system
- packet routing
- duplicate prevention
- TTL-based forwarding
- offline synchronization

This architecture prepares the application for future Bluetooth/WiFi Direct mesh communication support.

---

## Tech Stack

### Frontend

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind
- Zustand
- React Query
- Reanimated
- Socket.IO Client

### Backend

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Socket.IO

---

## Installation

### Frontend

```bash
npm install
npx expo start