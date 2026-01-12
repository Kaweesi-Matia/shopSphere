import * as types from '../actionTypes';
import { Order } from '../../lib/supabase';

interface OrdersState {
  items: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const ordersReducer = (state = initialState, action: any): OrdersState => {
  switch (action.type) {
    case types.ORDERS_FETCH_REQUEST:
    case types.ORDER_CREATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.ORDERS_FETCH_SUCCESS:
      return {
        ...state,
        items: action.payload,
        loading: false,
      };

    case types.ORDER_CREATE_SUCCESS:
      return {
        ...state,
        items: [action.payload, ...state.items],
        currentOrder: action.payload,
        loading: false,
      };

    case types.ORDERS_FETCH_FAILURE:
    case types.ORDER_CREATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
