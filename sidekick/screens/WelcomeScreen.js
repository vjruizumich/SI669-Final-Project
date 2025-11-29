import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                {/* logo placeholder */}
                <Ionicons name="flash" size={100} color="#007AFF" /> 
                <Text style={styles.title}>Sidekick</Text>
                <Text style={styles.tagline}>Let's get productive!</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.primaryButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.secondaryButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#ffffff', 
        justifyContent: 'center', 
        padding: 20 
    },
    logoContainer: { 
        alignItems: 'center', 
        marginBottom: 60 
    },
    title: { 
        fontSize: 40, 
        fontWeight: 'bold', 
        color: '#007AFF', 
        marginTop: 10 
    },
    tagline: { 
        fontSize: 18, 
        color: 'gray', 
        marginTop: 5 
    },
    buttonContainer: { 
        width: '100%' 
    },
    primaryButton: {
        backgroundColor: 
            '#007AFF', 
            padding: 15, 
            borderRadius: 10, 
            alignItems: 'center', 
            marginBottom: 15
    },
    primaryButtonText: { 
        color: 'white', 
        fontSize: 18, 
        fontWeight: '600' 
    },
    secondaryButton: {
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#007AFF'
    },
    secondaryButtonText: { 
        color: '#007AFF', 
        fontSize: 18, 
        fontWeight: '600' 
    },
});