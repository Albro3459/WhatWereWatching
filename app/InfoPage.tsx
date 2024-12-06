import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';

const InfoPage = () => {
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: 'image_url_here' }} style={styles.headerImage} />
      <Text style={styles.title}>The Wild Robot</Text>
      <Text style={styles.rating}>⭐ 4.7/5</Text>

      <View style={styles.buttonContainer}>
        <Button title="Add to List" onPress={() => {}} />
        <Button title="Episode" onPress={() => {}} />
        <Button title="Score" onPress={() => {}} />
      </View>

      <View style={styles.tabContainer}>
        <Text style={styles.tab}>About</Text>
        <Text style={styles.tab}>Reviews</Text>
        <Text style={styles.tab}>Recommended</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.text}>
          Shipwrecked on a deserted island, a robot named Roz must learn to adapt to its new surroundings...
        </Text>

        <Text style={styles.sectionTitle}>More Info</Text>
        <Text style={styles.text}>Animation | Sci-Fi | Survival</Text>

        <Text style={styles.sectionTitle}>Cast</Text>
        <View style={styles.castContainer}>
          {/* Add images of cast */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10, 
        backgroundColor: Colors.background,
    },
    headerImage: { 
        width: '100%', 
        height: 200, 
        borderRadius: 10 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginTop: 10 
    },
    rating: { 
        fontSize: 16, 
        marginVertical: 5 
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginVertical: 10 
    },
    tabContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        marginBottom: 20 
    },
    tab: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: 'blue' 
    },
    content: { 
        padding: 10 
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginVertical: 5 
    },
    text: { 
        fontSize: 14, 
        marginBottom: 10 
    },
    castContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
});

export default InfoPage;
