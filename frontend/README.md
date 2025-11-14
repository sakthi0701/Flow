# Life Scheduler Frontend

This is the React Native mobile frontend for the Life Scheduler application.

## Project Structure

- [App.tsx](App.tsx) - Main application component
- [app/](app/) - Expo Router pages
- [components/](components/) - Reusable UI components
- [src/](src/) - Main source code
  - [screens/](src/screens/) - Screen components
  - [components/](src/components/) - Feature-specific components
  - [services/](src/services/) - API service layer
- [assets/](assets/) - Images and other static assets
- [constants/](constants/) - Application constants
- [hooks/](hooks/) - Custom React hooks
- [types/](types/) - TypeScript type definitions

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npx expo start
   ```

3. Follow Expo's instructions to run on iOS, Android, or Web.

## Available Scripts

- `npx expo start` - Start the development server
- `npx expo start --android` - Run on Android emulator/device
- `npx expo start --ios` - Run on iOS simulator
- `npx expo start --web` - Run in web browser
- `npm run lint` - Run ESLint

## Testing

Run tests with:
```
npm test
```