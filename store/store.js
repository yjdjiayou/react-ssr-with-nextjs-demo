import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import axios from 'axios';

const userInitialState = {};

const LOGOUT = 'LOGOUT';

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case LOGOUT: {
      return {}
    }
    default:
      return state
  }
}

const allReducers = combineReducers({
  user: userReducer,
});

// action creators
export function logout() {
  return dispatch => {
    axios
      .post('/logout')
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: LOGOUT,
          })
        } else {
          console.log('logout failed', resp)
        }
      })
      .catch(err => {
        console.log('logout failed', err)
      })
  }
}

// 为防止每次服务端重新渲染时，都使用同一个 store，这里不能默认创建并导出 store
// 需要用函数来创建 store
// 如果不重新创建 store ，store 中的状态就不会重置，下一次服务端渲染的时候，还会保留上一次的值
export default function initializeStore(state) {
  const store = createStore(
    allReducers,
    Object.assign(
      {},
      {
        user: userInitialState,
      },
      state,
    ),
    composeWithDevTools(applyMiddleware(ReduxThunk)),
  );

  return store
}
