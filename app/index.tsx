import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';

import '../global.css';

export default function App() {
  return (
    <>
      <ScreenContent title="Home page for diary app" path="App.tsx"></ScreenContent>
      <StatusBar style="auto" />
    </>
  );
}
