import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, TextInput, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useMyContextController } from "../store";
import { MaterialIcons } from 'react-native-vector-icons';

const RecipeDetail = ({ route, navigation }) => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;
  const userId = userLogin.id;
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribeRecipes = firestore()
      .collection('RECIPES')
      .doc(recipeId)
      .onSnapshot(recipeDoc => {
        if (recipeDoc.exists) {
          const recipeData = recipeDoc.data();
          setRecipe(recipeData);
          const authorId = recipeData.userId;

          if (authorId) {
            firestore()
              .collection('USERS')
              .doc(authorId)
              .get()
              .then(userDoc => {
                if (userDoc.exists) {
                  setAuthorInfo(userDoc.data());
                }
              })
              .catch(error => {
                console.error('Error fetching author data:', error);
              });
          }
        } else {
          console.log('Recipe not found:', recipeId);
        }
      }, error => {
        console.error('Error fetching recipe:', error);
      });

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
      unsubscribeRecipes();
      unsubscribeUser();
    };
  }, [recipeId, userId]);

  useEffect(() => {
    if (recipe && userInfo && authorInfo) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [recipe, userInfo, authorInfo]);

  const handleEdit = () => navigation.navigate('EditRecipe', { recipeId });
  const handleBackPress = () => navigation.goBack();

  const imageHeight = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [350, 50],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 350],
    outputRange: [-3, 5],
    extrapolate: 'clamp',
  });

  const handleMenuToggle = () => setMenuVisible(!menuVisible);

  const handleOptionSelect = (option) => {
    setMenuVisible(false);
    if (option === 'addToCollection') {
      console.log('Thêm vào bộ sưu tập');
      navigation.navigate('addToCollection'); // Chuyển hướng đến trang AddToCollection
      // Thêm logic để thêm vào bộ sưu tập
    } else if (option === 'delete') {
      console.log('Xóa món này');
      // Thêm logic để xóa món
    } else if (option === 'share') {
      console.log('Chia sẻ món này');
      // Thêm logic để chia sẻ món
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />;
  }
  if (!recipe) return <Text>Recipe not found.</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={handleBackPress} />

        <Animated.View style={[styles.titleContainer, { opacity: titleOpacity }]}>
          <Text style={styles.titleNameHeader}>{recipe.name}</Text>
        </Animated.View>

        {userId === recipe.userId && (
          <TouchableOpacity
            style={styles.edittButton}
            onPress={handleEdit}
          >
            <Text style={styles.buttonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        )}

        <Menu
          visible={menuVisible}
          onDismiss={handleMenuToggle}
          anchor={<IconButton icon="dots-vertical" onPress={handleMenuToggle} />}
        >
          <Menu.Item onPress={() => handleOptionSelect('addToCollection')} title="Thêm vào bộ sưu tập" />
          <Menu.Item onPress={() => handleOptionSelect('delete')} title="Xóa món này" />
          <Menu.Item onPress={() => handleOptionSelect('share')} title="Chia sẻ món này" />
        </Menu>
      </View>
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image source={{ uri: recipe.imageUri }} style={styles.image} resizeMode="cover" />
        </Animated.View>
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>
          <View style={styles.userInfoContainer}>
            <Image
              source={{ uri: authorInfo?.imageUri }}
              style={styles.avatar1}
            />
            <View style={styles.nameIdAddress}>
              <View style={styles.nameId}>
                <Text style={styles.loginText1}>{authorInfo?.fullName}</Text>
                <Text style={styles.userId}>  {authorInfo.id}</Text>
              </View>
              <View style={styles.iconAddress}>
                <MaterialIcons name="location-on" size={20} color="gray" />
                <Text style={styles.address}>{authorInfo.address}</Text>
              </View>
            </View>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.meaning}>{recipe.meaning}</Text>
          </View>
          <View style={styles.containerTime}>
            <View style={styles.separator} />
            <View style={styles.timeContainer}>
              <MaterialIcons name="access-time" size={20} color="gray" />
              <Text style={styles.timeText}>{recipe.cookingTime}</Text>
            </View>
            <View style={styles.separator} />
          </View>
          <Text style={styles.sectionTitle}>Nguyên Liệu</Text>
          <View style={styles.iconSerVings}>
            <MaterialIcons name="person-outline" size={20} />
            <Text style={styles.servings}>{recipe.servings} phần ăn</Text>
          </View>
          <View style={styles.separatorKeGach} />
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index}>
              <Text style={styles.ingredient}>{ingredient}</Text>
              <View style={styles.separatorKeGach} />
            </View>
          ))}
          <Text style={styles.sectionTitle}>Cách Làm</Text>
          {recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepContainerCL}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
          <Text style={styles.date}>Ngày tạo: {new Date(recipe.createdAt.seconds * 1000).toLocaleString()}</Text>
          <Text style={styles.titleBinhLuan}>Bình Luận</Text>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('Comment')}>
            <View style={styles.avatarBinhLuan}>
              <Image
                source={{ uri: userInfo?.imageUri }}
                style={styles.avatarBL}
              />
              <TextInput
                style={styles.input}
                placeholder="Thêm bình luận"
                editable={false}
                pointerEvents="none"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexGrow: 1,
  },
  titleNameHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  edittButton: {
    width: '30%',
    alignSelf: 'auto',
    backgroundColor: '#ff9932',
    borderRadius: 12,
    padding: 9,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar1: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  nameIdAddress: {
    flexDirection: 'column',
  },
  nameId: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText1: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userId: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 4,
  },
  iconAddress: {
    flexDirection: 'row',
  },
  address: {
    fontSize: 16,
    color: 'gray',
  },
  meaning: {
    fontSize: 16,
    marginVertical: 8,
    fontStyle: 'italic',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'gray',
  },
  containerTime: {
    alignItems: 'center',
  },
  separator: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    height: 1,
    backgroundColor: 'black',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  iconSerVings: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  ingredient: {
    fontSize: 16,
    marginVertical: 4,
  },
  stepContainer: {
    marginVertical: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  stepContainerCL: {
    flexDirection: 'row',
    marginVertical: 8,
    padding: 5,
    borderRadius: 8,
  },
  circle: {
    left: -7,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  circleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 16,
    flexWrap: 'wrap',
    flexShrink: 1,
    maxWidth: '100%',
    lineHeight: 24,
    textAlign: 'justify',
  },
  servings: {
    fontSize: 16,
    color: 'gray',
    left: 5,
  },
  separatorKeGach: {
    height: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderColor: 'black',
    borderStyle: 'dashed',
    marginVertical: 8,
    width: '100%',
  },
  date: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  titleBinhLuan: {
    paddingBottom: 5,
    paddingTop: 5,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
  },
  avatarBinhLuan: {
    flexDirection: 'row',
  },
  avatarBL: {
    width: 35,
    height: 35,
    borderRadius: 30,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    top: 5,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    padding: 8,
    marginBottom: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default RecipeDetail;