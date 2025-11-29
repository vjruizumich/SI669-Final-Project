import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function FormInput({ label, value, onChangeText, ...props }) {
    return (
        <View style={styles.inputContainer}>
            {label && <Text style={styles.inputLabel}>{label}</Text>}
            <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={onChangeText}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 10,
    },
    inputLabel: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 5,
    },
    textInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 12,
        fontSize: 16,
    },
});