import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { productsReducer } from './productsReducer';
import { cartReducer } from './cartReducer';
import { ordersReducer } from './ordersReducer';
import { vendorReducer } from './vendorReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  vendor: vendorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
