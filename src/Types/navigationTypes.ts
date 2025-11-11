import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp } from "@react-navigation/native";
import { ROOT_STACK, MAIN_TAB_STACK } from "@Constants";
import { Review } from "@Screens/Main/Movie/Components/MovieReview";

// Root Stack Param List
export type RootStackParamList = {
  [ROOT_STACK.MAIN]: undefined;
  Login?: any;
  Register: undefined;
  ForgotPassword: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  BlogDetail: {
    id: number;
    slug: string;
  };
  MovieList: {
    type: string;
    title: string;
    emptyText: string;
  };
  MovieDetail: { id: string; slug: string };
  MovieShowtime: { movieId: number; movieName: string; slug: string };
  SelectSeat: {
    showtimeId: number;
    cinema: number;
    auditorium: number;
    time: string;
    date: string;
    format: string;
    slug: string;
  };
  AdditionalService: undefined;
  TicketConfirm: undefined;
  PaymentWebView: {
    paymentUrl: string;
  };
  MovieRating: {
    movieId: number;
    movieName: string;
    reviews: Review[];
  };
};

// Main Tab Param List
export type MainTabParamList = {
  [MAIN_TAB_STACK.HOME]: undefined;
  [MAIN_TAB_STACK.BOOKING]: undefined;
  [MAIN_TAB_STACK.NEWS]: undefined;
  [MAIN_TAB_STACK.PROFILE]: undefined;
};

// Navigation Props
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type MainTabNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
