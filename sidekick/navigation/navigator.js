import React from 'react';
import { Image, View, Text } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';


import SignupScreen from '../screens/SignupScreen.js';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen.js';
import TimerScreen from '../screens/TimerScreen.js';

// placeholder screens
const StoreScreen = () => <View><Text>Store placeholder</Text></View>;
const LessonsScreen = () => <View><Text>Lessons placeholder</Text></View>;

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen 
                name="Signup" 
                component={SignupScreen} 
                options={{ 
                    headerShown: true, 
                    title: 'Sign Up', 
                    headerBackTitle: 'Back' 
                }}
            />
        </AuthStack.Navigator>
    );
}

function MainNavigator() {
    const user = useSelector(state => state.auth.user);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                headerLeft: () => (
                    <View style={{ marginLeft: 15 }}>
                        {user?.photoURL ? (
                            <Image 
                                source={{ uri: user.photoURL }} 
                                style={{ width: 35, height: 35, borderRadius: 17.5, borderWidth: 1, borderColor: '#ccc' }}
                            />
                        ) : (
                            <Ionicons name="person-circle-outline" size={35} color="gray" />
                        )}
                    </View>
                ),
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Timer') iconName = focused ? 'timer' : 'timer-outline';
                    else if (route.name === 'Store') iconName = focused ? 'cart' : 'cart-outline';
                    else if (route.name === 'Lessons') iconName = focused ? 'book' : 'book-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Sidekick' }}/>
            <Tab.Screen name="Store" component={StoreScreen} />
            <Tab.Screen name="Lessons" component={LessonsScreen} />
            <Tab.Screen 
                name="Timer" 
                component={TimerScreen} 
                options={{ 
                    title: 'Focus',
                    headerShown: false
                }} 
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const user = useSelector(state => state.auth.user);
    return user ? <MainNavigator /> : <AuthNavigator />;
}