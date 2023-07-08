import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, FlatList, Dimensions } from 'react-native';
import careers from './careers.js';

const HomeScreen = ({ navigation }) => {
  const handleCareerPress = (career) => {
    navigation.navigate('CareerDetails', { career });
  };

  const renderCareerButton = ({ item }) => (
    <TouchableOpacity style={styles.careerButton} onPress={() => handleCareerPress(item)}>
      <Image source={{ uri: item.logoURI }} style={styles.logo} />
      <Text style={styles.buttonText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greetingHeader}>Gotowy?</Text>
      <Text style={styles.greetingMessage}>Wybierz swoją ścieżkę kariery</Text>
      <FlatList
        data={careers}
        numColumns={2}
        renderItem={renderCareerButton}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.buttonContainer}
      />
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
  greetingHeader: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
    color: '#75549c',
    padding: 10,
    borderRadius: 10,
    width: '60%',
    textTransform: 'uppercase',
  },
  greetingMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 50,
    width: '80%',
    color: '#75549c',
    padding: 10,
    borderRadius: 10,
    width: '60%',
    textTransform: 'uppercase',
  }, 
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '90%'
  },
  careerButton: {
    width: Dimensions.get('window').width / 3 - 8, // Adjust the width as needed
    height: Dimensions.get('window').width / 3 - 8, // Adjust the height as needed
    backgroundColor: '#BCE0EA',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#75549c',
    textTransform: 'uppercase',
  },
});

export default HomeScreen;
