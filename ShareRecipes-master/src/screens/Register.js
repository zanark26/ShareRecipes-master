import { Alert, View, StyleSheet, ImageBackground } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const Register = ({ navigation }) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const [hiddenPasswordConfirm, setHiddenPasswordConfirm] = useState(true);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [describe, setDescribe] = useState("");
    const USERS = firestore().collection("USERS");

    const hasErrorFullName = () => fullName === "";
    const hasErrorEmail = () => !email.includes("@");
    const hasErrorPassword = () => password.length < 6;
    const hasErrorPasswordConfirm = () => passwordConfirm !== password;

    const getNextUserId = async () => {
        const snapshot = await USERS.get();
        const ids = snapshot.docs.map(doc => {
            const id = doc.data().id;
            return parseInt(id.replace('@cook_', ''));
        });
        const maxId = Math.max(...ids, -1);
        return `@cook_${maxId + 1}`;
    };

    const handleCreateAccount = async () => {
        // Kiểm tra thông tin đầu vào
        if (hasErrorFullName() || hasErrorEmail() || hasErrorPassword() || hasErrorPasswordConfirm()) {
            Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin đã nhập.");
            return;
        }

        try {
            const newId = await getNextUserId();
            await auth().createUserWithEmailAndPassword(email, password);
            await USERS.doc(newId).set({
                id: newId,
                fullName,
                email,
                password,
                phone,
                address,
                role: "customer",
                imageUri: "file:///data/user/0/com.tranquy11537.ShareRecipes/cache/rn_image_picker_lib_temp_a6b4f1c4-3e81-45c9-98fc-3a248cd5ee82.jpg",
                describe
            });
            navigation.navigate("Login");
        } catch (e) {
            Alert.alert("Tài khoản đã tồn tại hoặc có lỗi khác xảy ra");
            console.error("Error creating account: ", e);
        }
    };

    return (
        <ImageBackground 
            source={require('../asset/4.png')} 
            style={styles.background}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Đăng Ký Tài Khoản Mới</Text>
                    <TextInput
                        label={"Họ và Tên"}
                        value={fullName}
                        onChangeText={setFullName}
                        style={styles.input}
                    />
                    <HelperText type="error" visible={hasErrorFullName()}>
                        Họ và tên không được phép để trống
                    </HelperText>
                    <TextInput
                        label={"Email"}
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />
                    <HelperText type="error" visible={hasErrorEmail()}>
                        Địa chỉ email không hợp lệ
                    </HelperText>
                    <TextInput
                        label={"Mật khẩu"}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={hiddenPassword}
                        right={<TextInput.Icon icon={"eye"} onPress={() => setHiddenPassword(!hiddenPassword)} />}
                        style={styles.input}
                    />
                    <HelperText type="error" visible={hasErrorPassword()}>
                        Mật khẩu ít nhất 6 ký tự
                    </HelperText>
                    <TextInput
                        label={"Xác nhận mật khẩu"}
                        value={passwordConfirm}
                        onChangeText={setPasswordConfirm}
                        secureTextEntry={hiddenPasswordConfirm}
                        right={<TextInput.Icon icon={"eye"} onPress={() => setHiddenPasswordConfirm(!hiddenPasswordConfirm)} />}
                        style={styles.input}
                    />
                    <HelperText type="error" visible={hasErrorPasswordConfirm()}>
                        Xác nhận mật khẩu phải khớp với mật khẩu
                    </HelperText>
                    <TextInput
                        label={"Địa chỉ"}
                        value={address}
                        onChangeText={setAddress}
                        style={styles.input}
                    />
                    <TextInput
                        label={"Số điện thoại"}
                        value={phone}
                        onChangeText={setPhone}
                        style={styles.input}
                    />
                    <Button mode="contained" style={styles.button} onPress={handleCreateAccount}>
                        Tạo Tài Khoản Mới
                    </Button>
                    <View style={styles.footer}>
                        <Text>Bạn đã có tài khoản?</Text>
                        <Button onPress={() => navigation.navigate("Login")}>Đăng Nhập</Button>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Overlay tối để tăng khả năng đọc
        justifyContent: 'center',
    },
    container: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Nền trắng trong suốt
        borderRadius: 15,
        margin: 20,
        elevation: 5, // Đổ bóng để tạo chiều sâu
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        alignSelf: "center",
        color: "#ff9932", // Màu cam
        marginBottom: 30,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff', // Nền trắng cho các trường nhập
        borderRadius: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#ff9932", // Màu cam
        borderRadius: 10,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
});

export default Register;