import { View, StyleSheet, ImageBackground } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { login, useMyContextController } from "../store";
import { useEffect, useState } from "react";

const Login = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const hasErrorEmail = () => !email.includes("@") || emailError !== "";
    const hasErrorPassword = () => password.length < 6 || passwordError !== "";

    const handleLogin = () => {
        setEmailError("");
        setPasswordError("");

        if (!email) {
            setEmailError("Email không được để trống.");
        }
        if (!password) {
            setPasswordError("Mật khẩu không được để trống.");
        }
        if (email && password) {
            login(dispatch, email, password);
        }
    };

    useEffect(() => {
        if (userLogin != null) {
            if (userLogin.role === "admin") navigation.navigate("Admin");
            else if (userLogin.role === "customer") navigation.navigate("Customers");
        }
    }, [userLogin]);

    return (
        <ImageBackground 
            source={require('../asset/4.png')} 
            style={styles.background}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Đăng Nhập</Text>
                    <TextInput
                        label={"Email"}
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />
                    <HelperText type="error" visible={hasErrorEmail()}>
                        {emailError || (hasErrorEmail() ? "Địa chỉ Email không hợp lệ" : "")}
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
                        {passwordError || (hasErrorPassword() ? "Mật khẩu ít nhất 6 ký tự" : "")}
                    </HelperText>
                    <Button mode="contained" style={styles.button} onPress={handleLogin}>
                        Đăng nhập
                    </Button>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Bạn chưa có tài khoản?</Text>
                        <Button onPress={() => navigation.navigate("Register")}>
                            Tạo tài khoản mới
                        </Button>
                    </View>
                    <View style={styles.footer}>
                        <Button onPress={() => navigation.navigate("ForgotPassword")}>
                            Quên mật khẩu?
                        </Button>
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
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Độ mờ của overlay
        justifyContent: 'center',
    },
    container: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Độ trong suốt của container
        borderRadius: 15,
        margin: 20,
        elevation: 5, // Đổ bóng nhẹ
    },
    title: {
        fontSize: 36,
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
    footerText: {
        color: "#333", // Màu tối cho văn bản trong footer
    },
});

export default Login;