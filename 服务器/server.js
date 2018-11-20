var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var path = request.url
    var query = ''
    if (path.indexOf('?') >= 0) {
        query = path.substring(path.indexOf('?'))
    }
    var pathNoQuery = parsedUrl.pathname
    var queryObject = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/









    console.log(path)

    if (path === '/') {
        var string = fs.readFileSync('./ajax.html', 'utf8')
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.write(string)
        response.end()
    } else if (path === '/main.js') {
        var string = fs.readFileSync('./main.js', 'utf8')
        response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
        response.write(string)
        response.end()

    }
    else if (path === '/xxx') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/xml')
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8001')
        response.write(`
        {
            "note": {
                "to": "小谷",
                "from": "方方",
                "heading": "打招呼",
                "content": "hi"
            }
        }
        `)
        response.end()
    }
    else if (path.indexOf('/pay') != -1) {
        // var amount = fs.readFileSync('./db.txt', 'utf8')
        // var newAmount = amount - 1
        // fs.writeFileSync('./db.txt', newAmount)
        if (Math.random() < 0.5) {
            response.statusCode = 200
            response.setHeader('Content-Type', 'application/javascript')
            response.write(`
                ${queryObject.callback}.call(undefined, {
                    "success": true,
                  })
            `)
            response.end()
        } else {
            response.statusCode = 404
            response.write('fail')
            response.end()
        }
    } else {
        response.statusCode = 404
        response.end()
    }


    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)