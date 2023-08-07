import { View, Text,  StatusBar, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {COLORS, SIZES} from '.././constants/theme'
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const TermsScreen = () => {

    {/* Navigation */}
    const navigation = useNavigation();
    const onSettingScreen = () => {
      navigation.navigate('SettingScreen');
    };

  {/* Font */}
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" translucent />
        <SafeAreaView SafeAreaView style={{ top: 50 }}>
            <View style={{ flexDirection: 'row',  marginHorizontal: 25, alignItems:'center' }}>
                <TouchableOpacity onPress={onSettingScreen}>
                    <Ionicons name="chevron-back" size={SIZES.xLarge} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={{marginLeft: 15, fontSize: SIZES.medium, textTransform:'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white}}>Terms and Conditions</Text>
            </View>

            <ScrollView vertical style={{marginTop:25, height:'84%'}}>
                <View style={{backgroundColor:COLORS.tertary, paddingHorizontal:25, paddingVertical:10}}>
                    <Text style={{fontSize: SIZES.medium, textTransform:'uppercase',fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary}}>Acceptance of Terms</Text>
                </View>
                <Text style={{marginVertical:20,marginHorizontal:25, lineHeight: 24, fontSize: SIZES.medium,fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white}}>By downloading, installing, or using this application, you fully and unreservedly accept these terms and conditions. If you do not agree to these terms, please do not use the application.</Text>
                <View style={{backgroundColor:COLORS.tertary, paddingHorizontal:25, paddingVertical:10}}>
                    <Text style={{fontSize: SIZES.medium, textTransform:'uppercase',fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary}}>Use of the Application</Text>
                </View>
                <Text style={{marginVertical:20,marginHorizontal:25, lineHeight: 24, fontSize: SIZES.medium,fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white}}>You are authorized to use this application for personal, non-commercial purposes. You must not use the application in a way that violates any laws or regulations. Any abusive use of the application is strictly prohibited.</Text>
                <View style={{backgroundColor:COLORS.tertary, paddingHorizontal:25, paddingVertical:10}}>
                    <Text style={{fontSize: SIZES.medium, textTransform:'uppercase',fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary}}>Intellectual Property</Text>
                </View>
                <Text style={{marginVertical:20,marginHorizontal:25, lineHeight: 24, fontSize: SIZES.medium,fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white}}>The application and all its content, including but not limited to text, graphics, logos, images, videos, icons, and software, are the exclusive property of our company and are protected by intellectual property laws. You are not allowed to reproduce, distribute, modify, display, or use the content of the application in any way without our prior written consent</Text>
                <View style={{backgroundColor:COLORS.tertary, paddingHorizontal:25, paddingVertical:10}}>
                    <Text style={{fontSize: SIZES.medium, textTransform:'uppercase',fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary}}>Data Privacy</Text>
                </View>
                <Text style={{marginVertical:20,marginHorizontal:25, lineHeight: 24, fontSize: SIZES.medium,fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white}}>We highly value the privacy of your personal data. Our privacy policy explains how we collect, use, and protect your information. By using this application, you consent to the collection, use, and disclosure of your personal information in accordance with our privacy policy.</Text>
                <View style={{backgroundColor:COLORS.tertary, paddingHorizontal:25, paddingVertical:10}}>
                    <Text style={{fontSize: SIZES.medium, textTransform:'uppercase',fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary}}>Limitation of Liability</Text>
                </View>
                <Text style={{marginVertical:20,marginHorizontal:25, lineHeight: 24, fontSize: SIZES.medium,fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white}}>We strive to keep the application up-to-date, secure, and accessible, but we cannot guarantee its uninterrupted or error-free operation. We disclaim any liability for any direct, indirect, incidental, consequential, or special damages resulting from the use or inability to use the application.</Text>
                <View style={{backgroundColor:COLORS.tertary, paddingHorizontal:25, paddingVertical:10}}>
                    <Text style={{fontSize: SIZES.medium, textTransform:'uppercase',fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary}}>Changes to the Terms</Text>
                </View>
                <Text style={{marginTop:20, marginBottom:10,marginHorizontal:25, lineHeight: 24, fontSize: SIZES.medium,fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white}}>We reserve the right to modify these terms and conditions at any time and without prior notice. It is your responsibility to regularly review the updated terms. Your continued use of the application after any modifications constitutes your acceptance of the new terms.</Text>
                <Text style={{marginVertical:10,marginHorizontal:25, lineHeight: 24, fontSize: SIZES.medium,fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white}}>We recommend that you carefully read the terms and conditions before using the application. If you have any questions, please contact us at the provided address within the application.</Text>
                <Text style={{marginVertical:10,marginHorizontal:25, lineHeight: 24, fontSize: SIZES.medium,fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white}}>By using this application, you fully and unreservedly accept the terms and conditions.</Text>
                <Text style={{marginVertical:10,marginHorizontal:25, lineHeight: 24, fontSize: SIZES.medium,fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white}}>Thank you for your understanding and enjoy using the application!</Text>
            </ScrollView>
        </SafeAreaView>
    </LinearGradient>
  )
}

export default TermsScreen
