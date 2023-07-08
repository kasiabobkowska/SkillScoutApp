import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/skillScoutLogo.png')} style={styles.logo} />
      <Text style={styles.greetingHi}>Cześć!</Text>
      <Text style={styles.greetingText}>Wiemy jak skomplikowane potrafi być znalezienie pierwszej pracy w IT. Dlatego stworzyłyśmy Skillscout - pomoże Ci łatwo odnaleźć oferty pracy w zawodzie, który Cię interesuje. Nie czujesz się jeszcze na siłach? Mamy dla Ciebie linki do odpowiednich kursów, które pomogą Ci zdobyć wymarzoną pracę.</Text>
      <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Zaczynamy?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A1C4CE',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  greetingHi: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#75549c',
    textTransform: 'uppercase',
  },
  greetingText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 50,
    color: 'white',
    width: '40%',
    lineHeight: '1,5',
  },
  getStartedButton: {
    backgroundColor: '#75549c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textTransform: 'uppercase',
  },
});

export default WelcomeScreen;
