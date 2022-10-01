import React from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

//Import gifted chat
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      avatar: '',
    };

    //Firestore config integration
    const firebaseConfig = {
      apiKey: "AIzaSyBzvOGzqIdOr4VGU7p-qePOqVYv4urgm5c",
      authDomain: "chat-app-12c75.firebaseapp.com",
      projectId: "chat-app-12c75",
      storageBucket: "chat-app-12c75.appspot.com",
      messagingSenderId: "226074002150",
      appId: "1:226074002150:web:c61002bf2cb93405523127"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    //Reference to Firestore collection
    this.referenceMessages = firebase.firestore().collection('messages');
  }

  //Function to update state whenever change in messages collection
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    });
  };

  //Function to store messages in collection
  addMessages() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  componentDidMount() {
    //Set name as chat title
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    //Reference to Firestore collection
    this.referenceMessages = firebase.firestore().collection('messages');

    //Authenticate users anonymously
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        // avatar: 'https://placeimg.com/140/140/any'
      });
      this.referenceMessages = firebase.firestore().collection('messages');
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }



  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => { this.addMessages(); }
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#E0DCCC',
          },
          right: {
            backgroundColor: '#5475A0',
          },
        }}
      />
    );
  }


  render() {
    let { color } = this.props.route.params;
    return (
      <View style={[{ backgroundColor: color }, { flex: 1 }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            avatar: 'https://placeimg.com/140/140/any',
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
      </View>
    )
  }
};

// const styles = StyleSheet.create({
//   Background: {
//     flex: 1,
//   },
// })
