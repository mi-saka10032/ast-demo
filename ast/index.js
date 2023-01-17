import parse from "./parse.js";

const templateString = `<div id="app">
    <h3 class="hello" id="top" data-src="888">哈哈哈哈你好</h3>
    <ul>
        <li>A</li>
        <li>B</li>
        <li>C</li>
    </ul>
    <div>
        <div>哈哈</div>
    </div>
</div>
`

const ast = parse(templateString)
console.log(ast);
