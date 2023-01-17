// parse函数 主函数
import parseAttrsString from "./parseAttrsString.js";

export default function parse(templateString) {
    // 指针
    let index = 0;
    // 剩余部分
    let rest = "";
    // 开始标记 <div>
    const startReg = /^<([a-z]+[1-6]?)(\s[^<]+)?>/;
    // 结束标记 </div>
    const endReg = /^<\/([a-z]+[1-6]?)>/;
    // 结束标记前的文字
    const wordReg = /^([^<]+)<\/[a-z]+[1-6]?>/;
    // 标签堆栈
    const tagStack = [];
    // 内容堆栈
    const contentStack = [];
    // 输出结果
    let output = [];

    while (index < templateString.length - 1) {
        rest = templateString.substring(index);
        // 识别开始标签
        if (startReg.test(rest)) {
            const tag = rest.match(startReg)[1];
            // attrs内容
            const attrs = rest.match(startReg)[2];
            // console.log("检测到开始标记", tag);
            // 开始标记入栈1
            tagStack.push(tag);
            // 空数组入栈2
            contentStack.push({ tag, attrs: parseAttrsString(attrs), children: [] });
            // <>占两位，额外+2 再加attrs长度
            index += tag.length + (attrs ? attrs.length : 0) + 2 ;
        } else if (endReg.test(rest)) {
            const tag = rest.match(endReg)[1];
            // console.log("检测到结束标记", tag);
            const pop_tag = tagStack.pop();
            // tag和tagStack顶部相同，标签必定是封闭闭合的
            if (tag === pop_tag) {
                const pop_arr = contentStack.pop();
                const len = contentStack.length;
                if (len > 0) {
                    // 长度不为0，出栈项往上一项的children里推
                    contentStack[contentStack.length - 1].children.push(pop_arr);
                } else if (len === 0) {
                    // 长度为0，最后推出的项就是堆叠完整的AST结构
                    output = pop_arr;
                }
            } else {
                throw new Error(tagStack[tagStack.length - 1] + "标签没有封闭!");
            }
            // </>占三位，额外+3
            index += tag.length + 3;
        } else if (wordReg.test(rest)) {
            const word = rest.match(wordReg)[1];
            // 检测截取片段内容不为空
            if (!/^\s+$/.test(word)) {
                // console.log("检测到文字", word);
                contentStack[tagStack.length - 1].type = 3;
                contentStack[tagStack.length - 1].text = word;
            }
            index += word.length;
        } else {
            index++;
        }
    }
    return output;
};
