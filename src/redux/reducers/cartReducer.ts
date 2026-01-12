import * as types from '../actionTypes';
import { CartItem } from '../../lib/supabase';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const cartReducer = (state = initialState, action: any): CartState => {
  switch (action.type) {
    case types.CART_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.CART_FETCH_SUCCESS:
      return {
        ...state,
        items: action.payload,
        loading: false,
      };

    case types.CART_FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.CART_ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case types.CART_UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case types.CART_REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case types.CART_CLEAR:
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};
