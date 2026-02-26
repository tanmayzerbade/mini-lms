# 📚 Course Learning App (React Native + Expo)

A modern mobile learning platform built using **React Native, Expo Router, Zustand, and Secure Storage**.

This app allows users to register, log in, browse courses, enroll, bookmark, and manage their learning journey with user-specific persistent storage.

---

## 🚀 Features

### 🔐 Authentication
- User Login & Registration
- Token-based authentication
- Persistent login using Expo SecureStore
- Zustand state management

### 📖 Courses
- Fetch courses from API
- Dynamic course details screen (`[id].tsx`)
- Course metadata (level, duration, rating, price)

### 🎓 Enrollments
- Enroll in courses
- Stored securely per user
- "My Courses" screen
- Pull-to-refresh support

### 🔖 Bookmarks
- Bookmark / Unbookmark courses
- Stored per logged-in user
- Dedicated Bookmarks screen

### 👤 Profile
- Displays logged-in user information
- Profile image picker
- Logout functionality
- Navigation to My Courses & Bookmarks

### 🎨 UI Enhancements
- Password visibility toggle (Eye / EyeOff)
- Snackbar error handling
- Clean card-based layout
- Expo Router navigation

---

## 🛠 Tech Stack

- React Native
- Expo
- Expo Router
- Zustand (State Management)
- Expo Secure Store
- React Native Paper
- Lucide Icons
- Axios

---

## 📂 Project Structure (Simplified)

```
app/
│
├── courses.tsx
├── my-courses.tsx
├── bookmarks.tsx
├── [id].tsx
├── webview.tsx
├── _layout.tsx
│
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
|
├── (tabs)/
|    └──_layout.tsx
|    └── courses.tsx
|    └── home.tsx
|    └──profile.tsx
|
│
services/
├── api.ts
├── authService.ts
│
store/
└── useAuthStore.ts
│
utils/
└── secureStore.ts
```

---

## 🔐 Multi-User Data Handling

Bookmarks and enrollments are stored using **user-specific keys**:

```
bookmarks_<userId>
enrollments_<userId>
```

This ensures:
- Data isolation between accounts
- No shared bookmarks between users
- Proper multi-user support

---

## ⚙️ Installation & Setup

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start development server

```bash
npx expo start -c
```

---

## 📦 Building Android APK (Using EAS)

This project uses **Expo EAS Build**.

### First-time setup:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Build APK:

```bash
eas build -p android --profile preview
```

After the build completes:
- Download the APK from the Expo build link
- Install it on your Android device

---

## 🧠 Key Concepts Implemented

- Dynamic routing with Expo Router
- Typed route navigation (`/[id]`)
- Secure token storage
- Persistent authentication
- User-specific local storage architecture
- API error handling
- Production build configuration

---

## 📌 Future Improvements

- Move bookmarks/enrollments to backend
- Add course progress tracking
- Add search and filtering
- Add dark mode
- Improve animations and UI polish

---

## 👨‍💻 Author

Built as a learning project to demonstrate:
- Mobile app architecture
- Authentication flow
- Local persistence
- Clean navigation structure
- Production-ready Expo build
