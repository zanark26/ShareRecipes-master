import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { useMyContextController } from "../store";
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons } from 'react-native-vector-icons';

const MessengerScreen = () => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const userId = userLogin.id;
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-330)).current;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDrawer = () => {
    setIsDrawerOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    Animated.timing(slideAnim, {
      toValue: -330,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const unsubscribeUser = firestore()
      .collection('USERS')
      .doc(userId)
      .onSnapshot(userDoc => {
        if (userDoc.exists) {
          setUserInfo(userDoc.data());
        } else {
          console.log('No such user document for userId:', userId);
        }
      }, error => {
        console.error('Error fetching user data:', error);
      });

    return unsubscribeUser;
  }, [userId]);
  
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('USERS')
      .onSnapshot((querySnapshot) => {
        const userData = [];
        querySnapshot.forEach((doc) => {
          const user = { id: doc.id, ...doc.data() };
          if (user.id !== userId) {
            userData.push(user);
          }
        });
        setUsers(userData);
        setFilteredUsers(userData);
        setLoading(false);
      });
  
    return unsubscribe;
  }, [userId]);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter(user =>
        user.fullName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('messageDetail', { receiverId: item.id, receiverName: item.fullName })}
    >
      <Image source={{ uri: item.imageUri }} style={styles.avatar1} />
      <Text style={styles.userName}>{item.fullName}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <Image source={{ uri: userInfo.imageUri }} style={styles.avatar} />
        </TouchableWithoutFeedback>
        <Text style={styles.searchText}>Chats</Text>
        <IconButton icon="bell" size={24} onPress={() => console.log('Thông báo')} />
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm..."
        mode="outlined"
        theme={{ roundness: 40 }}
        value={searchQuery}
        onChangeText={handleSearch}
        left={<Icon name="search" color="black" />}
      />

      <Animated.ScrollView style={styles.body}>
        {filteredUsers.length > 0 ? (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            contentContainerStyle={styles.userList}
          />
        ) : (
          <Text style={styles.noResultsText}>Không tìm thấy người dùng nào.</Text>
        )}
      </Animated.ScrollView>

      {isDrawerOpen && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.drawerContent}>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('InfoCustomer')}>
            <View style={styles.loginSection}>
              <Image source={{ uri: userInfo.imageUri }} style={styles.avatar} />
              <Text style={styles.loginText}>{userInfo.fullName}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity onPress={() => navigation.navigate('InfoCustomer')}>
            <View style={styles.IconSection}>
              <Icon name="person-outline" size={26} color="black" style={styles.arrowIcon} />
              <Text style={styles.settingText}>Bếp Cá Nhân</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('RecentDishesScreen')}>
            <View style={styles.IconSection}>
              <MaterialIcons name="notifications" size={26} color="black" style={styles.arrowIcon} />
              <Text style={styles.settingText}>Hoạt Động</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('RecentDishesScreen')}>            
            <View style={styles.IconSection}>
              <Icon name="bar-chart" size={26} color="black" style={styles.arrowIcon} />
              <Text style={styles.settingText}>Thống Kê Bếp</Text>
            </View>
          </TouchableOpacity>  
          <TouchableOpacity onPress={() => navigation.navigate('RecentDishesScreen')}>
            <View style={styles.IconSection}>
              <MaterialIcons name="access-time" size={26} color="black" style={styles.arrowIcon} />
              <Text style={styles.settingText}>Món Đã Xem Gần Đây</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Stings')}>
            <View style={styles.IconSection}>
              <MaterialIcons name="settings" size={26} color="black" style={styles.arrowIcon} />
              <Text style={styles.settingText}>Cài đặt</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('RecentDishesScreen')}>
            <View style={styles.IconSection}>
              <Icon name="send" size={26} color="black" style={styles.arrowIcon} />
              <Text style={styles.settingText}>Gửi Phản Hồi</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <IconButton icon="weather-night" onPress={() => console.log('Mặt trăng')} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f6f2',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: '#f8f8f8',
      elevation: 2,
    },
    body: {
      backgroundColor: '#f8f6f2',
      padding: 10,
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'lightgray',
    },
    searchText: {
        flex: 1,
        textAlign: 'left',
        fontSize: 20,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    searchInput: {
      marginTop: 10,
      borderRadius: 8,
    },
    drawer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 330,
      height: '100%',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: 'gray',
      zIndex: 1,
      padding: 16,
      elevation: 50,
    },
    drawerContent: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 0,
    },
    loginSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    loginText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    IconSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 6,
    },
    arrowIcon: {
      marginLeft: 2,
    },
    settingText: {
      fontSize: 16,
      marginVertical: 8,
      marginLeft: 15
    },
    iconContainer: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 16,
      left: 16,
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginVertical: 6,
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 16,
    },
    avatar1: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'lightgray',
    },
    noResultsText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: 'gray',
    },
});

export default MessengerScreen;