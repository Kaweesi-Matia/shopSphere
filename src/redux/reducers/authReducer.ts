import * as types from '../actionTypes';
import { Profile } from '../../lib/supabase';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case types.AUTH_LOGIN_REQUEST:
    case types.AUTH_REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.AUTH_LOGIN_SUCCESS:
    case types.AUTH_REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
        loading: false,
        error: null,
      };

    case types.AUTH_LOGIN_FAILURE:
    case types.AUTH_REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.AUTH_SET_USER:
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
      };

    case types.AUTH_LOAD_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };

    case types.AUTH_LOGOUT:
      return initialState;

    default:
      return state;
  }
};
