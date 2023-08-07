import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../screens/WelcomeScreen';
import Routes from '../navigation/appNavigation';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SettingScreen from '../screens/SettingScreen';
import InterestScreen from '../screens/InterestScreen';
import ProfilModificationScreen from '../screens/ProfilModificationScreen';
import AboutScreen from '../screens/AboutScreen';
import AssistanceScreen from '../screens/AssistanceScreen';
import LanguageScreen from '../screens/LanguageScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import TermsScreen from '../screens/TermsScreen';
import EventInformationScreen from '../screens/EventInformationScreen';
import BookTicketScreen from '../screens/BookTicketScreen';
import CodePasswordScreen from '../screens/CodePasswordScreen';
import EventScreen from '../screens/EventScreen';
import TicketScreen from '../screens/TicketScreen';
import BraceletScreen from '../screens/BraceletScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '../constants/theme';

const Stack = createStackNavigator();

const Navigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [compte, setCompte] = useState(null);
  const [cookieEmail, setCookieEmail] = useState(null);

  useEffect(() => {
    // Simulate AsyncStorage getItem with a timeout (replace this with actual AsyncStorage calls)
    setTimeout(() => {
      AsyncStorage.getItem('compte').then((compteValue) => {
        setCompte(compteValue);
        setIsLoading(false);
      });

      AsyncStorage.getItem('cookieEmail').then((cookieEmailValue) => {
        setCookieEmail(cookieEmailValue);
      });
    }, 1000); // Simulated 1-second delay
  }, []); // Empty dependency array to run the effect once

  if (isLoading) {
    // Show loading spinner or splash screen while data is fetched
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={COLORS.gray} size={100} />
    </View>
      );
  }
   
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
       {compte === null ? (
          <Stack.Screen
            name="WelcomeScreen1"
            component={WelcomeScreen}
            options={{
              ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
          />
        ) : cookieEmail === null ? (
          <Stack.Screen
            name="LoginScreen1"
            component={LoginScreen}
            options={{
              ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
          />
        ) : (
          <Stack.Screen
            name="Home1"
            component={Routes}
            options={{
              ...TransitionPresets.SlideFromRightIOS,
            }}
          />
        )}
        <Stack.Screen
          name="Home"
          component={Routes}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{
              ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
          />
          <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name="SettingScreen"
          component={SettingScreen}
          options={{
            ...TransitionPresets.ScaleFromCenterAndroid,
          }}
        />
        <Stack.Screen
          name="InterestScreen"
          component={InterestScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Stack.Screen
          name="ProfilModificationScreen"
          component={ProfilModificationScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureDirection: 'horizontal-inverted'
          }}
        />
        <Stack.Screen
          name="AboutScreen"
          component={AboutScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureDirection: 'horizontal-inverted'
          }}
        />
        <Stack.Screen
          name="AssistanceScreen"
          component={AssistanceScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureDirection: 'horizontal-inverted'
          }}
        />
        <Stack.Screen
          name="LanguageScreen"
          component={LanguageScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureDirection: 'horizontal-inverted'
          }}
        />
        <Stack.Screen
          name="NewPasswordScreen"
          component={NewPasswordScreen}
          options={{
            ...TransitionPresets.ScaleFromCenterAndroid,
          }}
        />
        <Stack.Screen
          name="TermsScreen"
          component={TermsScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureDirection: 'horizontal-inverted'
          }}
        />
        <Stack.Screen
          name="EventInformationScreen"
          component={EventInformationScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Stack.Screen
          name="BookTicketScreen"
          component={BookTicketScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
            gestureDirection: 'horizontal-inverted'
          }}
        />
        <Stack.Screen
          name="CodePasswordScreen"
          component={CodePasswordScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <Stack.Screen
          name="EventScreen"
          component={EventScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
         <Stack.Screen
          name="TicketScreen"
          component={TicketScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
         <Stack.Screen
          name="BraceletSCreen"
          component={BraceletScreen}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>  
  );
};

export default Navigation;