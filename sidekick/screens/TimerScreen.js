import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateCurrency } from '../features/authSlice';
import { Ionicons } from '@expo/vector-icons';

export default function TimerScreen() {
    const dispatch = useDispatch();
    
    const [initialMinutes, setInitialMinutes] = useState(25); 
    const [timeLeft, setTimeLeft] = useState(25 * 60); 
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [inputText, setInputText] = useState('25');
    
    const timerRef = useRef(null);

    useEffect(() => {
        setInputText(initialMinutes.toString());
    }, [initialMinutes]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleTimerComplete();
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleTimerComplete = async () => {
        setIsActive(false);
        clearInterval(timerRef.current);

        if (!isBreak) {
            const coinsEarned = initialMinutes;
            
            try {
                await dispatch(updateCurrency(coinsEarned)).unwrap();
                
                Alert.alert(
                    "Pomodoro Complete!", 
                    `You earned ${coinsEarned} ${coinsEarned === 1 ? 'coin' : 'coins'}! Take a break.`
                );
                
                setIsBreak(true);
                setInitialMinutes(5);
                setTimeLeft(5 * 60);

            } catch (error) {
                console.error("Coin update failed:", error);
                Alert.alert("Error Saving Coins", "Could not save your coins. Check your internet connection.");
            }

        } else {
            Alert.alert("Break Over!", "Ready to focus again?");
            setIsBreak(false);
            setInitialMinutes(25);
            setTimeLeft(25 * 60);
        }
    };

    const toggleTimer = () => {
        Keyboard.dismiss();
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsBreak(false);
        setInitialMinutes(25);
        setTimeLeft(25 * 60);
    };

    const adjustTime = (change) => {
        if (isActive) return; 
        const newTime = initialMinutes + change;
        if (newTime >= 1) {
            setInitialMinutes(newTime);
            setTimeLeft(newTime * 60);
        }
    };

    const handleTextChange = (text) => {
        setInputText(text);
        const val = parseInt(text);
        if (!isNaN(val) && val > 0) {
            setInitialMinutes(val);
            setTimeLeft(val * 60);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, isBreak ? styles.breakContainer : styles.focusContainer]}>
                <Text style={styles.modeText}>{isBreak ? "Break Time" : "Focus Time"}</Text>
                
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>

                {!isBreak && (
                    <View style={styles.coinPreview}>
                        <Ionicons name="cash" size={24} color="#4CAF50" />
                        <Text style={styles.coinText}> Reward: {initialMinutes} {initialMinutes === 1 ? 'Coin' : 'Coins'}</Text>
                    </View>
                )}

                <View style={styles.controlsContainer}>
                    {!isActive && !isBreak && (
                        <View style={styles.inputSection}>
                            <View style={styles.manualInputContainer}>
                                <Text style={styles.label}>Set Minutes:</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={inputText}
                                    onChangeText={handleTextChange}
                                    keyboardType="number-pad"
                                    maxLength={3}
                                />
                            </View>

                            <View style={styles.adjustContainer}>
                                <TouchableOpacity onPress={() => adjustTime(-5)} style={styles.adjustButton}>
                                    <Text style={styles.adjustText}>- 5m</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => adjustTime(5)} style={styles.adjustButton}>
                                    <Text style={styles.adjustText}>+ 5m</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <View style={styles.mainButtons}>
                        <TouchableOpacity onPress={toggleTimer} style={styles.circleButton}>
                            <Ionicons name={isActive ? "pause" : "play"} size={40} color={isBreak ? "#4CAF50" : "#007AFF"} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={resetTimer} style={styles.smallButton}>
                            <Ionicons name="refresh" size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    focusContainer: {
        backgroundColor: '#ffffff',
    },
    breakContainer: {
        backgroundColor: '#e8f5e9',
    },
    modeText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
    },
    timerText: {
        fontSize: 80,
        fontWeight: '200',
        color: '#333333',
        fontVariant: ['tabular-nums'],
    },
    coinPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    coinText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555555',
        marginLeft: 5,
    },
    controlsContainer: {
        alignItems: 'center',
        width: '100%',
    },
    inputSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    manualInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: 'gray',
        marginRight: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 8,
        fontSize: 18,
        width: 80,
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
    },
    adjustContainer: {
        flexDirection: 'row',
    },
    adjustButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 10,
        minWidth: 60,
        alignItems: 'center',
    },
    adjustText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555555',
    },
    mainButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    circleButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    smallButton: {
        padding: 10,
    },
});