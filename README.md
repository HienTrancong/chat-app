# CHAT-APP
![image](https://user-images.githubusercontent.com/89924593/198895894-9a49a362-730c-4fca-b085-cddc6384889a.png)
![image](https://user-images.githubusercontent.com/89924593/198895967-7283d6fc-1d6c-4aec-b464-dc1a91432945.png)

## Purpose

A chat app for mobile devices using React Native. The app will
provide users with a chat interface and options to share images and their
location.

## Key features

1. A page where users can enter their name and choose a background color for the chat screen before joining the chat.
2. A page displaying the conversation, as well as an input field and submit button.
3. The chat must provide users with two additional communication features: sending images and location data.
4. Data gets stored online and offline.

## Technologies

- Written in React Native.
- Developed using Expo.
- Chat conversations are stored in Google Firestore Database.
- App authenticates users anonymously via Google Firebase authentication.
- Chat conversations are stored locally.
- Users can pick and send images from the phone’s image library.
- Users can take pictures with the device’s camera app, and send them.
- Store images in Firebase Cloud Storage.
- The app can read the user’s location data.
- Location data is sent via the chat in a map view.
- The chat interface and functionality are created using the Gifted Chat library.
- Codebase contains comments.

## List of Dependencies
![image](https://user-images.githubusercontent.com/89924593/199111836-5a61a315-a3f1-433f-b98e-14df49c3fdcf.png)

## How to run project

First of all make sure Node and npm are available on your machine. To install node, visit:
https://nodejs.org/en/download/

1. Clone the repository

```
git clone https://github.com/HienTrancong/chat-app.git
```

2. Install Expo CLI as global npm package

```
npm install expo-cli --global
```

3. Install all dependecies using npm

```
npm install
```

4. Start project

```
expo start
```

5. Launch app on Expo app on mobile phone, or using Android emulator https://developer.android.com/studio/run/emulator
