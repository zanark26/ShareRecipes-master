import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ActivityIndicator} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import { useMyContextController } from "../store";
import Share from 'react-native-share';


const InfoCustomer = () => {
    const navigation = useNavigation();
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    const userId = userLogin.id;
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('USERS')
            .doc(userId)
            .onSnapshot(userDoc => {
                if (userDoc.exists) {
                    const data = userDoc.data();
                    setUserInfo(data);
                    setLoading(false); // Đặt loading thành false khi nhận được dữ liệu
                } else {
                    console.log('No such document!');
                    setLoading(false); // Cập nhật loading nếu không tìm thấy tài liệu
                }
            }, error => {
                console.error(error);
                setLoading(false); // Cập nhật loading nếu có lỗi
            });

        // Cleanup function để hủy đăng ký khi component unmount
        return () => unsubscribe();
    }, []); // Thêm userId vào danh sách phụ thuộc

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />; // Hiển thị loading indicator
    }

    if (!userInfo) {
        return <Text>Không tìm thấy thông tin người dùng.</Text>; // Thông báo nếu không có dữ liệu
    }

    const handleBackPress = () => {
        navigation.goBack(); // Quay lại trang trước
      };
    const goToEditInfoCustomer = (recipeId) => {
        navigation.navigate('EditInfoCustomer');
    };

    const shareInfo = async () => {
        try {
            const message = 
                `🌟Thông tin người dùng🌟`+

                `\n       --------------------------------`+

                `\n       Tên: ${userInfo.fullName}\n`+

                `\n       Tài khoản: ${userInfo.id}`+``
            .trim();
            const imageUrl = userInfo.imageUri; // Đường dẫn tới hình ảnh
            const shareOptions = {
                title: 'Chia sẻ thông tin người dùng',
                message: message,
                //url: imageUrl
            };
    
            await Share.open(shareOptions);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}> 
                <View style={styles.headerButtons}>
                    <IconButton icon="arrow-left" onPress={handleBackPress} />
                    <View style={styles.spacer} />
                    <IconButton 
                        icon={() => <Icon name="share" size={24}/>}
                        onPress={shareInfo} 
                    />
                </View>
            </View>

            <View style={styles.header1}>
                <View style={styles.headerIndividual}>
                    <Image
                        source={{ uri: userInfo.imageUri }}
                        style={styles.avatar}
                    />
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{userInfo.fullName}</Text>
                        <Text style={styles.username}>{userInfo.id}</Text>
                    </View>
                </View> 

                <View style={styles.stats}>
                    <Text style={styles.stat}>0 Bạn bếp</Text>
                    <Text style={styles.stat}>0 Người quan tâm</Text>
                </View>
                
                <View style={styles.buttonContainer}>
                    <Button
                        title="Sửa thông tin"
                        onPress={goToEditInfoCustomer}
                        color="#ff9932"
                    />
                </View>
            </View>
           
            <View style={styles.noActivity}>
                <Image
                    source={require("../asset/chen.png")} // Thay đổi URL với icon phù hợp
                    style={styles.icon}
                />
                <Text style={styles.noActivityText}>Chưa có hoạt động bếp nào</Text>
                
            </View>

            <IconButton
                icon="plus"
                size={40}
                style={styles.floatingButton}
                iconColor="#fff"
                onPress={() => navigation.navigate('AddRecipe')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    header1: {
        paddingLeft: "3%",
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Để headerButtons chiếm không gian
    },
    spacer: {
        flex: 1, // Spacer sẽ chiếm không gian giữa hai icon
    },
    headerIndividual: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameContainer: {
        marginLeft: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    username: {
        fontSize: 16,
        color: '#888',
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        marginVertical: 10,
    },
    stat: {
        paddingLeft: "3%",
        paddingBottom: "3%",
        paddingTop: "3%",
        fontSize: 16,
    },
    buttonContainer: {
        width: '90%',
        alignSelf: 'center', // Căn giữa nút
        borderRadius: 50,
    },
    noActivity: {
        backgroundColor: '#f8f6f2',
        padding: 10,
        width: '100%', // Đảm bảo content chiếm hết chiều rộng
        height: '100%',
        alignItems: 'center',
    },
    noActivityText: {
        fontSize: 20,
        marginBottom: 10,
        marginTop: 10,
        fontWeight: 'bold',
    },
    icon: {
        marginTop: 40,
        width: 100,
        height: 100,
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

export default InfoCustomer;