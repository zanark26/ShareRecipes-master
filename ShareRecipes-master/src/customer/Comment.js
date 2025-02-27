import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CommentSection = ({ navigation }) => {
  const [comment, setComment] = useState(''); // Khởi tạo state cho bình luận
  const [comments, setComments] = useState([ // Khởi tạo state cho danh sách bình luận
    { id: '1', user: 'Trọng Trần', time: '1 giây trước', text: 'ngon' },
  ]);

  // Hàm để thêm bình luận vào danh sách
  const addComment = () => {
    if (comment.trim()) { // Kiểm tra nếu bình luận không rỗng
      setComments([...comments, { id: (comments.length + 1).toString(), user: 'Bạn', time: 'Vừa xong', text: comment }]);
      setComment(''); // Xóa trường nhập bình luận sau khi thêm
    }
  };

  // Hàm để quay lại trang trước
  const handleBackPress = () => {
    navigation.goBack(); // Gọi hàm goBack từ navigation
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={handleBackPress} /> 
      </View>
      <Text style={styles.title}>Bình Luận</Text>
      <FlatList
        data={comments} // Dữ liệu từ state comments
        renderItem={({ item }) => ( // Render từng bình luận
          <View style={styles.commentItem}>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.commentTime}>{item.time}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.replyButton}>Trả lời</Text>
          </View>
        )}
        keyExtractor={(item) => item.id} // Khóa duy nhất cho mỗi bình luận
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Dùng @ để nhắc đến ai đó." // Placeholder cho trường nhập bình luận
          value={comment} // Giá trị của trường nhập bình luận
          onChangeText={setComment} // Cập nhật state khi người dùng nhập
        />
        <TouchableOpacity 
            onPress={addComment} 
            style={styles.iconContainer}
            disabled={!comment.trim()} 
        >
            <Icon name="send" size={24} color={comment.trim() ? "#007BFF" : "#ccc"} /> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo container chiếm toàn bộ không gian
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row', // Đặt các phần tử trong header theo hàng
    alignItems: 'center', // Căn giữa các phần tử
    marginBottom: 12, // Khoảng cách dưới header
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12, // Khoảng cách dưới tiêu đề
  },
  commentItem: {
    marginBottom: 12, // Khoảng cách giữa các bình luận
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8, // Bo góc cho bình luận
  },
  userName: {
    fontWeight: 'bold', // Đậm tên người dùng
  },
  commentTime: {
    color: '#888', // Màu sắc cho thời gian bình luận
    fontSize: 12,
  },
  commentText: {
    marginVertical: 4, // Khoảng cách giữa các dòng bình luận
  },
  replyButton: {
    color: '#007BFF', // Màu sắc cho nút trả lời
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row', // Đặt các phần tử trong input theo hàng
    alignItems: 'center', // Căn giữa các phần tử
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30, // Bo góc cho input
    backgroundColor: '#fff',
    padding: 5,
  },
  input: {
    flex: 1, // Chiếm toàn bộ không gian có sẵn
    padding: 10,
    borderRadius: 30, // Bo góc cho input
    backgroundColor: '#f9f9f9',
  },
  iconContainer: {
    padding: 10, // Padding cho biểu tượng gửi
  },
});

export default CommentSection;