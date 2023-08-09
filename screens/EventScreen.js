import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, Animated, TouchableOpacity, ScrollView, Dimensions, Pressable, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../components/StyleSheet';
import SettingComponent from '../components/SettingComponent';
import { eachDayOfInterval, addDays, format, isSameDay, isToday, isTomorrow, parseISO } from 'date-fns';
import CardComponent from '../components/CardComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color } from 'react-native-reanimated';



const windowWidth = Dimensions.get('window').width;

const getDaysRemainingInTwoMonths = (date) => {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const endMonth = currentMonth + 2;
  const endDate = new Date(currentYear, endMonth, 1, 4, 0, 0, 0); 
  const daysRemaining = Math.max(0, (endDate - date) / (1000 * 60 * 60 * 24));

  return daysRemaining;
};


const EventScreen = () => {
  const navigation = useNavigation();
  const scrollRef = useRef(null);

  // DAte
  const [selectedDay, setSelectedDay] = useState(new Date());
  const today = new Date();
  const startDate = today;
  const endDate = addDays(today, getDaysRemainingInTwoMonths(today));
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  const weeks = [];

  //Variables 
  const [infoParty, setInfoParty] = useState([]); 
  const [selectedParty, setSelectedParty] = useState(null);
  const [vailableDates, setVailableDates] = useState([]);
  const [availableParties, setAvailableParties] = useState([]);
  const flatListRef = useRef(null); 
  const [contentOffsetY, setContentOffsetY] = useState(0);
  const flatListContainerRef = useRef(null);
  const separatorRef = useRef(null);
  const separatorPositions = {}; 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [enTrainDeRafraichir, setEnTrainDeRafraichir] = useState(false);

  const handleRafraichissement = () => {
    setEnTrainDeRafraichir(true);
    getPartyInfo();
    setEnTrainDeRafraichir(false); 
  };


  const extraHeight = windowWidth + 100;



  while (dates.length > 0) {
    const week = dates.splice(0, 7);
    weeks.push(week);
  }
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
                 
                  updateFavoris(userInfo.favoris)
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


  // récupérer les infos des party 
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

        weeks.map((week) => {
          week.map((day) => {

            const dateString = format(day, 'yyyy-MM-dd');
            if (infosDeLaParty.some((party) => party.date.substring(0, 10) === dateString)) {
              vailableDates.push(dateString);
            }
          });
        })
        setVailableDates(vailableDates);

        const availableParties = infosDeLaParty.filter((party) =>
          vailableDates.includes(party.date.substring(0, 10))
        );

        const sortedAvailableParties = availableParties.sort(sortEventsByDateAndTime);
        setAvailableParties(sortedAvailableParties);


      })

      .catch((error) => console.log("error", error), alwaysNewParty = false);

  }

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {

      const firstVisibleItem = viewableItems[0];
      if (firstVisibleItem.item.type === 'separator') {
        const selectedDateString = format(parseISO(firstVisibleItem.item.date), 'yyyy-MM-dd');
        setSelectedDay(new Date(selectedDateString));
      }
    }

    if (viewableItems.length > 0) {
      const firstVisibleItem = viewableItems[0];
      if (firstVisibleItem.item.type === 'separator') {
        const selectedDateString = format(parseISO(firstVisibleItem.item.date), 'yyyy-MM-dd');
        setSelectedDay(new Date(selectedDateString));
      }
    }
  }).current;


  useEffect(() => {
    const currentWeekIndex = weeks.findIndex((week) => week.some((date) => isSameDay(date, today)));
    if (scrollRef.current && currentWeekIndex !== -1) {
      setTimeout(() => {
        scrollRef.current.scrollTo({ x: windowWidth * currentWeekIndex, animated: true });
      }, 0);
    }
  }, []);

  useFocusEffect( 
    React.useCallback(() => {
      fetchUserInfo();
      getPartyInfo();

    }, [])
  );

  useEffect(() => {
    if (userInfo && availableParties) {
      setIsLoading(false);
    }
  }, [userInfo, availableParties]);


  const sortEventsByDateAndTime = (a, b) => {
    const dateComparison = new Date(parseISO(a.date)).getTime() - new Date(parseISO(b.date)).getTime();
    if (dateComparison === 0) {
      const startTimeComparison = a.start_time.localeCompare(b.start_time);
      return startTimeComparison;
    }
    return dateComparison;
  };


  const formatDate = (date) => {

    const dateAComperer = parseISO(date.substring(0, 10));
    if (isToday(dateAComperer)) {
      return "Today";
    } else if (isTomorrow(dateAComperer)) {
      return 'Tomorrow';
    } else {
      return format(dateAComperer, 'EEE dd MMM');
    }
  };

  // Animation Heart
  const heartAnimation = useRef(new Animated.Value(1)).current;
  const startHeartAnimation = () => {
    const loopAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnimation, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 2 }
    );
    loopAnimation.start(() => {
      setIsLoading(true);
      navigation.navigate('InterestScreen');
    });
  };

  // Callback function to handle heart press
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
      })
      .catch(error => console.log('error', error));




  };

  // Font 
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  // Style s'il y a une soirée le day en question
  const getDayStyleNameDay = (day) => {
    const isSelectedDay = isSameDay(day, selectedDay);
    if (vailableDates.includes(format(day, 'yyyy-MM-dd'))) {
      return {
        color: isSelectedDay ? COLORS.white : COLORS.white, 
      };
    }

    return {
      color: isSelectedDay ? COLORS.white : COLORS.gray, 
    };
  };


  // Style s'il y a une soirée le day en question
  const getDayStyleNumberDate = (day) => {
    const isSelectedDay = isSameDay(day, selectedDay);
    const isAvailableDay = vailableDates.includes(format(day, 'yyyy-MM-dd'));

    if (isAvailableDay) {
      const selectedDateTime = selectedDay.getTime();
      const currentDateTime = day.getTime();
      const endDateTime = new Date(selectedDay);
      endDateTime.setHours(4, 0, 0, 0); 


      return {
        color: isSelectedDay ? COLORS.black : COLORS.white,
      };
    }

    return {
      color: isSelectedDay ? COLORS.black : COLORS.gray, 
    };
  };


  const data = [];
  let prevDate = null;

  availableParties.forEach((item) => {
    const currentDate = parseISO(format(parseISO(item.date), 'EEE dd MMM'));

    if (currentDate !== prevDate) {
      data.push({ type: 'separator', date: item.date });
    }
    data.push({ type: 'party', party: item });

    prevDate = currentDate;
  });

  const RedirectionPartyInfo = (party) => {

    AsyncStorage.setItem('party', JSON.stringify(party))
      .then(() => {
        navigation.navigate('EventInformationScreen');
      })
      .catch((error) => {
      });

  }

  const scrollToSeparator = (selectedDateString) => {

    var dateAComparer = parseISO(selectedDateString);
    const scrollPosition = separatorPositions[selectedDateString] || 0;
    flatListRef.current.scrollToOffset({ offset: scrollPosition });
  };

  const updateFavoris = async (favoris) => {
    try {
      const updatedUserInfo = { ...userInfo, favoris };
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo);
    } catch (error) {
    }
  };



  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={{ top: 50 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 25, marginBottom: 30 }}>
          <Text style={styles.title}>Events</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={startHeartAnimation}>
              <Animated.View style={{ transform: [{ scale: heartAnimation }] }}>
                <Ionicons name="heart-outline" size={SIZES.xLarge} color={COLORS.white} style={{ marginRight: 15, alignItems: 'center' }} />
              </Animated.View>
            </TouchableOpacity>
            <SettingComponent />
          </View>
        </View>

        {/* Calendar */}
        <View style={{ paddingHorizontal: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={{ flexDirection: 'row', justifyContent: 'space-around', width: windowWidth - 20 }}>
                {week.map((day, dayIndex) => {
                  const isCurrentDay = isSameDay(day, today);
                  const isSelectedDay = isSameDay(day, selectedDay);
                  const onPressDay = () => {
                    const selectedDateString = format(day, 'yyyy-MM-dd');
                    if(vailableDates.includes(selectedDateString)){
                      scrollToSeparator(selectedDateString);
                      setSelectedDay(day);
                    }
                  };

                  return (
                    <Pressable key={dayIndex} style={{ alignItems: 'center' }} onPress={vailableDates.includes(day) ? undefined : onPressDay}  >
                      <Text style={{ textTransform: 'uppercase', fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, ...getDayStyleNameDay(day) }}> {/* les trois petits points sont utilisés pour étendre les styles*/}
                        {format(day, 'EEE')}
                      </Text>
                      <View
                        ref={vailableDates.includes(day) ? separatorRef : undefined}
                        style={{ backgroundColor: isSelectedDay ? COLORS.white : 'transparent', borderRadius: 50, marginTop: 4, padding: 5, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}
                      >
                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, ...getDayStyleNumberDate(day) }}>{day.getDate()}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Contenu */}

        {isLoading ? (
          <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "70%" }}>
            <ActivityIndicator color={COLORS.gray} size={100} style={{ justifyContent: "center", alignItems: "center" }}></ActivityIndicator>
          </View>
        ) : (
          <View style={{ marginTop: 25 }} ref={flatListContainerRef}>

            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={enTrainDeRafraichir}
                  onRefresh={handleRafraichissement}
                />
              }
              ref={flatListRef}
              data={data}
              style={{ flexGrow: 1 }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {


                if (item.type === 'separator') {
                  return (
                    <LinearGradient  colors={[COLORS.tertary, COLORS.tertary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '100%', height: 50, justifyContent: 'center', marginBottom: 50 }}>
                      <Text style={{ marginHorizontal: 25, color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.large, textTransform: 'uppercase' }}>{formatDate(item.date)}</Text>
                    </LinearGradient>
                  );
                } else if (item.type === 'party') {

                  var videoNameWithoutSpace = item.party.video_name.replace(/\s/g, '');
                  var videoUrl = "http://195.20.234.70:3000/events/photo/" + videoNameWithoutSpace;

                  var imgUrl = "http://195.20.234.70:3000/events/photo/" + item.party.image_name;

                  if (item.party.image_name == "") {
                    imgUrl = "http://195.20.234.70:3000/events/photo/Fond.png";
                  }
                  if (userInfo?.favoris?.includes(item.party.id)) {
            
                    item.favori = true;
             

                  } else {
                    item.favori = false                   
                  }

                  return (

                    <CardComponent
                      id={item.party.id}
                      title={item.party.name}
                      date={format(parseISO(item.party.date), 'EEE dd MMM')}
                      time={`${item.party.start_time.substring(0, 5)} - ${item.party.end_time.substring(0, 5)}`}
                      price1={Object.values(item.party.price)[0][1]}
                      price2={Object.values(item.party.price)[0][0]}
                      image={imgUrl}
                      video={videoUrl}
                      party={item.party}
                      onPress={() => RedirectionPartyInfo(item.party)}
                      onHeartPress={handleHeartPress}
                      isHeartPressed2={item.favori}

                    />


                  );
                }
                return null;
              }}
              keyExtractor={(item, index) => index.toString()}
              onViewableItemsChanged={onViewableItemsChanged}
              ListFooterComponent={
                data.length > 0 && data[data.length - 1].type === 'party' ? (
                  <View style={{ marginBottom: 330 }} />
                ) : null
              }

            />
          </View>

        )}

      </SafeAreaView>
    </LinearGradient>
  );
};

export default EventScreen;
