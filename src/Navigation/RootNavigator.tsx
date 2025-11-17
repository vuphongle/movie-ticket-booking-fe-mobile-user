import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROOT_STACK } from "@Constants";
import { RootStackParamList } from "@Types/navigationTypes";
import TabNavigator from "./TabNavigator";
import { LoginScreen, RegisterScreen, EditProfileScreen, ChangePasswordScreen } from "@Screens";
import ForgotPasswordScreen from "@Screens/Auth/ForgotPasswordScreen";
import { OrderHistoryScreen } from "@Screens/Main/Profile/OrderHistoryScreen";
import BlogDetailScreen from "@Screens/Main/BlogDetail/BlogDetailScreen";
import MovieListScreen from "@Screens/Main/Movie/MovieListScreen";
import MovieDetailScreen from "@Screens/Main/Movie/MovieDetailScreen";
import MovieShowtime from "@Screens/Main/Movie/Components/MovieShowtime";
import MovieRatingScreen from "@Screens/Main/Movie/MovieRatingScreen";
import SelectSeatScreen from "@Screens/Main/Booking/SelectSeat/SelectSeatScreen";
import AdditionalServiceScreen from "@Screens/Main/Booking/AdditionalService/AdditionalServiceScreen";
import TicketConfirmScreen from "@Screens/Main/Booking/TicketConfirm/TicketConfirmScreen";
import CinemaShowtimeScreen from "@Screens/Main/Booking/QuickBooking/CinemaShowtimeScreen";
import PaymentWebViewScreen from "@Screens/Main/Payment/PaymentWebViewScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  initialRouteName?: keyof RootStackParamList;
}

const RootNavigator = ({ initialRouteName = ROOT_STACK.MAIN }: RootNavigatorProps) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 200,
      }}
    >
      <Stack.Screen
        name={ROOT_STACK.MAIN}
        component={TabNavigator}
        options={{
          animation: "fade",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="BlogDetail"
        component={BlogDetailScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />

      <Stack.Screen
        name="MovieList"
        component={MovieListScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />

      <Stack.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="MovieRating"
        component={MovieRatingScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />

      <Stack.Screen
        name="MovieShowtime"
        component={MovieShowtime}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />

      <Stack.Screen
        name="SelectSeat"
        component={SelectSeatScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />

      <Stack.Screen
        name="AdditionalService"
        component={AdditionalServiceScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="TicketConfirm"
        component={TicketConfirmScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="PaymentWebView"
        component={PaymentWebViewScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
      <Stack.Screen
        name="CinemaShowtime"
        component={CinemaShowtimeScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 300,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
