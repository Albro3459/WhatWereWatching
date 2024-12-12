// import React, {FC, useState} from 'react';
// import {ColorValue, SafeAreaView, StyleSheet, Text, View} from 'react-native';
// import {Gesture, GestureDetector} from 'react-native-gesture-handler';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
//   Easing,
//   runOnJS,
// } from 'react-native-reanimated';
// import Entypo from 'react-native-vector-icons/Entypo';
// import { Content } from '../types/contentType';



//****** OLD OUTDATED AND NOT WORKING< WE USE THE OTHER SPINNER COMPONENT *******








// const wheelDiameter = 330;

// const maxSpinnerItems = 21;

// const Wheel: FC<{list: Content[], currentAngle: any}> = ({list, currentAngle}) => {

    
//     // const sliceAngle = 120;


//     // dont even ask me how or how long this took. was it worth it? absolutely not
//     const crazyMathFunction = (num: number) => {
//         const x = num == 0 ? 1 : num;
//         return 0.000535867*(x ** 5) - (x ** 4)*(0.0351744) + 0.897574*(x ** 3) - (x ** 2)*(11.1576) + 68.3061*x - 56.0574;
//     };

//     /*
//         func(3) ~= 69.6
//         func(4) ~= 88
//         func(5) ~= 99.25
//         func(6) ~= 104
//         func(7) ~= 107.31
//         func(8) ~= 109
//         func(9) ~= 110
//         func(10) ~= 111.1
//         func(11) ~= 111.65
//         func(12) ~= 112.2
//         func(13) ~= 112.58
//         func(14) ~= 112.924
//         func(15) ~= 113.25
//         func(16) ~=113.44
//         17	113.56
//         18	113.22
//         19	113.62
//         20	114.2
//     */

//     {/* the spinner doesnt support that many*/}
//     if (list.length > maxSpinnerItems) {
//         list = list.slice(0, maxSpinnerItems);
//     }

//     let lastColorIndex = -1;

//     const getColor = (index) : ColorValue => {
//         const colors = [ styles.pizzaRed, styles.pizzaBlue, styles.pizzaGreen, styles.pizzaYellow ];
//         let colorIndex = index % colors.length;
//         if (colorIndex === lastColorIndex) {
//             colorIndex = (index + 1) % colors.length; // Shift to the next color
//         }
//         if (index === list.length - 1 && colorIndex === 0) {
//             colorIndex = (colorIndex + 1) % colors.length;
//         }

//         lastColorIndex = colorIndex;
//         return colors[lastColorIndex].backgroundColor;
//     };

//     const sliceAngle = 360 / (list.length > 0 ? list.length : 1);
    
//     return (
//         <View style={styles.circle}>
//             {(list && list.length > 2) ? (
//                 list.map((item, index) => {
//                     const rotation = 360/(list.length > 0 ? list.length : 1) * (index > 0 ? index : list.length);
//                     return (
//                         <Triangle 
//                             label={item.title}
//                             rotation={rotation}
//                             inputStyle={[{
//                                 borderTopWidth: wheelDiameter,
//                                 // borderLeftWidth: (wheelDiameter)*sliceAngle/(list.length > 0 ? list.length * 5.71 : 1*22),
//                                 // borderRightWidth: (wheelDiameter)*sliceAngle/(list.length > 0 ? list.length * 5.71 : 1*22),
//                                 borderLeftWidth: wheelDiameter*sliceAngle/crazyMathFunction(list.length),
//                                 borderRightWidth: wheelDiameter*sliceAngle/crazyMathFunction(list.length),

