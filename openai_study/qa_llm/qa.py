from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

# 初始化 FastAPI 应用
app = FastAPI()

# 指定本地模型路径
local_model_path = "D:/code/klc/AI_Study/openai_study/qa_llm/model/"

# 使用 Hugging Face Hub 中的 TinyBERT 模型进行问答任务
qa_pipeline = pipeline("question-answering", model=local_model_path)

# 定义输入格式
class QAInput(BaseModel):
    question: str
    context: str

@app.post("/qa/")
async def answer_question(input_data: QAInput):
    # 使用 TinyBERT 模型进行问答推理
    result = qa_pipeline(question=input_data.question, context=input_data.context)
    return {"answer": result["answer"]}

