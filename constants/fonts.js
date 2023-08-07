import { useFonts } from "expo-font";

export const useCustomFonts = () => {
    const [fontsLoaded] = useFonts({
        'SpaceGrotesk-Bold' : require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
        'SpaceGrotesk-Regular' : require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
        'MonumentExtended-Ultrabold' : require('../assets/fonts/MonumentExtended-Ultrabold.otf'),
        'TitilliumWeb-Bold' : require('../assets/fonts/TitilliumWeb-Bold.ttf'),
    });
    return fontsLoaded;
};