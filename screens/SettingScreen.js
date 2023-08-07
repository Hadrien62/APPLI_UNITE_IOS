import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, Animated, Easing, TouchableWithoutFeedback, Linking, Platform } from 'react-native';
import { useNavigation, useIsFocused, CommonActions } from '@react-navigation/native';
import { COLORS, SIZES } from '.././constants/theme'
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonComponent from '../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SettingScreen = () => {
  // Navigation
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const onMenuPage = () => {
    navigation.navigate('Home');
  };

  // Transition Page
  const [profilAnimation] = useState(new Animated.Value(0));
  const [languageAnimation] = useState(new Animated.Value(0));
  const [assistanceAnimation] = useState(new Animated.Value(0));
  const [rateAnimation] = useState(new Animated.Value(0));
  const [termsAnimation] = useState(new Animated.Value(0));
  const [aboutAnimation] = useState(new Animated.Value(0));


  // Variables
  const [userInfo, setUserInfo] = useState('');


  const handlePress = (animation, page) => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate(page);
    });
  };

  const handlePress2 = (animation) => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      let appStoreURL;
      if (Platform.OS === 'android') {
        appStoreURL = 'https://play.google.com/store/apps/details?id=VOTRE_PACKAGE';
      } else if (Platform.OS === 'ios') {
        appStoreURL = 'https://apps.apple.com/us/app/Unitevent/6457516288';
      } else {
        return;
      }
      Linking.openURL(appStoreURL);
    });
  };

  const getAnimatedStyle = (animation) => {
    return {
      transform: [
        {
          translateX: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 15],
          }),
        },
      ],
    };
  };

  useEffect(() => {
    if (isFocused) {
      profilAnimation.setValue(0);
      languageAnimation.setValue(0);
      assistanceAnimation.setValue(0);
      rateAnimation.setValue(0);
      termsAnimation.setValue(0);
      aboutAnimation.setValue(0);
    }
  }, [isFocused]);

  {/* UseEffect */ }
  useEffect(() => {
    getUserInfo();
  }, []);

  {/* Fonction recup info users*/ }
  const getUserInfo = async () => {
    try {
      const userInfoData = await AsyncStorage.getItem('userInfo');
      if (userInfoData) {
        const userInfo = JSON.parse(userInfoData);
        const userInfoURL = `http://195.20.234.70:3000/connexion/${userInfo.email}`;
        var requestOptionsInfoUser = {
          method: "GET",
          redirect: "follow",
        };
        try {
          const response = await fetch(userInfoURL, requestOptionsInfoUser);
          const result = await response.json();
          setUserInfo(result);
          AsyncStorage.setItem('userInfo', JSON.stringify(result))
            .then(() => {
            })
            .catch((error) => {
            });
        } catch (error) {
        }
      }
    } catch (error) {
    }
  };

  // Animation Pop-up
  const [showPopup, setShowPopup] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const popupTypeRef = useRef('');

  const showPopUp = (type) => {
    setShowPopup(true);
    popupTypeRef.current = type;
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const hidePopUp = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setShowPopup(false));
  };

  const handleCancel = () => {
    hidePopUp();
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userInfo');
    hidePopUp();
    AsyncStorage.removeItem('cookieEmail').then(() => {
      AsyncStorage.removeItem('cookiePassword').then(() => {
        AsyncStorage.removeItem('bracelet').then(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
          );
        })
      })
    })
  };

  const handleDeleteAccount = () => {


    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };

    fetch("http://195.20.234.70:3000/connexion/" + userInfo.id, requestOptions)
      .then(response => response.text())
      .then(result => {
        AsyncStorage.removeItem('userInfo').then(() => {
          hidePopUp();
          AsyncStorage.removeItem('cookieEmail').then(() => {
            AsyncStorage.removeItem('cookiePassword').then(() => {
              AsyncStorage.removeItem('bracelet').then(() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'LoginScreen' }],
                  })
                );
              })
            })
          })
        })
      })
      .catch(error => console.log('error', error));

  };

  // Font
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }


  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={{ top: 50 }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', marginHorizontal: 25, alignItems: 'center' }}>
          <TouchableOpacity onPress={onMenuPage}>
            <Ionicons name="chevron-back" size={SIZES.xLarge} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={{ marginLeft: 15, fontSize: SIZES.medium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white }}>Settings</Text>
        </View>

        {/* Profil */}
        <TouchableOpacity onPress={() => handlePress(profilAnimation, 'ProfilModificationScreen')}>
          <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, marginTop: 30 }, getAnimatedStyle(profilAnimation)]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="person-outline" size={24} color={COLORS.white} style={{ marginTop: 6 }} />
              <View>
                <Text style={{ marginLeft: 20, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>{userInfo.firstname} {userInfo.name}</Text>
                <Text style={{ marginLeft: 20, fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Regular', color: COLORS.gray }}>{userInfo.email}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </Animated.View>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: COLORS.tertary, marginHorizontal: 25, marginVertical: 20 }} />

        {/* Language */}
        <TouchableOpacity onPress={() => handlePress(languageAnimation, 'LanguageScreen')}>
          <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25 }, getAnimatedStyle(languageAnimation)]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="logo-instagram" size={24} color={COLORS.white} style={{ marginTop: 6 }} />
              <View>
                <Text style={{ marginLeft: 20, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>Social Media</Text>
              <Text style={{ marginLeft: 20, fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Regular', color: COLORS.gray }}>All You Can Party</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </Animated.View>
        </TouchableOpacity>

        <View style={{ height: 8, backgroundColor: COLORS.tertary, marginVertical: 20 }} />

        {/* Assistance */}
        <TouchableOpacity onPress={() => handlePress(assistanceAnimation, 'AssistanceScreen')}>
          <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25 }, getAnimatedStyle(assistanceAnimation)]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="help-buoy-outline" size={24} color={COLORS.white} />
              <Text style={{ marginLeft: 20, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>Contact us</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </Animated.View>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: COLORS.tertary, marginHorizontal: 25, marginVertical: 20 }} />

        {/* Rate */}
        <TouchableOpacity onPress={() => handlePress2(rateAnimation)}>
          <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25 }, getAnimatedStyle(rateAnimation)]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="star-outline" size={24} color={COLORS.white} />
              <Text style={{ marginLeft: 20, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>Rate the app</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </Animated.View>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: COLORS.tertary, marginHorizontal: 25, marginVertical: 20 }} />

        {/* Terms */}
        <TouchableOpacity onPress={() => handlePress(termsAnimation, 'TermsScreen')}>
          <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25 }, getAnimatedStyle(termsAnimation)]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="book-outline" size={24} color={COLORS.white} />
              <Text style={{ marginLeft: 20, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>Terms and Conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </Animated.View>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: COLORS.tertary, marginHorizontal: 25, marginVertical: 20 }} />

        {/* About */}
        <TouchableOpacity onPress={() => handlePress(aboutAnimation, 'AboutScreen')}>
          <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25 }, getAnimatedStyle(aboutAnimation)]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="information-circle-outline" size={24} color={COLORS.white} />
              <Text style={{ marginLeft: 20, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>About us</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
          </Animated.View>
        </TouchableOpacity>

        <View style={{ height: 8, backgroundColor: COLORS.tertary, marginVertical: 20 }} />

        {/* Delete */}
        <TouchableOpacity onPress={() => showPopUp('delete')}>
          <Animated.View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25 }}>
            <Ionicons name="trash-outline" size={24} color={COLORS.white} />
            <Text style={{ marginLeft: 20, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>Delete account</Text>
          </Animated.View>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: COLORS.tertary, marginHorizontal: 25, marginVertical: 20 }} />

        {/* Log out */}
        <TouchableOpacity onPress={() => showPopUp('logout')}>
          <Animated.View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25 }}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
            <Text style={{ marginLeft: 20, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>Log out</Text>
          </Animated.View>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Pop-up */}
      {showPopup && (
        <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} onPress={hidePopUp}>
          <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', opacity: scaleAnim }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: COLORS.white, borderRadius: 20, marginHorizontal: 40, padding: 30 }}>
                <Text style={{ fontSize: SIZES.large, textAlign: 'center', fontFamily: 'SpaceGrotesk-Bold', color: COLORS.black }}>Are you sure you want to do this action?</Text>
                {popupTypeRef.current === 'logout' && (
                  <ButtonComponent onPress={handleLogout} colorText={COLORS.white} buttonBackground={COLORS.error} buttonText="Disconnect" />
                )}
                {popupTypeRef.current === 'delete' && (
                  <ButtonComponent onPress={handleDeleteAccount} colorText={COLORS.white} buttonBackground={COLORS.error} buttonText="Delete" />
                )}
                <ButtonComponent onPress={handleCancel} colorText={COLORS.white} buttonBackground={COLORS.graylight} buttonText="Cancel" />
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableOpacity>
      )}
    </LinearGradient>
  )
}

export default SettingScreen;
