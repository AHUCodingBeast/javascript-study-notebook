class Color:
    def __init__(self, r, g, b):
        self.__values = [r, g, b]

red = Color(255, 0, 0)

# 看似不能访问：
# print(red.__values)  # AttributeError

# 实际上改个名就能拿到：
print(red._Color__values)  # [255, 0, 0]