import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({
    name:'auth',
    initialState:{
        isLoggedIn:false
    },
    reducers:{
        setAuthenticated:(state,action) =>{
            state.isLoggedIn = action.payload
        }
    }
})

export const {setAuthenticated} = authSlice.actions
export default authSlice.reducer