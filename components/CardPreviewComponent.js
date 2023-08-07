import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Vibration, Image, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '.././constants/theme';
import { useCustomFonts } from '../constants/fonts';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';



const CardPreviewComponent = ({ title, date, time, price, image, drink, onPress, }) => {

    const { width } = Dimensions.get('window');

    const navigation = useNavigation();

    const videoWidth = width - 32;
    const videoHeight = (9 / 16) * videoWidth;


    {/* Font */ }
    const fontsLoaded = useCustomFonts();
    if (!fontsLoaded) {
        return null;
    }



    return (
        <View style={{ marginBottom: 40 }} >
            <View style={{ borderRadius: 5, overflow: 'hidden', marginHorizontal: 25 }}>
                <Image source={{ uri: image }} style={{ width: videoWidth, height: videoHeight, resizeMode: 'cover' }} />
            </View>

            <Text style={{ marginHorizontal: 25, color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', fontSize: SIZES.large, textTransform: 'uppercase', marginTop: 10 }}>{title}</Text>
            <View style={{ flexDirection: 'row', marginHorizontal: 25, marginTop: 5 }}>
                <Text style={{ color: COLORS.gray, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase' }}>{drink} Drink
                </Text>
                <Ionicons name="wine-outline" size={20} color={COLORS.gray} style={{ marginLeft: 5 }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 25 }}>
                <View style={{ flexDirection: 'row', marginTop: -5 }}>
                    <Text style={{ color: COLORS.secondary, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium }}>{date}</Text>
                    <Text style={{ color: COLORS.gray, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium }}> | </Text>
                    <Text style={{ color: COLORS.secondary, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium }}>{time}</Text>
                </View>
                <View style={{ height: 35, paddingHorizontal: 5, flexDirection: 'row', borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.tertary, marginTop: -5, }}>
                    <Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium }} >
                        {price}€
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default CardPreviewComponent;
