import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import { useFonts } from "expo-font";
import * as ExpoSplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";
import SplashScreen from "./screens/splashScreen";
import OnboardingScreen from "./screens/onboarding/onboardingScreen";
import LoginScreen from "./screens/auth/loginScreen";
import RegisterScreen from "./screens/auth/registerScreen";
import VerificationScreen from "./screens/auth/verificationScreen";
import BottomTabBarScreen from "./components/bottomTabBarScreen";
import TaskDetailScreen from "./screens/taskDetail/taskDetailScreen";
import InviteMemberScreen from "./screens/inviteMember/inviteMemberScreen";
import NotificationScreen from "./screens/notification/notificationScreen";
import SearchScreen from "./screens/search/searchScreen";
import ProjectDetailScreen from "./screens/projectDetail/projectDetailScreen";
import ChatScreen from "./screens/chat/chatScreen";
import EditProfileScreen from "./screens/editProfile/editProfileScreen";
import TeamScreen from "./screens/team/teamScreen";
import CreateTeamScreen from "./screens/createTeam/createTeamScreen";
import PrivacyPolicyScreen from "./screens/privacyPolicy/privacyPolicyScreen";
import TermsAndConditionsScreen from "./screens/termsAndConditions/termsAndConditionsScreen";
import FaqScreen from "./screens/faq/faqScreen";
import AddNewScreen from "./screens/addNew/addNewScreen";
import AddNewMemberScreen from "./screens/teamMember/teamMemberScreen";
import TeamMemberList from "./screens/teamMember/teamMemberList";

ExpoSplashScreen.preventAutoHideAsync();

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  onLayoutRootView();

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Verification" component={VerificationScreen} />
          <Stack.Screen name="BottomTabBar" component={BottomTabBarScreen} />
          <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
          <Stack.Screen name="InviteMember" component={InviteMemberScreen} />
          <Stack.Screen name="AddNew" component={AddNewScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Team" component={TeamScreen} />
          <Stack.Screen name="TeamMember" component={AddNewMemberScreen} />
          {/* <Stack.Screen name="TeamMember" component={TeamMemberList} /> */}
          <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen
            name="TermsAndConditions"
            component={TermsAndConditionsScreen}
          />
          <Stack.Screen name="Faq" component={FaqScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default App;
