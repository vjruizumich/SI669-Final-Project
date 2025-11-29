import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/authSlice';
import FormInput from '../components/FormInputComponent';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.auth);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }

        const result = await dispatch(loginUser({ email, password }));
        
        if (loginUser.rejected.match(result)) {
            Alert.alert("Login Failed", result.payload || "An error occurred");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>

            <FormInput 
                label="Email" 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none"
                keyboardType="email-address"
            />
            
            <FormInput 
                label="Password" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
            />

            <TouchableOpacity 
                style={[styles.button, status === 'loading' && styles.disabled]} 
                onPress={handleLogin}
                disabled={status === 'loading'}
            >
                <Text style={styles.buttonText}>
                    {status === 'loading' ? "Logging in..." : "Log In"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{marginTop: 20}}>
                <Text style={styles.linkText}>Don't have an account? Sign Up!</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        justifyContent: 'center', 
        backgroundColor: '#ffffff' 
    },
    title: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 30, 
        color: '#007AFF', 
        textAlign: 'center' 
    },
    button: { 
        backgroundColor: '#007AFF', 
        padding: 15, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginTop: 10 },
    disabled: { 
        backgroundColor: '#A0A0A0' 
    },
    buttonText: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: '600' 
    },
    linkText: { 
        color: '#007AFF', 
        textAlign: 'center' 
    }
});