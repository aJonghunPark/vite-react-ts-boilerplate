# vite + react + typescript + prettier + jest

## summary

案外とスムーズに進んでいてよかったが。
Jest を追加する時、色々とトラブルが爆発した。
忘れないようにメモして残す。

## create a project

template として react-ts を指定してプロジェクトを生成すると、typescript、eslint までインストールされるため、eslint --init など別途のコマンドを実行する必要はない。[参照](https://vitejs.dev/guide/)

```sh
yarn create vite <project_name> --template react-ts

... snip ...

cd <project_name>
yarn
yarn dev
```

こんなページが表示されたら成功！

![vite-react-ts.png](./doc/vite-react-ts.png)

## install prettier

prettier 関連パッケージをインストールする。

```sh
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier prettier-eslint prettier-standard @trivago/prettier-plugin-sort-imports
```

prettier の設定ファイルを作成する。

```json:.prettierrc
{
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  "importOrder": ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

eslint の設定ファイルに prettier 関連設定を追加。
env に node: true を追加。
project: "./tsconfig.json"を追加。

```javascript:.eslintrc.cjs
module.exports = {
  env: { browser: true, node: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": "warn",
  },
};
```

tsconfig.json の include に.eslintrc.cjs を追加。

```json:tsconfig.json
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "esModuleInterop": true,
    "allowJs": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "config", ".eslintrc.cjs", "jest.config.cjs"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

prettier の動作を確認する。

```sh
prettier -c .
```

prettier で formatting を行う。

```sh
prettier --write .
```

## install jest

テスト関連パッケージをインストールする。

```sh
yarn add -D jest ts-jest @types/jest @testing-library/react @testing-library/jest-dom @testing-library/dom @testing-library/user-event jest-environment-jsdom identity-obj-proxy
```

jest の設定ファイルを作成する。
esmを使うようにpresetを設定する。
そして、transformでesmを使うようにts-jestを設定する。
esbuild-jestを設定していたが、vimspectorのdebuggingのとき、typescriptがjavascriptで変換されてしまう。typescriptのままにしたい場合は、ts-jestを使わないといけない模様。

```javascript:jest.config.cjs
module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "jest-environment-jsdom",
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/dist",
    "<rootDir>/node_modules",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/(build|docs|node_modules|scripts|dist)",
  ],
  moduleNameMapper: {
    "^.+\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["ts-jest", { useESM: true }],
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|mdx)$":
      "<rootDir>/fileTransformer.js",
  },
};
```

tsconfig.json の include に jest.config.cjs を追加。

```json:tsconfig.json
... snip ...
  "include": ["src", ".eslintrc.cjs", "jest.config.cjs"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

アセットでテストが失敗しないように fileTransformer.js を用意する。（jest の公式サイトで出たもの）

```javascript:fileTransformer.js
const path = require('path');

module.exports = {
  process(sourceText, sourcePath, options) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
    };
  },
};
```

tsconfig.json の include に fileTransformer.js を追加。

```json:tsconfig.json
... snip ...
  "include": ["src", ".eslintrc.cjs", "jest.config.cjs", "fileTransformer.js"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

そうしても以下のように eslint error が表示される。

```javascript:fileTransformer.js
const path = require("path"); // E: Require statement not part of import statement.
```

指摘されたところを import 文で直さないといけない。

```javascript:fileTransformer.js
import * as path from "path";
```

直したら、eslint error が消えた。
ちゃんとテストができるかテストファイルを用意して確認する。

```javascript:App.test.tsx
import { render, screen } from "@testing-library/react";

import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn more/i);
  expect(linkElement).toBeInTheDocument();
});
```

テストしたら、エラーが発生した。

```sh
 FAIL  src/App.test.tsx
  ● Test suite failed to run

    Cannot find module '/vite.svg' from 'src/App.tsx'

    Require stack:
      src/App.tsx
      src/App.test.tsx

      34 | }
      35 |
    > 36 | export default App;
         |                           ^
      37 |

      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)
      at Object.<anonymous> (src/App.tsx:36:27)
      at Object.<anonymous> (src/App.test.tsx:24:26)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        0.56 s, estimated 1 s
Ran all test suites within paths "src/App.test.tsx".
```

vite.svg ファイルを探せない。
vite.svg ファイルは src/assets ではなく public の配下にあった。
public/vite.svg -> src/assets/vite.svg へコピーしてファイルのパスを修正した後、もう一度テストする。

```sh
Test Suites: 0 of 1 total
Tests:       0 total
Snapshots:   0 total
Time:        0.033 s
Ran all test suites within paths "src/App.test.tsx".
ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/Users/devtopia/apps/study/js/vite-react-ts-boilerplate/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use
the '.cjs' file extension.
    at file:///Users/devtopia/apps/study/js/vite-react-ts-boilerplate/fileTransformer.js:3:1
    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)
```

fileTransformer.js が ES 方式ではない CommonJS 方式で書かれていると指摘している。
CRA からの migration の時はこれで問題なかったが、Vite から react-ts の template で新規プロジェクトを生成する時は以下のように修正する必要がある。[参照](https://jestjs.io/docs/28.x/upgrading-to-jest28#transformer)

**修正版**

```javascript:fileTransformer.js
import * as path from "path";

export default {
  process(src, filename, config, options) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(filename))};`,
    };
  },
};
```

再びテストを行う。
また他のエラーが出た。
しかし、エラーメッセージが変わったので、一歩前進だ。

```sh
 FAIL  src/App.test.tsx
  ✕ renders learn react link (1 ms)

  ● renders learn react link

    ReferenceError: React is not defined



      at Object.<anonymous> (src/App.test.tsx:26:44)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        0.544 s
