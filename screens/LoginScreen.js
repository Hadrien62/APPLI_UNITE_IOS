import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Text, StatusBar, SafeAreaView, TouchableOpacity, Animated, ScrollView, Dimensions, KeyboardAvoidingView, Image, Modal } from 'react-native';
import { COLORS, SIZES } from '.././constants/theme'
import { useNavigation } from '@react-navigation/native';
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonComponent from '../components/ButtonComponent';
import InputComponent from '../components/InputComponent';
import PhoneInput from "react-native-phone-number-input";
import { SHA256 } from 'crypto-js';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {

  {/* Constante */ }
  const [activeTab, setActiveTab] = useState('Login');
  const [isChecked, setIsChecked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emails2, setEmails2] = useState([]);
  const [valdEmail, setValidEmail] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [validMdp, setValidMdp] = useState(false);
  const [userInfo, setUserInfo] = useState('');
  const [name, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const scrollView = useRef();
  const animation = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const [remember, setRemember] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(8); 
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const [isVisible4, setIsVisible4] = useState(false);
  const [isVisible5, setIsVisible5] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const phoneInputRef = React.createRef();

  const handlePhoneInputChange = () => {
    const formattedNumber = phoneInputRef.current.getValue();
    setPhoneNumber(formattedNumber);
  };

  const handleShowPopup = () => {
    setIsVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        handleHidePopup();
      }, 2500);
    });
  };
  const handleHidePopup = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible(false);
    });
  };
  const handleShowPopup2 = () => {
    setIsVisible2(true);
    Animated.timing(animation, {
      toValue: 1,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        handleHidePopup2();
      }, 2500);
    });
  };
  const handleHidePopup2 = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible2(false);
    });
  };
  const handleShowPopup3 = () => {
    setIsVisible3(true);
    Animated.timing(animation, {
      toValue: 1,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        handleHidePopup3();
      }, 2500);
    });
  };
  const handleHidePopup3 = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible3(false);
    });
  };
  const handleShowPopup4 = () => {
    setIsVisible4(true);
    Animated.timing(animation, {
      toValue: 1,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        handleHidePopup4();
      }, 2500);
    });
  };
  const handleHidePopup4 = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible4(false);
    });
  };
  const handleShowPopup5 = () => {
    setIsVisible5(true);
    Animated.timing(animation, {
      toValue: 1,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        handleHidePopup5();
      }, 2500);
    });
  };
  const handleHidePopup5 = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible5(false);
    });
  };
  const interpolateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });
  const interpolateOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  var intervalId
  const startTimer = () => {
    setShowPopup(true);
    intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setTimeout(() => {
      setShowPopup(false);
      clearInterval(intervalId); 
      navigation.navigate('Home');
    }, 3000);
  };

  const closePopup = () => {
    setShowPopup(false);
    setTimer(5);
    navigation.navigate('Home');
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, []);


  {/* Gestion des pop-up*/ }
  const showPopupForTwoSeconds = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };


  {/* Animation changement de page */ }
  const loginColorInterpolate = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [COLORS.white, COLORS.gray]
  })
  const registerColorInterpolate = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [COLORS.gray, COLORS.white]
  })
  const loginUnderlineInterpolate = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [2, 0]
  })
  const registerUnderlineInterpolate = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [0, 2]
  })

  {/*  Voir le mot de passe */ }
  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  {/*  CheckBox */ }
  const handleCheckboxPress = () => {
    setRemember(!remember);
    setIsChecked(!isChecked);
  };
  const handleCheckboxFocus = () => {
    setIsFocused(true);
  };
  const handleCheckboxBlur = () => {
    setIsFocused(false);
  };

  {/* Navigation */ }
  const onWelcomeScreen = () => {
    navigation.navigate('WelcomeScreen');
  }
  const onForgotPasswordScreen = () => {
    navigation.navigate('ForgotPasswordScreen');
  }

  const reloadPage = () => {
    const Url = "http://195.20.234.70:3000/connexion/email";
    const Url2 = "http://195.20.234.70:3000/connexion/pass";
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(Url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const emails2 = JSON.parse(result);
        setEmails2(emails2);
      })
      .catch((error) => console.log("error", error));
    var requestOptions2 = {
      method: "GET",
      redirect: "follow",
    };
    fetch(Url2, requestOptions2)
      .then((response) => response.text())
      .then((result) => {
        const passwords = JSON.parse(result);
        setPasswords(passwords);
      })
      .catch((error) => console.log("error", error));
  };

  {/* UseEffect */ }
  useEffect(() => {
    const Url = "http://195.20.234.70:3000/connexion/email";
    const Url2 = "http://195.20.234.70:3000/connexion/pass";
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(Url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const emails2 = JSON.parse(result);
        setEmails2(emails2);
      })
      .catch((error) => console.log("error", error));
    var requestOptions2 = {
      method: "GET",
      redirect: "follow",
    };
    fetch(Url2, requestOptions2)
      .then((response) => response.text())
      .then((result) => {
        const passwords = JSON.parse(result);
        setPasswords(passwords);
      })
      .catch((error) => console.log("error", error));
  }, []);


  {/* Fonction connexion*/ }
  const onSignInPressed = async () => {
    try {
     
      if (email === '' || password === '') {
        handleShowPopup()
      } else {
        let number = -1;
     
        const emailWithoutSpace = email.replace(/\s+$/, '');
        for (let i = 0; i <= emails2.length; ++i) {
         
          if (emailWithoutSpace.toLowerCase() === emails2[i]) {
            number = i;
            break;
          }
        }
        if (number === -1) {
          handleShowPopup2();
          return;
        }

        for (let index = 0; index < passwords.length; index++) {
          if (SHA256(password).toString() === passwords[number]) {

            const userInfoURL = "http://195.20.234.70:3000/connexion/" + email;

            var requestOptionsInfoUser = {
              method: "GET",
              redirect: "follow",
            };

            try {
              const response = await fetch(userInfoURL, requestOptionsInfoUser);
              const result = await response.text();
              const infoUser = JSON.parse(result);

              setUserInfo(infoUser);

              AsyncStorage.setItem('userInfo', JSON.stringify(infoUser))
                .then(() => {
                  setValidEmail(true);
                  setValidMdp(true);
                  if (remember) {
                    try {
                      AsyncStorage.setItem('cookieEmail', email).then(() => {
                        AsyncStorage.setItem('cookiePassword', password).then(() => {
                        })
                          .catch((error) => {
                          });
                      })
                        .catch((error) => {
                        });

                    } catch (error) {
                    }
                  }
                  navigation.navigate('Home');
                })
                .catch((error) => {
                });
            } catch (error) {
            }
          } else {
            handleShowPopup();
          }
        }
      }
    } catch (error) {
      handleShowPopup()
    }
  };


  {/* Fonction inscription*/ }

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleFirstnameChange = (text) => {
    setFirstname(text);
  };


  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handlePhoneNumberChange = (text) => {
    setPhonenumber(text);
  };

  const handleSignUp = async () => {
    const emailRegex = /[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[\W_]/;
    const emailWithoutSpace = email.replace(/\s+$/, '');


    if (name === '' || firstname === '' || emailWithoutSpace === '' || password === '') {
      handleShowPopup();
    }

    else if (emailWithoutSpace && !emailRegex.test(emailWithoutSpace.toLowerCase())) {
      handleShowPopup4();
    }


    else if (emails2.includes(emailWithoutSpace.toLowerCase())) {
      handleShowPopup5();
    }

    else if (password && (!uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !digitRegex.test(password) || !specialCharRegex.test(password) || password.length < 8)) {
      handleShowPopup3();
    }
    else {

      const hashedPassword = SHA256(password).toString();
      const referralCode = generateReferralCode();
      let data = JSON.stringify({
        "name": name,
        "firstname": firstname,
        "email": emailWithoutSpace.toLowerCase(),
        "password": hashedPassword,
        "phonenumber": phonenumber,
        "referralcode": referralCode,
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://195.20.234.70:3000/connexion',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          showPopupForTwoSeconds();
          AsyncStorage.setItem('userInfo', JSON.stringify(response.data)).then(() => {
            AsyncStorage.setItem('compte', 'deja un compte').then(() => {
              navigation.navigate('Home');
            })
          })
        })
        .catch((error) => {

        });


      setName('');
      setFirstname('');
      setEmail('');
      setPassword('');
      setPhonenumber('');


    }
  }

  const generateReferralCode = () => {

    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 8);
    const code = timestamp + randomString;
    const hashedCode = SHA256(code).toString();
    return hashedCode.substring(0, 8).toUpperCase();
  };

  {/* Font */ }
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={{ top: 50 }}>

        {/*  Header */}
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
          <KeyboardAvoidingView KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
            <Image source={require('../assets/images/BackgroundLogin.png')} style={{ width: 'auto', resizeMode: 'contain', marginTop: '60%' }} />
          </KeyboardAvoidingView>
        </SafeAreaView>

        {/*  Menu Register/login */}
        <View style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: 25 }}>
          <TouchableOpacity onPress={() => { scrollView.current.scrollTo({ x: 0 }); setActiveTab('Login'); }}>
            <Animated.View style={{ borderBottomWidth: loginUnderlineInterpolate, borderBottomColor: COLORS.white, marginRight: 20, paddingBottom: 10 }}>
              <Animated.Text style={{ color: loginColorInterpolate, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold' }}>Login</Animated.Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { scrollView.current.scrollTo({ x: windowWidth }); setActiveTab('Register'); }}>
            <Animated.View style={{ borderBottomWidth: registerUnderlineInterpolate, borderBottomColor: COLORS.white, paddingBottom: 10 }}>
              <Animated.Text style={{ color: registerColorInterpolate, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold' }}>Register</Animated.Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/*  Contenu Register/login */}
        <ScrollView height={'100%'} horizontal pagingEnabled showsHorizontalScrollIndicator={false} ref={scrollView} scrollEventThrottle={16} onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: animation } } }], { useNativeDriver: false })}>

          {/*  Login */}
          <View style={{ width: windowWidth, marginTop: 20, }}>
            <InputComponent placeholder="E-mail" icon="mail" value={email} setValue={setEmail} gradientColors={['#0e0d12', '#0e0d12', COLORS.tertary, COLORS.tertary]} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InputComponent secureTextEntry={!passwordVisible} placeholder="Password" icon="lock-closed" value={password} setValue={setPassword} gradientColors={['#16151a', '#16151a', COLORS.tertary, COLORS.tertary]} />
              <TouchableOpacity style={{ position: 'absolute', alignItems: 'center', right: 40, top: 22 }} onPress={handlePasswordVisibilityToggle} >
                <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={22} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            {/* Remember */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 17, justifyContent: 'space-between', marginHorizontal: 25 }}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[{ borderColor: isChecked ? COLORS.primary : COLORS.white, width: 20, height: 20, borderWidth: isChecked ? 0 : 2, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: isChecked ? COLORS.primary : 'transparent', },]} onPress={handleCheckboxPress} onFocus={handleCheckboxFocus} onBlur={handleCheckboxBlur}>
                  {isChecked ? (
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  ) : null}
                </TouchableOpacity>
                <Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Regular', fontSize: SIZES.medium }}>Remember me</Text>
              </View>
              <TouchableOpacity onPress={onForgotPasswordScreen}>
                <Text style={{ color: COLORS.secondary, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium }}>Forgot Password ?</Text>
              </TouchableOpacity>
            </View>
            <ButtonComponent buttonText="Login" animated={true} onPress={onSignInPressed} />
          </View>

          {/*  Register */}
          <View style={{ width: windowWidth, marginTop: 20 }}>
            <InputComponent placeholder="Name" icon="person" value={name} setValue={handleNameChange} gradientColors={['#0e0d12', '#0e0d12', COLORS.tertary, COLORS.tertary]} />
            <InputComponent placeholder="Surname" icon="happy" value={firstname} setValue={handleFirstnameChange} gradientColors={['#16151a', '#16151a', COLORS.tertary, COLORS.tertary]} />
            <View style={{marginHorizontal:25}}>
              <PhoneInput ref={phoneInputRef} defaultCode='FR' defaultValue={phonenumber} onChangeFormattedText={(text) => {setPhonenumber(text)}} onlyNumber={true}
                flagButtonStyle={{ width: 70 }} 
                containerStyle={{ marginRight:25, width:'100%',alignItems: 'center', marginTop: 10, justifyContent:'center', textAlign:'center', backgroundColor: COLORS.tertary,  borderRadius: 5,  height:50
                }}
                textContainerStyle={{
                  backgroundColor: 'transparent', 
                }}
              textInputStyle={{
                color: COLORS.white,    
                marginBottom:-3,
                fontSize: SIZES.medium, 
                fontFamily: 'SpaceGrotesk-Regular',
              }}
              textInputProps={{
                placeholderTextColor: COLORS.gray, 
              }}
              codeTextStyle={{
                color: COLORS.white,
                marginLeft:-15,
                fontSize: SIZES.medium, 
                fontFamily: 'SpaceGrotesk-Regular',
              }}/>
            </View>
            <InputComponent placeholder="E-mail" icon="mail" value={email} setValue={handleEmailChange} gradientColors={['#1c1f26', '#1c1f26', COLORS.tertary, COLORS.tertary]} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InputComponent secureTextEntry={!passwordVisible} placeholder="Password" icon="lock-closed" value={password} setValue={handlePasswordChange} gradientColors={['#22252c', '#22252c', COLORS.tertary, COLORS.tertary]} />
              <TouchableOpacity style={{ position: 'absolute', alignItems: 'center', right: 40, top: 22 }} onPress={handlePasswordVisibilityToggle} >
                <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={22} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            <ButtonComponent buttonText="Register" animated={true} onPress={handleSignUp} />
          </View>
        </ScrollView>

        {
          showPopup && (
            (() => {
              return (
                <Modal style={{ zIndex: 9999 }} transparent={true} animationType="fade">
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={() => setShowPopup(false)}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 10, marginHorizontal: 50 }}>
                        <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary, marginBottom: 10 }}>account created</Text>
                        <Text style={{ fontSize: SIZES.xMedium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.tertary, marginBottom: 20 }}>Your account has been successfully created!</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                          <Image source={require('../assets/images/Check.png')} style={{ width: 100, height: 100 }} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
              );
            })()
          )
        }

      </SafeAreaView>
      {isVisible && (
          <Animated.View style={{ position: 'absolute', bottom: 30, width: '85%', paddingHorizontal: 15, marginHorizontal:25, paddingVertical:10,backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 25,flexDirection:'row', alignItems:'center', transform: [{ translateY: interpolateY }], opacity: interpolateOpacity}} >
          <Ionicons name="alert-circle" size={SIZES.xLarge} color={COLORS.error} style={{marginRight:5}}/>
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>Please check your information</Text>
          </Animated.View>
        )}  
        {isVisible2 && (
          <Animated.View style={{ position: 'absolute', bottom: 30, width: '85%', paddingHorizontal: 15, marginHorizontal:25, paddingVertical:10,backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 25,flexDirection:'row', alignItems:'center', transform: [{ translateY: interpolateY }], opacity: interpolateOpacity}} >
          <Ionicons name="alert-circle" size={SIZES.xLarge} color={COLORS.error} style={{marginRight:5}}/>
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>Invalid password or e-mail address</Text>
          </Animated.View>
        )}  
        {isVisible3 && (
          <Animated.View style={{ position: 'absolute', bottom: 30, width: '85%', paddingHorizontal: 15, marginHorizontal:25, paddingVertical:10,backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 25,flexDirection:'row', alignItems:'center', transform: [{ translateY: interpolateY }], opacity: interpolateOpacity}} >
          <Ionicons name="alert-circle" size={SIZES.xLarge} color={COLORS.error} style={{marginRight:5}}/>
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>Invalid password (8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character)</Text>
          </Animated.View>
        )}  
        {isVisible4 && (
          <Animated.View style={{ position: 'absolute', bottom: 30, width: '85%', paddingHorizontal: 15, marginHorizontal:25, paddingVertical:10,backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 25,flexDirection:'row', alignItems:'center', transform: [{ translateY: interpolateY }], opacity: interpolateOpacity}} >
          <Ionicons name="alert-circle" size={SIZES.xLarge} color={COLORS.error} style={{marginRight:5}}/>
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>Invalid e-mail address</Text>
          </Animated.View>
        )} 
        {isVisible5 && (
          <Animated.View style={{ position: 'absolute', bottom: 30, width: '85%', paddingHorizontal: 15, marginHorizontal:25, paddingVertical:10,backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 25,flexDirection:'row', alignItems:'center', transform: [{ translateY: interpolateY }], opacity: interpolateOpacity}} >
          <Ionicons name="alert-circle" size={SIZES.xLarge} color={COLORS.error} style={{marginRight:5}}/>
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>E-mail address already exists</Text>
          </Animated.View>
        )} 
    </LinearGradient>
  );
}

export default LoginScreen;