//                                 borderTopColor: getColor(index),
//                                 transform: [
//                                     {rotateZ: `${rotation}deg`},
//                                     {translateY: -wheelDiameter/2},                            
//                                 ]}]}
//                         />
//                     );
//                 })
//             ) : list.length == 2 ? (
//                 <View style={{position: 'relative', alignItems: 'center', justifyContent: 'center',}}>
//                     <View style={styles.circleRow}>
//                         <View style={[styles.pizza, styles.pizzaBlue]} />
//                         <View
//                             style={[
//                                 styles.textContainer,
//                                 {
//                                     justifyContent: "center",
//                                     transform: [
//                                         {rotateZ: `0deg`},
//                                         {translateY: 400},
//                                         {translateX: 120}
//                                     ],
//                                 },
//                             ]}
//                         >   
//                             {/* this transofm keeps the text vertical in the triangle */}
//                             <Text
//                                 style={[
//                                     styles.triangleText,
//                                     {   
//                                         fontSize: 26,
//                                         textAlign: "center",
//                                         transform: [{rotateZ: `0deg`}],
//                                     },
//                                 ]}
//                                 >{list[0].title.split(":").length == 0 ? list[0].title : list[0].title.split(":")[0]}
//                             </Text>
//                         </View>
//                     </View>
//                     <View style={styles.circleRow}>
//                         <View style={[styles.pizza, styles.pizzaRed]} />
//                         <View
//                             style={[
//                                 styles.textContainer,
//                                 {
//                                     justifyContent: "center",
//                                     transform: [
//                                         {rotateZ: `0deg`},
//                                         {translateY: 50},
//                                         {translateX: 120}
//                                     ],
//                                 },
//                             ]}
//                         >   
//                             {/* this transofm keeps the text vertical in the triangle */}
//                             <Text
//                                 style={[
//                                     styles.triangleText,
//                                     {
//                                         fontSize: 26,
//                                         textAlign: "center",
//                                         transform: [{rotateZ: `180deg`}],
//                                     },
//                                 ]}
//                                 >{list[1].title.split(":").length == 0 ? list[1].title : list[1].title.split(":")[0]}
//                             </Text>
//                         </View>
//                     </View>
//                     {/* this transfom keeps the text rotaing with the triangle */}
                    
//                 </View>
//             ) : (
//                 <View>
//                     <View style={[styles.pizza, styles.pizzaBlue]} />
//                         {list.length === 1 && (
//                             <View
//                                 style={[
//                                     styles.textContainer,
//                                     {
//                                         transform: [
//                                             {rotateZ: `180deg`},
//                                             {translateY: 50},
//                                             {translateX: 100}
//                                         ],
//                                     },
//                                 ]}
//                             >   
//                                 {/* this transofm keeps the text vertical in the triangle */}
//                                 <Text
//                                     style={[
//                                         styles.triangleText,
//                                         {
//                                             transform: [{rotateZ: `90deg`}],
//                                         },
//                                     ]}
//                                     >{list[0].title.split(":").length == 0 ? list[0].title : list[0].title.split(":")[0]}
//                                 </Text>
//                             </View>
//                         )}
//                 </View>
//             )}
//         </View>
//     );
// };

// const Info: FC<{currentColor: string; currentAngle: number}> = ({
//   currentAngle,
//   currentColor,
// }) => {
//   return (
//     <View style={styles.infoBox}>
//       <Text style={styles.text}>Current Color: {currentColor}</Text>
//       <Text style={styles.text}>Current Angle: {currentAngle}</Text>
//     </View>
//   );
// };

// export const Spinner: FC<{list: Content[]}> = ({list}) => {

//   const rotation = useSharedValue(0);
//   const [currentAngle, setCurrentAngle] = useState(rotation.value);

//   const animatedStyles = useAnimatedStyle(() => {
//     return {
//       transform: [{rotateZ: `${rotation.value}deg`}],
//     };
//   });

//   const handleAngle = (value: number) => {
//     setCurrentAngle(parseInt(value.toFixed(), 10));
//   };
//   const easing = Easing.bezier(0.23, 1, 0.32, 1);
//   const gesture = Gesture.Pan().onUpdate(e => {
//     rotation.value = withTiming(
//       Math.abs(e.velocityY) / 7 + rotation.value,
//       {
//         duration: 1000,
//         easing: easing,
//       },
//       () => runOnJS(handleAngle)(rotation.value % 360),
//     );
//   });

//   const getCurrentColor = (): string => {
//     let colors = ['Red', 'Blue', 'Green', 'Yellow'];
//     let maxItems = Math.min(list.length, maxSpinnerItems); 
//     maxItems === 0 ? maxItems = 1 : null;
//     const sliceAngle = 360 / maxItems; // angle per slice
//     let normalizedAngle = (360 - (currentAngle-(sliceAngle/2) % 360)) % 360; // Reverse direction and normalize the angle to [0, 360)
//     if (list.length === 2) {
//         colors = ['Blue', 'Red'];
//     }

