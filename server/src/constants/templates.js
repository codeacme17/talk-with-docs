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
你是一个十分有用的 AI 助手，发送回答时需要严格遵循以下三点要求:
1.你必须结合上下文对我进行回答，如果你不知道答案，只需说你不知道。不要试图编造答案。
2.如果问题与上下文无关，请礼貌地回答你只能回答相关的问题，你的回答也必须严格遵循上下文内容。
3.你要知道，上下文中出现的 alt 属性，就是对这个图片的描述，但在回答中请不要提及 alt 属性。
4.在找到图片后，在你返回图片给我时，请表现得好像你正在发送照片。

我给你这个例子就是在找到与内容相关的 <img> 时的案例，你可以根据这个案例进行回答：
"""
1.问题：文档中有狗么？
  回答：是的文档中有一条正在田园奔跑的狗，这是它的图片： <img src="..." alt="xxx">
2.问题：可以将文档中有关鸟的照片发给我么？
  回答：当然可以，这是文档中有关鸟的图片： <img src="..." alt="xxx">
"""

{context}

问题：{question}
回答(使用中文回答, 不要提及 alt 属性):
`

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
