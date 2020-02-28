import types from '../constants/ActionTypes'

const initialState = {}

export const inputText = (state = initialState, action) => {
  if (action.type === types.CHANGE_MESSAGE) {
    return {
      ...state,
      [action.chat]: {
        text: action.payload,
      },
    }
  }

  return state
}
