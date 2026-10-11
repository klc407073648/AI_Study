# 整个过程

1. 输入：使用TinyBERT 做知识问答的模型，给出示例

2. ChatGPT输出：见chatGPT.md

3. 需要提取下载模型：
https://huggingface.co/nboost/pt-tinybert-msmarco/tree/main

4. 测试：

启动问答服务
```
PS D:\code\klc\AI_Study\>cd .\openai_study\qa_llm\
PS D:\code\klc\AI_Study\openai_study\qa_llm> uvicorn qa:app --reload
INFO:     Will watch for changes in these directories: ['D:\\code\\klc\\AI_Study\\openai_study\\qa_llm']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [14148] using StatReload
Some weights of BertForQuestionAnswering were not initialized from the model checkpoint at D:/code/klc/AI_Study/openai_study/qa_llm/model/ and are newly initialized: ['qa_outputs.bias', 'qa_outputs.weight']
You should probably TRAIN this model on a down-stream task to be able to use it for predictions and inference.      
INFO:     Started server process [28656]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:60398 - "POST /qa/ HTTP/1.1" 200 OK
```

做测试：

```
PS D:\code\klc\AI_Study\openai_study\qa_llm> python .\qa_test.py
{'answer': 'of BERT. It is designed to be more efficient in resource-constrained environments'}
```