import types from '../constants/ActionTypes'

const initialState = {
  info: {},
  isLoaded: false,
  error: null,
}

export const userInfo = (state = initialState, action) => {
  switch (action.type) {
    case types.USER_SUCCESS:
      return {
        ...state,
        isLoaded: true,
        info: {
          ...state.info,
          ...action.payload,
        },
      }
    case types.USER_ERROR:
      return {
        ...state,
        error: action.payload.error,
      }
    default:
      return state
  }
}
