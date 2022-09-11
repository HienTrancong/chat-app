import React from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

//Import gifted chat
import { GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createAr: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'This is a system message',
          createAt: new Date(),
          system: true,
        }
      ],
    })
  }

  //
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }))
  }


  render() {

    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{ _id: 1, }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
      </View>
    )
  }
};

// const styles = StyleSheet.create({

//   Background: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   button: {
//     width: '88%',
//     height: 50,
//     borderWidth: 1,
//     borderColor: 'black',
//     justifyContent: 'center',
//     backgroundColor: 'white',
//     alignItems: 'center',
//   },
// })
