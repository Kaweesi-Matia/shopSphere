import { Dispatch } from 'redux';
import { supabase, Product } from '../../lib/supabase';
import * as types from '../actionTypes';

export const fetchVendorProfile = (userId: string) => async (dispatch: Dispatch) => {
  dispatch({ type: types.VENDOR_FETCH_REQUEST });

  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    dispatch({
      type: types.VENDOR_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.VENDOR_FETCH_FAILURE,
      payload: error.message,
    });
  }
};

export const fetchVendorProducts = (vendorId: string) => async (dispatch: Dispatch) => {
  dispatch({ type: types.VENDOR_PRODUCTS_FETCH_REQUEST });

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    dispatch({
      type: types.VENDOR_PRODUCTS_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.VENDOR_PRODUCTS_FETCH_FAILURE,
      payload: error.message,
    });
  }
};

export const createProduct = (vendorId: string, productData: Partial<Product>) =>
  async (dispatch: Dispatch) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          vendor_id: vendorId,
        })
        .select()
        .single();

      if (error) throw error;

      dispatch({
        type: types.VENDOR_PRODUCT_CREATE,
        payload: data,
      });

      return data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

export const updateProduct = (productId: string, productData: Partial<Product>) =>
  async (dispatch: Dispatch) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      dispatch({
        type: types.VENDOR_PRODUCT_UPDATE,
        payload: data,
      });

      return data;
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

export const deleteProduct = (productId: string) => async (dispatch: Dispatch) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;

    dispatch({
      type: types.VENDOR_PRODUCT_DELETE,
      payload: productId,
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const fetchAllVendors = () => async (dispatch: Dispatch) => {
  dispatch({ type: types.VENDORS_FETCH_REQUEST });

  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    dispatch({
      type: types.VENDORS_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.VENDORS_FETCH_FAILURE,
      payload: error.message,
    });
  }
};
