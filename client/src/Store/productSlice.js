import { createSlice } from '@reduxjs/toolkit';

const initialValue = {
    allCategory : [],
    subCategory : [],
    product : [],
    loadingCategory : false,

}

const productSlice = createSlice({
    name : 'product',
    initialState : initialValue,
    reducers : {
        setAllCategory : (state, action) => {
            state.allCategory = [...action.payload];
        },
        setAllSubCategory : (state, action) => {
            state.subCategory = [...action.payload];
        },
        setLoadingCategory : (state, action) => {
            state.loadingCategory = action.payload;
        },
    }
})

export const {setAllCategory, setAllSubCategory, setLoadingCategory} = productSlice.actions;

export default productSlice.reducer;