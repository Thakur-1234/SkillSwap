# 🌟 SkillSwap - React Native Mobile App

[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge\&logo=react)](https://reactnative.dev/) [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge\&logo=firebase)](https://firebase.google.com/) [![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge\&logo=expo)](https://expo.dev/) [![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/YourUsername/SkillSwap)

---

## 📖 Overview

**SkillSwap** is a modern, **real-time skill exchange platform** built for mobile using **React Native + Firebase**. Users can **post their skills**, **browse others’ skills**, **send requests**, and **chat in real-time**, all within a clean, interactive, and colorful interface.

💡 **Goal:** Connect people, encourage skill-sharing, and make learning/collaboration seamless.

---

## 🎯 Key Features

### 1️⃣ User Authentication

* ✅ **Email & Password Login/Signup** with Firebase Authentication.
* ✅ Unique **UID-based user tracking** for security.
* ✅ Users can set **display names**.

---

### 2️⃣ Skill Posting

* 🛠️ Post skills or services with:

  * Type (Coding, Design, Tutoring, etc.)
  * Title & Description
  * Timestamp
* 🌟 Skill feed visible to all users.
* 🧩 Clean **card-style layout** for each skill.

---

### 3️⃣ Requests Management

* 📩 Send requests for skills/services.
* ⚠️ Prevent sending duplicate requests.
* ❌ Users cannot request their own posts.
* 🔔 Local notifications when a request is sent.
* ✅ Real-time status updates: `pending`, `accepted`, `rejected`.
* 🖌 Color-coded statuses:

  * 🟡 Pending
  * 🟢 Accepted
  * 🔴 Rejected

---

### 4️⃣ Real-Time Chat System

* 💬 One-to-one chat for accepted skill swaps.
* 🕒 Shows sender, message, and timestamp.
* 📝 Messages visually distinguished by sender:

  * You → Blue
  * Other user → Gray
* 🖌 Smooth UI with:

  * Rounded messages
  * Keyboard avoiding input
  * Scrollable FlatList
  * Modern color theme

---

### 5️⃣ Chats List

* 📂 All active chats displayed in a **list**:

  * Name of the other user
  * Last message preview
  * Timestamp
* Minimalistic, **colorful cards** without avatars (optional for simplicity).
* Real-time updates with caching.

---

### 6️⃣ Empty States

* 🌈 Friendly messages when no data is present.
* Features:

  * Emoji icon for visual feedback
  * Heading and subtitle
* Used in:

  * Chats
  * Requests
  * Skills feed

---

### 7️⃣ Realtime Data Updates

* 🔄 Firestore for instant updates:

  * Requests
  * Chat messages
  * Skill posts
* ⚡ Optimized with **local caching** to reduce unnecessary requests.

---

### 8️⃣ Notifications

* 🔔 Local notifications for:

  * New requests
  * Updates in request status
* Works even when the user is **not on the app screen**.

---

### 9️⃣ Modern UI/UX

* 🎨 Soft color palette: `#f0f9ff`, `#e0f2fe`, `#1e3a8a`.
* 🖌 Rounded cards, padding, and subtle shadows.
* ⚡ Responsive FlatList layouts.
* 🌟 Clean, intuitive interface with **minimalistic design**.

---

### 1️⃣0️⃣ Security

* 🔒 Firestore rules to ensure **authorized access**:

  * Users can only view their chats/requests.
  * Only participants can access the content.
* UID-based secure filtering.

---

## 🚀 Tech Stack

| Layer            | Technology                                                                             |
| ---------------- | -------------------------------------------------------------------------------------- |
| Frontend         | React Native + Expo                                                                    |
| Backend          | Firebase Firestore & Authentication                                                    |
| Notifications    | React Native Local Notifications                                                       |
| State Management | React Hooks (`useState`, `useEffect`, `useCallback`)                                   |
| UI Libraries     | `react-native-gesture-handler`, `react-native-reanimated`, `react-native-vector-icons` |

---

## 🖥️ Screens & Navigation

1. **Login/Signup**
2. **Home/Skill Feed** - Browse available skills
3. **Skill Post Screen** - Create and share skills
4. **Requests Screen** - Sent/received requests management
5. **Chats Screen** - List of active chats
6. **Chat Room Screen** - Real-time messaging
7. **Empty States** - Friendly feedback

---

## 🔮 Future Enhancements

* 👤 Full **user profiles** with bio, skills, and rating system.
* 📍 **Search & filter skills** by category or location.
* ✨ **Swipe-to-manage requests** (accept/reject with animation).
* 📲 **Push notifications** integration for better engagement.
* 🎨 Dark mode theme option.

---

## 💻 How to Run Locally

1. **Clone Repository**

```bash
git clone https://github.com/YourUsername/SkillSwap.git
```

2. **Install dependencies**

```bash
cd SkillSwap
npm install
```

3. **Start Expo Server**

```bash
npx expo start
```

4. **Configure Firebase**

* Replace `/config/firebase.js` with your Firebase project details.

---

## 🏆 Why SkillSwap is Unique

* ✅ Real-time skill sharing platform.
* ✅ Interactive and **colorful UI** for better user experience.
* ✅ Fully **React Native + Firebase powered**, cross-platform ready.
* ✅ Optimized **caching & performance** for large datasets.
* ✅ Focused on **learning, collaboration, and productivity**.

---

## 🎨 Badges & Status

* ![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge\&logo=react)
* ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge\&logo=firebase)
* ![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge\&logo=expo)
* ![Version](https://img.shields.io/badge/version-1.0.0-blue)

