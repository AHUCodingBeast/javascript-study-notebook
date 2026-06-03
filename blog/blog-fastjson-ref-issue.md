# 虚惊一场，真的不要 FastJson 和 FastJson2 一起混用啦

今天收到生产环境告警短信，拿着 traceId 到日志平台看看controller 接口日志返回，突然在日志中看到接口返回的数据里出现 `$ref` ，我去吓得我一激灵 这数据返回给客户端那不是完了

```json
{
  "stationList": [
    {
      "stationId": "S001",
      "agpUserCouponsInfoDtoList": [
        { "$ref": "$.data.stationList[0].agpUserCouponsInfoDtoList[0]" },
        { "$ref": "$.data.stationList[0].agpUserCouponsInfoDtoList[1]" }
      ]
    },
    {
      "stationId": "S002",
      "agpUserCouponsInfoDtoList": [
        { "$ref": "$.data.stationList[0].agpUserCouponsInfoDtoList[0]" },
        { "$ref": "$.data.stationList[0].agpUserCouponsInfoDtoList[1]" }
      ]
    }
  ]
}
```

但是很快啊 我又冷静下来了，这东西都上线这么长时间了要有数据问题不是早就裂开了吗，不会等到今天，于是我在测试环境直接抓包客户端的接口响应数据，确实客户端实际收到的数据是正常的

那问题就来了为啥日志返回的 JSON 长这个鬼样子，客户端拿到的却又是正确的呢？这问题必须得搞清楚。


## 原因分析

### 出问题的代码

首先我找到了打印日志的代码，打印日志的代码在一个切面中，在这块打印日志的 finally 代码块中，打印请求参数和返回结果时使用了 FastJSON v1 的 `JSON.toJSONString()`：

```java
@Around("pointcut()")
public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
    Object response = null;
    try {
        response = joinPoint.proceed();
    } finally {
        log.info("返回={}", JSON.toJSONString(response));
    }
    return response;
}
```

在业务代码中 agpUserCouponsInfoDtoList 这个列表赋值逻辑则大致如下，同一个优惠券列表对象被多个站点引用：

```java
// 一次查询获取用户优惠券
List<CouponDTO> userCoupons = getUserCouponsInfo();

// 遍历多个站点，每个站点都引用同一个优惠券对象
for (Station station : stationList) {
    station.setCoupons(userCoupons.stream()
        .filter(c -> c.suitable(station.getId()))
        .collect(Collectors.toList()));
}
```

问题原因已经呼之欲出了，**FastJSON v1 默认开启循环引用检测**。当同一个对象实例被多处引用时，为了避免序列化死循环和减少输出体积，FastJSON 会将后续引用替换为 `$ref` 占位符。在我们的场景中，多个站点的 `agpUserCouponsInfoDtoList` 中持有**相同的优惠券对象引用**（因为是从同一个 list filter 出来的），所以从第二个站点开始，FastJSON 就输出了 `$ref`。

### 为什么客户端数据正常？

这代码看起来铁定有问题，但是为啥客户端毫无波澜呢？我大胆猜测下估计是接口返回到客户端经过了个什么处理。

果然，我发现项目还有这样的一段代码

```java

import com.alibaba.fastjson2.support.config.FastJsonConfig;
import com.alibaba.fastjson2.support.spring.http.converter.FastJsonHttpMessageConverter;

@Configuration
public class WebJsonConfig implements WebMvcConfigurer {

    @Bean
    public FastJsonConfig fastJsonConfig() {
        FastJsonConfig config = new FastJsonConfig();
        //允许返回null的属性
        config.setWriterFeatures(JSONWriter.Feature.WriteNulls);
        return config;
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        //1.转换器
        FastJsonHttpMessageConverter converter = new FastJsonHttpMessageConverter();
        converter.setDefaultCharset(StandardCharsets.UTF_8);
        converter.setFastJsonConfig(fastJsonConfig());
        converter.setSupportedMediaTypes(Collections.singletonList(MediaType.APPLICATION_JSON));
        converters.add(0, converter);
    }

}
```
WebMvcConfigurer 这个类 熟悉 SpringMVC 的都知道就是定制 Controller 接口的一些默认行为的 这里搞了个 `configureMessageConverters`，作用主要有以下两个

> 1. 出方向 举例： Controller return new User("Zhangsan");，转换器把它变成 {"name": "Zhangsan"} 写回给前端。
> 2. 入方向（请求体 -> Controller 参数）前端发来 JSON -> 转换器自动把它反序列化成 Java 对象，塞给 @RequestBody 参数。

但是注意啊这里的 import 语句里面导入的包是 fastjson2 ，于是根本原因找到了 因为项目中存在 FastJSON v1 和 v2 两套库：

- 日志打印使用的是 `com.alibaba.fastjson.JSON`（**v1**），默认开启循环引用检测
- HTTP 响应序列化通过全局转换器使用的是 `com.alibaba.fastjson2`（**v2**），默认行为不同，不再输出 `$ref`

同一个项目中混用两个版本，导致了行为差异，也恰好因为这种差异反而导致接口没有出问题，也是醉了。不过为了避免再次给别人造成惊吓 我还是默默的把切面里面的的 import 语句改为了

```java
import com.alibaba.fastjson2.JSON;
```

这里也顺带说一嘴，如果项目里没有 fastjson2，全用 fastjson v1 的话，解决 `$ref` 问题也很简单，拷贝一份就行，代码可以改成下面这样

```java
// 一次查询获取用户优惠券
List<CouponDTO> userCoupons = getUserCouponsInfo();

// 遍历多个站点，每个站点都拿到一份独立的优惠券副本
for (Station station : stationList) {
    station.setCoupons(userCoupons.stream()
        .filter(c -> c.suitable(station.getId()))
        // 通过 map 把每个 CouponDTO 拷贝成新实例，避免共享对象引用
        .map(c -> {
            CouponDTO copy = new CouponDTO();
            BeanUtils.copyProperties(c, copy);
            return copy;
        })
        .collect(Collectors.toList()));
}
```

## 经验总结

1. **一个项目尽量统一 JSON 序列化库的版本**，避免 v1/v2 混用导致行为不一致
2. **日志打印**也是代码的一部分，序列化行为可能影响问题排查效率
3. FastJSON v1 的循环引用检测在大多数场景下是好事，但在对象被多处共享时会干扰日志阅读
