import { Dispatch } from 'redux';
import { supabase, Profile } from '../../lib/supabase';
import * as types from '../actionTypes';

export const login = (email: string, password: string) => async (dispatch: Dispatch) => {
  dispatch({ type: types.AUTH_LOGIN_REQUEST });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      dispatch({
        type: types.AUTH_LOGIN_SUCCESS,
        payload: { user: data.user, profile },
      });
    }
  } catch (error: any) {
    dispatch({
      type: types.AUTH_LOGIN_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

export const register = (email: string, password: string, fullName: string, role: 'customer' | 'vendor' = 'customer') =>
  async (dispatch: Dispatch) => {
    dispatch({ type: types.AUTH_REGISTER_REQUEST });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role,
          });

        if (profileError) throw profileError;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        dispatch({
          type: types.AUTH_REGISTER_SUCCESS,
          payload: { user: data.user, profile },
        });
      }
    } catch (error: any) {
      dispatch({
        type: types.AUTH_REGISTER_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };

export const logout = () => async (dispatch: Dispatch) => {
  await supabase.auth.signOut();
  dispatch({ type: types.AUTH_LOGOUT });
};

export const setUser = (user: any, profile: Profile | null) => ({
  type: types.AUTH_SET_USER,
  payload: { user, profile },
});

export const loadProfile = (userId: string) => async (dispatch: Dispatch) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    dispatch({
      type: types.AUTH_LOAD_PROFILE,
      payload: profile,
    });
  } catch (error) {
    console.error('Error loading profile:', error);
  }
};
