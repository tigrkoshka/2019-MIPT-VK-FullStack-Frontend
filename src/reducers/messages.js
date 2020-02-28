import types from '../constants/ActionTypes'

const initialState = {
  messages: {},
  errors: {},
  isLoaded: false,
}

export const messages = (state = initialState, action) => {
  switch (action.type) {
    case types.MESSAGES_SUCCESS:
      return {
        messages: {
          ...state.messages,
          [action.chatTag]: [...(state.messages[action.chatTag] || []), ...action.payload],
        },
        errors: {
          ...state.errors,
          [action.chat]: null,
        },
        isLoaded: true,
      }
    case types.MESSAGES_ERROR:
      return {
        messages: {
          ...state.messages,
        },
        errors: {
          ...state.errors,
          [action.chat]: action.payload.error,
        },
      }
    default:
      return state
  }
}
