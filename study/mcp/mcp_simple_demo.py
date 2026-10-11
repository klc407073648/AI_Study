"""
MCP 简化示例 - 避免编码问题的版本

这个示例演示 MCP 的核心功能，适合在 Windows 环境运行
"""

import asyncio
import json
from contextlib import AsyncExitStack

try:
    from mcp import ClientSession, StdioServerParameters
    from mcp.client.stdio import stdio_client
except ImportError:
    print("请先安装依赖: pip install mcp")
    exit(1)

# 这段代码定义了一个名为 demo_filesystem 的异步函数，用于演示如何通过 MCP 协议与一个文件系统服务器进行交互，并执行一系列常见的文件操作。具体理解如下：

# 1. 进入演示方法后，首先会输出标题，方便用户辨别本次操作属于“演示 1: 文件系统操作”。
# 2. 使用 AsyncExitStack 管理异步上下文资源，保证所有连接和资源在退出时正确释放。
# 3. 配置并启动一个子进程，运行本目录下的 mcp_server_filesystem.py 作为 MCP 服务器端。StdioServerParameters 用于指定启动命令和参数。
# 4. 使用 stdio_client 以标准输入输出方式（stdin/stdout）和服务器进程建立通信通道，随后创建一个 ClientSession，这样就可以作为 MCP 客户端进行后续的 API 调用了。调用 session.initialize() 用于和服务器端完成初始化握手。
# 5. 通过 session.list_tools() 调用服务器提供的“列出工具”接口，获取当前服务器支持哪些功能。并将每个工具的名称和简介打印出来。
# 6. 演示调用“read_file”工具，读取本地存在的 example.txt 文件内容，并只显示返回内容的前 100 个字符（避免输出过长）。调用方式为 session.call_tool("read_file", {"path": "example.txt"})。

# 总体来说，这段代码体现了以结构化、异步的方式连接 MCP 服务器，并使用其文件操作能力的基本流程，步骤清晰，便于新手理解和拓展。
async def demo_filesystem():
    """演示文件系统 MCP 服务"""
    print("\n" + "=" * 70)
    print("演示 1: 文件系统操作")
    print("=" * 70)
    
    async with AsyncExitStack() as stack:
        # 连接到服务器
        server_params = StdioServerParameters(
            command="python",
            args=["mcp_server_filesystem.py"]
        )
        
        stdio_transport = await stack.enter_async_context(
            stdio_client(server_params)
        )
        stdio, write = stdio_transport
        session = await stack.enter_async_context(ClientSession(stdio, write))
        await session.initialize()
        
        # 1. 列出可用工具
        print("\n[1] 列出所有可用工具:")
        tools_response = await session.list_tools()
        for tool in tools_response.tools:
            print(f"  - {tool.name}: {tool.description}")
        
        # 2. 读取文件
        print("\n[2] 读取 example.txt:")
        result = await session.call_tool("read_file", {"path": "example.txt"})
        print(f"  结果: {result.content[0].text[:100]}...")
        
        # 3. 写入新文件
        print("\n[3] 写入新文件 test_output.txt:")
        result = await session.call_tool("write_file", {
            "path": "test_output.txt",
            "content": "这是通过 MCP 写入的测试内容！\n当前时间: " + str(asyncio.get_event_loop().time())
        })
        print(f"  结果: {result.content[0].text}")
        
        # 4. 获取文件信息
        print("\n[4] 获取 example.txt 文件信息:")
        result = await session.call_tool("file_info", {"path": "example.txt"})
        print(f"  结果: {result.content[0].text}")


async def demo_database():
    """演示数据库 MCP 服务"""
    print("\n" + "=" * 70)
    print("演示 2: 数据库操作")
    print("=" * 70)
    
    async with AsyncExitStack() as stack:
        # 连接到服务器
        server_params = StdioServerParameters(
            command="python",
            args=["mcp_server_database.py"]
        )
        
        stdio_transport = await stack.enter_async_context(
            stdio_client(server_params)
        )
        stdio, write = stdio_transport
        session = await stack.enter_async_context(ClientSession(stdio, write))
        await session.initialize()
        
        # 1. 创建产品表
        print("\n[1] 创建产品表:")
        result = await session.call_tool("execute_query", {
            "query": """
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    price REAL NOT NULL,
                    stock INTEGER DEFAULT 0
                )
            """
        })
        print(f"  {result.content[0].text}")
        
        # 2. 插入数据
        print("\n[2] 插入产品数据:")
        products = [
            ("笔记本电脑", "5999.99", "15"),
            ("无线鼠标", "89.99", "50"),
            ("机械键盘", "399.00", "30")
        ]
        
        for name, price, stock in products:
            result = await session.call_tool("execute_query", {
                "query": "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
                "params": [name, price, stock]
            })
            print(f"  插入 {name}: {result.content[0].text}")
        
        # 3. 查询所有产品
        print("\n[3] 查询所有产品:")
        result = await session.call_tool("execute_query", {
            "query": "SELECT * FROM products"
        })
        print(result.content[0].text)
        
        # 4. 列出所有表
        print("\n[4] 列出数据库中的所有表:")
        result = await session.call_tool("list_tables", {})
        print(result.content[0].text)
        
        # 5. 查看表结构
        print("\n[5] 查看 products 表结构:")
        result = await session.call_tool("describe_table", {
            "table_name": "products"
        })
        print(result.content[0].text)


async def demo_weather():
    """演示天气 MCP 服务"""
    print("\n" + "=" * 70)
    print("演示 3: 天气查询服务")
    print("=" * 70)
    
    async with AsyncExitStack() as stack:
        # 连接到服务器
        server_params = StdioServerParameters(
            command="python",
            args=["mcp_server_weather.py"]
        )
        
        stdio_transport = await stack.enter_async_context(
            stdio_client(server_params)
        )
        stdio, write = stdio_transport
        session = await stack.enter_async_context(ClientSession(stdio, write))
        await session.initialize()
        
        # 1. 列出支持的城市
        print("\n[1] 列出支持的城市:")
        result = await session.call_tool("list_cities", {})
        print(result.content[0].text)
        
        # 2. 查询北京天气
        print("\n[2] 查询北京当前天气:")
        result = await session.call_tool("get_weather", {"city": "北京"})
        print(result.content[0].text)
        
        # 3. 查询上海3天预报
        print("\n[3] 查询上海未来3天天气预报:")
        result = await session.call_tool("get_forecast", {
            "city": "上海",
            "days": 3
        })
        print(result.content[0].text)


async def main():
    """主函数"""
    print("\n" + "=" * 70)
    print("MCP (Model Context Protocol) 示例演示")
    print("=" * 70)
    print("\n这个示例展示了如何使用 MCP 连接不同的服务器并调用工具")
    
    try:
        await demo_filesystem()
    except Exception as e:
        print(f"\n文件系统演示错误: {e}")
    
    try:
        await demo_database()
    except Exception as e:
        print(f"\n数据库演示错误: {e}")
    
    try:
        await demo_weather()
    except Exception as e:
        print(f"\n天气演示错误: {e}")
    
    print("\n" + "=" * 70)
    print("所有演示完成！")
    print("=" * 70)


if __name__ == "__main__":
    # 在 Windows 上设置正确的事件循环策略
    import sys
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
    asyncio.run(main())

