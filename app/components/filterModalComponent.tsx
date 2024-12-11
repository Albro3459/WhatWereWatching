import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Filter, Genres, PaidOptions, Services, Types,  } from '../types/filterTypes';
import { Colors } from '@/constants/Colors';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';
import { RalewayFont } from '@/styles/appStyles';

const FilterModal = ({ visible, onClose, initialValues } : {visible: boolean, onClose: (any) => void, initialValues: Filter}) => {
  const [selectedGenres, setSelectedGenres] = useState(initialValues.selectedGenres || []);
  const [selectedTypes, setSelectedTypes] = useState(initialValues.selectedTypes || []);
  const [selectedServices, setSelectedServices] = useState(initialValues.selectedServices || []);
  const [selectedPaidOptions, setSelectedPaidOptions] = useState(initialValues.selectedPaidOptions || []);
  const [genreOpen, setGenreOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [paidOpen, setPaidOpen] = useState(false);

  const handleOpen = (modalName) => {
    setGenreOpen(modalName === 'genre' ? !genreOpen : false);
    setTypeOpen(modalName === 'type' ? !typeOpen : false);
    setServiceOpen(modalName === 'service' ? !serviceOpen : false);
    setPaidOpen(modalName === 'paid' ? !paidOpen : false);
  };

  const handleApply = () => {
    if (genreOpen || typeOpen || serviceOpen || paidOpen) {
        handleOpen("none");
        return;
    }
    const filters: Filter = {
        selectedGenres: [...selectedGenres], // Ensures the current value is captured
        selectedTypes: [...selectedTypes],
        selectedServices: [...selectedServices],
        selectedPaidOptions: [...selectedPaidOptions],
    };
    
    // console.log('Current Filters:', {
    //     selectedGenres: [...selectedGenres],
    //     selectedTypes: [...selectedTypes],
    //     selectedServices: [...selectedServices],
    //     selectedPaidOptions: [...selectedPaidOptions],
    //   });
    onClose(filters);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Filter Options</Text>

          <Text style={styles.label}>Genre:</Text>
          <DropDownPicker
            multiple={true}
            open={genreOpen}
            setOpen={() => handleOpen('genre')}
            value={selectedGenres}
            setValue={setSelectedGenres}
            items={Genres}
            placeholder="Select Genres"
            style={styles.dropdown}
            theme="DARK"
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
            zIndex={4000}
            zIndexInverse={1000}
          />

          <Text style={styles.label}>Type:</Text>
          <DropDownPicker
            multiple={true}
            open={typeOpen}
            setOpen={() => handleOpen('type')}
            value={selectedTypes}
            setValue={setSelectedTypes}
            items={Types}
            placeholder="Select Types"
            style={styles.dropdown}
            theme="DARK"
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
            zIndex={3000}
            zIndexInverse={2000}
          />

          <Text style={styles.label}>Streaming Service:</Text>
          <DropDownPicker
            multiple={true}
            open={serviceOpen}
            setOpen={() => handleOpen('service')}
            value={selectedServices}
            setValue={setSelectedServices}
            items={Services}
            placeholder="Select Services"
            style={styles.dropdown}
            theme="DARK"
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
            zIndex={2000}
            zIndexInverse={3000}
          />

          <Text style={styles.label}>Paid or Free:</Text>
          <DropDownPicker
            multiple={true}
            open={paidOpen}
            setOpen={() => handleOpen('paid')}
            value={selectedPaidOptions}
            setValue={setSelectedPaidOptions}
            items={PaidOptions}
            placeholder="Select Payment Option"
            style={styles.dropdown}
            theme="DARK"
            mode="BADGE"
            badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
            zIndex={1000}
            zIndexInverse={4000}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => { handleOpen("none"); onClose(null); }}>
              <Text style={[styles.buttonText, {color: Colors.backgroundColor}]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleApply}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: "white",
    opacity: 50,
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  title: {
    color: Colors.backgroundColor,
    fontSize: 24,
    fontFamily: RalewayFont,
    textAlign: "center",
  },
  label: {
    color: "black",
    marginBottom: 5,
    fontSize: 16,
  },
  dropdown: {
    marginBottom: 10,
    backgroundColor: `${Colors.unselectedColor}CC`,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.buttonColor, 
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: Colors.grayCell,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FilterModal;
