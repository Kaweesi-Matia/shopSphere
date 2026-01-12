import * as types from '../actionTypes';
import { Vendor, Product } from '../../lib/supabase';

interface VendorState {
  profile: Vendor | null;
  products: Product[];
  allVendors: Vendor[];
  loading: boolean;
  error: string | null;
}

const initialState: VendorState = {
  profile: null,
  products: [],
  allVendors: [],
  loading: false,
  error: null,
};

export const vendorReducer = (state = initialState, action: any): VendorState => {
  switch (action.type) {
    case types.VENDOR_FETCH_REQUEST:
    case types.VENDOR_PRODUCTS_FETCH_REQUEST:
    case types.VENDORS_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.VENDOR_FETCH_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };

    case types.VENDOR_PRODUCTS_FETCH_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false,
      };

    case types.VENDORS_FETCH_SUCCESS:
      return {
        ...state,
        allVendors: action.payload,
        loading: false,
      };

    case types.VENDOR_PRODUCT_CREATE:
      return {
        ...state,
        products: [action.payload, ...state.products],
      };

    case types.VENDOR_PRODUCT_UPDATE:
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case types.VENDOR_PRODUCT_DELETE:
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };

    case types.VENDOR_FETCH_FAILURE:
    case types.VENDOR_PRODUCTS_FETCH_FAILURE:
    case types.VENDORS_FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
