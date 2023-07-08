import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Card, Text } from '@ui-kitten/components';
import axios from 'axios';
import careers from './careers.js';

const CareerDetailsScreen = ({ route }) => {
  const { career } = route.params;
  const { description, courses, tag } = careers.find((item) => item.title === career.title);

  const [jobOffers, setJobOffers] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
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

    fetchData();
  }, []);

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
      <Card style={styles.header}>
        <Image source={{ uri: career.logoURI }} style={styles.logo} />
        <Text category="h4" style={styles.title}>{career.title}</Text>
      </Card>
      <Card style={styles.descriptionContainer}>
        <Text style={styles.description}>{description}</Text>
      </Card>

      <Card style={styles.section}>
        <Text category="h5" style={styles.sectionTitle}>Oferty pracy</Text>
        {visibleJobOffers.length > 0 ? (
          visibleJobOffers.map((item, index) => (
            <Card key={index} style={styles.jobOfferCard}>
              <Text category="h6" style={styles.jobTitle}>{item.job_offer.data.job_title}</Text>
              <Text category="s1" style={styles.company}>{item.job_offer.data.company}</Text>
              <Text category="s2" style={styles.jobLocation}>{item.job_offer.data.job_location}</Text>
              {Object.entries(item.job_offer.data.additional_info).map(([key, value]) => (
                <Text key={key} style={styles.additionalInfo}>
                  {value}
                </Text>
              ))}
              <Text category="s2" style={styles.jobURL}>{item.job_offer.data.job_url}</Text>
            </Card>
          ))
        ) : (
          <Text>No job offers available</Text>
        )}
        {!showAllJobOffers && filteredJobOffers.length > 5 && (
          <Button onPress={handleShowAllJobOffers} style={styles.seeMoreButton} appearance="ghost">
            See More
          </Button>
        )}
      </Card>

      <Card style={styles.section}>
        <Text category="h5" style={styles.sectionTitle}>Kursy</Text>
        {visibleCourses.length > 0 ? (
          visibleCourses.map((item, index) => (
            <Card key={index} style={styles.courseCard}>
              <Text category="h6" style={styles.courseTitle}>{item.course.data.course_title}</Text>
              <Text category="s1" style={styles.courseLevel}>{item.course.data.course_level}</Text>
              <Text category="s2" style={styles.courseLength}>{item.course.data.course_length}</Text>
              <Text category="s2" style={styles.courseURL}>{item.course.data.course_url}</Text>
            </Card>
          ))
        ) : (
          <Text>No courses available</Text>
        )}
        {!showAllCourses && filteredCourses.length > 5 && (
          <Button onPress={handleShowAllCourses} style={styles.seeMoreButton} appearance="ghost">
            See More
          </Button>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    marginVertical: 10,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginVertical: 8,
    fontWeight: 'bold',
  },
  jobOfferCard: {
    marginBottom: 10,
    padding: 16,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 16,
  },
  jobLocation: {
    fontSize: 14,
    color: 'gray',
  },
  additionalInfo: {
    fontSize: 14,
    color: 'gray',
  },
  jobURL: {
    fontSize: 14,
    color: 'blue',
  },
  courseCard: {
    marginBottom: 10,
    padding: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseLevel: {
    fontSize: 16,
  },
  courseLength: {
    fontSize: 14,
    color: 'gray',
  },
  courseURL: {
    fontSize: 14,
    color: 'blue',
  },
  seeMoreButton: {
    marginVertical: 10,
  },
});
