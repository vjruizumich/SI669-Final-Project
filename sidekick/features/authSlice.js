import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db, storage } from '../Secrets.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadProfileImage = async (uri, uid) => {
    if (!uri) return null;
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const storageRef = ref(storage, `profile_pics/${uid}.jpg`); 
        await uploadBytes(storageRef, blob);
        
        return await getDownloadURL(storageRef); 
    } catch (error) {
        console.error("Image upload failed", error);
        return null;
    }
};

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ email, password, profilePicUri }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { uid } = userCredential.user;

            const photoURL = await uploadProfileImage(profilePicUri, uid);

            const userData = {
                uid,
                email,
                photoURL: photoURL || null,
                currency: 0, 
                inventory: [], 
                equippedItems: {}, 
                createdAt: new Date().toISOString(),
                // !LATER! -> add stats for "nice-to-have" features here (i.e. totalSessions)
            };

            await setDoc(doc(db, 'users', uid), userData);
            return userData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const { uid } = userCredential.user;
            
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                return rejectWithValue("User data missing in Firebase database.");
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await signOut(auth);
            return null; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCurrency = createAsyncThunk(
    'auth/updateCurrency',
    async (amount, { getState, rejectWithValue }) => {
        try {
            const { user } = getState().auth;
            if (!user) return rejectWithValue("No user logged in");

            const userRef = doc(db, 'users', user.uid);
            
            await updateDoc(userRef, {
                currency: increment(amount)
            });

            return user.currency + amount;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, // user has -> { uid, email, currency, photoURL } add more later? (first and last name? user name?)
        status: 'idle',
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(updateCurrency.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.currency = action.payload;
                }
            });
    },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;