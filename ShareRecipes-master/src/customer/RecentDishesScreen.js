import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import { useMyContextController } from "../store";
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const RecipeStorageScreen = () => {
    const [controller] = useMyContextController();
    const navigation = useNavigation();
    const { userLogin } = controller;
    const userId = userLogin.id;
    const [userInfo, setUserInfo] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        const unsubscribeRecentDishes = firestore()
            .collection('RECENT_DISHES')
            .where('idDishes', '==', userId)
            .onSnapshot(async snapshot => {
                const recentDishesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                if (recentDishesData.length > 0) {
                    const recipeIds = recentDishesData.map(dish => dish.dishes).flat();

                    // Lấy thông tin từ bảng RECIPES
                    const recipesData = await Promise.all(recipeIds.map(async (id) => {
                        const recipeDoc = await firestore().collection('RECIPES').doc(id).get();
                        return recipeDoc.exists ? { id: recipeDoc.id, ...recipeDoc.data() } : null;
                    }));

                    // Lọc ra các món không null
                    const validRecipes = recipesData.filter(recipe => recipe);

                    // Cập nhật state với thông tin món ăn và thông tin người dùng
                    const enrichedRecipes = await Promise.all(validRecipes.map(async recipe => {
                        const userDoc = await firestore().collection('USERS').doc(recipe.userId).get();
                        const userData = userDoc.exists ? userDoc.data() : null;
                        return { ...recipe, userInfo: userData };
                    }));

                    setRecipes(enrichedRecipes);
                }

                setLoading(false);
            }, error => {
                console.error('Error fetching recent dishes:', error);
                setLoading(false);
            }
        );

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

        return () => {
            unsubscribeRecentDishes();
            unsubscribeUser();
        };
    }, [userId]);

    const goToRecipeDetail = (item) => {
        navigation.navigate('RecipeDetail', { recipeId: item.id });
    };

    

    const renderRecipeItem = ({ item }) => {
        const truncatedIngredients = item.ingredients.length > 200 
        ? item.ingredients.substring(0, 200) + '...' 
        : item.ingredients;
        return (
            <TouchableOpacity style={styles.recipeItem} onPress={() => goToRecipeDetail(item)}>
                <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{item.name}</Text>
                    <Text style={styles.ingredients}>{truncatedIngredients}</Text>
                    <View style={styles.separatorKeGach} />
                    <View style={styles.userInfoContainer}>
                        <Image source={{ uri: item.userInfo?.imageUri }} style={styles.avatar1} />
                        <Text style={styles.loginText1}>{item.userInfo?.fullName}</Text>
                    </View>
                </View>
                <View style={styles.recipeImage1}>
                    <Image source={{ uri: item.imageUri }} style={styles.recipeImage} resizeMode="cover" />
                </View>
            </TouchableOpacity>
        );
    };

    const handleDeleteAll = async () => {
        setLoading(true);
        setMenuVisible(false);
    
        try {
            // Xóa các bản ghi trong bảng "RECENT_DISHES" có userId của người dùng
            await firestore()
                .collection('RECENT_DISHES')
                .where('idDishes', '==', userId)
                .get()
                .then(querySnapshot => {
                    const batch = firestore().batch();
                    querySnapshot.docs.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    return batch.commit();
                });
    
            // Cập nhật lại state với dữ liệu mới
            const unsubscribeRecentDishes = firestore()
                .collection('RECENT_DISHES')
                .where('idDishes', '==', userId)
                .onSnapshot(async snapshot => {
                    const recentDishesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    
                    if (recentDishesData.length > 0) {
                        const recipeIds = recentDishesData.map(dish => dish.dishes).flat();
    
                        // Lấy thông tin từ bảng RECIPES
                        const recipesData = await Promise.all(recipeIds.map(async (id) => {
                            const recipeDoc = await firestore().collection('RECIPES').doc(id).get();
                            return recipeDoc.exists ? { id: recipeDoc.id, ...recipeDoc.data() } : null;
                        }));
    
                        // Lọc ra các món không null
                        const validRecipes = recipesData.filter(recipe => recipe);
    
                        // Cập nhật state với thông tin món ăn và thông tin người dùng
                        const enrichedRecipes = await Promise.all(validRecipes.map(async recipe => {
                            const userDoc = await firestore().collection('USERS').doc(recipe.userId).get();
                            const userData = userDoc.exists ? userDoc.data() : null;
                            return { ...recipe, userInfo: userData };
                        }));
    
                        setRecipes(enrichedRecipes);
                    } else {
                        setRecipes([]);
                    }
    
                    setLoading(false);
                }, error => {
                    console.error('Error fetching recent dishes:', error);
                    setLoading(false);
                });
    
            return unsubscribeRecentDishes;
        } catch (error) {
            console.error('Error deleting recent dishes:', error);
            setLoading(false);
        }
    };

    const handleBackPress = () => navigation.goBack();
    const handleMenuToggle = () => setMenuVisible(!menuVisible);
    const handleOptionSelect = (option) => {
        setMenuVisible(false);
        if (option === 'delete') {
            console.log('Xóa món này');
            handleDeleteAll();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={handleBackPress} />
                <Text style={styles.searchText}>Món đã xem gần đây</Text>
                <Menu
                    visible={menuVisible}
                    onDismiss={handleMenuToggle}
                    anchor={<IconButton icon="dots-vertical" onPress={handleMenuToggle} />}
                >
                    <Menu.Item onPress={() => handleOptionSelect('delete')} title="Xóa toàn bộ lịch sử món đã xem" />
                </Menu>
            </View>

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
                    <Image style={styles.image} source={require("../asset/MonDaXem.png")} />
                    <Text style={styles.subtitle}>Không có lịch sử xem món</Text>
                    <Text style={styles.description}>Bạn chưa xem món nào gần đây.</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f6f2',
        alignItems: 'stretch',
    },
    header: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    searchText: {
        flex: 1,
        textAlign: 'left',
        fontSize: 20,
    },
    contentContainer: {
        paddingBottom: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 100,
        padding: 20,
        width: '100%',
        height: '100%',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
    },
    recipeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        width: '100%',
        maxHeight: 170,
        marginVertical: 10,
    },
    recipeImage: {
        width: '100%',
        height: '100%',
        //aspectRatio: 1,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    recipeInfo: {
        flex: 1, // Chiếm phần còn lại
        justifyContent: 'flex-start',
        paddingTop: 6, 
    },
    recipeImage1: {
        width: 150,
        height: 170,
        justifyContent: 'center',
        padding: 0,  // Loại bỏ padding nếu có
        margin: 0,
    },
    avatar1: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: 'lightgray',
        marginRight: 8,
    },
    loginText1: {
        fontSize: 14,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        position: 'absolute',
        top: 5,
        left: 8,
    },
    ingredients: {
        fontSize: 15,
        marginBottom: 5,
        // position: 'absolute', // Loại bỏ thuộc tính này để Text có thể xuống dòng
        marginTop: 25,
        marginLeft: 8,
        marginRight: 8,
        flexWrap: 'wrap', // Cho phép văn bản tự xuống dòng
        width: '90%', // Đảm bảo chiều rộng vừa phải để Text xuống dòng
    },
    separatorKeGach: {
        height: 1,
        backgroundColor: 'transparent',
        borderTopWidth: 1,
        borderColor: 'black',
        borderStyle: 'dashed',
        marginVertical: 8,
        width: '95%',
        position: 'absolute',
        top: 110,
        left: 8,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 125, // Đặt ảnh và tên ở góc dưới
        left: 8,  // Đặt ảnh và tên ở góc trái
    },
    image: {
        alignSelf: 'center',
        marginVertical: 20,
        height: '30%',
        width: '100%',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#666',
    },
    description: {
        marginHorizontal: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
    },
});

export default RecipeStorageScreen;