var http = require('http')
var fs = require('fs')
var url = require('url')
var md5 = require('md5')
var port = process.argv[2]
let sessions = {}

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

    if (path === '/js/main.js') {
        let string = fs.readFileSync('js/main.js', 'utf8')
        response.setHeader('Content-Type', 'application/javascript;charset=utf9')
        let fileMd5 = md5(string)
        // response.setHeader('Cache-Control', 'max-age=30')
        // response.setHeader('Expires', 'Wed, 28 Nov 2018 05:31:09 GMT')
        if (request.headers['if-none-match'] === fileMd5) {
            console.log('没有响应体')
            response.statusCode = 304
        }
        else {
            response.setHeader('ETag', fileMd5)
            response.write(string)
        }
        response.end()
    }
    else if (path === '/css/default.css') {
        let string = fs.readFileSync('css/default.css', 'utf8')
        response.setHeader('Last-Modified', 'Wed, 28 Nov 2018 05:31:09 GMT')
        // response.setHeader('Content-Type', 'text/css;charset=utf9')
        response.write(string)
        response.end()
    }
    else if (path === '/') {
        let string = fs.readFileSync('./ajax.html', 'utf8')

        // ['email=1@', 'a=1', 'b=2']
        let cookies = ''
        if (request.headers.cookie) {
            cookies = request.headers.cookie.split('; ')
        }
        let hash = {}
        for (let i = 0; i < cookies.length; i++) {
            let parts = cookies[i].split('=')
            let key = parts[0]
            let value = parts[1]
            hash[key] = value
        }
        // let email = sessions[hash.sessionid].sign_in_email
        let email = 'haixiang6123@gmail.com'
        let users = fs.readFileSync('./db/users', 'utf8')
        users = JSON.parse(users)
        let foundUser = null
        for (let i = 0; i < users.length; i++) {
            console.log(users[i].email, email)
            if (users[i].email === email) {
                foundUser = users[i]
                break
            }
        }
        if (foundUser) {
            string = string.replace('__password__', foundUser.password)
        }
        else {
            string = string.replace('__password__', '不知道')
        }

        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.write(string)
        response.end()
    }
    else if (path === '/sign_up' && method === 'GET') {
        var string = fs.readFileSync('./sign_up.html', 'utf8')
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write(string)
        response.end()
    }
    else if (path === '/sign_up' && method === 'POST') {
        readData(request).then((body) => {
            let strings = body.split('&')
            let hash = {}
            strings.forEach((string) => {
                let parts = string.split('=')
                let key = parts[0]
                let value = parts[1]
                hash[key] = decodeURIComponent(value)
            })

            let {
                email,
                password,
                password_confirm
            } = hash

            if (email.indexOf('@') === -1) {
                response.statusCode = 400
                response.setHeader('Content-Type', 'application/json;charset=utf8')
                response.write(`{
                    "error": {
                        "email": "invalid"
                    }
                }`)
            }
            else if (password !== password_confirm) {
                response.statusCode = 400
                response.write(`{
                    "error": {
                        "password": "invalid"
                    }
                }`)
            }
            else {
                let users = fs.readFileSync('./db/users', 'utf8')
                try {
                    users = JSON.parse(users)
                }
                catch (exception) {
                    users = []
                }
                let isUsed = false
                for (let i = 0; i < users.length; i++) {
                    let user = users[i]
                    if (user.email === email) {
                        isUsed = true
                        break
                    }
                }
                if (isUsed) {
                    response.statusCode = 400
                    response.write(`
                        "error": {
                            "email": "is registered"
                        }
                    `)
                }
                users.push({email, password})
                fs.writeFileSync('./db/users', JSON.stringify(users))
                response.statusCode = 200
            }
            response.end()
        })
    }
    else if (path === '/sign_in' && method === 'GET') {
        let string = fs.readFileSync('./sign_in.html', 'utf8')
        response.statusCode = 200
        response.write(string)
        response.end()
    }
    else if (path === '/sign_in' && method === 'POST') {
        readData(request).then((body) => {
            let strings = body.split('&')
            let hash = {}
            strings.forEach((string) => {
                let parts = string.split('=')
                let key = parts[0]
                let value = parts[1]
                hash[key] = decodeURIComponent(value)
            })
            let {email, password} = hash

            let users = fs.readFileSync('./db/users', 'utf8')
            try {
                users = JSON.parse(users)
            }
            catch (exception) {
                users = []
            }

            let isValid = false
            for (let i = 0; i < users.length; i++) {
                if (users[i].email === email && users[i].password === password) {
                    let sessionid = Math.random() * 10000
                    sessions[sessionid] = {
                        sign_in_email: email
                    }
                    isValid = true
                    response.statusCode = 200
                    // Set-Cookie: <cookie-name>=<cookie-value>
                    response.setHeader('Set-Cookie', `sessionid=${sessionid}`)
                    break
                }
            }

            if (!isValid) {
                response.statusCode = 401
            }
            response.end()
        })
    }
    else if (path === '/main.js') {
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

function readData(request) {
    return new Promise((resolve, reject) => {
        let body = [] // 请求体
        request.on('data', (chunk) => {
            body.push(chunk)
        }).on('end', () => {
            body = Buffer.concat(body).toString()
            resolve(body)
        })
    })
}

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)