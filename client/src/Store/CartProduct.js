import { createSlice } from "@reduxjs/toolkit";
const initialValue = {
    cart : []
}
const cartSlice = createSlice({
    initialState : initialValue,
    name : "cartItem",
    reducers : {

        handleAddItemCart : (state, action) => {
            state.cart = [...action.payload]
        }
    }
})
export const { handleAddItemCart } = cartSlice.actions
export default cartSlice.reducer