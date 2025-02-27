import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, FlatList, Image, TouchableOpacity, ActivityIndicator, PanResponder, ImageBackground } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from "../store";
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons } from 'react-native-vector-icons';

const SearchScreen = () => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const userId = userLogin.id;
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-330)).current;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [popularIngredients, setPopularIngredients] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentDishes, setRecentDishes] = useState([]);

  useEffect(() => {
    const unsubscribeUser = firestore()
      .collection('USERS')
      .doc(userId)
      .onSnapshot(userDoc => {
        if (userDoc.exists) {
          setUserInfo(userDoc.data());
        } else {
          console.log('Không tìm thấy tài liệu!');
        }
        setLoading(false);
      }, error => {
        console.error(error);
        setLoading(false);
      });

    const fetchPopularIngredients = async () => {
      setLoading(true);
      try {
        const snapshot = await firestore().collection('RECIPES').limit(8).get();
        if (!snapshot.empty) {
          const ingredients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPopularIngredients([...new Map(ingredients.map(item => [item.id, item])).values()]);
        } else {
          console.log("Không có nguyên liệu phổ biến nào.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy nguyên liệu phổ biến: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularIngredients();

    return () => {
      unsubscribeUser();
    };
  }, [userId]);

  const updateRecentDishes = async (item) => {
    try {
      const recentDishesRef = firestore().collection('RECENT_DISHES').doc(userId);
      const doc = await recentDishesRef.get();
      if (!doc.exists) {
        await recentDishesRef.set({ dishes: [item.id], idDishes: userId });
      } else {
        const data = doc.data();
        if (!data.dishes.includes(item.id)) {
          data.dishes.push(item.id);
          await recentDishesRef.update({ dishes: data.dishes });
        }
      }
      setRecentDishes(prevDishes => {
        if (!prevDishes.find(d => d.id === item.id)) {
          return [...prevDishes, item];
        }
        return prevDishes;
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật món đã xem gần đây: ", error);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dx > 20,
      onPanResponderMove: (evt, gestureState) => {
        slideAnim.setValue(Math.min(0, gestureState.dx));
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          toggleDrawer();
        } else {
          closeDrawer();
        }
      },
    })
  ).current;

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

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />;
  }

  if (!userInfo) {
    return <Text style={styles.errorText}>Không tìm thấy thông tin người dùng.</Text>;
  }

  const goToRecipeDetail = (item) => {
    navigation.navigate('RecipeDetail', { recipeId: item.id });
    updateRecentDishes(item);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <Image source={{ uri: userInfo.imageUri }} style={styles.avatar} />
        </TouchableWithoutFeedback>
        <Text style={styles.searchText}>Tìm Kiếm</Text>
        <IconButton icon="bell" size={24} onPress={() => console.log('Thông báo')} />
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Gõ vào tên các nguyên liệu ..."
        mode="outlined"
        theme={{ roundness: 40 }}
        onPress={() => navigation.navigate('SearchInHome')}
        left={<Icon name="search" color="black" />}
      />

      <Animated.ScrollView style={styles.body}>
        <Text style={styles.popularIngredientsTitle}>Nguyên liệu phổ biến:</Text>
        <View style={styles.gridContainer}>
          {popularIngredients.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.ingredientItem} 
              onPress={() => goToRecipeDetail(item)}
            >
              <ImageBackground 
                source={{ uri: item.imageUri }} 
                style={styles.ingredientImage} 
                imageStyle={styles.imageBackground}
              >
                <Text style={styles.ingredientText}>{item.name}</Text>
              </ImageBackground>
            </TouchableOpacity>
            
          ))}
        </View>
        {recentDishes.length > 0 && (
          <>
            <View style={styles.recentDishesHeader}>
              <Text style={styles.recentDishesTitle}>Món đã xem gần đây:</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('RecentDishesScreen')}
              >
                <Icon name="arrow-forward" size={26} color="black" style={styles.arrowIcon} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={recentDishes.slice(0, 4)}
              renderItem={({ item, index }) => (
                <View style={styles.recentDishItemContainer}>
                  <TouchableOpacity 
                    style={styles.recentDishItem}
                    onPress={() => goToRecipeDetail(item)}
                  >
                    <Image source={{ uri: item.imageUri }} style={styles.recentDishImage} />
                    <Text style={styles.recentDishText} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.recentDishText1}>{userInfo.fullName}</Text>
                  </TouchableOpacity>
                  {index === 3 && recentDishes.length > 4 && (
                    <View style={styles.seeMoreButton}>
                      <TouchableOpacity style={styles.muiTenButton}
                        onPress={() => navigation.navigate('RecentDishesScreen')}
                      >
                        <Icon name="arrow-forward" size={30} color="black" />
                      </TouchableOpacity>
                      <Text style={styles.seeMoreText}>Xem tất cả</Text>
                    </View>
                  )}
                </View>
              )}
              keyExtractor={(item) => `${item.id}-${item.name}`} // Use a combination for unique keys
              horizontal
            />
          </>
        )}
      </Animated.ScrollView>

      <IconButton
        icon="plus"
        size={40}
        style={styles.floatingButton}
        iconColor="#fff"
        onPress={() => navigation.navigate('AddRecipe')}
        disabled={isDrawerOpen}
      />
      <IconButton
  icon="camera"
  size={30}
  onPress={() => navigation.navigate('DetectObject')}
