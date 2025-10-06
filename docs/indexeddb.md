# IndexedDB 保存形式

| データベース名       | 説明                   |
| -------------------- | ---------------------- |
| projectIds           | プロジェクトの ID 一覧 |
| project-${projectId} | プロジェクトのデータ   |

## データベース: projectIds

### オブジェクトストア: projectIds

- インラインキー: id

```ts
{
    id: string,   // uuidv7
}
```

## データベース: project-${projectId}

### オブジェクトストア: project

- インラインキー: id

```ts
{
    id: string,   // プロジェクトID(uuidv7)
    name: string,   // プロジェクト名
}
```

### オブジェクトストア: nodes

- インラインキー: id

```ts
{
    id: string,   // ノードID(uuidv7)
    role: 'system',
    content: string,
    parentNodeId: string | null,
    childNodeIds: string[],
    renderingProperty: {
        left: number,
        top: number,
        width: number,
        height: number,
    },
} | {
    id: string,   // ノードID(uuidv7)
    role: 'user',
    content: string,
    parentNodeId: string | null,
    childNodeIds: string[],
    renderingProperty: {
        left: number,
        top: number,
        width: number,
        height: number,
    },
} | {
    id: string,   // ノードID(uuidv7)
    role: 'assistant',
    content: string,
    parentNodeId: string | null,
    childNodeIds: string[],
    renderingProperty: {
        left: number,
        top: number,
        width: number,
        height: number,
    },
    aiNodeProperty: {
        model: string,
        temperature: number,
        topP: number,
    },
    state: 'normal' | 'waiting' | 'running' | 'error',
}
```
