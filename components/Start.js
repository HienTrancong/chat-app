import React, { Component } from 'react';
import { ImageBackground, Button, TouchableOpacity, Text, TextInput, View, StyleSheet, Image } from 'react-native';

//Import background image from assets folder
import BackgroundImage from '../assets/Background-Image.png';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: '#090C08'
    };

  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={BackgroundImage} style={styles.BackgroundImage}>

          {/* App title box */}
          <View style={styles.titleBox}>
            <Text style={styles.title}>Chat</Text>
          </View>

          {/* Box 1 contain nameinput, color select, Chat button boxes */}
          <View style={styles.box1}>
            {/* nameInput box */}
            <View style={styles.nameInputWrapper}>

              <TextInput
                style={styles.nameInput}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder='Your Name...'
              />
            </View>

            {/* Color box */}
            <View style={styles.colorWrapper}>
              <Text style={styles.smallText}>Choose Background Color:</Text>
              <View
                style={styles.colors}
              >
                <TouchableOpacity style={(this.state.color === '#090C08') ? [styles.color, styles.color1, styles.selected] : [styles.color, styles.color1]}
                  onPress={() => this.setState({ color: '#090C08' })}
                  accessibilityLabel='Black background colour'
                  accessibilityHint='Set chat background colour to black'
                  accessibilityRole='button'
                />
                <TouchableOpacity style={(this.state.color === '#474056') ? [styles.color, styles.color2, styles.selected] : [styles.color, styles.color2]}
                  onPress={() => this.setState({ color: '#474056' })}
                  accessibilityLabel='Light purple background colour'
                  accessibilityHint='Set chat background colour to light purple'
                  accessibilityRole='button'
                />
                <TouchableOpacity style={(this.state.color === '#8A95A5') ? [styles.color, styles.color3, styles.selected] : [styles.color, styles.color3]}
                  onPress={() => this.setState({ color: '#8A95A5' })}
                  accessibilityLabel='Grey background colour'
                  accessibilityHint='Set chat background colour to grey'
                  accessibilityRole='button'
                />
                <TouchableOpacity style={(this.state.color === '#B9C6AE') ? [styles.color, styles.color4, styles.selected] : [styles.color, styles.color4]}
                  onPress={() => this.setState({ color: '#B9C6AE' })}
                  accessibilityLabel='Light green background colour'
                  accessibilityHint='Set chat background colour to light green'
                  accessibilityRole='button'
                />
              </View>
            </View>

            {/* Button box */}
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.button}
                onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
                accessible={true}
                accessibilityLabel='Go to chat screen'
                accessibilityHint='Set chat background colour to light green'
                accessibilityRole='button'
              >
                <Text style={styles.buttonText}>Start Chatting</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground >

      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  BackgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    flexDirection: 'column',
    alignItems: 'center',
  },

  titleBox: {
    flex: 1,
    height: '40%',
    width: '88%',
    paddingTop: 50,
    alignItems: 'center'
  },

  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF'
  },

  box1: {
    borderRadius: 2,
    width: '88%',
    height: '44%',
    backgroundColor: '#FFFFFF',
    justifyContent: "space-around",
    alignItems: 'center',
    paddingTop: '6%',
    paddingBottom: '6%',
    marginBottom: '6%',
    justifyContent: 'space-evenly',
  },

  // > nameinput box 
  nameInputWrapper: {
    borderRadius: 2,
    borderWidth: 1,
    width: '88%',
    height: 50,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  nameInput: {
    paddingLeft: 10,
    opacity: 0.5,
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
  },
  // < nameinput box 

  // color box >
  colorWrapper: {
    width: '88%',
    height: '60%',
    justifyContent: 'center',
    // alignContent: 'center',
  },

  smallText: {
    fontSize: 16,
    color: '#757083',
    fontWeight: '300',
    alignContent: 'center',
    justifyContent: 'center',
  },

  colors: {
    flexDirection: 'row',
    justifyContent: "space-between",
    width: "80%",
    paddingTop: 10
  },

  color: {
    width: 40,
    height: 40,
    borderRadius: 50,
    padding: 1,
    marginRight: 20,
  },

  selected: {
    borderWidth: 3,
    borderColor: 'lightgrey',
    padding: 10,
  },

  color1: {
    backgroundColor: '#090C08',
  },
  color2: {
    backgroundColor: '#474056',
  },
  color3: {
    backgroundColor: '#8A95A5',
  },
  color4: {
    backgroundColor: '#B9C6AE',
  },


  // color box <

  buttonWrapper: {
    width: '88%',
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    height: 50,
    width: '100%',
    borderRadius: 2,
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});