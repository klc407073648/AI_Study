"""
MCP 服务器示例 - 天气 API 服务

这个 MCP 服务器提供天气查询相关的工具（模拟数据）
"""

import asyncio
import random
from datetime import datetime, timedelta

try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import Tool, TextContent
except ImportError:
    print("请先安装依赖: pip install mcp")
    exit(1)


# 创建 MCP 服务器实例
app = Server("weather-server")


# 模拟天气数据
WEATHER_DATA = {
    "北京": {"temp": 15, "condition": "晴朗", "humidity": 45, "wind": "东北风 3级"},
    "上海": {"temp": 20, "condition": "多云", "humidity": 65, "wind": "东南风 2级"},
    "广州": {"temp": 28, "condition": "阴天", "humidity": 80, "wind": "南风 1级"},
    "深圳": {"temp": 27, "condition": "小雨", "humidity": 85, "wind": "东南风 2级"},
    "成都": {"temp": 18, "condition": "多云", "humidity": 70, "wind": "无持续风向"},
}


@app.list_tools()
async def list_tools() -> list[Tool]:
    """列出所有可用的工具"""
    return [
        Tool(
            name="get_weather",
            description="获取指定城市的当前天气",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称"
                    }
                },
                "required": ["city"]
            }
        ),
        Tool(
            name="get_forecast",
            description="获取指定城市的天气预报",
            inputSchema={
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称"
                    },
                    "days": {
                        "type": "integer",
                        "description": "预报天数（1-7天）",
                        "minimum": 1,
                        "maximum": 7
                    }
                },
                "required": ["city", "days"]
            }
        ),
        Tool(
            name="list_cities",
            description="列出所有支持的城市",
            inputSchema={
                "type": "object",
                "properties": {}
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    """处理工具调用"""
    
    if name == "get_weather":
        city = arguments["city"]
        
        if city not in WEATHER_DATA:
            return [TextContent(
                type="text",
                text=f"抱歉，暂不支持查询 {city} 的天气信息"
            )]
        
        weather = WEATHER_DATA[city]
        result = f"""
{city} 当前天气:

温度: {weather['temp']}°C
天气: {weather['condition']}
湿度: {weather['humidity']}%
风向: {weather['wind']}

更新时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        return [TextContent(type="text", text=result.strip())]
    
    elif name == "get_forecast":
        city = arguments["city"]
        days = arguments["days"]
        
        if city not in WEATHER_DATA:
            return [TextContent(
                type="text",
                text=f"抱歉，暂不支持查询 {city} 的天气信息"
            )]
        
        base_weather = WEATHER_DATA[city]
        conditions = ["晴朗", "多云", "阴天", "小雨", "晴转多云"]
        
        result = f"{city} 未来 {days} 天天气预报:\n\n"
        
        for i in range(days):
            date = datetime.now() + timedelta(days=i)
            temp = base_weather['temp'] + random.randint(-3, 3)
            condition = random.choice(conditions)
            
            result += f"{date.strftime('%Y-%m-%d')} ({['今天', '明天', '后天'][i] if i < 3 else ''})\n"
            result += f"  温度: {temp}°C\n"
            result += f"  天气: {condition}\n\n"
        
        return [TextContent(type="text", text=result.strip())]
    
    elif name == "list_cities":
        result = "支持的城市列表:\n\n"
        for i, city in enumerate(WEATHER_DATA.keys(), 1):
            result += f"{i}. {city}\n"
        
        return [TextContent(type="text", text=result)]
    
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

