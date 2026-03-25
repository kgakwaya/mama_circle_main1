import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchPosts = createAsyncThunk('forums/fetchPosts', async (_, thunkAPI) => {
    try {
        const response = await api.get('/posts');
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const createPost = createAsyncThunk('forums/createPost', async (postData: any, thunkAPI) => {
    try {
        const response = await api.post('/posts', postData);
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

const forumsSlice = createSlice({
    name: 'forums',
    initialState: {
        posts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as any;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                // @ts-ignore
                state.posts.unshift(action.payload);
            });
    },
});

export default forumsSlice.reducer;
