"""
MCP 服务器示例 - SQLite 数据库操作

这个 MCP 服务器提供数据库相关的工具
"""

import sqlite3
import asyncio
import json

try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import Tool, TextContent
except ImportError:
    print("请先安装依赖: pip install mcp")
    exit(1)


# 创建 MCP 服务器实例
app = Server("database-server")

# 数据库连接
DB_PATH = "example.db"


@app.list_tools()
async def list_tools() -> list[Tool]:
    """列出所有可用的工具"""
    return [
        Tool(
            name="execute_query",
            description="执行 SQL 查询（SELECT、INSERT、UPDATE、DELETE 等）",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "要执行的 SQL 查询"
                    },
                    "params": {
                        "type": "array",
                        "description": "查询参数（可选）",
                        "items": {"type": "string"}
                    }
                },
                "required": ["query"]
            }
        ),
        Tool(
            name="list_tables",
            description="列出数据库中的所有表",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        ),
        Tool(
            name="describe_table",
            description="显示表结构",
            inputSchema={
                "type": "object",
                "properties": {
                    "table_name": {
                        "type": "string",
                        "description": "表名"
                    }
                },
                "required": ["table_name"]
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """处理工具调用"""
    
    if name == "execute_query":
        query = arguments["query"]
        params = arguments.get("params", [])
        
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            # 如果是 SELECT 查询，获取结果
            if query.strip().upper().startswith("SELECT"):
                rows = cursor.fetchall()
                columns = [desc[0] for desc in cursor.description]
                
                result = f"查询结果 ({len(rows)} 行):\n\n"
                result += " | ".join(columns) + "\n"
                result += "-" * 50 + "\n"
                for row in rows:
                    result += " | ".join(str(val) for val in row) + "\n"
            else:
                conn.commit()
                result = f"查询执行成功，影响了 {cursor.rowcount} 行"
            
            conn.close()
            return [TextContent(type="text", text=result)]
            
        except Exception as e:
            return [TextContent(type="text", text=f"错误: {str(e)}")]
    
    elif name == "list_tables":
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            conn.close()
            
            result = "数据库中的表:\n\n"
            for table in tables:
                result += f"  [TABLE] {table[0]}\n"
            
            return [TextContent(type="text", text=result)]
        except Exception as e:
            return [TextContent(type="text", text=f"错误: {str(e)}")]
    
    elif name == "describe_table":
        table_name = arguments["table_name"]
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            conn.close()
            
            result = f"表 {table_name} 的结构:\n\n"
            result += "列名 | 类型 | 非空 | 默认值 | 主键\n"
            result += "-" * 50 + "\n"
            for col in columns:
                result += f"{col[1]} | {col[2]} | {col[3]} | {col[4]} | {col[5]}\n"
            
            return [TextContent(type="text", text=result)]
        except Exception as e:
            return [TextContent(type="text", text=f"错误: {str(e)}")]
    
    return [TextContent(type="text", text=f"未知工具: {name}")]


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

