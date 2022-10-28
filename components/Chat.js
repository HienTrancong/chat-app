import React from 'react';
import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        avatar: '',
        name: '',
      },
      // avatar: '',
      isConnected: false,
      image: null,
      location: null,
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
    querySnapshot.forEach((doc) => {

      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || '',
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

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
  };

  //Save message to asyncstorage as string
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
      console.log(this.state.messages);
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
            user: {
              _id: user.uid,
              name: name,
            },
          });
          this.unsubscribe = this.referenceMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
          this.saveMessages();
        });
      } else {
        console.log('Offline');
        this.setState({ isConnected: false });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    if (this.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  //Function to store messages in collection
  addMessages() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }), () => {
      this.saveMessages();
      this.addMessages(this.state.messages[0]);
      this.deleteMessages();
    });
  }

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

  renderCustomActions = (props) => <CustomActions {...props} />;

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }


  render() {
    let { color } = this.props.route.params;
    return (
      <View style={[{ backgroundColor: color }, styles.container]}>
        <GiftedChat
          renderBubble={this.renderBubble}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})