import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Linking } from 'react-native';
import * as Font from 'expo-font';
import axios from 'axios';
import careers from './careers.js';

const CareerDetailsScreen = ({ route }) => {
  const { career } = route.params;
  const { description, courses, tag } = careers.find((item) => item.title === career.title);

  const [jobOffers, setJobOffers] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showAllJobOffers, setShowAllJobOffers] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobOffersResponse = await axios.get('http://127.0.0.1:8000/api/offers/');
        const coursesResponse = await axios.get('http://127.0.0.1:8000/api/courses/');

        setJobOffers(jobOffersResponse.data);
        setCoursesData(coursesResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      }
    };

    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Inter-Light': require('../assets/fonts/Inter/static/Inter-Light.ttf'),
          'Inter-Bold': require('../assets/fonts/Inter/static/Inter-Bold.ttf'),
          'Inter-Medium': require('../assets/fonts/Inter/static/Inter-Medium.ttf'),
          'Inter-Regular': require('../assets/fonts/Inter/static/Inter-Regular.ttf'),
        });
  
        setFontLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setIsError(true);
      }
    };
  
    const loadData = async () => {
      try {
        await Promise.all([fetchData(), loadFonts()]);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadData();

  }, []);

  if (!fontLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  const filteredJobOffers = tag ? jobOffers.filter((item) => item.job_offer.tag === tag) : jobOffers;
  const filteredCourses = tag ? coursesData.filter((item) => item.course.tag === tag) : coursesData;
  const visibleJobOffers = showAllJobOffers ? filteredJobOffers : filteredJobOffers.slice(0, 5);
  const visibleCourses = showAllCourses ? filteredCourses : filteredCourses.slice(0, 5);

  const handleShowAllJobOffers = () => {
    setShowAllJobOffers(true);
  };

  const handleShowAllCourses = () => {
    setShowAllCourses(true);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error connecting to the API</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: career.logoURI }} style={styles.logo} />
        <Text style={styles.title}>{career.title}</Text>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Oferty pracy</Text>
        {visibleJobOffers.length > 0 ? (
          <FlatList
            data={visibleJobOffers}
            renderItem={({ item }) => (
              <View style={styles.jobOfferContainer}>
                <Text style={styles.jobTitle}>{item.job_offer.data.job_title}</Text>
                <Text style={styles.company}>{item.job_offer.data.company}</Text>
                <Text style={styles.jobLocation}>{item.job_offer.data.job_location}</Text>
                {Object.entries(item.job_offer.data.additional_info).map(([key, value]) => (
                  <Text style={styles.additionalInfo} key={key}>
                    {value}
                  </Text>
                ))}
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(item.job_offer.data.job_url);
                  }}
                  style={styles.jobURLContainer}
                >
                  <View style={styles.jobURLButton}>
                    <Text style={styles.jobURLButtonText}>Zobacz ofertę</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text>No job offers available</Text>
        )}
        {!showAllJobOffers && filteredJobOffers.length > 5 && (
          <TouchableOpacity onPress={handleShowAllCourses} style={styles.seeMoreButton}>
          <Text style={styles.seeMoreButtonText}>WIĘCEJ</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kursy</Text>
        {visibleCourses.length > 0 ? (
          <FlatList
            data={visibleCourses}
            renderItem={({ item }) => (
              <View style={styles.courseContainer}>
                <Text style={styles.courseTitle}>{item.course.data.course_title}</Text>
                <Text style={styles.courseLevel}>{item.course.data.course_level}</Text>
                <Text style={styles.courseLength}>{item.course.data.course_length}</Text>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(item.course.data.course_url);
                  }}
                  style={styles.courseURLContainer}
                >
                  <View style={styles.courseURLButton}>
                    <Text style={styles.courseURLButtonText}>Zobacz kurs</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text>No courses available</Text>
      )}
      {!showAllCourses && filteredCourses.length > 5 && (
        <TouchableOpacity onPress={handleShowAllCourses} style={styles.seeMoreButton}>
          <Text style={styles.seeMoreButtonText}>WIĘCEJ</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A1C4CE',
    },
  header: {
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: '#AFCDD5',
    padding: 10,
    borderRadius: 10,
    width: '70%',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 50,
    marginTop: 50,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Medium',
    marginBottom: 10,
    color: '#75549c',
    textTransform: 'uppercase',
  },
  descriptionContainer: {
    marginBottom: 40,
    width: '70%',
    backgroundColor: '#AFCDD5',
    padding: 10,
    borderRadius: 10,
    opacity: 0.9,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Inter-Light',
    color: '#75549c',
  },
  section: {
    marginBottom: 16,
    width: '70%',
  },
  sectionTitle: {
    fontSize: 32,
    marginTop: 15,
    marginBottom: 30,
    textAlign: 'center',
    color: '#75549c',
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
  },
  jobOfferContainer: {
    marginBottom: 40,
    backgroundColor: '#AFCDD5',
    padding: 10,
    borderRadius: 10,
    opacity: 0.9,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#75549c',
    fontFamily: 'Inter-Bold',
  },
  company: {
    fontSize: 16,
    color: '#d1649d',
  },
  jobLocation: {
    fontSize: 14,
    color: 'gray',
  },
  additionalInfo: {
    fontSize: 14,
    color: 'gray',
  },
  jobURLContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  jobURLButton: {
    backgroundColor: '#75549c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    opacity: 0.9,
  },
  jobURLButtonText: {
    fontSize: 14,
    color: 'white',
  },
  courseContainer: {
    marginBottom: 40,
    backgroundColor: '#AFCDD5',
    padding: 10,
    borderRadius: 10,
    opacity: 0.9,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    color: '#75549c',
  },
  courseLevel: {
    fontSize: 16,
    color: '#d1649d',
  },
  courseLength: {
    fontSize: 14,
    color: 'gray',
  },
  courseURLContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  courseURLButton: {
    backgroundColor: '#75549c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    opacity: 0.9,
  },
  courseURLButtonText: {
    fontSize: 14,
    color: 'white',
  },
  seeMoreButton: {
    backgroundColor: '#75549c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '15%',
    alignItems: 'center',
    alignSelf: 'center',
    opacity: 0.9,
  },
  seeMoreButtonText: {
    fontSize: 16,
    color: 'white',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default CareerDetailsScreen;
