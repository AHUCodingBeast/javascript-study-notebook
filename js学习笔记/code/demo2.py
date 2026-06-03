import requests

# ========== 配置 ==========
API_KEY = "YOUR_AMAP_KEY"  # TODO: 替换为你的高德 Web服务 Key

# 高德驾车路径规划 2.0 API 地址
API_URL = "https://restapi.amap.com/v5/direction/driving"

# 起终点坐标（经度,纬度）
ORIGIN = "116.434307,39.90909"       # 起点：北京某位置
DESTINATION = "116.434446,39.90816"  # 终点：北京某位置

# ========== show_fields 全部可选字段 ==========
# 不传 show_fields 时只返回基础信息
# 传入以下逗号分隔的字段可获取全部可选字段
SHOW_FIELDS = "cost,tmcs,navi,cities,polyline"
# 各字段说明：
#   cost       -> duration(耗时/秒), tolls(收费/元), toll_distance(收费路段里程/米),
#                 toll_road(主要收费道路), traffic_lights(红绿灯个数)
#   tmcs       -> tmc_status(路况: 未知/畅通/缓行/拥堵/严重拥堵),
#                 tmc_distance(相同路况距离), tmc_polyline(路况坐标点串)
#   navi       -> action(导航主要动作), assistant_action(导航辅助动作)
#   cities     -> adcode(区域编码), citycode(城市编码), city(城市名称),
#                 district(区县信息: name, adcode)
#   polyline   -> 分路段坐标点串（两点间用;分隔）

# ========== 请求参数 ==========
params = {
    "key": API_KEY,
    "origin": ORIGIN,
    "destination": DESTINATION,
    "strategy": 32,              # 32=高德推荐默认策略
    "show_fields": SHOW_FIELDS,  # 请求返回全部可选字段
    "output": "json",
}

# ========== 发起请求 ==========
resp = requests.get(API_URL, params=params)
resp.raise_for_status()
data = resp.json()

# ========== 打印结果 ==========
print(f"状态: {data.get('status')}")
print(f"信息: {data.get('info')}")
print(f"方案数: {data.get('count')}")
print()

routes = data.get("route", {}).get("paths", [])
for i, path in enumerate(routes, 1):
    print(f"=== 方案 {i} ===")
    print(f"  距离: {path.get('distance')} 米")
    print(f"  耗时: {path.get('duration')} 秒")

    # cost 字段（需 show_fields 包含 cost）
    cost = path.get("cost")
    if cost:
        print(f"  [cost] 耗时: {cost.get('duration')}s, 收费: {cost.get('tolls')}元, "
              f"收费路段: {cost.get('toll_distance')}m, "
              f"主要收费道路: {cost.get('toll_road')}, "
              f"红绿灯: {cost.get('traffic_lights')}个")

    # polyline 字段（需 show_fields 包含 polyline）
    polyline = path.get("polyline")
    if polyline:
        print(f"  [polyline] 坐标点串长度: {len(polyline)} 字符")

    # 打印分段详情
    steps = path.get("steps", [])
    print(f"  共 {len(steps)} 个分段:")
    for j, step in enumerate(steps, 1):
        print(f"    分段{j}: {step.get('instruction', '')} | "
              f"距离: {step.get('step_distance', '?')}m | "
              f"道路: {step.get('road_name', '?')}")

        # tmcs 字段（需 show_fields 包含 tmcs）
        tmcs = step.get("tmcs", [])
        if tmcs:
            print(f"      [tmcs] 共 {len(tmcs)} 段路况")

        # navi 字段（需 show_fields 包含 navi）
        navi = step.get("navi")
        if navi:
            print(f"      [navi] 动作: {navi.get('action')} | "
                  f"辅助: {navi.get('assistant_action')}")

        # cities 字段（需 show_fields 包含 cities）
        cities = step.get("cities", [])
        if cities:
            for c in cities:
                print(f"      [cities] 途经: {c.get('city')} "
                      f"({c.get('adcode')})")
