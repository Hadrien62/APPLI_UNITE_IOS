import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SafeAreaView, StyleSheet, View } from 'react-native';

import BraceletScreen from '../screens/BraceletScreen'
import EventScreen from '../screens/EventScreen'
import ProfilScreen from '../screens/ProfilScreen'
import TicketScreen from '../screens/TicketScreen'
import { Ionicons } from '@expo/vector-icons';
import {COLORS, SIZES} from '.././constants/theme'


const Tab = createBottomTabNavigator();

function Routes(){
    return(
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.white,
                tabBarShowLabel: false,
                tabBarStyle:{
                    position: 'absolute',
                    backgroundColor: COLORS.tertary,
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 50,
                }
            }}
            >
            
            <Tab.Screen
            name="EventScreen"
            component={EventScreen}
            options= {{
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if(focused){
                        return <Ionicons name="flash" size={size} color={color}/>
                    }
                    return <Ionicons name="flash-outline" size={size} color={color}/>
                }
            }}
            />

            <Tab.Screen
            name="TicketScreen"
            component={TicketScreen}
            options= {{
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if(focused){
                        return <Ionicons name="pricetag" size={size} color={color}/>
                    }
                    return <Ionicons name="pricetag-outline" size={size} color={color}/>
                }
            }}
            />

            <Tab.Screen
            name="BraceletScreen"
            component={BraceletScreen}
            options= {{
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if(focused){
                        return <Ionicons name="aperture" size={size} color={color}/>
                    }
                    return <Ionicons name="aperture-outline" size={size} color={color}/>
                }
            }}
            />

            <Tab.Screen
            name="ProfilScreen"
            component={ProfilScreen}
            options= {{
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if(focused){
                        return <Ionicons name="person" size={size} color={color}/>
                    }
                    return <Ionicons name="person-outline" size={size} color={color}/>
                }
            }}
            />
        </Tab.Navigator>
    )
}
export default Routes;