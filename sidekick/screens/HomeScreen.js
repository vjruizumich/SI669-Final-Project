import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/authSlice';

export default function HomeScreen() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    return (
        <View style={styles.container}>
            <View style={styles.currencyDisplay}>
                <Text style={styles.currencyText}>Coins: {user?.currency || 0}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.welcomeText}>Welcome, {user?.email}!</Text>
                <Text style={{color: 'gray', marginTop: 10}}>[character room place holder]</Text>
            </View>

            <View style={styles.footer}>
                <Button 
                    title="Log Out" 
                    onPress={() => dispatch(logoutUser())} 
                    color="#FF3B30"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#ffffff', 
        padding: 20 
    },
    currencyDisplay: { 
        alignItems: 'flex-end', 
        marginBottom: 20 },
    currencyText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#FFD700' 
    },
    content: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    welcomeText: { 
        fontSize: 20, 
        fontWeight: '600' 
    },
    footer: { 
        marginBottom: 20 
    }
});