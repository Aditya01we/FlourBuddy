import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState:{
        items:[], //hold the items picked from menu
        deliveryLocation: {
            title: 'Locating...',
            address: 'Fetching your current location...',
            isManual: false,
        },
    },
    reducers:{
        setAddress: (state, action) => {
            state.deliveryLocation = action.payload;
        },
        addToCart:(state, action) => {
            const existingItem = state.items.find(item  => item.id === action.payload.id);
            //action.payload is item object

            if(existingItem){
                existingItem.quantity+= 1;
            }else{
                // Add new item and set initial quantity to 1
        state.items.push({ ...action.payload, quantity: 1 });
            }
        },

        removeFromCart: (state, action) => {
            const existingItem = state.items.find(item  => item.id === action.payload.id);
            if(existingItem){
                if(existingItem.quantity >1){
                    existingItem.quantity-= 1;
                }else{
                    state.items =state.items.filter(item => item.id !== action.payload.id);
                }
            }
        }
    }
})

export const {addToCart, removeFromCart, setAddress} = cartSlice.actions;
export default cartSlice.reducer;