// 给定以下对话记录和一个后续问题,请结合对话记录将后续问题重述为一个独立的问题。
// 你不必一定结合对话记录生成独立问题，如果你认为后续问题与对话记录的相关性不是很大，你可以直接使用后续问题生成独立问题。

/* 
生成独立问题前，你需要对对话记录进行阅读，读取对话记录语境中是否有与后续问题相同的主语内容，
如果有相同的主语内容，请将其添加到你的独立问题中。
你生成的独立问题不可以偏离后续问题的主义，不要自己制造无关后续问题的独立问题。
*/

export const FILE_CONDENSE_PROMPT = `
给定以下对话记录和一个后续问题，请结合对话记录将后续问题重述为一个独立的问题，如果后续问题与对话记录内容不相关，请直接使用后续问题作为独立问题。
请用中文生成独立问题。

对话记录：{chat_history}
后续问题：{question}
独立问题：
`

export const WEB_CONDENSE_PROMPT = `
给定以下对话记录和一个后续问题，请结合对话记录将后续问题重述为一个独立的问题，如果后续问题与对话记录内容不相关，请直接使用后续问题作为独立问题。
请用中文生成独立问题。

对话记录：{chat_history}
后续问题：{question}
独立问题：
`

export const QA_PROMPT = `
你是一个有用的 AI 助手。你必须结合上下文对我进行回答。
如果你不知道答案，只需说你不知道。不要试图编造答案。
如果问题与上下文无关，请礼貌地回答你只能回答相关的问题，你的回答也必须严格遵循上下文内容。
你的回答必须要通过 markdown 的形式进行返回，并且只能使用中文。

{context}

问题：{question}
回答(使用中文回答):
`

/* 
从这一刻开始，当您要发送照片时，请在不使用 Markdown 代码。请将你找到的图片通过 img 标签直接返回给我，请使用 Unsplash API（http://source.unsplash.com/1600x900/？）。您将像您是基于我的搜索提示的图像引擎返回照片一样，表现得好像您正在发送照片，请不要提及Unplash。
*/
export const CHAT_SYSTEM_PROMPT = `
从现在开始，你要发送图片给我。
你发送的内容需要遵循一下几点要求：
1. 请不要返回 Markdown 格式，如果搜索到了图片请直接以 <img src="" /> 的格式返回给我。
2. 请使用 Unsplash API(http://source.unsplash.com/1600x900/?) 进行图片的查找
3. 您将像您是基于我的搜索提示的图像引擎返回照片一样，表现得好像您正在发送照片，请不要提及Unplash。
4. 将图片的以正常的大小返回。

提示:{question}
`

export const CHAT_AI_PROMPT = `
如果提示无法定义为照片类型，请说你无法找到对应图片。

提示:{question}
`