/>

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
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
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
    backgroundColor: '#f8f6f2',
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
  loginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  IconSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff9932',
    borderRadius: 50,
    width: 50,
    height: 50,
    elevation: 5,
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
  popularIngredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Căn giữa các item
  },
  ingredientItem: {
    width: '49%', // Điều chỉnh kích thước để có hai cột
    marginBottom: 5, // Khoảng cách giữa các hàng
    borderRadius: 5,
    overflow: 'hidden', // Để tạo hiệu ứng bo tròn
  },
  ingredientImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  imageBackground: {
    borderRadius: 5, // Bo tròn cho hình nền
    justifyContent: 'center', // Căn giữa nội dung
    alignItems: 'center', // Căn giữa nội dung
  },
  ingredientText: {
    position: 'absolute', // Đặt vị trí là absolute
    bottom: 8, // Khoảng cách từ đáy
    left: 8, // Khoảng cách từ bên trái
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Nền đen bán trong suốt
    padding: 4, // Khoảng cách giữa chữ và viền nền
    borderRadius: 4, // Bo tròn cho nền
  },
  recentDishesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Đảm bảo tiêu đề và mũi tên cách xa nhau
    alignItems: 'center', // Căn giữa theo chiều dọc
    marginVertical: 16,
  },
  recentDishesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: 2, // Khoảng cách giữa tiêu đề và mũi tên
  },
  recentDishesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  recentDishItem: {
    flex: 1,
    width: 150,
    height: 220,
    margin: 8,
    paddingBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    justifyContent: 'flex-start', // Đặt nội dung ở trên cùng
  },
  recentDishImage: {
    width: 150,
    height: 100,
    marginBottom: 8,
  },
  recentDishText: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 16,
    left: 6,
    width: '100%', // Đảm bảo chiếm toàn bộ chiều rộng
    flexShrink: 1, // Cho phép xuống hàng nếu cần
  },
  recentDishText1: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 4,
    position: 'absolute', // Định vị ở vị trí tuyệt đối
    bottom: 10, // Khoảng cách từ đáy
    left: 6, // Khoảng cách từ bên trái (có thể điều chỉnh)
    right: 10, // Khoảng cách từ bên phải (có thể điều chỉnh)
  },
  recentDishItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  seeMoreButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    flexDirection: 'column', // Để xếp icon và text nằm dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
  },
  muiTenButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 50,
    height: 50,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeMoreText: {
    marginTop: 8, // Thêm margin để tạo khoảng cách giữa icon và text
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
});

export default SearchScreen;