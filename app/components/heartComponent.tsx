import { Pressable, StyleSheet, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface HeartTypes {
    heartColor?: string;
    size?: number;
    screenWidth?: number;
    scale?: number;
    onPress?: (any) => void;
}

const Heart: React.FC<HeartTypes> = ({heartColor = Colors.unselectedHeartColor, size = 40, screenWidth = 420, scale = 1, onPress = () => {}}) => {
    scale = scale ? scale : 1;
    return (
        <Pressable 
            style={[
                heartStyles.heartContainer,
                {
                    width: size,
                    height: size*0.8,
                }
            ]} 
            onPress={onPress} 
        >
            <View
            style={[
                heartStyles.heartLeft, 
                { 
                    backgroundColor: heartColor ? heartColor : Colors.unselectedHeartColor,
                    width: size*0.8,
                    height: size/2, 
                }
            ]}
            />
            <View
            style={[
                heartStyles.heartRight, 
                { 
                    backgroundColor: heartColor,
                    width: size*0.8,
                    height: size/2, 
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

export default Heart;