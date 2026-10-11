import requests

# 定义问题和上下文
data = {
    "question": "What is TinyBERT?",
    "context": "TinyBERT is a smaller, faster version of BERT. It is designed to be more efficient in resource-constrained environments while maintaining a good level of performance for tasks like question answering."
}

# 发送 POST 请求
response = requests.post("http://127.0.0.1:8000/qa/", json=data)

# 输出返回结果
print(response.json())