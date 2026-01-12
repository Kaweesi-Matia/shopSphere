import * as types from '../actionTypes';
import { Product, Category } from '../../lib/supabase';

interface ProductsState {
  items: Product[];
  currentProduct: Product | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
};

export const productsReducer = (state = initialState, action: any): ProductsState => {
  switch (action.type) {
    case types.PRODUCTS_FETCH_REQUEST:
    case types.PRODUCT_FETCH_REQUEST:
    case types.CATEGORIES_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.PRODUCTS_FETCH_SUCCESS:
      return {
        ...state,
        items: action.payload,
        loading: false,
      };

    case types.PRODUCT_FETCH_SUCCESS:
      return {
        ...state,
        currentProduct: action.payload,
        loading: false,
      };

    case types.CATEGORIES_FETCH_SUCCESS:
      return {
        ...state,
        categories: action.payload,
        loading: false,
      };

    case types.PRODUCTS_FETCH_FAILURE:
    case types.PRODUCT_FETCH_FAILURE:
    case types.CATEGORIES_FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
