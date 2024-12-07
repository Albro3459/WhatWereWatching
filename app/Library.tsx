import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import PagerView from 'react-native-pager-view';

const movies = [  
    { id: '1', title: 'Joker', poster: 'https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
    { id: '2', title: 'Elf', poster: 'https://image.tmdb.org/t/p/w200/xVwpZTcDqppOrE1Zdcdrt8oEwJa.jpg' },
    { id: '3', title: 'Shrek', poster: 'https://image.tmdb.org/t/p/w200/hz0kDzyIdhP5hOJBWlDdcF2Z7rl.jpg' },
    { id: '4', title: 'The Wild Robot', poster: 'https://placekitten.com/200/300' }, // Replace with actual
    { id: '5', title: 'Star Wars', poster: 'https://image.tmdb.org/t/p/w200/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg' },
    { id: '6', title: 'Avengers', poster: 'https://image.tmdb.org/t/p/w200/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg' },
    { id: '7', title: 'Beauty and the Beast', poster: 'https://image.tmdb.org/t/p/w200/tWqifoYuwLETmmasnGHO7xBjEtt.jpg' },
    { id: '8', title: 'Barbie', poster: 'https://placekitten.com/200/200' }, // Replace with actual
  ]; 
const TabContent = ({ movies }) => (
   <View style={styles.container}>
      <FlatList
         data={movies}
         numColumns={2}
         keyExtractor={(item) => item.id}
         renderItem={({ item }) => (
            <View style={styles.movieCard}>
               <Image source={{ uri: item.poster }} style={styles.movieImage} />
               <Text style={styles.movieTitle}>{item.title}</Text>
            </View>
         )}
      />
   </View>
);

const Library = () => {
   const pagerViewRef = useRef(null);
   const [activeTab, setActiveTab] = useState(0);

   const handleTabPress = (index) => {
      setActiveTab(index);
      pagerViewRef.current?.setPage(index); // Ensure ref works correctly
   };
   return (
      <View style={{ flex: 1, backgroundColor: '#2b2b4f' }}>
         {/* Tab Bar */}
         <View style={styles.tabBar}>
            {['Planned', 'Watching', 'Completed', 'Favorite'].map((tab, index) => (
               <TouchableOpacity
                  key={index}
                  style={[styles.tabItem, activeTab === index && styles.activeTabItem]}
                  onPress={() => handleTabPress(index)}
               >
                  <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>{tab}</Text>
               </TouchableOpacity>
            ))}
         </View>

         {/* Pager View */}
         <PagerView
            style={{ flex: 1 }}
            initialPage={0}
            ref={pagerViewRef} // Attach ref
            onPageSelected={(e) => setActiveTab(e.nativeEvent.position)} // Sync tab state
         >
            <View key="1">
               <TabContent movies={movies.slice(0, 4)} />
            </View>
            <View key="2">
               <TabContent movies={movies.slice(4, 8)} />
            </View>
            <View key="3">
               <TabContent movies={movies.slice(0, 4)} />
            </View>
            <View key="4">
               <TabContent movies={movies.slice(4, 8)} />
            </View>
         </PagerView>
      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#2b2b4f', padding: 10 },
   tabBar: { flexDirection: 'row', backgroundColor: '#4f4f77', justifyContent: 'space-around', paddingVertical: 10 },
   tabItem: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 5 },
   activeTabItem: { backgroundColor: '#6c6c91' },
   tabText: { color: '#ccc', fontSize: 14 },
   activeTabText: { color: 'white', fontWeight: 'bold' },
   movieCard: { flex: 1, margin: 5, alignItems: 'center' },
   movieImage: { width: 100, height: 150, borderRadius: 10, marginBottom: 5 },
   movieTitle: { color: 'white', textAlign: 'center' },
});
export default Library;