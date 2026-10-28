# Kalinga (KalingaApp)

> **Isang Makabagong Katuwang sa Kalusugan at Pag-aaruga**  
> An assistive, dual-mode eldercare and wellness mobile application built with React Native and Expo, bridging Filipino senior citizens (*mga nakatatanda*) and their caretakers (*mga tagapag-alaga*).

---

## Overview

**Kalinga** (from the Filipino word meaning *to care* or *to nurture*) is designed to empower senior citizens to monitor their health and access essential government benefits with dignity and ease, while giving caretakers and family members real-time oversight and communication tools to ensure their loved ones are safe, healthy, and supported.

The app features an adaptive, senior-first user interface tailored for elderly users, including Filipino text-to-speech guidance, idle detection walkthroughs, dynamically scaling touch targets, and Tagalog language support.

---

## Key Features

### Senior Mode (*Para sa mga Nakatatanda*)
- **Tagalog-First, Accessible Interface**: Clear, high-contrast layouts designed specifically for ease of use by seniors.
- **Adaptive Touch Controls (`AdaptiveButton`)**: Button component that detects repeated missed taps and automatically scales up in size to improve accessibility.
- **Voice-Guided Walkthroughs (Text-to-Speech)**: Interactive, step-by-step app guides powered by `react-native-copilot` and `expo-speech` with native Tagalog voice narration.
- **Inactivity / Idle Assistance (`IdleManager`)**: Detects when a senior is hesitant or inactive on a screen and proactively launches guided walkthroughs.
- **Dynamic Font Resizing**: Customizable text scaling (Normal, Large, Extra Large) via persistent accessibility settings.
- **Kalusugan (Health Monitoring)**: Clear records of vital signs including Blood Pressure (Systolic/Diastolic) and Blood Sugar levels.
- **Mga Gamot (Medication Tracker)**: Schedules and reminders for daily prescriptions and dosages.
- **Serbisyo ng Gobyerno (Government Services)**:
  - **SSS Pension**: View status and submit pension applications.
  - **PhilHealth**: Access senior health benefits and coverage details.
  - **DSWD**: Information and assistance programs for indigent senior citizens.
- **Pamilya (Family Hub)**: Keep linked family members and caretakers within immediate reach.
- **Emergency SOS**: Quick one-touch distress alert that instantly notifies registered caretakers.

---

### Caretaker Mode (*Para sa mga Tagapag-alaga*)
- **Elder Linking and Management**: Pair with senior accounts via user ID or name search, with request approval workflows.
- **Remote Health Monitoring**: Log and track seniors' vital signs with instant notifications sent to the elder's device.
- **Medication Scheduling**: Add, edit, and organize medication regimens, dosages, and administration times.
- **Doctor and Clinic Appointments**: Schedule medical consultations and clinic visits with automated alerts.
- **Family Contacts**: Coordinate with other family members and primary contacts.
- **Real-Time Notifications**: Instant updates when seniors log entries, acknowledge medications, or trigger emergency alerts.

---

## Technology Stack

