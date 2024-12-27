import { createSlice } from "@reduxjs/toolkit";

export const fIdReducers = createSlice({
    name: 'fid',
    initialState: {
        fid: 0,
        token: null,
    },
    reducers: {
        setFid: (state, action) => {
            state.fid = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        }
    }
})

export const { setFid ,setToken} = fIdReducers.actions;

export default fIdReducers.reducer