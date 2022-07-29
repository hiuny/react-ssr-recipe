import { loadableReady } from '@loadable/component'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { applyMiddleware, createStore } from 'redux'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import rootReducer, { rootSaga } from './modules'
import { hydrate } from 'react-dom'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  window.__PRELOAD_STATE__, // 이 값을 초기 상태로 사용함
  applyMiddleware(thunk, sagaMiddleware)
)
sagaMiddleware.run(rootSaga)
const Root = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// 프로덕션 환경에서는 loadableReady와 hydrate를 사용하고
// 개발 환경에서는 기존 방식으로 처리
if (process.env.NODE_ENV === 'production') {
  loadableReady(() => {
    hydrate(<Root />, root)
  })
} else {
  root.render(<Root />);
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
