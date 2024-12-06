import { Pressable, StyleSheet, View } from "react-native";

interface HeartTypes {
    heartColor: string;
    screenWidth: number;
    scale?: number;
    onPress?: (any) => void;
}

export const Heart: React.FC<HeartTypes> = ({heartColor = "#FF2452", screenWidth, scale = 1, onPress = () => {}}) => {
    return (
        <Pressable 
            style={[
                heartStyles.heartContainer,
                {
                    width: (screenWidth / 10) * scale,
                    height: ((4 * screenWidth) / 50) * scale,
                }
            ]} 
            onPress={onPress} 
        >
            <View
            style={[
                heartStyles.heartLeft, 
                { 
                    backgroundColor: heartColor,
                    width: 0.079 * screenWidth * scale,
                    height: (screenWidth / 20) * scale, 
                }
            ]}
            />
            <View
            style={[
                heartStyles.heartRight, 
                { 
                    backgroundColor: heartColor,
                    width: 0.079 * screenWidth * scale,
                    height: (screenWidth / 20) * scale, 
                }
            ]}
            />
        </Pressable>
    )
};

const heartStyles = StyleSheet.create({
    heartContainer: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
      },
      heartLeft: {
        backgroundColor: "#FDB0C0",
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        transform: [{ rotate: "45deg" }],
        position: "absolute",
        left: 0,
      },
      heartRight: {
        backgroundColor: "#FDB0C0",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        transform: [{ rotate: "-45deg" }],
        position: "absolute",
        right: 0,
      },
});