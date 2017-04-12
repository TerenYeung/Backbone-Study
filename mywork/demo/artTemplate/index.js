

var data = {
	title: '标签',
	list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
};


/*
	template(id,data)
	根据 id 渲染模板。内部会根据document.getElementById(id)查找模板
*/
var html = template('test',data);
console.log(html);
document.getElementById('content').innerHTML = html;