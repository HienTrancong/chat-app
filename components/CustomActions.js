import React from 'react';
import PropTypes from "prop-types";
import { connectActionSheet } from '@expo/react-native-action-sheet';
import firebase from 'firebase';
import 'firebase/firestore';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from 'react-native';

export default class CustomActions extends React.Component {

  pickImage = async () => {
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    try {
      if (status === 'granted') {
        let result = await ImagePicker
          .launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          }).catch(error => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.imageUpload(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  takePhoto = async () => {
    // const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.MEDIA_LIBRARY
    );
    try {
      if (status === 'granted') {
        let result = await ImagePicker
          .launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          }).catch(error => comsole.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.imageUpload(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  getLocation = async () => {
    // const { status } = await Location.requestForegroundPermissionsAsync();
    const { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND);
    try {
      if (status === 'granted') {
        let result = await Location
          .getCurrentPositionAsync({})
          .catch(error => comsole.log(error));
        const longitude = JSON.stringify(result.coords.longitude);
        const latitude = JSON.stringify(result.coords.latitude);
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            }
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  imageUpload = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    //Get image name from uri
    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    //reference to firestore storage
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    //put the blob data into the referenced storage using put(async promise)
    const snapshot = await ref.put(blob);
    //close the connection
    blob.close();
    //get image URL from storage
    return await snapshot.ref.getDownloadURL();
  }

  // onActionsPress = () => {
  //   console.log('click here');
  //   const options = [
  //     'Choose From Library',
  //     'Take Picture',
  //     'Send Location',
  //     'Cancel',
  //   ];
  //   const cancelButtonIndex = options.length - 1;
  //   // this.props.showActionSheetWithOptions(
  //   this.context.actionSheet().showActionSheetWithOptions(
  //     {
  //       options,
  //       cancelButtonIndex
  //     },
  //     async (buttonIndex) => {
  //       switch (buttonIndex) {
  //         case 0:
  //           console.log('user wants to pick an image');
  //           return this.pickImage();
  //         case 1:
  //           console.log('user wants to take a photo');
  //           return this.takePhoto();
  //         case 2:
  //           console.log('user wants to take a photo');
  //           return this.getLocation();
  //       }
  //     },
  //   );
  // };

  onActionsPress = () => {
    console.log('click here');
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      // this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return;
          case 1:
            console.log('user wants to take a photo');
            return;
          case 2:
            console.log('user wants to get their location');
          default:
        }
      },);

    // this.props.showActionSheetWithOptions(
    // this.context.actionSheet().showActionSheetWithOptions(
    //   {
    //     options,
    //     cancelButtonIndex
    //   },
    //   async (buttonIndex) => {
    //     switch (buttonIndex) {
    //       case 0:
    //         console.log('user wants to pick an image');
    //         return this.pickImage();
    //       case 1:
    //         console.log('user wants to take a photo');
    //         return this.takePhoto();
    //       case 2:
    //         console.log('user wants to take a photo');
    //         return this.getLocation();
    //     }
    //   },
    // );
  };

  render() {
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionsPress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});


// CustomActions.defaultProps = {
//   onSend: () => { },
//   options: {},
//   containerStyle: {},
//   wrapperStyle: {},
//   iconTextStyle: {},
// };

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

// CustomActions = connectActionSheet(CustomActions);

// export default CustomActions;

