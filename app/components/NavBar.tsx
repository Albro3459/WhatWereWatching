import React from 'react';
import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <Link href="/" style={styles.link}>
        <Text>Home</Text>
      </Link>
      <Link href="/LandingPage" style={styles.link}>
        <Text>Landing Page</Text>
      </Link>
      <Link href="/unmatched" style={styles.link}>
        <Text>unmatched</Text>
      </Link>
      {/* Add more links as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: "white",
  },
  link: {
    fontSize: 16,
  },
});