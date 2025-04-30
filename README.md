<p align="center">
  <img src="https://raw.githubusercontent.com/bhi049/MealBuddy/master/assets/MealBuddy-logo%202.png"     alt="MealBuddy Logo" width="300"/>
</p>

---

MealBuddy is a mobile application designed to help users discover, save, and manage recipes. It is ideal for food enthusiasts who want to explore new recipes, organize their favorite meals, and personalize their culinary experience. The app provides a seamless experience with features like recipe discovery, meal saving, and user profile customization.

---

## 📸 Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/bhi049/MealBuddy/master/assets/loginpage.png" alt="Login Page" width="250"/>
</p>

---

## ✨ Features

- **🔍 Discover Recipes**: Browse random recipes fetched from TheMealDB API.
- **🔎 Search Recipes**: Search for recipes by name and view detailed instructions and ingredients.
- **💾 Save Recipes**: Save favorite recipes to your profile for easy access.
- **👤 User Profiles**: Customize your profile with an avatar, bio, and personal details.
- **🎨 Theming**: Toggle between light and dark modes for a personalized user experience.
- **🔐 Authentication**: Secure login and signup using email and password via Supabase.
- **⚙️ Account Settings**: Manage account preferences, including theme and profile details.

---

## 🧰 Tech Stack

- **Frontend**: React Native, Expo
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Backend**: Supabase (authentication, database, and storage)
- **APIs**: TheMealDB API
- **Styling**: React Native StyleSheet
- **Other Libraries**:
  - `@react-native-async-storage/async-storage`
  - `@react-native-community/datetimepicker`
  - `@expo/vector-icons`
  - `axios`
  - `base64-arraybuffer`

---

## 📁 Folder Structure

```
MealBuddy/
├── assets/                # Static assets like images and icons
├── components/            # Reusable UI components (e.g., RecipeCard)
├── constants/             # App-wide constants (e.g., themes)
├── hooks/                 # Custom React hooks (e.g., useTheme, useAuth)
├── navigation/            # Navigation setup (e.g., MainNavigator)
├── screens/               # Individual screens for the app
├── ios/                   # iOS-specific files and configurations
├── .env                   # Environment variables (e.g., Supabase keys)
├── App.js                 # Main app entry point
├── supabase.js            # Supabase client setup
├── package.json           # Project dependencies and scripts
```

---

## ⚙️ Installation Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/MealBuddy.git
   cd MealBuddy
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=<your-supabase-url>
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

4. **Run the App**:
   - Run:
     ```bash
     npx expo start
     ```
---

## 🔐 Environment Variables

The app requires the following environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`: The Supabase project URL.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: The Supabase anonymous key.

---

## 📱 Screens / Navigation

The app uses a combination of stack and tab navigators. Below is an overview of the screens:

1. **🔑 Login Screen**: Handles user authentication (login/signup).
2. **🧭 Discover Screen**: Displays random recipes fetched from TheMealDB API.
3. **🔍 Search Screen**: Allows users to search for recipes by name.
4. **📄 Meal Detail Screen**: Shows detailed information about a selected recipe.
5. **👤 Profile Screen**: Displays user profile and saved recipes.
6. **✏️ Edit Profile Screen**: Allows users to update their profile details.
7. **⚙️ Account Settings Screen**: Provides options to manage account preferences.

---

## 🎨 Theming or Styling

The app supports light and dark themes, managed using a custom `useTheme` hook. Themes are defined in [`constants/theme.js`](constants/theme.js) and include properties like `background`, `text`, `accent`, and `inputBackground`. Users can toggle the theme in the account settings.

---

## 🔐 Authentication

Authentication is handled via Supabase using email and password. Key features include:

- **📝 Signup**: Users can create an account with email and password.
- **🔓 Login**: Existing users can log in securely.
- **🔄 Session Management**: The app listens for authentication state changes and updates the user context accordingly.

---
