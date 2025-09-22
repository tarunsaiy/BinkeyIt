import { createSlice } from '@reduxjs/toolkit';
const initialValue = {
    _id : "",
    name: '',
    email : '',
    avatar : '',
    mobile : '',
    verify_email : '',
    last_login_date : "",
    status : '',
    address_details : [],
    shopping_cart : [],
    wishlist : [],
    order_history : [],
    role : '',
    
}
const userSlice = createSlice({
    name: 'user',
    initialState: initialValue,
    reducers: {
        setUserDetails: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state._id = action.payload._id;
            state.avatar = action.payload.avatar;
            state.mobile = action.payload.mobile;
            state.verify_email = action.payload.verify_email;
            state.last_login_date = action.payload.last_login_date;
            state.status = action.payload.status;
            state.address_details = action.payload.address_details;
            state.shopping_cart = action.payload.shopping_cart;         
            state.order_history = action.payload.order_history;
            state.role = action.payload.role;
        },
        logout : (state, action) => {
            state.name = "";
            state.email = "";
            state._id = "";
            state.avatar = "";
            state.mobile = "";
            state.verify_email = "";
            state.last_login_date = "";
            state.status = "";
            state.address_details = [];
            state.shopping_cart = [];         
            state.order_history = [];
            state.role = "";
        },
        updateAvatar : (state, action) => {
            state.avatar = action.payload;
        }
    }
});
export const { setUserDetails, logout, updateAvatar } = userSlice.actions;
export default userSlice.reducer;