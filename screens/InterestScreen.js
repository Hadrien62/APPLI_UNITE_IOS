import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '.././constants/theme'
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonComponent from '../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardComponent from '../components/CardComponent';
import { eachDayOfInterval, addDays, format, isSameDay, isToday, isTomorrow, parseISO } from 'date-fns';




const InterestScreen = () => {

  {/* Constantes */ }
  const [userInfo, setUserInfo] = useState('');
  const [infoParty, setInfoParty] = useState([]); // Parties disponibles
  const [vailableDates, setVailableDates] = useState([]);
  const [availableParties, setAvailableParties] = useState([]);

  {/* Navigation */ }
  const navigation = useNavigation();
  const onMenuPage = () => {
    fetchUserInfo();
    navigation.goBack();
  };


  {/* Font */ }
  const fontsLoaded = useCustomFonts(); ``

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

  const fetchUserInfo = async () => {
    try {
      AsyncStorage.getItem('cookieEmail').then((cookieEmail) => {
        if (cookieEmail !== null) {
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
  }

  {/* récupérer les infos des party */}
  const getPartyInfo = async () => {

    const vailableDates = [];

    const UrlRecupPartyById = "http://195.20.234.70:3000/events/total/tout";

    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(UrlRecupPartyById, requestOptions)
      .then((response) => response.text())
      .then((result) => {

        const infosDeLaParty = JSON.parse(result);
        setInfoParty(infosDeLaParty);

      })

      .catch((error) => console.log("error", error), alwaysNewParty = false);

  }

  {/* UseEffect */ }
  useEffect(() => {
    getPartyInfo();
    fetchUserInfo();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  {/* récupère les infos pour afficher les party dans la flatlist */}
  const data = [];

  infoParty.forEach((item) => {
    item.favori = false;
    data.push({ type: 'party', party: item });

  });

  {/* Fonction pour cliquer sur le coeur */}
  const handleHeartPress = (partyData) => {

    if (!partyData.colorHeart) {
      if (userInfo.favoris == null) {
        var tabFavoris = [];
        tabFavoris.push(partyData.id)
        partyData.colorHeart = true;
      } else {
        var tabFavoris = userInfo.favoris;
        tabFavoris.push(partyData.id)
        partyData.colorHeart = true;
      }
    } else {
      var tabFavoris = userInfo.favoris;
      let elementASupprimer = partyData.id;
      let index = tabFavoris.indexOf(elementASupprimer);

      if (index !== -1) {
        tabFavoris.splice(index, 1);
      }
      partyData.colorHeart = false;

    }

    let data = JSON.stringify({
      "favoris": tabFavoris
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
        fetchUserInfo();
        updateFavoris(tabFavoris)

      })
      .catch(error => console.log('error', error));




  };

  const updateFavoris = async (favoris) => {
    try {
      const updatedUserInfo = { ...userInfo, favoris };
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo);
    } catch (error) {
    }
  };

  const RedirectionPartyInfo = (party) => {

    AsyncStorage.setItem('party', JSON.stringify(party))
      .then(() => {
        navigation.navigate('EventInformationScreen');
      })
      .catch((error) => {
      });

  }


  return (

    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={{ top: 50 }}>
        {/*  Header */}
        <View style={{ flexDirection: 'row', marginHorizontal: 25, alignItems: 'center' }}>
          <TouchableOpacity onPress={onMenuPage}>
            <Ionicons name="chevron-down" size={SIZES.xLarge} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={{ marginLeft: 15, fontSize: SIZES.medium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white }}>Interested</Text>
        </View>

        {/* Interest */}
        {(!userInfo || !userInfo.favoris || userInfo.favoris.length === 0) ? (

          <ScrollView vertical style={{ marginBottom: 90, marginTop: 25 }}>
            <View style={{ marginHorizontal: 50, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, textAlign: 'center', fontSize: SIZES.large, marginBottom: 8, marginTop: 40 }}>No interested at the moment</Text>
              <Text style={{ fontFamily: 'SpaceGrotesk-Regular', textAlign: 'center', lineHeight: 24, color: COLORS.gray, fontSize: SIZES.medium }}>Find here the events that interest you. There are new ones every week.</Text>
            </View>
            <View style={{ marginHorizontal: 100 }}>
              <ButtonComponent onPress={onMenuPage} buttonText="Explore" animated={true}></ButtonComponent>
            </View>
          </ScrollView>
        ) : (
          <View style={{ marginTop: 25 }} >
            <FlatList
              data={data}
              style={{ flexGrow: 1 }}  
              showsHorizontalScrollIndicator={false}

              renderItem={({ item, index }) => {

                if (userInfo && userInfo.favoris && userInfo.favoris.includes(item.party.id)) {

                  var videoNameWithoutSpace = item.party.video_name.replace(/\s/g, '');
                  var videoUrl = "http://195.20.234.70:3000/events/photo/" + videoNameWithoutSpace;

                  var imgUrl = "http://195.20.234.70:3000/events/photo/" + item.party.image_name;

                  if (item.party.image_name == "") {
                    imgUrl = "http://195.20.234.70:3000/events/photo/Fond.png";
                  }
                  item.favori = true;


                  return (

                    <CardComponent
                      id={item.party.id}
                      title={item.party.name}
                      date={format(parseISO(item.party.date), 'EEE dd MMM')}
                      time={`${item.party.start_time.substring(0, 5)} - ${item.party.end_time.substring(0, 5)}`}
                      price1={item.party.price?.["0"]?.[1]}
                      price2={item.party.price?.["0"]?.[0]}
                      image={imgUrl}
                      video={videoUrl}
                      party={item.party}
                      onPress={() => RedirectionPartyInfo(item.party)} 
                      onHeartPress={handleHeartPress}
                      isHeartPressed2={item.favori}

                    />


                  );
                }
              }}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={
                data.length > 0 && data[data.length - 1].type === 'party' ? (
                  <View style={{ marginBottom: 100 }} />
                ) : null
              }

            />

          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  )
}

export default InterestScreen
