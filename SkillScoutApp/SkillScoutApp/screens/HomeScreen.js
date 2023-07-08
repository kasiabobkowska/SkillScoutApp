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
    backgroundColor: '#F5F5F5',
  },
  buttonContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  careerButton: {
    width: Dimensions.get('window').width / 2 - 30,
    height: 150,
    backgroundColor: '#F8F8FF',
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
  },
});

export default HomeScreen;
