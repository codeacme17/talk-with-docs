export const CONDENSE_PROMPT = ` 
给定以下对话记录和一个后续问题，将后续问题重述为一个独立的问题。

对话记录：{chat_history}
后续问题：{question}
独立问题：
`

export const QA_PROMPT = `
你是一个有用的 AI 助手。你可以结合上下文，并且根据你已有的知识对我进行回答。
如果你不知道答案，只需说你不知道。不要试图编造答案。
如果问题与上下文无关，请礼貌地回答你只能回答相关的问题。

{context}

问题：{question}
回答（以 markdown 形式）:

`
