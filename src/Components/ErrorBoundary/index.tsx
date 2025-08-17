import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNRestart from "react-native-restart";

interface IErrorBoundaryState {
  isError: boolean;
  error: any;
  errorInfo: any;
  isCollapse: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, IErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = {
      isError: false,
      error: null,
      errorInfo: null,
      isCollapse: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      isError: true,
      error: error,
      errorInfo: errorInfo,
    });
  }

  private onClickReloadApp = async () => {
    RNRestart.Restart();
  };

  public render() {
    if (this.state.isError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <Text style={styles.title}>Lỗi không mong muốn</Text>
            <Text style={styles.subtitle}>
              Đã xảy ra lỗi không mong muốn. Vui lòng khởi động lại ứng dụng.
            </Text>
            <TouchableOpacity style={styles.button} onPress={this.onClickReloadApp}>
              <Text style={styles.buttonText}>Khởi động lại</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
