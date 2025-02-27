import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const DetectObject = () => {
  const [imageUri, setImageUri] = useState(null);
  const [labels, setLabels] = useState([]);
  
  // 🔹 API Key của Google Gemini (Lấy từ Google AI Studio)
  const apiKey = "AIzaSyBP2i5RF2ihP0DqJ65fNE2rbvY-EgILpDI";  
const apiURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;


  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image', error);
    }
  };

  // Phân tích hình ảnh với Google Gemini
  const analyzeImage = async () => {
    try {
      if (!imageUri) {
        alert("Vui lòng chọn ảnh trước!");
        return;
      }

      // Chuyển ảnh thành Base64
      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Tạo dữ liệu gửi đến API
      const requestData = {
        contents: [
          {
            parts: [
              { text: "Nhận diện món ăn trong ảnh này." },
              { inlineData: { mimeType: "image/jpeg", data: base64ImageData } }
            ]
          }
        ]
      };

      // Gửi ảnh đến Google Gemini API
      const apiResponse = await axios.post(apiURL, requestData, {
        headers: { "Content-Type": "application/json" }
      });

      // Lấy kết quả trả về
      const responseText = apiResponse.data.candidates[0]?.content?.parts[0]?.text || "Không nhận diện được.";
      setLabels(responseText.split("\n")); // Hiển thị từng dòng kết quả

    } catch (error) {
      console.error("Error analyzing image", error);
      alert(`Error: ${error.response?.data?.error?.message || 'Something went wrong'}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gemini AI Food Recognition</Text>
      
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 300, height: 300 }} />}
      
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.text}>Chọn ảnh</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={analyzeImage} style={styles.button}>
        <Text style={styles.text}>Nhận diện món ăn</Text>
      </TouchableOpacity>

      {labels.length > 0 && (
        <View>
          <Text style={styles.label}>Kết quả nhận diện:</Text>
          {labels.map((label, index) => (
            <Text key={index} style={styles.outputtext}>{label}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default DetectObject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50,
    marginTop: 100,
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  outputtext: {
    fontSize: 20,
    marginBottom: 10,
  },
});
