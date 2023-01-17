// 把attrsString转换为数组返回
export default function parseAttrsString(attrsString) {
    if (attrsString === null || attrsString === undefined) return [];
    // 当前是否在引号内
    let inYinHao = false;
    // 断点
    let point = 0;
    // 结果数组
    let result = [];
    // 遍历attrsString
    for (let i = 0; i < attrsString.length; i++) {
        let char = attrsString[i];
        if (char === "\"") {
            inYinHao = !inYinHao;
        } else if (char === " " && !inYinHao) {
            // 遇见了空格并且不在引号中，并且截取范围不为空值
            if (!/^\s*$/.test(attrsString.substring(point, i))) {
                result.push(attrsString.substring(point, i).trim())
                point = i;
            }
        }
    }
    // 循环结束之后，如果最后引号紧贴标签没有空格比如 <h3 class="hello" id="top" data-src="888">
    // data-src会push不到result里面，需要做额外判断
    result.push(attrsString.substring(point));

    // 根据等号拆分
    // 将["k=v", "k=v", "k=v"]变为[{ name: k, value: v },{ name: k, value: v },{ name: k, value: v }]
    return result.map(item => {
        // 根据等号拆分
        const o = item.match(/^(.+)="(.+)"$/);
        return { name: o[1], value: o[2] };
    })
};
