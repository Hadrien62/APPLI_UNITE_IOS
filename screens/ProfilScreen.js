import React, { useState, useRef, useEffect, mapRef } from 'react';
import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, ScrollView, Image, Animated, Dimensions, StyleSheet, Clipboard, Share, Linking, LayoutAnimation, Easing, Platform, Pressable, Modal, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '.././constants/theme';
import { useCustomFonts } from '../constants/fonts';
import SettingComponent from '../components/SettingComponent';
import ButtonComponent from '../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';



export default function ProfilScreen() {

    const navigation = useNavigation();

    {/* Map */ }
    const latitude = 35.92194638446071
    const longitude = 14.49090369295149
    const ouvrirGoogleMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    {/* Gestion Awards*/ }
    const [point, setPoint] = useState(0);
    const [isMaxReached, setIsMaxReached] = useState(false);
    const [isMaxReached1, setIsMaxReached1] = useState(false);
    const [isMaxReached2, setIsMaxReached2] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isButtonDisabled1, setIsButtonDisabled1] = useState(false);
    const [isButtonDisabled2, setIsButtonDisabled2] = useState(false);
    const [enTrainDeRafraichir, setEnTrainDeRafraichir] = useState(false);

    const handleRafraichissement = () => {
        setEnTrainDeRafraichir(true);
        getUserInfo();
        setEnTrainDeRafraichir(false);
    };

    useEffect(() => {
        if (point >= 100) {
            setIsMaxReached(true);
            setIsButtonDisabled(false);
        } else {
            setIsMaxReached(false);
            setIsButtonDisabled(true);
        }
        if (point >= 50) {
            setIsMaxReached1(true);
            setIsButtonDisabled1(false);
        } else {
            setIsMaxReached1(false);
            setIsButtonDisabled1(true);
        }
        if (point >= 25) {
            setIsMaxReached2(true);
            setIsButtonDisabled2(false);
        } else {
            setIsMaxReached2(false);
            setIsButtonDisabled2(true);
        }
    }, [point]);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup1, setShowPopup1] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);
    const [showPopup3, setShowPopup3] = useState(false);
    const handleIncreasePoint = () => {
        setShowPopup(true);
        if (point < 100) {
            setPoint(point);
        }
    };
    const handleIncreasePoint1 = () => {
        setShowPopup1(true);
        if (point < 50) {
            setPoint(point);
        }
    };
    const handleIncreasePoint2 = () => {
        setShowPopup2(true);
        if (point < 25) {
            setPoint(point);
        }
    };
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim1 = useRef(new Animated.Value(1)).current;
    const fadeAnim2 = useRef(new Animated.Value(1)).current;
    const startAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.9,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };
    const startAnimation1 = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim1, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim1, {
                    toValue: 0.9,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim1, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const startAnimation2 = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim2, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim2, {
                    toValue: 0.9,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim2, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };


    useEffect(() => {
        if (point >= 100) {
            startAnimation2(fadeAnim2);
        }
        if (point >= 50) {
            startAnimation1(fadeAnim1);
        }
        if (point >= 25) {
            startAnimation(fadeAnim);
        }
    });

    {/* Constante */ }
    const [userInfo, setUserInfo] = useState('');
    const windowWidth = Dimensions.get('window').width;
    const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

    useEffect(() => {
        getUserInfo();
    }, []);

    useFocusEffect( 
        React.useCallback(() => {
            getUserInfo();

        }, [])
    );

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
                    handleBraceletActivation(result.bracelet)
                    AsyncStorage.setItem('userInfo', JSON.stringify(result))
                        .then(() => {
                            setPoint(result.numberParrainage)
                        })
                        .catch((error) => {
                        });
                } catch (error) {
                }
            }
        } catch (error) {

        }
    };

    {/* Copie/Partage Code promo */ }
    const handleCopyCode = (codePromo) => {
        Clipboard.setString(codePromo);
        setShowPopup3(true);
    };
    const handleShareCode = async (codePromo) => {
        try {
            const shareOptions = {
                message: `Reserve party with my referral code 🎉 : ${codePromo}`,
            };
            if (Platform.OS === 'android') {
                shareOptions.title = 'Partager le code promo';
            }
            await Share.share(shareOptions);
        } catch (error) {
        }
    };

    {/* Bracelet Acces */ }
    const [hasBracelet, setHasBracelet] = useState(false);
    const handleBraceletActivation = (valueBracelet) => {
        setHasBracelet(valueBracelet);
    };

    {/* Awards 77 */}
    const Awards77 = () => {

        var nbrParrainage = userInfo.numberParrainage
        nbrParrainage = nbrParrainage - 25;

        let json = {}
        if (userInfo.attente === null) {
          json["club"] = 0;
        } else {
          json = userInfo.attente;
          json["club"] = 0;
        }
        let data = JSON.stringify({
          attente: json,
          numberParrainage: nbrParrainage,
        });
    
        var requestOptions = {
          method: 'PATCH',
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': 'application/json'
          },
          body: data,
          redirect: 'follow'
        };
    
        fetch("http://195.20.234.70:3000/connexion/" + userInfo.id, requestOptions)
        .then(response => response.text())
        .then(result => {
          const currentDate = new Date();
          const currentDateStr = currentDate.toISOString();
    
          AsyncStorage.setItem("club", currentDateStr)
            .then(() => {
            })
            .catch((error) => {
            });
    
          navigation.navigate('Home', { screen: 'TicketScreen' });
        })
        .catch(error => console.log('error', error));
    };

    {/* Awards Pool */}
    const AwardsPool = () => {

        var nbrParrainage = userInfo.numberParrainage
        nbrParrainage = nbrParrainage - 50;

        let json = {}
        if (userInfo.attente === null) {
          json["pool"] = 0;
        } else {
          json = userInfo.attente;
          json["pool"] = 0;
        }
        let data = JSON.stringify({
          attente: json,
          numberParrainage: nbrParrainage,
        });


    
        var requestOptions = {
          method: 'PATCH',
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': 'application/json'
          },
          body: data,
          redirect: 'follow'
        };
    
        fetch("http://195.20.234.70:3000/connexion/" + userInfo.id, requestOptions)
        .then(response => response.text())
        .then(result => {
          const currentDate = new Date();
          const currentDateStr = currentDate.toISOString();
    
          AsyncStorage.setItem("pool", currentDateStr)
            .then(() => {
            })
            .catch((error) => {
            });
    
          navigation.navigate('Home', { screen: 'TicketScreen' });
        })
        .catch(error => console.log('error', error));
    };


        {/* Awards Boat */}
        const AwardsBoat = () => {

            var nbrParrainage = userInfo.numberParrainage
            nbrParrainage = nbrParrainage - 50;
    
            let json = {}
            if (userInfo.attente === null) {
              json["boat"] = 0;
            } else {
              json = userInfo.attente;
              json["boat"] = 0;
            }
            let data = JSON.stringify({
              attente: json,
              numberParrainage: nbrParrainage,
            });
    
    
        
            var requestOptions = {
              method: 'PATCH',
              maxBodyLength: Infinity,
              headers: {
                'Content-Type': 'application/json'
              },
              body: data,
              redirect: 'follow'
            };
  
            fetch("http://195.20.234.70:3000/connexion/" + userInfo.id, requestOptions)
            .then(response => response.text())
            .then(result => {
              const currentDate = new Date();
              const currentDateStr = currentDate.toISOString();
        
              AsyncStorage.setItem("boat", currentDateStr)
                .then(() => {
                })
                .catch((error) => {
                });
        
              navigation.navigate('Home', { screen: 'TicketScreen' });
            })
            .catch(error => console.log('error', error));
        };
    

    {/* Font */ }
    const fontsLoaded = useCustomFonts();
    if (!fontsLoaded) {
        return null;
    }
    return (
        <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
            <StatusBar backgroundColor="transparent" translucent />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 25, marginTop: 50 }}>
                <Text style={{ color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', textTransform: 'uppercase', fontSize: SIZES.xLarge }}>profil</Text>
                <SettingComponent />
            </View>

            {/* Information */}
            <ScrollView vertical style={{ marginBottom: 90 }} refreshControl={
                <RefreshControl
                    refreshing={enTrainDeRafraichir}
                    onRefresh={handleRafraichissement}
                />
            }>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 0.55 * screenHeight }}>
                        <SafeAreaView style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginVertical: 75 }}>
                            <Image source={require('../assets/images/Logo.png')} style={{ height: '100%', resizeMode: 'contain' }} />
                            <Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', marginTop: 10, fontSize: SIZES.xxLarge, textAlign: 'center',}}>{userInfo.name} {userInfo.firstname}</Text>
                            <Text style={{ color: COLORS.gray, fontFamily: 'SpaceGrotesk-Regular', fontSize: SIZES.large }}>{userInfo.email}</Text>
                        </SafeAreaView>

                        {/* Statistique */}
                        <SafeAreaView style={styles.container}>
                            <View style={[styles.box]}>
                                <Image source={require('../assets/images/Mixage.png')} style={{ width: 60, height: 40, resizeMode: 'cover', marginBottom: 10, }} />
                                <Text style={styles.title}>{userInfo.numberNight}</Text>
                                <Text style={styles.description}>Parties</Text>
                            </View>
                            <View style={[styles.box, styles.space]}>
                                <Image source={require('../assets/images/Coin.png')} style={{ width: 40, height: 40, resizeMode: 'cover', marginBottom: 10, }} />
                                <Text style={styles.title}>{userInfo.numberParrainage}</Text>
                                <Text style={styles.description}>Points</Text>
                            </View>
                            <View style={[styles.box,]}>
                                <Image source={require('../assets/images/Bracelet.png')} style={{ width: 70, height: 40, resizeMode: 'cover', marginBottom: 10, }} />
                                <Text style={{ color: hasBracelet ? 'green' : COLORS.error, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xxLarge, }}>{hasBracelet ? 'YES' : 'NO'}</Text>
                                <Text style={styles.description}>Pass</Text>
                            </View>
                        </SafeAreaView>
                    </View>

                    <View style={{ flex: 0.45 * screenHeight }}>

                        {/* Promo Code */}
                        <Text style={{ marginHorizontal: 25, marginTop: 25, color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xLarge }}>Referral Code</Text>
                        <SafeAreaView style={styles.container}>
                            <View style={{ flex: 1, borderRadius: 5, backgroundColor: COLORS.tertary, marginVertical: 25, paddingVertical: 15 }}>
                                <Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.large, marginHorizontal: 25 }}>Win parties with promo code !</Text>
                                <Text style={{ color: COLORS.gray, marginTop: 5, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, marginHorizontal: 25 }}>Share your code with your friends and get free parties 🎉</Text>
                                <Text style={{ color: COLORS.gray, marginTop: 5, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, marginHorizontal: 25 }}>For each successful promo code, you and your friend win a point.</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }} >
                                    <TouchableOpacity onPress={() => handleCopyCode(userInfo.referralcode)} style={{ backgroundColor: COLORS.white, borderRadius: 5, flex: 0.7, marginLeft: 25, padding: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: COLORS.tertary, fontSize: SIZES.medium, textAlign: 'center', }}>Tap to copy code</Text>
                                            <Ionicons style={{ marginLeft: 5, color: COLORS.black, }} name="document-outline" size={20} />
                                        </View>
                                        <Text style={{ fontFamily: 'TitilliumWeb-Bold', color: COLORS.black, fontSize: SIZES.large, textAlign: 'center', textTransform: 'uppercase', }}>{userInfo.referralcode}</Text>
                                    </TouchableOpacity>
                                    <View style={{ flex: 0.06 }} />
                                    <TouchableOpacity
                                        onPress={() => handleShareCode(userInfo.referralcode)} style={{ backgroundColor: COLORS.primary, borderRadius: 5, alignItems: 'center', flex: 0.3, marginRight: 25, padding: 11 }}>

                                        <Ionicons style={{ marginLeft: 5, color: COLORS.white, }} name="share-outline" size={20} />
                                        <Text style={{ fontFamily: 'TitilliumWeb-Bold', color: COLORS.white, fontSize: 17, textAlign: 'center', textTransform: 'uppercase' }}>share</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>

                        {/* Awards */}
                        <Text style={{ marginHorizontal: 25, color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xLarge, marginBottom: 25 }}>Awards</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', }}>

                            <Animated.View style={{ backgroundColor: COLORS.tertary, borderRadius: 5, borderBottomRightRadius: 20, height: 150, width: windowWidth / 1.15, marginLeft: 25, transform: [{ scale: fadeAnim }], }}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                                    <Image source={require('../assets/images/Club77.png')} style={{ width: 50, height: 68, resizeMode: 'cover' }} />
                                    <View style={{ flexDirection: 'row' }} >
                                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: COLORS.secondary, fontSize: SIZES.xLarge, textTransform: 'uppercase' }}>{Math.min(point, 25)}</Text>
                                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: isMaxReached2 ? COLORS.secondary : COLORS.white, fontSize: SIZES.xLarge, textTransform: 'uppercase', marginTop: -2, marginHorizontal: 3 }}>/</Text>
                                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: isMaxReached2 ? COLORS.secondary : COLORS.white, fontSize: SIZES.xLarge, textTransform: 'uppercase', marginRight: 5 }}>25</Text>
                                        <Image source={require('../assets/images/Coin.png')} style={{ width: 25, height: 25, resizeMode: 'cover', marginTop: 2 }} />
                                    </View>
                                </View>
                                <View style={{ position: 'absolute', bottom: 10, left: 15, }}>
                                    <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, fontSize: SIZES.xLarge, textTransform: 'uppercase', }}>Night club PArty</Text>
                                    <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray, fontSize: SIZES.large, }}>Club 77 only </Text>
                                </View>
                                <TouchableOpacity onPress={handleIncreasePoint2} disabled={isButtonDisabled2} style={{ position: 'absolute', bottom: 0, right: 0, width: 50, height: 50, borderTopLeftRadius: 20, borderBottomRightRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: isMaxReached2 ? COLORS.secondary : COLORS.gray }} >
                                    {isMaxReached2 ? (
                                        <View>
                                            <Ionicons name={'add'} size={30} color={COLORS.white} />
                                        </View>
                                    ) : (
                                        <Ionicons name={'lock-closed'} size={30} color={COLORS.white} />
                                    )}
                                </TouchableOpacity>
                                {showPopup2 && (
                                    <Modal transparent={true} animationType="fade">

                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            activeOpacity={1}
                                            onPress={() => setShowPopup2(false)}>
                                            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: COLORS.white, padding: 30, borderRadius: 10, marginHorizontal: 50 }}>
                                                    <Text style={{ fontSize: SIZES.large, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary, marginBottom: 5 }}>Club 77 party </Text>
                                                    <Text style={{ fontSize: SIZES.xMedium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.tertary, marginBottom: 20 }}>Congratulations, you've won a Club 77 party 🎉</Text>
                                                    <View style={{ backgroundColor: COLORS.graylight, borderRadius: 10, padding: 10, height: 120, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.tertary, marginBottom: 5 }}>Unite shop</Text>
                                                        <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                            <TouchableOpacity onPress={ouvrirGoogleMaps} style={{ width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', marginRight: 10 }}>
                                                                <Ionicons name="map-outline" size={24} color={COLORS.white} />
                                                            </TouchableOpacity>
                                                            <Text style={{ color: COLORS.tertary, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, marginRight: 25, flexWrap: 'wrap', flex: 1 }}>13 Triq Paceville, San Ġiljan</Text>
                                                            
                                                        </SafeAreaView>
                                                    </View>
                                                    <ButtonComponent onPress={Awards77} colorText={COLORS.white} buttonText="Booked" animated={false} />
                                                    <Text style={{ fontSize: SIZES.small, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray, marginTop: 10 }}>By pressing the "Booked" button, you agree to come to the Unite shop within 24 hours to choose from the available dates and events.</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Modal>
                                )}
                            </Animated.View>

                            <Animated.View style={{ backgroundColor: COLORS.tertary, borderRadius: 5, borderBottomRightRadius: 20, height: 150, width: windowWidth / 1.15, marginLeft: 25, transform: [{ scale: fadeAnim1 }], }}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                                    <Image source={require('../assets/images/Pool.png')} style={{ width: 60, height: 70, resizeMode: 'cover' }} />
                                    <View style={{ flexDirection: 'row' }} >
                                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: COLORS.secondary, fontSize: SIZES.xLarge, textTransform: 'uppercase' }}>{Math.min(point, 50)}</Text>
                                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: isMaxReached1 ? COLORS.secondary : COLORS.white, fontSize: SIZES.xLarge, textTransform: 'uppercase', marginTop: -2, marginHorizontal: 3 }}>/</Text>
                                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: isMaxReached1 ? COLORS.secondary : COLORS.white, fontSize: SIZES.xLarge, textTransform: 'uppercase', marginRight: 5 }}>50</Text>
                                        <Image source={require('../assets/images/Coin.png')} style={{ width: 25, height: 25, resizeMode: 'cover', marginTop: 2 }} />
                                    </View>
                                </View>
                                <View style={{ position: 'absolute', bottom: 10, left: 15, }}>
                                    <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, fontSize: SIZES.xLarge, textTransform: 'uppercase', }}>Pool Party</Text>
                                    <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray, fontSize: SIZES.large, }}>Giupula Rooftop only </Text>
                                </View><TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0, width: 50, height: 50, borderTopLeftRadius: 20, borderBottomRightRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: isMaxReached1 ? COLORS.secondary : COLORS.gray }} onPress={handleIncreasePoint1} disabled={isButtonDisabled1} >
                                    {isMaxReached1 ? (
                                        <View>
                                            <Ionicons name={'add'} size={30} color={COLORS.white} />
                                        </View>
                                    ) : (
                                        <Ionicons name={'lock-closed'} size={30} color={COLORS.white} />
                                    )}
                                </TouchableOpacity>
                                {showPopup1 && (
                                    <Modal transparent={true} animationType="fade">
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            activeOpacity={1}
                                            onPress={() => setShowPopup1(false)}>
                                            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: COLORS.white, padding: 30, borderRadius: 10, marginHorizontal: 50 }}>
                                                    <Text style={{ fontSize: SIZES.large, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary, marginBottom: 5 }}>Pool Party </Text>
                                                    <Text style={{ fontSize: SIZES.xMedium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.tertary, marginBottom: 20 }}>Congratulations, you've won a Pool party 🎉</Text>
                                                    <View style={{ backgroundColor: COLORS.graylight, borderRadius: 10, padding: 10, height: 120, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.tertary, marginBottom: 5 }}>Unite shop</Text>
                                                        <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                            <TouchableOpacity onPress={ouvrirGoogleMaps} style={{ width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', marginRight: 10 }}>
                                                                <Ionicons name="map-outline" size={24} color={COLORS.white} />
                                                            </TouchableOpacity>
                                                            <Text style={{ color: COLORS.tertary, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, marginRight: 25, flexWrap: 'wrap', flex: 1 }}>13 Triq Paceville, San Ġiljan</Text>
                                                        </SafeAreaView>
                                                    </View>
                                                    <ButtonComponent onPress={AwardsPool} colorText={COLORS.white} buttonText="Booked" animated={false} />
                                                    <Text style={{ fontSize: SIZES.small, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray, marginTop: 10 }}>By pressing the "Booked" button, you agree to come to the Unite shop within 24 hours to choose from the available dates and events.</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Modal>
                                )}
                            </Animated.View>
                            <Animated.View style={{ backgroundColor: COLORS.tertary, borderRadius: 5, borderBottomRightRadius: 20, height: 150, width: windowWidth / 1.15, marginLeft: 25, transform: [{ scale: fadeAnim2 }], marginRight: 25, }}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 15, marginTop: 10 }}>
                                    <Image source={require('../assets/images/Boat.png')} style={{ width: 70, height: 70, resizeMode: 'cover' }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: COLORS.secondary, fontSize: SIZES.xLarge, textTransform: 'uppercase' }}>{Math.min(point, 100)}</Text>
                                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: isMaxReached ? COLORS.secondary : COLORS.white, fontSize: SIZES.xLarge, textTransform: 'uppercase', marginTop: -2, marginHorizontal: 3 }}>/</Text>
                                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: isMaxReached ? COLORS.secondary : COLORS.white, fontSize: SIZES.xLarge, textTransform: 'uppercase', marginRight: 5 }}>100</Text>
                                        <Image source={require('../assets/images/Coin.png')} style={{ width: 25, height: 25, resizeMode: 'cover', marginTop: 2 }} />
                                    </View>
                                </View>
                                <View style={{ position: 'absolute', bottom: 10, left: 15 }}>
                                    <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, fontSize: SIZES.xLarge, textTransform: 'uppercase' }}>Boat Party</Text>
                                    <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray, fontSize: SIZES.large }}>Friday only</Text>
                                </View>
                                <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0, width: 50, height: 50, borderTopLeftRadius: 20, borderBottomRightRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: isMaxReached ? COLORS.secondary : COLORS.gray }} onPress={handleIncreasePoint} disabled={isButtonDisabled} >
                                    {isMaxReached ? (
                                        <View>
                                            <Ionicons name={'add'} size={30} color={COLORS.white} />
                                        </View>
                                    ) : (
                                        <Ionicons name={'lock-closed'} size={30} color={COLORS.white} />
                                    )}
                                </TouchableOpacity>
                                {showPopup && (
                                    <Modal transparent={true} animationType="fade">
                                        <TouchableOpacity
                                            style={{ flex: 1 }}
                                            activeOpacity={1}
                                            onPress={() => setShowPopup(false)}>
                                            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: COLORS.white, padding: 30, borderRadius: 10, marginHorizontal: 50 }}>
                                                    <Text style={{ fontSize: SIZES.large, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary, marginBottom: 5 }}>Boat party </Text>
                                                    <Text style={{ fontSize: SIZES.xMedium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.tertary, marginBottom: 20 }}>Congratulations, you've won a Boat party 🎉</Text>
                                                    <View style={{ backgroundColor: COLORS.graylight, borderRadius: 10, padding: 10, height: 120, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.tertary, marginBottom: 5 }}>Unite shop</Text>
                                                        <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                            <TouchableOpacity onPress={ouvrirGoogleMaps} style={{ width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', marginRight: 10 }}>
                                                                <Ionicons name="map-outline" size={24} color={COLORS.white} />
                                                            </TouchableOpacity>   
                                                            <Text style={{ color: COLORS.tertary, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, marginRight: 25, flexWrap: 'wrap', flex: 1 }}>13 Triq Paceville, San Ġiljan</Text>   
                                                    
                                                        </SafeAreaView>
                                                    </View>
                                                    <ButtonComponent onPress={AwardsBoat} colorText={COLORS.white} buttonText="Booked" animated={false} />
                                                    <Text style={{ fontSize: SIZES.small, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray, marginTop: 10 }}>By pressing the "Booked" button, you agree to come to the Unite shop within 24 hours to choose from the available dates and events.</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Modal>
                                )}
                                {showPopup3 && (
                                        (() => {
                                        return (
                                            <Modal style={{ zIndex: 9999 }} transparent={true} animationType="fade">
                                            <TouchableOpacity
                                                style={{ flex: 1 }}
                                                activeOpacity={1}
                                                onPress={() => setShowPopup3(false)}>
                                                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 10, marginHorizontal: 50 }}>
                                                    <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary, marginBottom: 10 }}>Code Copied!</Text>
                                                    <Text style={{ fontSize: SIZES.xMedium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.tertary, marginBottom: 20 }}>You can send them to your friend to earn some points!</Text>
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
                            </Animated.View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </LinearGradient>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 25,
    },
    box: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: COLORS.tertary,
        padding: 15,
    },
    space: {
        marginHorizontal: 15,
    },
    title: {
        color: COLORS.white,
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: SIZES.xxLarge
    },
    description: {
        color: COLORS.gray,
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: SIZES.medium
    }
});
