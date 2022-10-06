import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';

//Import gifted chat
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
//Import AsyncStorage of React Native to store messages to Client site
import AsyncStorage from "@react-native-async-storage/async-storage";
//Import Netinfo to check client connection
import NetInfo from '@react-native-community/netinfo';
//Import firebase to store messages on Google firestore database
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      avatar: '',
      isConnected: undefined,
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
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  // Retrieve chat message from asyncstorage and parse to object
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message)
    }
  }

  //Save message to asyncstorage as string
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
      console.log(this.state.messages + 'here');
    } catch (error) {
      console.log(error.message);
    }
  }

  //Delete messages from asyncstorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      });
    } catch (error) {
      console.log(error.message);
    }
  }


  componentDidMount() {
    //Set name as chat title
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    //Netinfo to check connection status
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('Online');
        this.setState({ isConnected: true });
      } else {
        console.log('Offline');
        this.setState({ isConnected: false });
      }
    });

    if (this.state.isConnected == false) {
      this.getMessages();
    } else {
      console.log('Offline here');
      this.getMessages();
      //Reference to Firestore collection
      // this.referenceMessages = firebase.firestore().collection('messages');

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
  }

  componentWillUnmount() {
    if (this.state.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }), () => {
        this.addMessages();
        this.saveMessages();
      }
    );
  }

  //Show/hide input bar by renderInputToolbar from Gift Chat
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (<InputToolbar
        {...props}
      />)
    }
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
          renderBubble={this.renderBubble}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
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
