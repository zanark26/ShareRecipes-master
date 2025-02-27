import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditRecipe = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const RECIPES = firestore().collection("RECIPES");
  const { recipeId } = route.params; // Nhận ID công thức từ tham số điều hướng
  const [ingredients, setIngredients] = useState(['', '']);
  const [steps, setSteps] = useState([{ text: '', image: null }, { text: '', image: null }]);
  const [imageUri, setImageUri] = useState(null);
  const [recipeName, setRecipeName] = useState('');
  const [meaning, setMeaning] = useState('');
  const [servings, setServings] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipeDoc = await RECIPES.doc(recipeId).get();
      if (recipeDoc.exists) {
        const recipeData = recipeDoc.data();
        setRecipeName(recipeData.name);
        setMeaning(recipeData.meaning);
        setServings(recipeData.servings);
        setCookingTime(recipeData.cookingTime);
        setIngredients(recipeData.ingredients);
        setSteps(recipeData.steps);
        setImageUri(recipeData.imageUri);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const saveRecipe = async () => {
    if (!recipeName || !servings || !cookingTime || ingredients.length === 0 || steps.length === 0) {
      alert('Please fill in all fields!');
      return;
    }
  
    setLoading(true);
  
    try {
      await RECIPES.doc(recipeId).update({
        idRecipe: recipeId,
        name: recipeName,
        meaning,
        servings,
        cookingTime,
        ingredients,
        steps,
        imageUri,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating recipe: ', error);
      setLoading(false);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']); // Thêm một nguyên liệu trống mới
  };
  
  const addStep = () => {
    setSteps([...steps, { text: '', image: null }]); // Thêm một bước mới trống
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <View style={styles.headerButtons}>
          <IconButton icon="content-save" onPress={saveRecipe} loading={loading} disabled={loading} />
          <IconButton icon="wave" onPress={() => console.log('Lên sóng')} />
          <IconButton icon="dots-vertical" onPress={() => console.log('Thêm tùy chọn')} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingTop: 80 }}>
        <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
          {imageUri ? (
            <Image style={styles.image} source={{ uri: imageUri }} />
          ) : (
            <>
              <Image style={styles.image} source={{ uri: 'https://via.placeholder.com/300' }} />
              <Text style={styles.addImageText}>Thêm hình đại diện món ăn</Text>
            </>
          )}
        </TouchableOpacity>

        <TextInput style={styles.input} placeholder="Tên món ăn" value={recipeName} onChangeText={setRecipeName} />
        <TextInput style={styles.input} placeholder="Ý nghĩa khi chia sẻ món ăn" value={meaning} onChangeText={setMeaning} />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Khẩu phần:</Text>
          <TextInput
            style={styles.numberInput}
            placeholder="2 người"
            value={servings}
            onChangeText={(text) => setServings(text || '2')}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Thời gian nấu:</Text>
          <TextInput
            style={styles.numberInput}
            placeholder="1 tiếng 30 phút"
            value={cookingTime}
            onChangeText={(text) => setCookingTime(text || '1 tiếng 30 phút')}
          />
        </View>

        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Nguyên liệu:</Text>
        {ingredients.map((ingredient, index) => (
          <View style={styles.ingredientContainer} key={index}>
            <Icon name="reorder" size={24} color="black" style={styles.icon} />
            <TextInput
              style={styles.ingredientInput}
              placeholder={`Nguyên liệu ${index + 1}`}
              value={ingredient}
              onChangeText={(text) => {
                const newIngredients = [...ingredients];
                newIngredients[index] = text;
                setIngredients(newIngredients);
              }}
            />
            <Icon
              name="more-vert"
              size={24}
              color="black"
              style={styles.icon}
              onPress={() => {
                Alert.alert(
                  'Xóa nguyên liệu',
                  'Bạn có chắc chắn muốn xóa nguyên liệu này?',
                  [
                    { text: 'Hủy', style: 'cancel' },
                    {
                      text: 'Xóa',
                      onPress: () => {
                        const newIngredients = ingredients.filter((_, i) => i !== index);
                        setIngredients(newIngredients);
                      },
                    },
                  ],
                  { cancelable: true }
                );
              }}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
          <Text style={styles.addButtonText}>+ Thêm nguyên liệu</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Cách làm:</Text>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.iconContainer}>
                <View style={styles.numberContainer}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Icon name="reorder" size={24} color="black" />
              </View>

              <TextInput
                style={styles.stepInput}
                placeholder={`Bước ${index + 1}`}
                value={step.text}
                onChangeText={(text) => {
                  const newSteps = [...steps];
                  newSteps[index].text = text;
                  setSteps(newSteps);
                }}
              />
              <Icon
                name="more-vert"
                size={24}
                color="black"
                onPress={() => {
                  Alert.alert(
                    'Xóa bước',
                    'Bạn có chắc chắn muốn xóa bước này?',
                    [
                      { text: 'Hủy', style: 'cancel' },
                      {
                        text: 'Xóa',
                        onPress: () => {
                          const newSteps = steps.filter((_, i) => i !== index);
                          setSteps(newSteps);
                        },
                      },
                    ],
                    { cancelable: true }
                  );
                }}
              />
            </View>
            <TouchableOpacity style={styles.imageButton}>
              <Icon name="photo-camera" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addStep}>
          <Text style={styles.addButtonText}>+ Thêm bước</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    padding: 16,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#1E1E1E',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  addImageText: {
    marginTop: 8,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  numberInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  ingredientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  ingredientInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#ff9932',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepContainer: {
    marginVertical: 10,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberContainer: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Căn giữa nội dung
    backgroundColor: '#ff9932',
    borderRadius: 8,
    paddingVertical: 10,  // Điều chỉnh padding trên và dưới
    paddingHorizontal: 15, // Điều chỉnh padding trái và phải
    marginTop: 8,
    marginLeft: 30,
    width: '30%',         // Đặt độ rộng theo ý muốn, ví dụ 100% để chiếm toàn bộ chiều rộng
    height: 80,
  },
});

export default EditRecipe;