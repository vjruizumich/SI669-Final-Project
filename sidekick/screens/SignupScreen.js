import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/authSlice';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '../components/FormInputComponent';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    
    const [permissionStatus, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.auth);

    const pickImage = async () => {
        if (!permissionStatus?.granted) {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert("Permission Required", "You need to allow access to your photos to upload a profile picture.");
                return;
            }
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'], 
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setProfilePic(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error", "Could not open image library.");
            console.error(error);
        }
    };

    const handleSignup = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        
        const result = await dispatch(registerUser({ email, password, profilePicUri: profilePic }));
        
        if (registerUser.fulfilled.match(result)) {
        } else {
            Alert.alert("Registration Failed", result.payload || "Unknown error");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Create Account</Text>
            </View>

            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {profilePic ? (
                    <Image source={{ uri: profilePic }} style={styles.profileImage} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="camera" size={30} color="gray" />
                        <Text style={styles.addPhotoText}>Add Photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.form}>
                <FormInput 
                    label="Email" 
                    value={email} 
                    onChangeText={setEmail} 
                    keyboardType="email-address" 
                    autoCapitalize="none" 
                    placeholder="Enter email"
                />
                <FormInput 
                    label="Password" 
                    value={password} 
                    onChangeText={setPassword} 
                    secureTextEntry 
                    placeholder="Create password"
                />

                <TouchableOpacity 
                    style={[styles.button, status === 'loading' && styles.buttonDisabled]} 
                    onPress={handleSignup}
                    disabled={status === 'loading'}
                >
                    <Text style={styles.buttonText}>
                        {status === 'loading' ? 'Creating Account...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        backgroundColor: '#ffffff', 
        padding: 20 
    },
    header: { 
        marginBottom: 20, 
        alignItems: 'center' 
    },
    headerTitle: { 
        fontSize: 24, 
        fontWeight: 'bold' 
    },
    imageContainer: { 
        alignSelf: 'center', 
        marginBottom: 30 
    },
    profileImage: { 
        width: 100, 
        height: 100, 
        borderRadius: 50 
    },
    placeholderImage: { 
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        backgroundColor: '#F0F0F0',
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#dddddd'
    },
    addPhotoText: { 
        fontSize: 12, 
        color: 'gray', 
        marginTop: 5 
    },
    form: { 
        width: '100%' 
    },
    button: {
        backgroundColor: '#007AFF', 
        padding: 15, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginTop: 10
    },
    buttonDisabled: { 
        backgroundColor: '#A0A0A0' 
    },
    buttonText: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: '600' 
    },
});