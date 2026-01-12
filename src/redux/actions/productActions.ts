import { Dispatch } from 'redux';
import { supabase, Product } from '../../lib/supabase';
import * as types from '../actionTypes';

export const fetchProducts = (filters?: { categoryId?: string; search?: string; featured?: boolean }) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: types.PRODUCTS_FETCH_REQUEST });

    try {
      let query = supabase
        .from('products')
        .select('*, vendors(business_name), categories(name)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters?.featured) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      dispatch({
        type: types.PRODUCTS_FETCH_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: types.PRODUCTS_FETCH_FAILURE,
        payload: error.message,
      });
    }
  };

export const fetchProductById = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: types.PRODUCT_FETCH_REQUEST });

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, vendors(id, business_name, logo_url), categories(name)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    dispatch({
      type: types.PRODUCT_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.PRODUCT_FETCH_FAILURE,
      payload: error.message,
    });
  }
};

export const fetchCategories = () => async (dispatch: Dispatch) => {
  dispatch({ type: types.CATEGORIES_FETCH_REQUEST });

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;

    dispatch({
      type: types.CATEGORIES_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.CATEGORIES_FETCH_FAILURE,
      payload: error.message,
    });
  }
};
