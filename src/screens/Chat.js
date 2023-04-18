/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {View, Text, Pressable, SafeAreaView, FlatList} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Modal from '../components/Modal';
import ChatComponent from '../components/ChatComponent';
import { styles } from '../utils/styles';
import socket from '../utils/socket';

const Chat = () => {
  const [visible, setVisible] = React.useState(false);
  const [rooms, setRooms] = React.useState([]);

  //👇🏻 Runs when the component mounts
  React.useLayoutEffect(() => {
    function fetchGroups() {
      fetch('http://10.0.2.2:4000/api')
        .then(res => res.json())
        .then(data => setRooms(data))
        .catch(err => console.error(err));
    }
    fetchGroups();
  }, []);

  //👇🏻 Runs whenever there is new trigger from the backend
  React.useEffect(() => {
    socket.on('roomsList', (rooms) => {
      setRooms(rooms);
    });
  }, [socket]);

  return (
    <SafeAreaView style={styles.chatscreen}>
      <View style={styles.chattopContainer}>
        <View style={styles.chatheader}>
          <Text style={styles.chatheading}>Chats</Text>

          {/* 👇🏻 Logs "ButtonPressed" to the console when the icon is clicked */}
          <Pressable onPress={() => setVisible(true)}>
            <Feather name="edit" size={24} color="green" />
          </Pressable>
        </View>
      </View>

      <View style={styles.chatlistContainer}>
        {rooms.length > 0 ? (
          <FlatList
            data={rooms}
            renderItem={({item}) => <ChatComponent item={item} />}
            keyExtractor={item => item.id}
          />
        ) : (
          <View style={styles.chatemptyContainer}>
            <Text style={styles.chatemptyText}>No rooms created!</Text>
            <Text>Click the icon above to create a Chat room</Text>
          </View>
        )}
      </View>
      {visible ? <Modal setVisible={setVisible} /> : ''}
    </SafeAreaView>
  );
};

export default Chat;
