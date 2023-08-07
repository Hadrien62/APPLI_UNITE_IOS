import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, Animated, ScrollView, Dimensions, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS, SIZES } from '.././constants/theme'
import { useCustomFonts } from '../constants/fonts';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import SettingComponent from '../components/SettingComponent';
import ButtonComponent from '../components/ButtonComponent';
import styles from '../components/StyleSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardComponent from '../components/CardComponent';
import CardTicketComponent from '../components/CardTicketComponent';
import CardPreviewComponent from '../components/CardPreviewComponent';
import CardPassComponent from '../components/CardPassComponent';
import CardAwardsComponent from '../components/CardAwardsComponent';
import { eachDayOfInterval, addDays, format, isSameDay, isToday, isTomorrow, parseISO } from 'date-fns';
import { te } from 'date-fns/locale';


export default function TicketScreen() {

  const navigation = useNavigation();
  const onMenuPage = () => {
    setIsLoading(true);
    navigation.navigate('Home', { screen: 'EventScreen' });

  };

  const [activeTab, setActiveTab] = useState('ticket');
  const scrollView = useRef();
  const animation = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  const BookingColorInterpolate = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [COLORS.white, COLORS.gray]
  })
  const ComingColorInterpolate = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [COLORS.gray, COLORS.white]
  })
  const BookingUnderlineInterpolate = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [2, 0]
  })
  const ComingUnderlineInterpolate = animation.interpolate({
    inputRange: [0, windowWidth],
    outputRange: [0, 2]
  })
  const [email, setEmail] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [infoParty, setInfoParty] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [partyAttente, setPartyAttente] = useState([]);
  const [braceletAttente, setBraceletAttente] = useState([])
  const [awardsAttente, setAwardsAttente] = useState([])
  const [partyValide, setPartyValide] = useState([]);
  const [enTrainDeRafraichir, setEnTrainDeRafraichir] = useState(false);

  const handleRafraichissement = () => {
    setEnTrainDeRafraichir(true);
    fetchUserInfo();
    setEnTrainDeRafraichir(false);
  };


  // lance la récupération des party
  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      fetchUserInfo();
      getPartyInfo();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (userInfo !== '') {
        getPartyAttente(userInfo, infoParty);
        getPartyValide(userInfo, infoParty);
      }
    }, [userInfo, infoParty])
  );



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
              getPartyAttente();
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

  const getPartyAttente = (userInfo, infoParty) => {
    const dataAttente = [];
    const braceletAttente = [];
    const awardsAttente = [];

    const promises = [];

    //Gestion bracelet 
    if (userInfo.attente !== null) {
      const keys = Object.keys(userInfo.attente);
      keys.forEach((attenteKey) => {
        if (attenteKey == "bracelet") {

          AsyncStorage.getItem("bracelet").then((heureBuyBracelet) => {

            if (heureBuyBracelet !== null) {

              const monObjet = {
                bracelet: heureBuyBracelet
              };
              braceletAttente.push(monObjet);
            }
          })
        }
      })
    }
    // Gestion awards 77
    if (userInfo.attente !== null) {
      const keys = Object.keys(userInfo.attente);
      keys.forEach((attenteKey) => {
        if (attenteKey == "club") {
          AsyncStorage.getItem("club").then((heureBuyBracelet) => {
            if (heureBuyBracelet !== null) {

              const monObjet = {
                club: heureBuyBracelet
              };
              awardsAttente.push(monObjet);
            }
          })
        }
      })
    }

    // Gestion awards pool
    if (userInfo.attente !== null) {
      const keys = Object.keys(userInfo.attente);
      keys.forEach((attenteKey) => {
        if (attenteKey == "pool") {
          AsyncStorage.getItem("pool").then((heureBuyBracelet) => {

            if (heureBuyBracelet !== null) {

              const monObjet = {
                pool: heureBuyBracelet
              };
              awardsAttente.push(monObjet);
            }
          })
        }
      })
    }

    // Gestion awards boat
    if (userInfo.attente !== null) {
      const keys = Object.keys(userInfo.attente);
      keys.forEach((attenteKey) => {
        if (attenteKey == "boat") {
          AsyncStorage.getItem("boat").then((heureBuyBracelet) => {

            if (heureBuyBracelet !== null) {

              const monObjet = {
                boat: heureBuyBracelet
              };
              awardsAttente.push(monObjet);
            }
          })
        }
      })
    }

    // Gestion party buy
    infoParty.forEach((party) => {
      if (userInfo.attente !== null) {
        const keys = Object.keys(userInfo.attente);

        keys.forEach((attenteKey) => {
          const promise = AsyncStorage.getItem(party.name).then((heureBuyParty) => {
            if (heureBuyParty !== null) {
              const attenteKeyNumber = parseInt(attenteKey, 10);
              if (attenteKeyNumber == party.id) {
                party.heureBuyParty = heureBuyParty;
                dataAttente.push(party);
              }
            }
          });
          promises.push(promise);
        });
      }
    });

    Promise.all(promises)
      .then(() => {
        setBraceletAttente(braceletAttente);
        setAwardsAttente(awardsAttente);
        setPartyAttente(dataAttente);
        setIsLoading(false);
      })
      .catch((error) => {
      });
  };


  const getPartyValide = (userInfo, infoParty) => {

    const dataValide = [];

    infoParty.forEach((party) => {

      if (userInfo.party_id !== null) {

        const keys = Object.keys(userInfo.party_id);

        keys.forEach((attenteKey) => {
          const attenteKeyNumber = parseInt(attenteKey, 10);
          if (attenteKeyNumber == party.id) {
            dataValide.push(party);
          }
        });
      }


    });
    setPartyValide(dataValide)
    setIsLoading(false)
  }


  const RedirectionPartyInfo = (party) => {

    AsyncStorage.setItem('party', JSON.stringify(party))
      .then(() => {

        navigation.navigate('EventInformationScreen');
      })
      .catch((error) => {
      });

  }



  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }


  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={{ top: 50 }}>

        {/*  Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 25 }}>
          <Text style={styles.title}>My tickets</Text>
          <SettingComponent></SettingComponent>
        </View>

        {/*  Menu Booking/Coming */}
        <View style={{ flexDirection: 'row', marginTop: 40, marginHorizontal: 25 }}>
          <TouchableOpacity onPress={() => { scrollView.current.scrollTo({ x: 0 }); setActiveTab('Booking'); }}>
            <Animated.View style={{ borderBottomWidth: BookingUnderlineInterpolate, borderBottomColor: COLORS.white, marginRight: 20, paddingBottom: 10 }}>
              <Animated.Text style={{ color: BookingColorInterpolate, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold' }}>Booking</Animated.Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { scrollView.current.scrollTo({ x: windowWidth }); setActiveTab('Coming'); }}>
            <Animated.View style={{ borderBottomWidth: ComingUnderlineInterpolate, borderBottomColor: COLORS.white, paddingBottom: 10 }}>
              <Animated.Text style={{ color: ComingColorInterpolate, fontSize: SIZES.large, fontFamily: 'SpaceGrotesk-Bold' }}>Preview</Animated.Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "70%" }}>
            <ActivityIndicator color={COLORS.gray} size={100} style={{ justifyContent: "center", alignItems: "center" }}></ActivityIndicator>
          </View>
        ) : (
          <>
            {/*  Contenu Booking */}
            <ScrollView height={'100%'} horizontal pagingEnabled showsHorizontalScrollIndicator={false} ref={scrollView} scrollEventThrottle={16} onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: animation } } }], { useNativeDriver: false })} refreshControl={
              <RefreshControl
                refreshing={enTrainDeRafraichir}
                onRefresh={handleRafraichissement}
              />
            }>

              {/*  Booking */}
              <ScrollView vertical style={{ marginBottom: 230, marginTop: 25 }}>
                {(!userInfo || !userInfo.attente || Object.keys(userInfo.attente).length === 0) ? (
                  <View style={{ width: windowWidth }}>
                    <View style={{ marginTop: '40%' }}>
                      <View style={{ marginHorizontal: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, fontSize: SIZES.large, marginBottom: 8 }}>No ticket at the moment</Text>
                        <Text style={{ fontFamily: 'SpaceGrotesk-Regular', textAlign: 'center', lineHeight: 24, color: COLORS.gray, fontSize: SIZES.medium }}>Find your reservations here !! You have 24 hours from the moment you book your ticket to pick it up at the Unite shop.</Text>
                      </View>
                      <View style={{ marginHorizontal: 100 }}>
                        <ButtonComponent onPress={onMenuPage} buttonText="Explore" animated={true}></ButtonComponent>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={{ width: windowWidth }}>
                    <ScrollView>

                      {braceletAttente.map((item) => {

                        const heureBuyPartyDate = new Date(item.bracelet);

                        const currentDate = new Date();

                        const timeDifference = (currentDate - heureBuyPartyDate) / 1000;
                        const secondesPassees = Math.floor(timeDifference);

                        const secondesDans24Heures = 24 * 60 * 60;
                        var tempsRestantEnSecondes = secondesDans24Heures - secondesPassees;

                        if (tempsRestantEnSecondes > 0) {

                          return (
                            <CardPassComponent
                              key={item}
                              tempsRestant={tempsRestantEnSecondes}
                            />
                          );

                        } else {

                          delete userInfo.attente["bracelet"]

                          let data = JSON.stringify({
                            "attente": userInfo.attente,
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
                              AsyncStorage.setItem('cookieEmail', email).then(() => {
                                AsyncStorage.setItem('userInfo', JSON.stringify(result))
                                  .then(() => {
                                    AsyncStorage.removeItem('bracelet').then(() => {
                                    })                                    
                                  });
                              });
                            })
                            .catch(error => console.log('error', error));


                        }

                      })}

                      {awardsAttente.map((item) => {

                        if (item.club) {
                          const heureBuyPartyDate = new Date(item.club);

                          const currentDate = new Date();

                          const timeDifference = (currentDate - heureBuyPartyDate) / 1000;
                          const secondesPassees = Math.floor(timeDifference);

                          const secondesDans24Heures = 24 * 60 * 60;
                          var tempsRestantEnSecondes = secondesDans24Heures - secondesPassees;

                          if (tempsRestantEnSecondes > 0) {

                            return (
                              <CardAwardsComponent
                                key={item}
                                awards={"club"}
                                tempsRestant={tempsRestantEnSecondes}
                              />
                            );

                          } else {

                            delete userInfo.attente["club"]

                            let data = JSON.stringify({
                              "attente": userInfo.attente,
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
                                AsyncStorage.setItem('cookieEmail', email).then(() => {
                                  AsyncStorage.setItem('userInfo', JSON.stringify(result))
                                    .then(() => {
                                      AsyncStorage.removeItem('club').then(() => {
                                      })
                                    });
                                });
                              })
                              .catch(error => console.log('error', error));


                          }
                        }

                        if (item.pool) {
                          const heureBuyPartyDate = new Date(item.pool);

                          const currentDate = new Date();

                          const timeDifference = (currentDate - heureBuyPartyDate) / 1000;
                          const secondesPassees = Math.floor(timeDifference);

                          const secondesDans24Heures = 24 * 60 * 60;
                          var tempsRestantEnSecondes = secondesDans24Heures - secondesPassees;

                          if (tempsRestantEnSecondes > 0) {

                            return (
                              <CardAwardsComponent
                                key={item}
                                awards={"pool"}
                                tempsRestant={tempsRestantEnSecondes}
                              />
                            );

                          } else {

                            delete userInfo.attente["pool"]

                            let data = JSON.stringify({
                              "attente": userInfo.attente,
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
                                AsyncStorage.setItem('cookieEmail', email).then(() => {
                                  AsyncStorage.setItem('userInfo', JSON.stringify(result))
                                    .then(() => {
                                      AsyncStorage.removeItem('pool').then(() => {
                                      })
                                    });
                                });
                              })
                              .catch(error => console.log('error', error));


                          }
                        }

                        if (item.boat) {
                          const heureBuyPartyDate = new Date(item.boat);

                          const currentDate = new Date();

                          const timeDifference = (currentDate - heureBuyPartyDate) / 1000;
                          const secondesPassees = Math.floor(timeDifference);

                          const secondesDans24Heures = 24 * 60 * 60;
                          var tempsRestantEnSecondes = secondesDans24Heures - secondesPassees;

                          if (tempsRestantEnSecondes > 0) {

                            return (
                              <CardAwardsComponent
                                key={item}
                                awards={"boat"}
                                tempsRestant={tempsRestantEnSecondes}
                              />
                            );

                          } else {

                            delete userInfo.attente["boat"]

                            let data = JSON.stringify({
                              "attente": userInfo.attente,
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
                                AsyncStorage.setItem('cookieEmail', email).then(() => {
                                  AsyncStorage.setItem('userInfo', JSON.stringify(result))
                                    .then(() => {
                                      AsyncStorage.removeItem('boat').then(() => {
                                      })
                                    });
                                });
                              })
                              .catch(error => console.log('error', error));


                          }
                        }
                      })}

                      {partyAttente.map((item) => {

                        const heureBuyPartyDate = new Date(item.heureBuyParty);

                        const currentDate = new Date();

                        const timeDifference = (currentDate - heureBuyPartyDate) / 1000;
                        const secondesPassees = Math.floor(timeDifference);

                        const secondesDans24Heures = 24 * 60 * 60;
                        var tempsRestantEnSecondes = secondesDans24Heures - secondesPassees;

                        tempsRestantEnSecondes = tempsRestantEnSecondes - 86370

                        if (tempsRestantEnSecondes > 0) {

                          var videoNameWithoutSpace = item.video_name.replace(/\s/g, '');
                          var videoUrl = "http://195.20.234.70:3000/events/photo/" + videoNameWithoutSpace;
                          var imgUrl = "http://195.20.234.70:3000/events/photo/" + item.image_name;

                          if (item.image_name == "") {
                            imgUrl = "http://195.20.234.70:3000/events/photo/Fond.png";
                          }

                          var priceAPayer = userInfo.attente?.[`${item.id}`];

                          var nbrConso = null;

                          if (userInfo.bracelet) {
                            if (item.boat === '') {
                              Object.keys(item.price).forEach((key) => {
                                const value = item.price[key];
                                if (value[1] === priceAPayer) {
                                  nbrConso = key;
                                }
                              });
                            } else {
                              nbrConso = item.boat;
                            }

                            return (
                              <CardTicketComponent
                                key={item.id}
                                title={item.name}
                                date={format(parseISO(item.date), 'EEE dd MMM')}
                                time={`${item.start_time.substring(0, 5)} - ${item.end_time.substring(0, 5)}`}
                                price={priceAPayer}
                                image={imgUrl}
                                drink={nbrConso}
                                boat={item.boat}
                                remainingTimeSeconde={tempsRestantEnSecondes}
                                onPress={() => RedirectionPartyInfo(item)}

                              />
                            );
                          } else {
                            if (item.boat === '') {
                              Object.keys(item.price).forEach((key) => {
                                const value = item.price[key];
                                if (value[0] === priceAPayer) {
                                  nbrConso = key;
                                }
                              });
                            } else {
                              nbrConso = item.boat;
                            }


                            return (
                              <CardTicketComponent
                                key={item.id}
                                title={item.name}
                                date={format(parseISO(item.date), 'EEE dd MMM')}
                                time={`${item.start_time.substring(0, 5)} - ${item.end_time.substring(0, 5)}`}
                                price={priceAPayer}
                                image={imgUrl}
                                drink={nbrConso}
                                boat={item.boat}
                                remainingTimeSeconde={tempsRestantEnSecondes}
                                onPress={() => RedirectionPartyInfo(item)}

                              />
                            );
                          }
                        } else {

                          delete userInfo.attente[item.id]

                          let data = JSON.stringify({
                            "attente": userInfo.attente,
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
                              AsyncStorage.setItem('cookieEmail', email).then(() => {
                                AsyncStorage.setItem('userInfo', JSON.stringify(result))
                                  .then(() => {
                                    AsyncStorage.removeItem(item.name).then(() => {
                                    })
                                  });
                              });
                            })
                            .catch(error => console.log('error', error));

                        }
                      })}
                    </ScrollView>
                  </View>

                )}
              </ScrollView>


              {/* Preview */}
              <ScrollView vertical style={{ marginBottom: 230, marginTop: 25 }}>

                {(!userInfo || !userInfo.party_id || Object.keys(userInfo.party_id).length === 0) ? (
                  <View style={{ width: windowWidth }}>
                    <View style={{ marginTop: '40%' }}>
                      <View style={{ marginHorizontal: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, fontSize: SIZES.large, marginBottom: 8 }}>No ticket at the moment</Text>
                        <Text style={{ fontFamily: 'SpaceGrotesk-Regular', textAlign: 'center', lineHeight: 24, color: COLORS.gray, fontSize: SIZES.medium }}>Find your past event here !! If you have any doubts about the events you have done, you can see them on this page.</Text>
                      </View>
                      <View style={{ marginHorizontal: 100 }}>
                        <ButtonComponent onPress={onMenuPage} buttonText="Explore" animated={true}></ButtonComponent>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={{ width: windowWidth }}>
                    <ScrollView>

                      {partyValide.map((item) => {

                        var videoNameWithoutSpace = item.video_name.replace(/\s/g, '');
                        var videoUrl = "http://195.20.234.70:3000/events/photo/" + videoNameWithoutSpace;
                        var imgUrl = "http://195.20.234.70:3000/events/photo/" + item.image_name;

                        if (item.image_name == "") {
                          imgUrl = "http://195.20.234.70:3000/events/photo/Fond.png";
                        }

                        if (userInfo?.favoris?.includes(item.id)) {
                          item.favori = true;
                        } else {
                          item.favori = false;
                        }

                        var pricePayer = userInfo.party_id?.[`${item.id}`];

                        var nbrConso = null;
                        if (userInfo.bracelet) {
                          if (item.boat === '') {
                            Object.keys(item.price).forEach((key) => {
                              const value = item.price[key];
                              if (value[1] === pricePayer) {
                                nbrConso = key;
                              }
                            });
                          } else {
                            nbrConso = item.boat;
                          }
                        } else {
                          if (item.boat === '') {
                            Object.keys(item.price).forEach((key) => {
                              const value = item.price[key];
                              if (value[1] === pricePayer) {
                                nbrConso = key;
                              }
                            });
                          } else {
                            nbrConso = item.boat;
                          }
                        }

                        return (
                          <CardPreviewComponent
                            key={item.id}
                            title={item.name}
                            date={format(parseISO(item.date), 'EEE dd MMM')}
                            time={`${item.start_time.substring(0, 5)} - ${item.end_time.substring(0, 5)}`}
                            price={pricePayer}
                            image={imgUrl}
                            boat={item.boat}
                            drink={nbrConso}
                          />
                        );
                      })}
                    </ScrollView>
                  </View>
                )}

              </ScrollView>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
