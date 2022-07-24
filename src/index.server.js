import { renderToString } from 'react-dom/server'
import express from 'express'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import React from 'react'

const app = express()
const serverRender = (req, res, next) => {
  // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 해줍니다.
  const context = {}
  const jsx = (
    <StaticRouter location={req.url} contetxt={context}>
      <App />
    </StaticRouter>
  )
  const root = renderToString(jsx) // 렌더링을 하고
  res.send(root) // 클라이언트에게 결과물을 응답합니다.
}

app.use(serverRender)
app.listen(5000, () => {
  console.log('Running on https://localhost:5000')
})