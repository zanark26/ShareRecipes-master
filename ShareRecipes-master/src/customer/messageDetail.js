import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMyContextController } from "../store";

const ChatScreen = ({ route, navigation }) => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const userId = userLogin.id; // ID người dùng đang đăng nhập
  const { receiverId, receiverName } = route.params; // Nhận ID người nhận và tên người nhận từ params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!userId || !receiverId) {
      console.error('User ID or Receiver ID is not valid');
      return;
    }
  
    const chatRef = firestore().collection('USERS').doc(userId).collection('CHATS').doc(receiverId);
  
    const unsubscribe = chatRef.onSnapshot((doc) => {
      if (doc.exists) {
        const { messagesSent = [], messagesReceived = [] } = doc.data();
  
        const combinedMessages = [
          ...messagesSent.map((message) => ({ ...message, senderId: userId })),
          ...messagesReceived.map((message) => ({ ...message, senderId: receiverId })),
        ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sắp xếp tin nhắn theo thời gian
  
        setMessages(combinedMessages || []); // Cập nhật tin nhắn đã sắp xếp
      } else {
        console.log("No chat history found.");
      }
    });
  
    return unsubscribe;
  }, [receiverId, userId]);
  

  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        const currentTimestamp = new Date();
  
        // Cập nhật tin nhắn trong tài liệu của người gửi (userId)
        const senderChatRef = firestore().collection('USERS').doc(userId).collection('CHATS').doc(receiverId);
        await senderChatRef.set({
          messagesSent: firestore.FieldValue.arrayUnion({
            text: newMessage,
            createdAt: currentTimestamp,
          }),
        }, { merge: true });
  
        // Cập nhật tin nhắn trong tài liệu của người nhận (receiverId)
        const receiverChatRef = firestore().collection('USERS').doc(receiverId).collection('CHATS').doc(userId);
        await receiverChatRef.set({
          messagesReceived: firestore.FieldValue.arrayUnion({
            text: newMessage,
            createdAt: currentTimestamp,
          }),
        }, { merge: true });
  
        // Sau khi gửi tin nhắn, cuộn xuống dưới cùng của danh sách
        this.flatListRef.scrollToEnd({ animated: true });
  
        console.log("Message sent:", newMessage);
        setNewMessage(''); // Xóa nội dung tin nhắn sau khi gửi
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };
  
  

  const renderMessage = ({ item }) => {
    const messageTime = item.createdAt ? new Date(item.createdAt.toDate()).toLocaleTimeString() : '';
  
    return (
      <View style={[
        styles.messageContainer,
        item.senderId === userId ? styles.sentMessage : styles.receivedMessage
      ]}>
        <View style={[
          styles.messageBubble,
          item.senderId === userId ? styles.sentBubble : styles.receivedBubble
        ]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{messageTime}</Text>
        </View>
      </View>
    );
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{receiverName}</Text>
        <View style={styles.headerActions}>
          <MaterialIcons name="call" size={24} color="#000" />
          <MaterialIcons name="video-call" size={24} color="#000" />
          <MaterialIcons name="more-vert" size={24} color="#000" />
        </View>
      </View>

      <FlatList
        //ref={(ref) => { this.flatListRef = ref; }}  // Tham chiếu đến FlatList để cuộn tự động
        data={messages}
        keyExtractor={(item, index) => index.toString()} 
        renderItem={renderMessage}
        inverted={true} // Hiển thị theo thứ tự tự nhiên, tin nhắn cũ ở trên, mới ở dưới
        contentContainerStyle={styles.messageList}
    />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialIcons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    marginLeft: -140,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageList: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  sentMessage: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end', // Tin nhắn gửi căn về bên phải
  },
  receivedMessage: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start', // Tin nhắn nhận căn về bên trái
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
  },
  sentBubble: {
    backgroundColor: '#007BFF',
    alignSelf: 'flex-end', // Căn về bên phải cho tin nhắn gửi
  },
  receivedBubble: {
    backgroundColor: '#f2f2f2',
    alignSelf: 'flex-start', // Căn về bên trái cho tin nhắn nhận
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
});

export default ChatScreen;
