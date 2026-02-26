<!-- # Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions. -->

<!-- ============================================================ -->

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
├── index.tsx
├── courses.tsx
├── my-courses.tsx
├── bookmarks.tsx
├── [id].tsx
│
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
│
├── profile/
│   └── index.tsx
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
npx expo start
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
