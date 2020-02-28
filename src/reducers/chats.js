import types from '../constants/ActionTypes'

const initialState = {
  chats: {},
  error: null,
  isLoaded: false,
}

export const chats = (state = initialState, action) => {
  switch (action.type) {
    case types.CHATS_SUCCESS:
      return {
        ...state,
        chats: action.payload,
        isLoaded: true,
      }
    case types.CHATS_ERROR:
      return {
        ...state,
        error: action.payload.error,
      }
    default:
      return state
  }
}
