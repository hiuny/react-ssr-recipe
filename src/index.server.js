import { renderToString } from 'react-dom/server'
import express from 'express'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'
import React from 'react'
import path from 'path'
import fs from 'fs'

// asset-manifest.json에서 파일 경로들을 조회합니다.
const manifest = JSON.parse(
  fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf8')
)
const chunks = Object.keys(manifest.files)
  .filter(key => /chunk\.js$/.exec(key)) // chunk.js로 끝나는 키를 찾아서
  .map(key => `<script src="${manifest.files[key]}"></script>`) // 스크립트 태그로 변환하고
  .join('') // 합침

function createPage(root) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
    <meta name="theme-color" content="#0000" />
    <title>React App</title>
    <link href="${manifest.files['main.css']}" rel="stylesheet" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
      ${root}
    </div>
    ${chunks}
    <script src="${manifest.files['main.js']}"></script>
  </body>
  </html>
  `
}

const app = express()

// 서버 사이드 렌더링을 처리할 핸들러 함수입니다.
const serverRender = (req, res, next) => {
  // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고
  // 서버 사이드 렌더링을 해줍니다.
  const context = {}
  const jsx = (
    <StaticRouter location={req.url} contetxt={context}>
      <App />
    </StaticRouter>
  )
  const root = renderToString(jsx) // 렌더링을 하고
  res.send(createPage(root)) // 클라이언트에게 결과물을 응답합니다.
}

const serve = express.static(path.resolve('./build'), {
  index: false // '/' 경로에서 index.html을 보여 주지 않도록 설정
})

app.use(serve) // 순서가 중요합니다. serverRender 전에 위치해야 합니다.
app.use(serverRender)
app.listen(5000, () => {
  console.log('Running on https://localhost:5000')
})