# MCP (Model Context Protocol) 示例项目

这个项目展示了如何使用 MCP 创建客户端和服务器。

## 文件说明

- `mcp_client_example.py` - MCP 客户端示例，连接并调用各种 MCP 服务
- `mcp_server_filesystem.py` - 文件系统操作 MCP 服务器
- `mcp_server_database.py` - SQLite 数据库操作 MCP 服务器
- `mcp_server_weather.py` - 天气查询 MCP 服务器（模拟数据）
- `example.txt` - 用于测试文件读取的示例文件

## 安装依赖

```bash
pip install -r requirements.txt
```

或者手动安装：

```bash
pip install mcp anthropic
```

## 运行示例

### 方式 1: 运行完整客户端示例

```bash
python mcp_client_example.py
```

这将依次运行所有三个示例（文件系统、数据库、天气）。

### 方式 2: 单独启动服务器

在一个终端启动服务器：

```bash
# 启动文件系统服务器
python mcp_server_filesystem.py

# 或启动数据库服务器
python mcp_server_database.py

# 或启动天气服务器
python mcp_server_weather.py
```

然后在另一个终端运行客户端。

## MCP 工具列表

### 文件系统服务器
- `read_file` - 读取文件内容
- `write_file` - 写入文件
- `list_directory` - 列出目录内容
- `delete_file` - 删除文件
- `file_info` - 获取文件信息

### 数据库服务器
- `execute_query` - 执行 SQL 查询
- `list_tables` - 列出所有表
- `describe_table` - 显示表结构

### 天气服务器
- `get_weather` - 获取当前天气
- `get_forecast` - 获取天气预报
- `list_cities` - 列出支持的城市

## 注意事项

由于 MCP Python SDK 可能还在开发中，如果遇到导入错误，可以使用简化版本的示例。

## 学习资源

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [MCP GitHub](https://github.com/modelcontextprotocol)

