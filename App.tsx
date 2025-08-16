import React from 'react';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {ErrorBoundary} from '@Components/ErrorBoundary';
import {Routes} from '@Navigation';
import '@Locales';

// Enable screens for better navigation performance
enableScreens();

export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
