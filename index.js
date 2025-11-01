/**
 * @format
 */

import { AppRegistry, LogBox } from "react-native";
import "react-native-screens";
import App from "./App";
import { name as appName } from "./app.json";

if (__DEV__) {
  LogBox.ignoreAllLogs(true);
  
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("useInsertionEffect") ||
        message.includes("must not schedule updates"))
    ) {
      return;
    }
    originalWarn(...args);
  };
  
  console.error = (...args) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("useInsertionEffect") ||
        message.includes("must not schedule updates"))
    ) {
      return;
    }
    originalError(...args);
  };
}

AppRegistry.registerComponent(appName, () => App);
