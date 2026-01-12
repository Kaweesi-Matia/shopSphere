import { Dispatch } from 'redux';
import { supabase } from '../../lib/supabase';
import * as types from '../actionTypes';

export const fetchOrders = (userId: string) => async (dispatch: Dispatch) => {
  dispatch({ type: types.ORDERS_FETCH_REQUEST });

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    dispatch({
      type: types.ORDERS_FETCH_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: types.ORDERS_FETCH_FAILURE,
      payload: error.message,
    });
  }
};

export const createOrder = (orderData: {
  userId: string;
  items: any[];
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
}) => async (dispatch: Dispatch) => {
  dispatch({ type: types.ORDER_CREATE_REQUEST });

  try {
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = 10;
    const total = subtotal + tax + shipping;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.userId,
        order_number: `ORD-${Date.now()}`,
        subtotal,
        tax,
        shipping,
        total,
        shipping_address: orderData.shippingAddress,
        billing_address: orderData.billingAddress,
        payment_method: orderData.paymentMethod,
        payment_status: 'paid',
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      vendor_id: item.product.vendor_id,
      product_name: item.product.name,
      product_image: item.product.image_url,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.product.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', orderData.userId);

    if (cartError) throw cartError;

    dispatch({
      type: types.ORDER_CREATE_SUCCESS,
      payload: order,
    });

    dispatch({ type: types.CART_CLEAR });

    return order;
  } catch (error: any) {
    dispatch({
      type: types.ORDER_CREATE_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};
