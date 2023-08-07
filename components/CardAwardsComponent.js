import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Image, Dimensions, TouchableOpacity, SafeAreaView, Linking, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useCustomFonts } from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';

const CardAwardsComponent = (awards, tempsRestant) => {
    const [iconColor, setIconColor] = useState(COLORS.tertary);
    const [isTimerEnding, setIsTimerEnding] = useState(false);
    const [remainingTime, setRemainingTime] = useState(awards.tempsRestant);


    useEffect(() => {
        if (remainingTime <= 0) {
            return;
        }
        if (remainingTime <= 10 * 60) {
            setIsTimerEnding(true);
        }
        const interval = setInterval(() => {
            setRemainingTime(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime]);

    useEffect(() => {
        if (remainingTime <= 0) {
            return;
        }
        let color = COLORS.tertary;
        let iconColor = COLORS.tertary;
        if (remainingTime <= 30 * 60) {
            color = COLORS.secondary;
            iconColor = COLORS.secondary;
        }
        if (remainingTime <= 15 * 60) {
            color = COLORS.error;
            iconColor = COLORS.error;
        }

        setTimerStyle({ color });
        setIconColor(iconColor);
    }, [remainingTime]);

    const [timerStyle, setTimerStyle] = useState({});
    const formatTime = timeInSeconds => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    const shakeAnimation = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isTimerEnding) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(shakeAnimation, {
                        toValue: 0.9,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnimation, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        }
    }, [isTimerEnding, shakeAnimation]);

    const animatedStyles = {
        transform: [{ scale: shakeAnimation }],
    };
    const [showPopup, setShowPopup] = useState(false);
    const handleIncreasePoint = () => {
        setShowPopup(true);
    };

    {/* Map */ }
    const latitude = 35.92194638446071
    const longitude = 14.49090369295149
    const ouvrirGoogleMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(url);
    };
    const { width } = Dimensions.get('window');

    {/* Navigation */ }
    const navigation = useNavigation();
    const BraceletScreen = () => {
        navigation.navigate('BraceletScreen');
    };
    const videoWidth = width - 32;
    const videoHeight = (9 / 16) * videoWidth;

    {/* Font */ }
    const fontsLoaded = useCustomFonts();
    if (!fontsLoaded) {
        return null;
    }

    return (
        <TouchableOpacity style={{ marginBottom: 40 }}>
            <View style={{ borderRadius: 5, overflow: 'hidden', marginHorizontal: 25 }}>
                {awards.awards == "club" ? (
                    <Image source={require('../assets/images/Club77Fond.png')} style={{ width: videoWidth, height: videoHeight, resizeMode: 'cover' }} />
                ) : awards.awards === "pool" ? (
                    <Image source={require('../assets/images/PoolFond.png')} style={{ width: videoWidth, height: videoHeight, resizeMode: 'cover' }} />
                ) : (
                    <Image source={require('../assets/images/BoatFond.png')} style={{ width: videoWidth, height: videoHeight, resizeMode: 'cover' }} />

                )}
                <View style={{ position: 'absolute', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.white, height: 45 }}>
                    <Text style={{ color: COLORS.tertary, marginLeft: 10, fontFamily: 'MonumentExtended-Ultrabold', fontSize: 14, marginRight: 10, textTransform: 'uppercase' }}>Time left :</Text>
                    <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }, animatedStyles]}>
                        <Text style={[{ color: COLORS.tertary, fontFamily: 'MonumentExtended-Ultrabold', fontSize: 14, marginRight: 5, textTransform: 'uppercase' }, timerStyle]}>{formatTime(remainingTime)}
                        </Text>
                        <Ionicons name={'alarm'} size={20} color={iconColor} />
                    </Animated.View>
                </View>

                <TouchableOpacity onPress={handleIncreasePoint} style={{ position: 'absolute', bottom: 10, right: 10, width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                    <Ionicons name="home" size={24} color={COLORS.white} />
                </TouchableOpacity>
                {showPopup && (
                    <Modal transparent={true} animationType="fade">
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            activeOpacity={1}
                            onPress={() => setShowPopup(false)}>
                            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ backgroundColor: COLORS.graylight, borderRadius: 10, padding: 20, marginHorizontal: 25 }}>
                                    <Text style={{ fontSize: SIZES.large, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.tertary, marginBottom: 10, textAlign: 'center' }}>Unite shop adress</Text>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: COLORS.tertary, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, textAlign: 'center' }}>13 Triq Paceville, San Ġiljan</Text>
                                        <Text style={{ marginBottom: 15, color: COLORS.tertary, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, textAlign: 'center' }}>Beside the Bellini</Text>
                                    </View>
                                    <View style={{ borderRadius: 25, marginBottom: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondary, height: 40, flexDirection: 'row' }}>
                                        <Ionicons name="time-outline" size={24} color={COLORS.white} style={{ marginRight: 10 }} />
                                        <Text style={{ color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', textTransform: 'uppercase', fontSize: SIZES.medium }}>14:00 - 18:00</Text>
                                    </View>
                                    <TouchableOpacity onPress={ouvrirGoogleMaps} style={{ borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', height: 40, flexDirection: 'row' }}>
                                        <Ionicons name="location-outline" size={24} color={COLORS.white} style={{ marginRight: 10 }} />
                                        <Text style={{ color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', textTransform: 'uppercase', fontSize: SIZES.medium }}>OPen google map</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                )}
            </View>
            {
                awards.awards === "club" ? (
                    <Text style={{ marginHorizontal: 25, color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', textTransform: 'uppercase', fontSize: SIZES.large, marginTop: 10 }}>Party at club 77</Text>
                ) : awards.awards === "pool" ? (
                    <Text style={{ marginHorizontal: 25, color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', textTransform: 'uppercase', fontSize: SIZES.large, marginTop: 10 }}>Party at Gianpula</Text>
                ) : (
                    <Text style={{ marginHorizontal: 25, color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', textTransform: 'uppercase', fontSize: SIZES.large, marginTop: 10 }}>Boat Party</Text>
                )
            }

            <Text style={{ marginHorizontal: 25, color: COLORS.gray, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', marginTop: 2 }}>By Unitevents </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 25 }}>
                <Text style={{ color: COLORS.secondary, fontFamily: 'SpaceGrotesk-Bold', textTransform: 'uppercase', fontSize: SIZES.xMedium }}>AWARDS</Text>
                <View style={{ height: 35, paddingHorizontal: 15, flexDirection: 'row', borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.tertary, marginTop: -5, }}>
                    <Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.large }} >AWARDS</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default CardAwardsComponent;