//     // Determine which slice the current angle falls into
//     const colorIndex = Math.floor(normalizedAngle / sliceAngle);
//     return colors[colorIndex % colors.length];
// };

//   return (
//     <SafeAreaView style={styles.container}>
//       <GestureDetector gesture={gesture}>
//         <View style={styles.circleContainer}>
//           <Entypo name="location-pin" size={80} color="black" style={styles.pointer} />
//           <Animated.View style={[styles.circle, animatedStyles]}>
//             <Wheel list={list} currentAngle={currentAngle} />
//           </Animated.View>
//         </View>
//       </GestureDetector>
//       <Info currentAngle={currentAngle} currentColor={getCurrentColor()} />
//     </SafeAreaView>
//   );
// };

// const Triangle = ({label, rotation, inputStyle,}) => {
//     // return <View style={[styles.triangle, inputStyle]} />;
//     return (
//         <View style={[styles.triangleContainer]}>
//             <View style={[styles.triangle, inputStyle]} />
//             {/* this transfom keeps the text rotaing with the triangle */}
//             <View
//                 style={[
//                     styles.textContainer,
//                     {
//                         transform: [
//                             {rotateZ: `${rotation}deg`},
//                             {translateY: -wheelDiameter/3.6},
//                         ],
//                     },
//                 ]}
//             >   
//                 {/* this transofm keeps the text vertical in the triangle */}
//                 <Text
//                     style={[
//                         styles.triangleText,
//                         {
//                             transform: [{rotateZ: `-90deg`}],
//                         },
//                     ]}
//                 >{label.split(":").length == 0 ? label : label.split(":")[0]}</Text>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     text: {
//         color: 'white',
//         fontSize: 16,
//       },
//       infoBox: {
//         marginTop: 15,
//         height: 40,
//         justifyContent: 'space-between',
//       },
//       circleRow: {width: '100%', height: '100%', flexDirection: 'row'},
//       pizza: {width: '100%', height: '100%'},
//       pizzaRed: {backgroundColor: '#ce4257'},
//       pizzaBlue: {backgroundColor: '#4361ee'},
//       pizzaYellow: {backgroundColor: '#fee440'},
//       pizzaGreen: {backgroundColor: '#06d6a0'},
//       ball: {
//         width: 100,
//         height: 100,
//         borderRadius: 100,
//         backgroundColor: 'blue',
//         alignSelf: 'center',
//       },
//       container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#343a40',
//       },
//       circleContainer: {
//         width: wheelDiameter,
//         height: wheelDiameter,
//         justifyContent: 'center',
//         alignItems: 'center',
//       },
//       pointer: {
//         position: 'absolute',
//         top: -50,
//         zIndex: 6000,
//         color: "gray"
//       },
//       circle: {
//         width: wheelDiameter,
//         height: wheelDiameter,
//         borderRadius: wheelDiameter/2,
//         justifyContent: 'center',
//         alignItems: 'center',
//         overflow: 'hidden',
//         position: 'relative',
//         borderWidth: 2,
//         borderColor: '#ced4da',
//       },
//       triangleContainer: {
//         position: 'relative',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height:0,
//         width:0,
//         padding:0,
//         margin: 0,
//     },
//       triangle: {
//         position: 'relative', // was absolute

//         width: 0,
//         height: 0,
//         backgroundColor: "transparent",
//         borderStyle: "solid",
//         borderLeftWidth: 50,
//         borderRightWidth: 50,
//         borderTopWidth: 100,
//         borderLeftColor: "transparent",
//         borderRightColor: "transparent",
//         borderTopColor: "red",

//         alignItems: 'center', 
//         justifyContent: 'center',
//       },
//       textContainer: {
//          position: 'absolute',
//     },
//       triangleText: {
//         color: '#fff',
//         fontSize: 12,
//     },
//       slice: {
//         position: 'absolute',
//         width: 0,
//         height: 0,
//         borderStyle: 'solid',
//         borderTopWidth: wheelDiameter,
//         borderRightWidth: wheelDiameter/2,
//         borderBottomWidth: 0,
//         borderLeftWidth: wheelDiameter/2,
//         borderTopColor: 'transparent',
//         borderRightColor: 'transparent',
//         borderBottomColor: 'transparent',
//         borderLeftColor: 'transparent',
//       },
// });

export default {};