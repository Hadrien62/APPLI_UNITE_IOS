import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, Animated, TouchableWithoutFeedback, Easing, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonComponent from '../components/ButtonComponent';
import { BottomSheetModal, BottomSheetModalProvider, } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import InputComponent from '../components/InputComponent';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BookTicketScreen = () => {

    const navigation = useNavigation();

    {/* Constantes */ }
    const [referralCode, setReferralCode] = useState('');
    const [partyInfo, setPartyInfo] = useState({});
    const [email, setEmail] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const [selectedPrice, setSelectedPrice] = useState([]);
    const [nombreDeConso, setNombreDeConso] = useState('');
    const [allReferralCode, setAllReferralCode] = useState('');
    const [valeurClefConso, setValeurClefConso] = useState('');
    const animation = useRef(new Animated.Value(0)).current;
    const [promoCode, setPromoCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isVisible3, setIsVisible3] = useState(false);
    const fontsLoaded = useCustomFonts();

    const [texte, setTexte] = useState('');
    const handleChangeText = (nouveauTexte) => {
        setTexte(nouveauTexte.toUpperCase());
    };
    const [isOpen, setIsOpen] = useState(false);
    const bottomSheetModalRef = useRef(null);
    const snapPoints = ["100%", "100%", "100%"];
    function handlePresentModal() {
        bottomSheetModalRef.current?.present();
        setTimeout(() => {
            setIsOpen(true);
        }, 100);
    }
    const handleApplyCode = () => {
        setTexte('');
        bottomSheetModalRef.current?.close();
    };
    const [selectedItemId, setSelectedItemId] = useState(0);

    // Animation Pop-up
    const [showPopup, setShowPopup] = useState(false);
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const popupTypeRef = useRef('');

    const handleShowPopup = () => {
        setIsVisible(true);
        Animated.timing(animation, {
            toValue: 1,
            duration: 250,
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
            duration: 250,
            useNativeDriver: false,
        }).start(() => {
            setIsVisible(false);
        });
    };
    const handleShowPopup2 = () => {
        setIsVisible2(true);
        Animated.timing(animation, {
            toValue: 1,
            duration: 250,
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
            duration: 250,
            useNativeDriver: false,
        }).start(() => {
            setIsVisible2(false);
        });
    };
    const handleShowPopup3 = () => {
        setIsVisible3(true);
        Animated.timing(animation, {
            toValue: 1,
            duration: 250,
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
            duration: 250,
            useNativeDriver: false,
        }).start(() => {
            setIsVisible3(false);
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

    const getUserInfo = async () => {
        try {
          const partyInfoData = await AsyncStorage.getItem('userInfo');
          if (partyInfoData) {
            const partyInfo = JSON.parse(partyInfoData);
            setUserInfo(partyInfo);
          }
        } catch (error) {
    
        }
      };



    {/* Lance la fonction pour récupères les infos sur la party */ }
    useEffect(() => {
        getPartyInfo();
        fetchUserInfo();
    }, []);

    {/* Sélectionne la 1ere partie */ }

    useEffect(() => {
        if (partyInfo && partyInfo.price && Object.keys(partyInfo.price).length > 0) {
            var index = 0;
            while (Object.values(partyInfo.dispo)[index] == false) {
                index++;
            }
            const firstPriceKey = Object.keys(partyInfo.price)[index];
            onSelectPrice(firstPriceKey, index);
        }
    }, [partyInfo]);




    {/* Fonction récupères les infos sur la party */ }
    const getPartyInfo = async () => {
        try {
            const partyInfoData = await AsyncStorage.getItem('party');
            if (partyInfoData) {
                const partyInfo = JSON.parse(partyInfoData);
                setPartyInfo(partyInfo)
                setIsLoading(false)
            }
        } catch (error) {

        }
    };

    {/* Fonction récupères les infos sur l'user */ }

    const fetchUserInfo = async () => {

        try {
            AsyncStorage.getItem('cookieEmail').then((cookieEmail) => {
                if (cookieEmail !== null) {
                    setEmail(cookieEmail);
                    const userInfoURL = `http://195.20.234.70:3000/connexion/${cookieEmail}`;
                    const requestOptionsInfoUser = {
                        method: "GET",
                        redirect: "follow",
                    };

                    fetch(userInfoURL, requestOptionsInfoUser)
                        .then(async (response) => {
                            const result = await response.text();
                            const infoUser = JSON.parse(result);
                            setUserInfo(infoUser);

                            AsyncStorage.setItem('userInfo', JSON.stringify(infoUser))
                                .then(() => {
                               
                                })
                                .catch((error) => {
                                });
                        })
                        .catch((error) => {
                        });
                } else {
                    getUserInfo();
                }
            });
        } catch (error) {
        }

    };



    {/* Fonction pour réserver sa partie */ }
    const onBuyParty = (partyId, price) => {



        if (promoCode) {

            var codePromoFind = false;
            var index = 0;

            const UrlAllReferralCode = "http://195.20.234.70:3000/connexion/code";
            var requestOptions = {
                method: "GET",
                redirect: "follow",
            };

            fetch(UrlAllReferralCode, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const allReferralCode = JSON.parse(result);
                    setAllReferralCode(allReferralCode);

                    while (!codePromoFind && index < allReferralCode.length) {
                        if (promoCode === allReferralCode[index]) {
                            
                            codePromoFind = true;

                            var updatedParty = {};

                            if (userInfo.attente !== null) {
                                updatedParty = { ...userInfo.attente }; 
                                updatedParty[partyId] = price; 
                            } else {
                                updatedParty = { [partyId]: price }; 
                            }


                            const UrlAllReferralCode = "http://195.20.234.70:3000/connexion/client/" + promoCode;
                            var requestOptions = {
                                method: "GET",
                                redirect: "follow",
                            };

                            fetch(UrlAllReferralCode, requestOptions)
                                .then((response) => response.text())
                                .then((result) => {
                                    const allInfoUser = JSON.parse(result);
                                    let nbrParrainage = parseInt(allInfoUser.numberParrainage);
                                    nbrParrainage = nbrParrainage + 1;

                                    let data = JSON.stringify({
                                        "numberParrainage": nbrParrainage
                                    });

                                    const UrlUpdateNbrParrainage = "http://195.20.234.70:3000/connexion/" + allInfoUser.id;

                                    const requestOptions = {
                                        method: "PATCH",
                                        redirect: "follow",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: data
                                    };

                                    fetch(UrlUpdateNbrParrainage, requestOptions)
                                        .then((response) => response.text())
                                        .then((result) => {

                                        })
                                        .catch((error) => console.log("error", error));

                                    let nbrParrainagePerso = userInfo.numberParrainage + 1

                                    let dataPerso = JSON.stringify({
                                        "numberParrainage": nbrParrainagePerso
                                    });

                                    const requestOptionsPerso = {
                                        method: "PATCH",
                                        redirect: "follow",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: dataPerso
                                    };


                                    const UrlUpdateNbrParrainagePerso = "http://195.20.234.70:3000/connexion/" + userInfo.id;

                                    fetch(UrlUpdateNbrParrainagePerso, requestOptionsPerso)
                                        .then((response) => response.text())
                                        .then((result) => {
                                        })
                                        .catch((error) => console.log("error", error));


                                    let data2 = JSON.stringify({
                                        "attente": updatedParty
                                    });

                                    const UrlUpdateParty = "http://195.20.234.70:3000/connexion/" + userInfo.id;

                                    const requestOptions2 = {
                                        method: "PATCH",
                                        redirect: "follow",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: data2
                                    };

                                    fetch(UrlUpdateParty, requestOptions2)
                                        .then((response) => response.text())
                                        .then((result) => {
                                            setUserInfo(prevUserInfo => ({ ...prevUserInfo, party_id: updatedParty }));
                                            const currentDate = new Date();
                                            const currentDateStr = currentDate.toISOString(); // Convertir en chaîne de caractères

                                            AsyncStorage.setItem(partyInfo.name, currentDateStr).then(() => {
                                            })
                                                .catch((error) => {
                                                });

                                            navigation.navigate('Home', { screen: 'TicketScreen' });
                                        })
                                        .catch((error) => console.log("error", error));
                                })
                                .catch((error) => console.log("error", error));

                            break;
                        }
                        index++;
                    }

                    if (!codePromoFind) {
                        handleShowPopup2();
                    }
                })
                .catch((error) => console.log("error", error));
        } else {
            var updatedParty = {};

            if (userInfo.attente !== null) {
                updatedParty = { ...userInfo.attente }; // Copie les propriétés existantes de `userInfo.party_id` dans `updatedParty`
                updatedParty[partyId] = price; // Ajoute une nouvelle propriété avec `partyId` comme clé et `price` comme valeur

            } else {
                updatedParty = { [partyId]: price }; // Crée un nouvel objet avec une seule propriété, `partyId` comme clé et `price` comme valeur

            }

            let data2 = JSON.stringify({
                "attente": updatedParty
            });

            const UrlUpdateParty = "http://195.20.234.70:3000/connexion/" + userInfo.id;

            const requestOptions2 = {
                method: "PATCH",
                redirect: "follow",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data2
            };

            fetch(UrlUpdateParty, requestOptions2)
                .then((response) => response.text())
                .then((result) => {
                   
                    setUserInfo(prevUserInfo => ({ ...prevUserInfo, party_id: updatedParty }));
                    const currentDate = new Date();
                    const currentDateStr = currentDate.toISOString();

                    AsyncStorage.setItem(partyInfo.name, currentDateStr).then(() => {
                    })
                        .catch((error) => {
                        });

                    navigation.navigate('Home', { screen: 'TicketScreen' });
                })
                .catch((error) => console.log("error", error));
        }
    }

    const onSelectPrice = (priceSelected, indexSelected) => {

        setSelectedItemId(indexSelected)

        setSelectedPrice(partyInfo.price[priceSelected]);

        setNombreDeConso(priceSelected)

        for (const key in partyInfo.price) {
            if (key == nombreDeConso) {
                setValeurClefConso(key);

                break;
            }
        }
    }

    const onApplyReferralCode = (referralCode) => {

        if (referralCode === "") {
            handleShowPopup();
        }
        if (referralCode === userInfo.referralcode) {
            handleShowPopup3();
            return;
        }
        else if (referralCode) {

            var codePromoFind = false;
            var index = 0;

            const UrlAllReferralCode = "http://195.20.234.70:3000/connexion/code";
            var requestOptions = {
                method: "GET",
                redirect: "follow",
            };

            fetch(UrlAllReferralCode, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const allReferralCode = JSON.parse(result);
                    setAllReferralCode(allReferralCode);

                    while (!codePromoFind && index < allReferralCode.length) {
                        if (referralCode === allReferralCode[index]) {
                            codePromoFind = true;
                            setPromoCode(referralCode)
                            handleApplyCode();
                            break;
                        }
                        index++;
                    }


                    if (!codePromoFind) {
                        handleShowPopup2()
                    }
                })
                .catch((error) => console.log("error", error));
        }
    }

    const goBack = () => {
        navigation.goBack()
    }


    {/* Font */ }
    if (!fontsLoaded) {
        return null;
    }

    return (
        <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
            <StatusBar backgroundColor="transparent" translucent />
            <View style={{ top: 50, height: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 25 }}>
                    <TouchableOpacity >
                        <Ionicons onPress={goBack} name="chevron-back" size={SIZES.xLarge} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePresentModal}>
                        <Text style={{ marginLeft: 15, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>Promo code</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ color: COLORS.white, fontSize: SIZES.xLarge, fontFamily: 'MonumentExtended-Ultrabold', marginHorizontal: 25, textTransform: 'uppercase', marginTop: 25 }}>TICKETS</Text>
                <ScrollView vertical showsVerticalScrollIndicator={false} style={{ marginTop: 15, marginHorizontal: 25, marginBottom: 280 }}>
                    {isLoading ? (
                        <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "70%" }}>
                            <ActivityIndicator color={COLORS.gray} size={100} style={{ justifyContent: "center", alignItems: "center" }}></ActivityIndicator>
                        </View>
                    ) : (
                        userInfo.bracelet ? (

                            Object.keys(partyInfo.price).map((priceKey, index) => {
                                const price = partyInfo.price[priceKey];
                                const drink = priceKey;
                                const soldOut = Object.values(partyInfo.dispo)[index]

                                return (

                                    <View key={index} style={{ borderColor: COLORS.tertary, borderWidth: 2, width: '100%', height: 100, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, borderRadius: 5, marginBottom: 25 }}>
                                        <View>
                                            <Text style={{ fontSize: SIZES.large, textTransform: 'uppercase', fontFamily: 'SpaceGrotesk-Bold', color: COLORS.secondary }}>{partyInfo.name}</Text>
                                            <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>{price[1]}€</Text>
                                            {partyInfo.boat === '' ? (
                                                <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray }}>{drink} drink</Text>
                                            ) : (
                                                <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray }}>{partyInfo.boat}</Text>
                                            )}
                                        </View>
                                        {!soldOut ? (
                                            <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.error, height: 30, alignItems: 'center', paddingHorizontal: 10, borderRadius: 25, borderColor: COLORS.tertary, borderWidth: 2, textTransform: 'uppercase' }}>sold out</Text>
                                        ) : (
                                            <TouchableOpacity onPress={() => onSelectPrice(priceKey, index)}>
                                                <View style={{ width: 24, height: 24, borderRadius: 5, borderWidth: 2, borderColor: selectedItemId === index ? COLORS.primary : COLORS.white, backgroundColor: selectedItemId === index ? COLORS.primary : 'transparent', justifyContent: 'center', alignItems: 'center', }} >
                                                    {selectedItemId === index && <Ionicons name="checkmark" size={20} color={COLORS.white} />}
                                                </View>
                                            </TouchableOpacity>
                                        )}


                                    </View>
                                );

                            })

                        ) : (
                            Object.keys(partyInfo.price).map((priceKey, index) => {
                                const price = partyInfo.price[priceKey];
                                const drink = priceKey;
                                const soldOut = Object.values(partyInfo.dispo)[index]

                                return (

                                    <View key={index} style={{ borderColor: COLORS.tertary, borderWidth: 2, width: '100%', height: 100, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, borderRadius: 5, marginBottom: 25 }}>
                                        <View>
                                            <Text style={{ fontSize: SIZES.large, textTransform: 'uppercase', fontFamily: 'SpaceGrotesk-Bold', color: COLORS.secondary }}>{partyInfo.name}</Text>
                                            <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>{price[0]}€</Text>
                                            {partyInfo.boat === '' ? (
                                                <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray }}>{drink} drink</Text>
                                            ) : (
                                                <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray }}>{partyInfo.boat}</Text>
                                            )}
                                        </View>
                                        {!soldOut ? (
                                            <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.error, height: 30, alignItems: 'center', paddingHorizontal: 10, borderRadius: 25, borderColor: COLORS.tertary, borderWidth: 2, textTransform: 'uppercase' }}>sold out</Text>
                                        ) : (
                                            <TouchableOpacity onPress={() => onSelectPrice(priceKey, index)}>
                                                <View style={{ width: 24, height: 24, borderRadius: 5, borderWidth: 2, borderColor: selectedItemId === index ? COLORS.primary : COLORS.white, backgroundColor: selectedItemId === index ? COLORS.primary : 'transparent', justifyContent: 'center', alignItems: 'center', }} >
                                                    {selectedItemId === index && <Ionicons name="checkmark" size={20} color={COLORS.white} />}
                                                </View>
                                            </TouchableOpacity>
                                        )}


                                    </View>
                                );

                            })
                        )
                    )}


                </ScrollView>
            </View>

            <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    {partyInfo.boat === '' ? (
                        <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, marginHorizontal: 25 }}>1 ticket selected - {nombreDeConso} drink</Text>
                    ) : (
                        <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, marginHorizontal: 25 }}>1 ticket selected - {partyInfo.boat} </Text>
                    )}
                    {promoCode ? (
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 25, marginTop: 5 }}>
                            <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray }}>Promo Code</Text>
                            <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray }}>{promoCode}</Text>
                        </View>
                    ) : (
                        null
                    )}
                    {userInfo.bracelet ? (
                        <>
                            <View style={{ backgroundColor: COLORS.gray, height: 1, marginHorizontal: 25, marginVertical: 15 }}></View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 25 }}>
                                <Text style={{ fontSize: SIZES.xLarge, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>Total</Text>
                                <Text style={{ fontSize: SIZES.xLarge, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>{selectedPrice[1]}€</Text>
                            </View>
                            <ButtonComponent onPress={showPopUp} colorText={COLORS.white} buttonBackground={COLORS.primary} buttonText="Booked" animated={false} />
                        </>

                    ) : (
                        <>
                            <View style={{ backgroundColor: COLORS.gray, height: 1, marginHorizontal: 25, marginVertical: 15 }}></View>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginHorizontal: 25 }}>
                                <Text style={{ fontSize: SIZES.xLarge, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>Total</Text>
                                <Text style={{ fontSize: SIZES.xLarge, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>{selectedPrice[0]}€</Text>
                            </View>
                            <ButtonComponent onPress={showPopUp} colorText={COLORS.white} buttonBackground={COLORS.primary} buttonText="Booked" animated={false} />
                        </>

                    )}

                    <Text style={{ marginBottom: 30 }}></Text>
                    {/*POP UP*/}
                    <BottomSheetModalProvider>
                        <BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={snapPoints} backgroundStyle={{ borderRadius: 50 }} onDismiss={() => setIsOpen(false)}>
                            <View style={{ padding: 16 }}>
                                <Text style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.tertary, marginHorizontal: 25 }}>Add promo code</Text>
                                <View style={{ marginHorizontal: 25, flexDirection: 'row', alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: COLORS.graylight, borderRadius: 5, padding: 10, position: 'relative' }}>
                                    <TextInput style={{ fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold', flex: 1, color: COLORS.tertary, }} placeholder={"Promo Code"} placeholderTextColor={COLORS.graylight} maxLength={8} value={texte} onChangeText={handleChangeText} />
                                </View>
                                <ButtonComponent onPress={() => { handleApplyCode; onApplyReferralCode(texte) }} colorText={COLORS.white} buttonBackground={COLORS.primary} buttonText="Apply code" />
                            </View>
                        </BottomSheetModal>
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </View>
            {/* Pop-up */}
            {showPopup && (
                <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} onPress={hidePopUp}>
                    <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', opacity: scaleAnim }}>
                        <TouchableWithoutFeedback>
                            <View style={{ backgroundColor: COLORS.white, borderRadius: 20, marginHorizontal: 40, padding: 30 }}>
                                <Text style={{ fontSize: SIZES.large, textAlign: 'center', fontFamily: 'SpaceGrotesk-Bold', color: COLORS.black }}>Are you sure you want to book this ticket?</Text>
                                <ButtonComponent onPress={handleCancel} colorText={COLORS.white} buttonBackground={COLORS.graylight} buttonText="Cancel" />
                                {userInfo.bracelet ? (
                                    <ButtonComponent onPress={() => onBuyParty(partyInfo.id, selectedPrice[1])} colorText={COLORS.white} buttonBackground={COLORS.valid} buttonText="Confirm" />

                                ) : (
                                    <ButtonComponent onPress={() => onBuyParty(partyInfo.id, selectedPrice[0])} colorText={COLORS.white} buttonBackground={COLORS.valid} buttonText="Confirm" />
                                )}
                                <Text style={{ fontSize: SIZES.small, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray, marginTop: 10 }}>By pressing the "Confirm" button, you agree to come to the Unite shop within 24 hours to take your ticket.</Text>
                                                
                            </View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </TouchableOpacity>
            )}
            {isVisible && (
                <Animated.View style={{ position: 'absolute', bottom: 30, width: '85%', paddingHorizontal: 15, marginHorizontal: 25, paddingVertical: 10, backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 25, flexDirection: 'row', alignItems: 'center', transform: [{ translateY: interpolateY }], opacity: interpolateOpacity }} >
                    <Ionicons name="alert-circle" size={SIZES.xLarge} color={COLORS.error} style={{ marginRight: 5 }} />
                    <Text style={{ color: COLORS.white, fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>Please enter a promo code</Text>
                </Animated.View>
            )}
            {isVisible2 && (
                <Animated.View style={{ position: 'absolute', bottom: 30, width: '85%', paddingHorizontal: 15, marginHorizontal: 25, paddingVertical: 10, backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 25, flexDirection: 'row', alignItems: 'center', transform: [{ translateY: interpolateY }], opacity: interpolateOpacity }} >
                    <Ionicons name="alert-circle" size={SIZES.xLarge} color={COLORS.error} style={{ marginRight: 5 }} />
                    <Text style={{ color: COLORS.white, fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>Promo code doesn't exist</Text>
                </Animated.View>
            )}
            {isVisible3 && (
                <Animated.View style={{ position: 'absolute', bottom: 30, width: '85%', paddingHorizontal: 15, marginHorizontal: 25, paddingVertical: 10, backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 25, flexDirection: 'row', alignItems: 'center', transform: [{ translateY: interpolateY }], opacity: interpolateOpacity }} >
                    <Ionicons name="alert-circle" size={SIZES.xLarge} color={COLORS.error} style={{ marginRight: 5 }} />
                    <Text style={{ color: COLORS.white, fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>Smart guy, it's your promo code</Text>
                </Animated.View>
            )}

        </LinearGradient>
    );
}

export default BookTicketScreen;