Ran all test suites within paths "src/App.test.tsx".
```

"React is not defined"は、App.tsx と App.test.tsx の中で React を import すればいいが。

```javascript:App.tsx
import React from "react"
```

React v17 以降からはこれを書く必要がない。
tsconfig.json で以下のように設定されている場合は、自動で React を import するらしい。

```json:tsconfig.json
"jsx": "react-jsx",
```

react-jsx を react に変更すると、React v16 までのように手動で React を import しないといけない。

```json:tsconfig.json
"jsx": "react",
```

これで修正するとテストも成功するが、できれば React の import なしでやりたい。
色々と調べて二つ方法で解決できることを確認した。

- esbuild-jest をそのまま使う。
- .babelrc を生成して、babel-jest を使う。

### use the esbuild-jest

[参照](https://github.com/aelbore/esbuild-jest/issues/70#issuecomment-1123452563)

config というフォルダを作ってその配下に jest.js ファイルを以下のように生成する。

```javascript:jest.js
import * as React from "react";

global.React = React;
```

jest.config.cjs ファイルを開いて最後に setupFilesAfterEnv という項目を追加する。

```javascript:jest.config.cjs
... snip ...
      "<rootDir>/config/fileTransformer.js",
  },
  setupFilesAfterEnv: ["<rootDir>/config/jest.js"],
};
```

fileTransformer.js も上記のように config の配下に移して tsconfig.json の include も修正する。

```json:tsconfig.json
... snip ...
  "include": ["src", "config", ".eslintrc.cjs", "jest.config.cjs"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

もう一度テストを行う。
が、別のエラーが出てきた。

```sh
 FAIL  src/App.test.tsx
  ✕ renders learn react link (18 ms)

  ● renders learn react link

    TypeError: expect(...).toBeInTheDocument is not a function



      at Object.<anonymous> (src/App.test.tsx:28:23)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        0.575 s, estimated 1 s
Ran all test suites within paths "src/App.test.tsx".
```

testing-library では@testing-library/jest-dom を import しないといけない。
App.test.tsx を修正する。

```javascript:App.test.tsx
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import App from "./App";

test("renders taskBox header", async () => {
  render(<App />);
  const linkElement = screen.getByText(/taskbox/i);
  expect(linkElement).toBeInTheDocument();
  await waitForElementToBeRemoved(linkElement);
});
```

今度こそ成功した。

```sh
 PASS  src/App.test.tsx
  ✓ renders learn react link (21 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.421 s, estimated 1 s
Ran all test suites within paths "src/App.test.tsx".
```

### use the babel-jest（非推奨）

[参照](https://zenn.dev/crsc1206/articles/de79af226d0c69)

CRA から Vite へのマイグレーションのように babel の preset をインストールして、.babelrc ファイルを生成する。

```sh
yarn add -D @babel/preset-env @babel/preset-react @babel/preset-typescript
```

```json:.babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    [
      "@babel/preset-react",
      {
        "runtime": "automatic"
      }
    ],
    "@babel/typescript"
  ]
}
```

jest.config.cjs の transform を修正する。
esbuild-jest -> babel-jest で変更する。

```javascript:jest.config.cjs
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|mdx)$":
      "<rootDir>/fileTransformer.js",
  },
```

テストして成功した。

```sh
 PASS  src/App.test.tsx
  ✓ renders learn react link (18 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.777 s
Ran all test suites within paths "src/App.test.tsx".
```

テスト結果にも出ているが、esbuild-jest が babel-jest より早い。
esbuild-jest は babel による変換なしでテストを行うので、早いみたい。
webpack、babel、esbuild の違いをちゃんと理解した方がいい。[参照](https://zenn.dev/crsc1206/articles/0b0960fa306d71)
