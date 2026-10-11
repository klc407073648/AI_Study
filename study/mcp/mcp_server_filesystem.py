"""
MCP 服务器示例 - 文件系统操作

这个 MCP 服务器提供文件系统相关的工具
"""

import os
import asyncio
from pathlib import Path

try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import Tool, TextContent
except ImportError:
    print("请先安装依赖: pip install mcp")
    exit(1)


# 创建 MCP 服务器实例
app = Server("filesystem-server")


@app.list_tools()
async def list_tools() -> list[Tool]:
    """列出所有可用的工具"""
    return [
        Tool(
            name="read_file",
            description="读取文件内容",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "要读取的文件路径"
                    }
                },
                "required": ["path"]
            }
        ),
        Tool(
            name="write_file",
            description="写入内容到文件",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "要写入的文件路径"
                    },
                    "content": {
                        "type": "string",
                        "description": "要写入的内容"
                    }
                },
                "required": ["path", "content"]
            }
        ),
        Tool(
            name="list_directory",
            description="列出目录中的文件和文件夹",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "目录路径"
                    }
                },
                "required": ["path"]
            }
        ),
        Tool(
            name="delete_file",
            description="删除文件",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "要删除的文件路径"
                    }
                },
                "required": ["path"]
            }
        ),
        Tool(
            name="file_info",
            description="获取文件信息（大小、修改时间等）",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "文件路径"
                    }
                },
                "required": ["path"]
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """处理工具调用"""
    
    if name == "read_file":
        path = arguments["path"]
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            return [TextContent(
                type="text",
                text=f"文件内容:\n{content}"
            )]
        except FileNotFoundError:
            return [TextContent(
                type="text",
                text=f"错误: 文件 {path} 不存在"
            )]
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"错误: {str(e)}"
            )]
    
    elif name == "write_file":
        path = arguments["path"]
        content = arguments["content"]
        try:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            return [TextContent(
                type="text",
                text=f"成功写入文件: {path}"
            )]
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"错误: {str(e)}"
            )]
    
    elif name == "list_directory":
        path = arguments["path"]
        try:
            items = os.listdir(path)
            files = []
            dirs = []
            for item in items:
                full_path = os.path.join(path, item)
                if os.path.isfile(full_path):
                    files.append(item)
                else:
                    dirs.append(item)
            
            result = f"目录 {path} 的内容:\n\n"
            result += f"文件夹 ({len(dirs)}):\n"
            for d in dirs:
                result += f"  [DIR] {d}\n"
            result += f"\n文件 ({len(files)}):\n"
            for f in files:
                result += f"  [FILE] {f}\n"
            
            return [TextContent(type="text", text=result)]
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"错误: {str(e)}"
            )]
    
    elif name == "delete_file":
        path = arguments["path"]
        try:
            os.remove(path)
            return [TextContent(
                type="text",
                text=f"成功删除文件: {path}"
            )]
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"错误: {str(e)}"
            )]
    
    elif name == "file_info":
        path = arguments["path"]
        try:
            stat = os.stat(path)
            info = f"文件信息: {path}\n"
            info += f"大小: {stat.st_size} 字节\n"
            info += f"创建时间: {stat.st_ctime}\n"
            info += f"修改时间: {stat.st_mtime}\n"
            info += f"访问时间: {stat.st_atime}\n"
            return [TextContent(type="text", text=info)]
        except Exception as e:
            return [TextContent(
                type="text",
                text=f"错误: {str(e)}"
            )]
    
    return [TextContent(
        type="text",
        text=f"未知工具: {name}"
    )]


async def main():
    """启动 MCP 服务器"""
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())

