"""
MCP 客户端示例 - 连接和使用 MCP 服务器

这个示例展示如何使用 MCP (Model Context Protocol) 连接到服务器并调用工具
"""

import asyncio
import json
from typing import Optional
from contextlib import AsyncExitStack

# 需要安装: pip install mcp anthropic
try:
    from mcp import ClientSession, StdioServerParameters
    from mcp.client.stdio import stdio_client
    from anthropic import Anthropic
except ImportError:
    print("请先安装依赖: pip install mcp anthropic")
    exit(1)


class MCPClientExample:
    """MCP 客户端示例类"""
    
    def __init__(self):
        self.sessions = []
        self.exit_stack = AsyncExitStack()
        
    async def connect_to_server(self, server_script_path: str):
        """
        连接到 MCP 服务器
        
        Args:
            server_script_path: MCP 服务器脚本路径
        """
        server_params = StdioServerParameters(
            command="python",
            args=[server_script_path],
            env=None
        )
        
        stdio_transport = await self.exit_stack.enter_async_context(
            stdio_client(server_params)
        )
        stdio, write = stdio_transport
        session = await self.exit_stack.enter_async_context(
            ClientSession(stdio, write)
        )
        
        await session.initialize()
        self.sessions.append(session)
        return session
    
    async def list_tools(self, session: ClientSession):
        """列出服务器提供的所有工具"""
        response = await session.list_tools()
        print("\n可用工具列表:")
        print("=" * 60)
        for tool in response.tools:
            print(f"\n工具名称: {tool.name}")
            print(f"描述: {tool.description}")
            if hasattr(tool, 'inputSchema'):
                print(f"输入参数: {json.dumps(tool.inputSchema, indent=2, ensure_ascii=False)}")
        print("=" * 60)
        return response.tools
    
    async def call_tool(self, session: ClientSession, tool_name: str, arguments: dict):
        """
        调用 MCP 工具
        
        Args:
            session: MCP 会话
            tool_name: 工具名称
            arguments: 工具参数
        """
        print(f"\n调用工具: {tool_name}")
        print(f"参数: {json.dumps(arguments, indent=2, ensure_ascii=False)}")
        
        result = await session.call_tool(tool_name, arguments)
        print(f"结果: {result}")
        return result
    
    async def list_resources(self, session: ClientSession):
        """列出服务器提供的所有资源"""
        response = await session.list_resources()
        print("\n可用资源列表:")
        print("=" * 60)
        for resource in response.resources:
            print(f"\nURI: {resource.uri}")
            print(f"名称: {resource.name}")
            print(f"描述: {resource.description}")
        print("=" * 60)
        return response.resources
    
    async def read_resource(self, session: ClientSession, uri: str):
        """读取资源内容"""
        print(f"\n读取资源: {uri}")
        result = await session.read_resource(uri)
        print(f"内容: {result}")
        return result
    
    async def cleanup(self):
        """清理资源"""
        await self.exit_stack.aclose()


async def example_filesystem_mcp():
    """示例1: 使用文件系统 MCP 服务"""
    print("\n" + "=" * 70)
    print("示例 1: 文件系统 MCP 服务")
    print("=" * 70)
    
    client = MCPClientExample()
    
    try:
        # 连接到文件系统 MCP 服务器
        session = await client.connect_to_server("mcp_server_filesystem.py")
        
        # 列出所有可用工具
        tools = await client.list_tools(session)
        
        # 调用工具 - 读取文件
        await client.call_tool(session, "read_file", {
            "path": "example.txt"
        })
        
        # 调用工具 - 列出目录
        await client.call_tool(session, "list_directory", {
            "path": "."
        })
        
        # 调用工具 - 写入文件
        await client.call_tool(session, "write_file", {
            "path": "test_output.txt",
            "content": "这是通过 MCP 写入的内容！"
        })
        
    finally:
        await client.cleanup()


async def example_database_mcp():
    """示例2: 使用数据库 MCP 服务"""
    print("\n" + "=" * 70)
    print("示例 2: 数据库 MCP 服务")
    print("=" * 70)
    
    client = MCPClientExample()
    
    try:
        # 连接到数据库 MCP 服务器
        session = await client.connect_to_server("mcp_server_database.py")
        
        # 列出所有可用工具
        tools = await client.list_tools(session)
        
        # 创建表
        await client.call_tool(session, "execute_query", {
            "query": """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL
                )
            """
        })
        
        # 插入数据
        await client.call_tool(session, "execute_query", {
            "query": "INSERT INTO users (name, email) VALUES (?, ?)",
            "params": ["张三", "zhangsan@example.com"]
        })
        
        # 查询数据
        await client.call_tool(session, "execute_query", {
            "query": "SELECT * FROM users"
        })
        
    finally:
        await client.cleanup()


async def example_weather_mcp():
    """示例3: 使用天气 API MCP 服务"""
    print("\n" + "=" * 70)
    print("示例 3: 天气 API MCP 服务")
    print("=" * 70)
    
    client = MCPClientExample()
    
    try:
        # 连接到天气 MCP 服务器
        session = await client.connect_to_server("mcp_server_weather.py")
        
        # 列出所有可用工具
        tools = await client.list_tools(session)
        
        # 获取天气信息
        await client.call_tool(session, "get_weather", {
            "city": "北京"
        })
        
        # 获取天气预报
        await client.call_tool(session, "get_forecast", {
            "city": "上海",
            "days": 3
        })
        
    finally:
        await client.cleanup()


async def main():
    """主函数 - 运行所有示例"""
    print("\n" + "=" * 70)
    print("MCP (Model Context Protocol) 客户端示例")
    print("=" * 70)
    
    # 运行各个示例（注释掉的示例需要对应的服务器文件）
    try:
        await example_filesystem_mcp()
    except Exception as e:
        print(f"文件系统示例错误: {e}")
    
    try:
        await example_database_mcp()
    except Exception as e:
        print(f"数据库示例错误: {e}")
    
    try:
        await example_weather_mcp()
    except Exception as e:
        print(f"天气 API 示例错误: {e}")


if __name__ == "__main__":
    asyncio.run(main())

