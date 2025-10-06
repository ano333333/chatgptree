# ChatGPTree

ChatGPTree はツリー構造型の LLM チャットアプリです。LLM とのやりとりを木構造のフローチャートで管理し、コンテキストの最適化を実現します。

## 📔 特徴

- **ツリー構造チャット**: 会話を木構造で管理し、複数の分岐を同時に追跡
- **コンテキスト最適化**: 効率的なコンテキスト管理による LLM 応答の向上
- **モダン UI**: Tailwind CSS と Radix UI による美しくアクセシブルなインターフェース
- **型安全性**: TypeScript による堅牢な開発環境
- **包括的テスト**: 単体テスト、コンポーネントテスト、E2E テストの充実

## 🚀 セットアップ

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/chatgptree.git
cd chatgptree

# 依存関係をインストール
pnpm install
```

### 開発サーバー起動

```bash
# 開発サーバーを起動
pnpm dev
```

ブラウザで `http://localhost:5173` を開いてアプリケーションを確認できます。

### その他のコマンド

```bash
# ビルド
pnpm build

# プレビュー
pnpm preview

# テスト実行
pnpm test

# テスト（ウォッチモード）
pnpm test:watch

# Storybook起動
pnpm storybook

# Storybookビルド
pnpm build-storybook

# Storybookテスト(`pnpm storybook`の起動中に実行する)
pnpm test:storybook

# リンター実行
pnpm lint
```

## 🛠 技術スタック

### フレームワーク・ライブラリ

- **React**: 19.1.0 (最新版)
- **TypeScript**: 5.8.3
- **Vite**: 6.3.5 (ビルドツール)
- **@xyflow/react**: 12.8.1 (フローチャート描画)

### UI・スタイリング

- **Tailwind CSS**
- **Radix UI**
- **Lucide React**

### テストフレームワーク

- **Vitest**
- **Storybook**
- **Testing Library**
- **Playwright**(vitest browser mode)

### 状態管理

- **use-context-selector**

### コード品質

- **ESLint**
- **Biome**
- **Prettier**

### 開発環境

- **pnpm**: 10.12.4
- **Node.js**: 24.3.0(pnpm で管理)

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！詳細なガイドラインは [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
