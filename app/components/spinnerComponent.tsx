import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  // Animated,
  // Easing,
  Dimensions,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import 
  Animated, 
  {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Svg, { Path, Text as SvgText } from "react-native-svg";
import { Content } from "../types/contentType";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");
const WHEEL_SIZE = width * 0.8;

export const Spinner: React.FC<{list: Content[], onFinish: (winnder: Content) => void}> = ({list, onFinish}) => {
  // const [segments, setSegments] = useState<string[]>([]);
  type Segment = {
    index: number; 
    content: Content; 
    path: string; 
    color: string; 
    segmentAngle: number; 
    textAngle: number; 
  };
  const [segmentMap, setSegmentMap] = useState<Segment[]>([]);

  const rotation = useSharedValue(0);
  const handlePickWinner = (value: number) => {
    const angle = parseInt(value.toFixed(), 10);

    const sliceAngle = 360 / segmentMap.length; // Angle covered by each segment
    const normalizedAngle = (angle+90) % 360;

    // Find the winner by checking which segment contains the angle
    const winner = segmentMap.find(({ segmentAngle }, index) => {
      const startAngle = segmentAngle;
      const endAngle = (segmentAngle + sliceAngle) % 360;

      // Check if the normalized angle is within this segment
      return (
        (startAngle <= normalizedAngle && normalizedAngle < endAngle) ||
        (startAngle > endAngle && (normalizedAngle >= startAngle || normalizedAngle < endAngle))
      );
    });

    if (winner) {
      // console.log('Winner:', winner.content);
      // Notify parent with the winner
      runOnJS(onFinish)(winner.content);
    }
  };
  const easing = Easing.bezier(0.23, 1, 0.32, 1);
  const gesture = Gesture.Pan().onUpdate(e => {
    rotation.value = withTiming(
      Math.abs(e.velocityY) / 7 + rotation.value,
      {
        duration: 1000,
        easing: easing,
      },
      (isFinished) => {
        if (isFinished) {
          runOnJS(handlePickWinner)(rotation.value % 360);
        }
      }
    );
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${rotation.value}deg`}],
    };
  });

  // Generate SVG Path for Each Segment
  const generateSegmentPath = (index: number) => {
    const segmentAngle = (2 * Math.PI) / list.length;
    const startAngle = index * segmentAngle;
    const endAngle = startAngle + segmentAngle;

    const largeArcFlag = segmentAngle > Math.PI ? 1 : 0;

    const x1 = WHEEL_SIZE / 2 + (WHEEL_SIZE / 2) * Math.cos(startAngle);
    const y1 = WHEEL_SIZE / 2 - (WHEEL_SIZE / 2) * Math.sin(startAngle);

    const x2 = WHEEL_SIZE / 2 + (WHEEL_SIZE / 2) * Math.cos(endAngle);
    const y2 = WHEEL_SIZE / 2 - (WHEEL_SIZE / 2) * Math.sin(endAngle);

    return `M ${WHEEL_SIZE / 2},${WHEEL_SIZE / 2} L ${x1 ? x1 : 0},${y1 ? y1 : 0} A ${WHEEL_SIZE /
      2},${WHEEL_SIZE / 2} 0 ${largeArcFlag} 0 ${x2 ? x2 : 0},${y2 ? y2 : 0} Z`;
  };

  // Generate dynamic colors for segments
  const generateSegmentColor = (index: number) => {
    const hue = (index * 360) / list.length;
    return `hsl(${hue}, 80%, 70%)`; // HSL color distribution
  };

  useEffect(() => {
    if (list && list.length > 0) {
      // console.log("SPINNER HAS DATA");
      const map: Segment[] = list.map((item, index) => {
          const path = generateSegmentPath(index);
          const color = generateSegmentColor(index);
          const segmentAngle = (360 / list.length) * index;
          const textAngle = (segmentAngle + 360 / (2 * list.length)) % 360;
          return { index, content: item, path, color, segmentAngle, textAngle };
      });
      setSegmentMap(map);
    } else {
        // console.log("empty spinerrrrrrr");
        setSegmentMap([]); // Ensure state is reset when the list is empty
    }
  }, [list]);

  return (
    <SafeAreaView style={[styles.container]}>
      <GestureDetector gesture={gesture}>
        <View style={styles.wheelContainer}>
          <Entypo name="location-pin" size={80} color="black" style={styles.pointer} />
          <Animated.View
            style={[
              styles.wheel,
              animatedStyles
            ]}
          >
            <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
              {segmentMap.map((segment) => {

                const textX =
                  WHEEL_SIZE / 2 +
                  (WHEEL_SIZE / 3.333) * Math.cos((segment.textAngle * Math.PI) / 180);
                const textY = 
                  WHEEL_SIZE / 2 -
                  (WHEEL_SIZE / 3.3333) * Math.sin((segment.textAngle * Math.PI) / 180);

                return (
                  <React.Fragment key={segment.index}>
                    <Path d={segment.path} fill={segment.color} />
                    <SvgText
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform={`rotate(${(segmentMap.length <= 2 ? 0 : -segment.textAngle -3)}, ${textX}, ${textY})`}
                    >
                      {/*splitting long titles that have a colon and also if the title doesnt exist then put an empty string*/}
                      {(segment ? segment.content.title.split(":").length == 0 ? segment.content.title : segment.content.title.split(":")[0] : "")}
                    </SvgText>
                  </React.Fragment>
                );
              })}
            </Svg>
          </Animated.View>
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "center"
  },
  pointer: {
    position: 'absolute',
    top: -50,
    zIndex: 6000,
    color: "gray"
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
  },
  input: {
    flex: 1,
    backgroundColor: "#4f4f77",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#6c6c91",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  list: {
    flex: 1,
    width: "100%",
    marginBottom: 20,
  },
  segmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4f4f77",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  segmentText: {
    color: "#fff",
    fontSize: 16,
  },
  removeButton: {
    color: "#ff4d4d",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
  wheelContainer: {
    backgroundColor: Colors.tabBarColor,
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 5,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  wheel: {
    width: "100%",
    height: "100%",
    borderRadius: WHEEL_SIZE / 2,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    overflow: "hidden"
  },
  spinButton: {
    backgroundColor: "#ff6f61",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  spinButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  winnerContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#6c6c91",
    borderRadius: 5,
  },
  winnerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default {};