| Category | Technology |
|---|---|
| **Framework** | [React Native](https://reactnative.dev/) (v0.81.5) with [Expo SDK 54](https://expo.dev/) |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation, New Architecture enabled) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (~5.9.2) |
| **Backend and Database** | [Firebase](https://firebase.google.com/) v12 (Authentication, Cloud Firestore, AsyncStorage Persistence) |
| **Assistive and Audio** | `expo-speech` (Tagalog TTS), `react-native-copilot` (guided tours), Custom Inactivity Detection |
| **UI and Styling** | `@expo/vector-icons` (Ionicons, FontAwesome5, MaterialCommunityIcons), `expo-linear-gradient`, `react-native-reanimated` |
| **Storage and State** | `@react-native-async-storage/async-storage`, React Context API |

---

## Project Structure

```text
kalinga-app/
├── app/                              # Expo Router routes and screens
│   ├── _layout.tsx                   # App root provider and copilot layout
│   ├── index.tsx                     # Entry redirect to role selection
│   ├── role-selection.tsx            # Dual-mode switch (Senior vs Caretaker)
│   ├── welcome-*.tsx                 # Role-specific onboarding
│   ├── login-*.tsx / register-*.tsx  # Role-specific authentication
│   ├── dashboard-senior.tsx          # Senior central dashboard
│   ├── dashboard-caretaker.tsx       # Caretaker central console
│   ├── dashboard-kalusugan.tsx       # Health vitals view
│   ├── dashboard-mga-gamot.tsx       # Medication management
│   ├── dashboard-presyon.tsx         # Blood pressure monitor
│   ├── dashboard-appointment.tsx     # Medical appointment listings
│   ├── dashboard-serbisyo.tsx        # Government agency portal menu
│   ├── dashboard-pamilya.tsx         # Family contact directory
│   ├── dashboard-settings.tsx        # Accessibility and text-scaling settings
│   ├── emergency.tsx                 # Emergency SOS alert screen
│   ├── sss-pension.tsx               # SSS Pension application and status
│   ├── philhealth.tsx                # PhilHealth benefits and guidance
│   ├── dswd.tsx                      # DSWD social pension and programs
│   ├── caretaker-elder.tsx           # Caretaker-senior connection management
│   ├── caretaker-add-medication.tsx  # Add medication prescription
│   ├── caretaker-schedule-*.tsx      # Schedule appointments and doses
│   └── caretaker-add-reading.tsx     # Record blood pressure / sugar readings
├── components/                       # Reusable UI and assistive components
│   ├── AdaptiveButton.tsx            # Miss-click detecting, auto-scaling button
│   ├── ContextualHelpTooltip.tsx     # Custom Copilot tooltip with TTS narration
│   ├── IdleManager.tsx               # Inactivity manager triggering walkthroughs
│   ├── themed-text.tsx               # Theme-aware text components
│   └── themed-view.tsx               # Theme-aware view components
├── configs/                          # Service configuration
│   └── firebase.ts                   # Firebase App, Auth and Firestore initialization
├── constants/                        # Theme colors and styles
│   └── theme.ts                      # Color palettes and visual constants
├── contexts/                         # React Contexts
│   └── SettingsContext.tsx           # Global font scaling and accessibility provider
├── hooks/                            # Custom React hooks
│   ├── useIdle.ts                    # User inactivity timer hook
│   └── use-color-scheme.ts           # Color scheme detection hook
├── services/                         # Firebase Firestore services
│   ├── auth.ts                       # Sign in, sign up, role management
│   ├── vitals.ts                     # Vitals recording and real-time listening
│   ├── medication.ts                 # Medication schedule CRUD
│   ├── appointment.ts                # Doctor appointment scheduler
│   ├── connection.ts                 # Elder-caretaker connection requests
│   ├── family.ts                     # Family members directory
│   ├── notification.ts               # In-app push / alerts
│   ├── sss.ts                        # SSS Pension claim service
│   └── mockGovApi.ts                 # Government API simulation service
├── app.json                          # Expo project configuration
└── package.json                      # Project metadata and dependencies
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) on your physical mobile device (Android / iOS) or an active Emulator/Simulator

### 1. Clone the Repository

```bash
git clone https://github.com/urixqt22/kalinga-app.git
cd kalinga-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

The project utilizes Firebase for authentication and database management. Configuration details are loaded in `configs/firebase.ts`. Ensure your Firebase project has:
- **Authentication**: Email/Password sign-in enabled.
- **Cloud Firestore**: Database created with read/write security rules appropriate for your environment.

### 4. Start the Application

```bash
npx expo start
```

Once the Metro bundler starts:
- Scan the QR code using the **Expo Go** app on Android or the Camera app on iOS.
- Press `a` in the terminal to launch on an Android emulator.
- Press `i` to launch on an iOS simulator.
- Press `w` to run on web.

---

## Accessibility Features

- **Adaptive Touch Target Scaling (`AdaptiveButton`)**:  
  Elderly individuals with tremors or diminished fine motor control often miss touchscreen buttons by a few pixels. `AdaptiveButton` listens for touches in an expanded boundary around the button. If repeated misses are detected, it dynamically enlarges the button with smooth spring animations.
- **Filipino Text-To-Speech (`expo-speech`)**:  
  All interactive walkthrough steps automatically query available Tagalog/Filipino voice models on the device to speak instructions out loud, assisting seniors with low vision or reading fatigue.
- **Inactivity Prompting (`IdleManager`)**:  
  When a senior pauses on any key dashboard screen without tapping for a period of time, the app initiates an interactive tutorial to guide them to the next action.

---

## License

This project is licensed under the terms specified by the repository maintainers.
