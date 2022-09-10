import React from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default class Chat extends React.Component {

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
  }
  render() {
    let { color } = this.props.route.params;
    return (
      <View style={[{ backgroundColor: color }, styles.Background]}>
        <TouchableOpacity style={styles.button}
          onPress={() => this.props.navigation.navigate('Start')}
        >
          <Text>To start screen</Text>
        </TouchableOpacity>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center'
  // },

  Background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    width: '88%',
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
  },
})
