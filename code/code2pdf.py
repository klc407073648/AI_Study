import os

def find_python_files(folder_path):
    python_files = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.py'):
                python_files.append(os.path.join(root, file))
    return python_files

folder_path = 'D:\CODE\CCSP\AIS\python\code2pdf-master\Demo\pact-python-master' # 替换为你的文件夹路径
python_files = find_python_files(folder_path)

# 转换为命令行并执行
for file in python_files:
    #print("dir:", os.path.dirname(file),",file:",os.path.basename(file))
    #print('code2pdf -l -s a3 -S emacs ' + file +' '+ os.path.basename(file).replace('.py','.pdf')) # 
    os.system('code2pdf -l -s a3 -S emacs ' + file +' '+ os.path.basename(file).replace('.py','.pdf'))