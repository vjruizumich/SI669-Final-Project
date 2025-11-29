import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { store } from './store';
import { auth, db } from './Secrets';
import { setUser } from './features/authSlice';
import AppNavigator from './navigation/navigator';

function AuthListener() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    dispatch(setUser(userDoc.data()));
                }
            } else {
                dispatch(setUser(null));
            }
        });

        return unsubscribe;
    }, [dispatch]);

    return <AppNavigator />;
}

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <AuthListener />
            </NavigationContainer>
        </Provider>
    );
}