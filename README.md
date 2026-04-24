# Tactical Monitor

A tactical monitoring application built with [Expo](https://expo.dev) and React Native.

---

## 📁 Adding Film Assets

All video files must be placed in the **`assets/`** folder at the root of the project before running the app.

```
tactical-monitor/
└── assets/
    ├── your-film-1.mp4
    ├── your-film-2.mp4
    └── ...
```

> **Important:** Make sure your video files are referenced correctly in the code. The app reads media files directly from the `assets/` directory. Without the required film files present, video playback will not work.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine
- An IDE (e.g. [VS Code](https://code.visualstudio.com/), [WebStorm](https://www.jetbrains.com/webstorm/))
- The **Expo Go** app installed on your mobile device:
  - [Expo Go for iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779)
  - [Expo Go for Android (Google Play)](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 1. Install Dependencies

Open the project in your IDE and run the following in the terminal:

```bash
npm install
```

### 2. Start the Development Server

From your IDE's terminal, run:

```bash
npx expo start
```

This will launch the Expo development server and display a **QR code** in your terminal.

### 3. Open on Your Device

- Open the **Expo Go** app on your phone.
- Scan the QR code shown in the terminal.
- The app will load on your device.

> **Note:** Your phone and development machine must be connected to the **same Wi-Fi network** for Expo Go to connect.

---

## 🛠 Troubleshooting

| Issue | Solution |
|---|---|
| App won't load | Ensure your phone and computer are on the same Wi-Fi network |
| Video not playing | Check that your film files are present in the `assets/` folder |
| Dependencies missing | Run `npm install` again from the project root |
| Expo command not found | Run `npm install -g expo-cli` or use `npx expo start` |
