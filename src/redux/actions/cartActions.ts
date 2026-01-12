import { Dispatch } from 'redux';
import { supabase, CartItem } from '../../lib/supabase';
import * as types from '../actionTypes';

export const fetchCart = (userId: string) => async (dispatch: Dispatch) => {
  dispatch({ type: types.CART_FETCH_REQUEST });

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId);

    if (error) throw error;

    dispatch({
      type: types.CART_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.CART_FETCH_FAILURE,
      payload: error.message,
    });
  }
};

export const addToCart = (userId: string, productId: string, quantity: number = 1) =>
  async (dispatch: Dispatch) => {
    try {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
          .select('*, product:products(*)')
          .single();

        if (error) throw error;

        dispatch({
          type: types.CART_UPDATE_ITEM,
          payload: data,
        });
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({ user_id: userId, product_id: productId, quantity })
          .select('*, product:products(*)')
          .single();

        if (error) throw error;

        dispatch({
          type: types.CART_ADD_ITEM,
          payload: data,
        });
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

export const updateCartItem = (itemId: string, quantity: number) => async (dispatch: Dispatch) => {
  try {
    if (quantity <= 0) {
      return dispatch(removeFromCart(itemId));
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select('*, product:products(*)')
      .single();

    if (error) throw error;

    dispatch({
      type: types.CART_UPDATE_ITEM,
      payload: data,
    });
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = (itemId: string) => async (dispatch: Dispatch) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    dispatch({
      type: types.CART_REMOVE_ITEM,
      payload: itemId,
    });
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = (userId: string) => async (dispatch: Dispatch) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    dispatch({ type: types.CART_CLEAR });
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};
