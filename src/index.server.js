import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import express from 'express'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import React from 'react'
import path from 'path'
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createSagaMiddleware, { END } from '@redux-saga/core'
import rootReducer, { rootSaga } from './modules'
import PreloadContext from './lib/PreloadContext'

const statsFile = path.resolve('./build/loadable-stats.json')

function createPage(root, tags) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
    <meta name="theme-color" content="#0000" />
    <title>React App</title>
    ${tags.styles}
    ${tags.links}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
      ${root}
    </div>
    ${tags.scripts}
  </body>
  </html>
  `
}

const app = express()

// 서버 사이드 렌더링을 처리할 핸들러 함수입니다.
const serverRender = async (req, res, next) => {
  // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고
  // 서버 사이드 렌더링을 해줍니다.
  const context = {}
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    rootReducer,
    applyMiddleware(thunk, sagaMiddleware)
  )
  const sagaPromise = sagaMiddleware.run(rootSaga).toPromise()
  const preloadContext = {
    done: false,
    promises: []
  }
  // 필요한 파일을 추출하기 위한 ChunkExtractor
  const extractor = new ChunkExtractor({ statsFile })
  const jsx = (
    <ChunkExtractorManager extractor={extractor}>
      <PreloadContext.Provider value={preloadContext}>
        <Provider store={store}>
          <StaticRouter location={req.url} contetxt={context}>
            <App />
          </StaticRouter>
        </Provider>
      </PreloadContext.Provider>
    </ChunkExtractorManager>
  )
  // renderToStaticMarkup()은 renterToString()보다 좀 빠르다.
  // 그저 Preloader로 넣어 주었던 함수를 호출하기 위한 목적
  renderToStaticMarkup(jsx)
  store.dispatch(END) // redux-saga의 END 액션을 발생시키면 액션을 모니터링하는 사가들이 모두 종료됩니다.
  try {
    console.log(0)
    await sagaPromise // 기존에 진행 중이던 사가들이 모두 끝날 때까지 기다립니다.
    console.log(1, preloadContext.promises)
    await Promise.all(preloadContext.promises) // 모든 프로미스를 기다림
    console.log(2)
  } catch (e) {
    console.log(e)
    return res.status(500)
  }
  preloadContext.done = true
  const root = renderToString(jsx) // 렌더링을 하고
  //JSON을 문자열로 변환하고 악성 스크립트가 실행되는 것을 방지하기 위해 <를 치환 처리
  // https://redux.js.org/recipes/server-rendering#security-considerations
  const stateString = JSON.stringify(store.getState()).replace(/</g, '\\u003c')
  const stateScript = `<script>__PRELOAD_STATE__=${stateString}</script`
  // 미리 불러와야 하는 스타일/스크립트를 추출하고
  const tags = {
    scripts: stateScript + extractor.getScriptTags(), // 스크립트 앞부분에 리덕스 상태 넣기
    links: extractor.getLinkTags(),
    styles: extractor.getStyleTags(),
  }
  res.send(createPage(root, tags)) // 클라이언트에게 결과물을 응답합니다.
}

const serve = express.static(path.resolve('./build'), {
  index: false // '/' 경로에서 index.html을 보여 주지 않도록 설정
})

app.use(serve) // 순서가 중요합니다. serverRender 전에 위치해야 합니다.
app.use(serverRender)
app.listen(5000, () => {
  console.log('Running on https://localhost:5000')
})