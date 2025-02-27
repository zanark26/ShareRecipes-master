import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, Animated, FlatList, ActivityIndicator  } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useMyContextController } from "../store";
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons } from 'react-native-vector-icons';

const RecipeStorageScreen = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;
    const userId = userLogin.id;
    const [userInfo, setUserInfo] = useState(null);
    const navigation = useNavigation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(-330)).current;
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
        Animated.timing(slideAnim, {
            toValue: isDrawerOpen ? -330 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const goToInfoCustomer = () => {
        navigation.navigate('InfoCustomer');
    };

    useEffect(() => {
        const unsubscribeRecipes = firestore()
            .collection('RECIPES')
            .where('userId', '==', userId)
            .onSnapshot(snapshot => {
                const recipesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (recipesData.length > 0) {
                    setRecipes(recipesData);
                } else {
                    console.log('No recipes found for userId:', userId);
                }
            }, error => {
                console.error('Error fetching recipes:', error);
            });

        const unsubscribeUser = firestore()
            .collection('USERS')
            .doc(userId)
            .onSnapshot(userDoc => {
                if (userDoc.exists) {
                    const data = userDoc.data();
                    setUserInfo(data);
                } else {
                    console.log('No such user document for userId:', userId);
                }
            }, error => {
                console.error('Error fetching user data:', error);
            });

        return () => {
            unsubscribeRecipes();
            unsubscribeUser();
        };
    }, []);

    useEffect(() => {
        // Cập nhật loading khi có dữ liệu từ cả recipes và userInfo
        if (recipes.length > 0 && userInfo) {
            setLoading(false);
        } else if (!userInfo || recipes.length === 0) {
            setLoading(true); // Nếu không có userInfo hoặc recipes, giữ loading là true
        }
    }, [recipes, userInfo]);

    const goToRecipeDetail = (item) => {
        navigation.navigate('RecipeDetail', { recipeId: item.id });
    };

    const renderRecipeItem = ({ item }) => (
        <TouchableOpacity style={[styles.recipeItem, { height: 170 }]} onPress={() => goToRecipeDetail(item)}>
            <View style={[styles.recipeInfo, { flex: 4 }]}>
                <Text style={styles.recipeTitle}>{item.name}</Text>
                <View style={styles.userInfoContainer}>
                    <Image
                        source={{ uri: userInfo?.imageUri }}
                        style={styles.avatar1}
                    />
                    <Text style={styles.loginText1}>{userInfo?.fullName}</Text>
                </View>
                
            </View>
            <View style={[styles.recipeImage1, { flex: 3 }]}>
                <Image
                    source={{ uri: item.imageUri }}
                    style={styles.recipeImage}
                    resizeMode="cover"
                />
            </View>
        </TouchableOpacity>
    );

    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableWithoutFeedback onPress={toggleDrawer}>
                    <Image
                        source={{ uri: userInfo?.imageUri }}
                        style={styles.avatar}
                    />
                </TouchableWithoutFeedback>
                <Text style={styles.searchText}>Kho món ngon của bạn</Text>
                <IconButton
                    icon="bell"
                    size={24}
                    onPress={() => console.log('Thông báo')}
                />
            </View>

            <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.drawerContent}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('InfoCustomer')}>
                        <View style={styles.loginSection}>
                            <Image source={{ uri: userInfo?.imageUri }} style={styles.avatar} />
                            <Text style={styles.loginText}>{userInfo?.fullName}</Text>
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

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
            ) : recipes.length > 0 ? (
                <FlatList
                    data={recipes}
                    renderItem={renderRecipeItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.contentContainer}
                />
            ) : (
                <View style={styles.content}>
                    <Image style={styles.image} source={require("../asset/KhoMonAn.png")} />
                    <Text style={styles.subtitle}>Tạo kho lưu trữ món ngon cho riêng bạn.</Text>
                    <Text style={styles.description}>
                        Bạn chưa lưu, tạo hoặc nhận bất kỳ công thức nào. Khi nào có, bạn sẽ thấy tất cả món ở đây!
                    </Text>
                </View>
            )}

            <IconButton
                icon="plus"
                size={40}
                style={styles.floatingButton}
                iconColor="#fff"
                onPress={() => navigation.navigate('AddRecipe')}
                disabled={isDrawerOpen}
            />
            
            {isDrawerOpen && (
                <TouchableWithoutFeedback onPress={toggleDrawer}>
                    <View style={styles.overlay} pointerEvents="auto" />
                </TouchableWithoutFeedback>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch', // Đặt alignItems thành 'stretch' để nội dung chiếm hết chiều rộng
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10, // Thay đổi padding để tránh khoảng trắng
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 330,
        height: '104%',
        backgroundColor: '#f8f6f2',
        borderWidth: 1,
        borderColor: 'gray',
        zIndex: 1,
        padding: 16,
    },
    drawerContent: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    loginSection: {
        
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    IconSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 6,
    },
    arrowIcon: {
        marginLeft: 2, // Khoảng cách giữa tiêu đề và mũi tên
    },
    settingText: {
        fontSize: 16,
        marginVertical: 8,
        marginLeft: 15
    },
    avatarSmall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    loginText: {
        fontSize: 18,
    },
    iconContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 16,
        left: 16,
    },
    contentContainer: {
        paddingBottom: 20, // Khoảng cách phía dưới danh sách
        paddingHorizontal: 16, // Khoảng cách hai bên
        alignItems: 'center', // Căn giữa các item
        justifyContent: 'flex-start', // Căn trên cùng
        backgroundColor: '#f8f6f2', // Màu nền cho danh sách
    },
    content: {
        backgroundColor: '#f8f6f2',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 100,
        padding: 20, // Sử dụng padding để tạo khoảng cách bên trong
        width: '100%', // Đảm bảo content chiếm hết chiều rộng
        height: '100%'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recipeItem: {
        flexDirection: 'row', // Sắp xếp theo hàng ngang
        marginVertical: 10,
        paddingRight: 30,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        width: '100%', // Đảm bảo món ăn có chiều rộng hợp lý
        alignSelf: 'center',
        alignItems: 'flex-start', // Căn giữa nội dung bên trong
    },
    recipeImage1: {
        flex: 1, // Đảm bảo phần hình ảnh chiếm hết khoảng trống còn lại
        justifyContent: 'center',
    },  
    recipeImage: {
        width: '100%', // Chiều rộng cố định cho hình ảnh
        height: '100%', // Để chiều cao tự động
        aspectRatio: 1, // Tỷ lệ khung hình 1:1, điều chỉnh theo nhu cầu
        borderTopRightRadius: 10, // Bo tròn góc trên bên phải
        borderBottomRightRadius: 10, // Bo tròn góc dưới bên phải
    },
    recipeInfo: {
        flex: 1, // Để thông tin chiếm hết không gian còn lại
        justifyContent: 'center', // Căn giữa theo chiều dọc
        padding: 10
    },
    avatar1: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    loginText1: {
        fontSize: 14,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5, // Khoảng cách giữa tiêu đề và hình ảnh
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Căn giữa theo chiều dọc
    },
    image: {
        alignSelf: 'center',
        marginVertical: 20,
        width: '100%', // Đảm bảo hình ảnh chiếm hết chiều rộng
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#666', // Màu chữ nhạt hơn (có thể thay đổi theo ý muốn)
    },
    description: {
        marginHorizontal: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
    },
    addButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007BFF',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 30,
        right: 30,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        backgroundColor: '#ff9932',
        borderRadius: 50,
        width: 50,
        height: 50,
      },
});

export default RecipeStorageScreen;