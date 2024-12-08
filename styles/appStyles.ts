import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

export const RalewayFont = 'Raleway_800ExtraBold';
export const KuraleFont = "Kurale_400Regular";


export const appStyles = StyleSheet.create({
    movieCard: {
        width: 11*7,
        marginRight: 15,
        overflow: "hidden"
    },
        movieImage: {
        height: 16*7,
        aspectRatio: 11 / 16,
        borderRadius: 8,
    },
        movieTitle: {
        color: "#fff",
        fontSize: 14,
        marginTop: 5,
        textAlign: "center",
    },
    
    reviewCard: {
        flexDirection: "row",
        backgroundColor: Colors.cardBackgroundColor,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
      },
      avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
      },
      reviewTextContainer: {
        flex: 1,
      },
      reviewUser: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
      },
      reviewText: {
        fontSize: 14,
        color: Colors.reviewTextColor,
        marginVertical: 5,
      },
      ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      reviewMovie: {
        fontSize: 14,
        color: Colors.italicTextColor,
        marginBottom: 5,
        fontStyle: "italic",
      },

      cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardBackgroundColor,
        borderRadius: 10,
        marginBottom: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      cardPoster: {
        height: 80,
        width: 60,
        borderRadius: 5,
        marginRight: 10,
      },
      cardContent: {
        flex: 1,
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
      },
      cardDescription: {
        fontSize: 14,
        color: '#AAAAAA',
        marginBottom: 5,
      },
      cardRating: {
        fontSize: 14,
        color: '#FFD700', // Gold star color
      },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#4f4f77',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalButton: {
      backgroundColor: '#6c6c91',
      padding: 10,
      borderRadius: 5,
      margin: 5,
      width: '100%',
      height: 40,
      alignItems: 'center',
    },
    selectedModalButton: {
      backgroundColor: Colors.selectedColor,
    },
    modalButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
});