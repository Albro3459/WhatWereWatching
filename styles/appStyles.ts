import { StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

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
});