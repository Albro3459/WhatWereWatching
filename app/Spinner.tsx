import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");
const WHEEL_SIZE = width * 0.8;

const Spinner = () => {
  const [segments, setSegments] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>(""); // Input for adding movies
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null); // Winner
  const [isSpinning, setIsSpinning] = useState(false); // Spin state
  const spinValue = useRef(new Animated.Value(0)).current;

  const SEGMENT_ANGLE = segments.length ? 360 / segments.length : 0;

  // Function to start spinning the wheel
  const spinWheel = () => {
    if (segments.length === 0) {
      Alert.alert("Error", "Please add movies to the wheel first!");
      return;
    }

    setIsSpinning(true);

    // Random spins between 3 and 5 full spins
    const randomSpins = Math.floor(Math.random() * 2) + 3;
    const randomExtraDegrees = Math.random() * 360; // Extra degrees to land on a random segment
    const totalRotation = randomSpins * 360 + randomExtraDegrees;

    // Animate the spin
    Animated.timing(spinValue, {
      toValue: totalRotation,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const normalizedAngle = totalRotation % 360; // Get the angle within a 360-degree circle
      const selectedIndex = Math.floor((360 - normalizedAngle) / SEGMENT_ANGLE) % segments.length;

      setSelectedSegment(segments[selectedIndex]);
      setIsSpinning(false);
    });
  };

  // Function to add a movie to the wheel
  const addSegment = () => {
    if (inputText.trim() === "") {
      Alert.alert("Error", "Please enter a movie name.");
      return;
    }
    setSegments((prev) => [...prev, inputText.trim()]);
    setInputText("");
  };

  // Function to remove a movie from the wheel
  const removeSegment = (movie: string) => {
    setSegments((prev) => prev.filter((item) => item !== movie));
  };

  // Interpolation for rotation
  const rotateInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  // Generate SVG Path for Each Segment
  const generateSegmentPath = (index: number) => {
    const segmentAngle = (2 * Math.PI) / segments.length;
    const startAngle = index * segmentAngle;
    const endAngle = startAngle + segmentAngle;

    const largeArcFlag = segmentAngle > Math.PI ? 1 : 0;

    const x1 = WHEEL_SIZE / 2 + (WHEEL_SIZE / 2) * Math.cos(startAngle);
    const y1 = WHEEL_SIZE / 2 - (WHEEL_SIZE / 2) * Math.sin(startAngle);

    const x2 = WHEEL_SIZE / 2 + (WHEEL_SIZE / 2) * Math.cos(endAngle);
    const y2 = WHEEL_SIZE / 2 - (WHEEL_SIZE / 2) * Math.sin(endAngle);

    return `M ${WHEEL_SIZE / 2},${WHEEL_SIZE / 2} L ${x1},${y1} A ${WHEEL_SIZE /
      2},${WHEEL_SIZE / 2} 0 ${largeArcFlag} 0 ${x2},${y2} Z`;
  };

  // Generate dynamic colors for segments
  const generateSegmentColor = (index: number) => {
    const hue = (index * 360) / segments.length;
    return `hsl(${hue}, 80%, 70%)`; // HSL color distribution
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Movie Spinner</Text>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a movie name"
          placeholderTextColor="#aaa"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addSegment}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* List of Movies */}
      <FlatList
        data={segments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.segmentItem}>
            <Text style={styles.segmentText}>{item}</Text>
            <TouchableOpacity onPress={() => removeSegment(item)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No movies added to the wheel yet.</Text>
        }
      />

      {/* Spinning Wheel */}
      <View style={styles.wheelContainer}>
        <Animated.View
          style={[
            styles.wheel,
            { transform: [{ rotate: rotateInterpolate }] },
          ]}
        >
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
            {segments.map((segment, index) => {
              const path = generateSegmentPath(index);
              const color = generateSegmentColor(index);
              const segmentAngle = (360 / segments.length) * index;
              const textAngle = (segmentAngle + 360 / (2 * segments.length)) % 360;

              const textX =
                WHEEL_SIZE / 2 +
                (WHEEL_SIZE / 3.333) * Math.cos((textAngle * Math.PI) / 180);
              const textY =
                WHEEL_SIZE / 2 -
                (WHEEL_SIZE / 3.3333) * Math.sin((textAngle * Math.PI) / 180);

              return (
                <React.Fragment key={index}>
                  <Path d={path} fill={color} />
                  <SvgText
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={`rotate(${(segments.length <= 2 ? 0 : -textAngle)}, ${textX}, ${textY})`}
                  >
                    {segment ? segment : ""}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </Animated.View>
      </View>

      {/* Spin Button */}
      <TouchableOpacity
        style={[styles.spinButton, isSpinning && { backgroundColor: "gray" }]}
        onPress={!isSpinning ? spinWheel : undefined}
      >
        <Text style={styles.spinButtonText}>Spin</Text>
      </TouchableOpacity>

      {/* Winner Display */}
      {selectedSegment && (
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerText}>You should watch: {selectedSegment}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b2b4f",
    padding: 20,
    alignItems: "center",
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
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 5,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  wheel: {
    width: "100%",
    height: "100%",
    borderRadius: WHEEL_SIZE / 2,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
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

export default Spinner;
