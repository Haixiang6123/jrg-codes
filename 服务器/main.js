window.xQuery = function(nodeOrSelector) {
    let nodes = {}
    nodes.addClass = function () { }
    nodes.html = function () { }
    return nodes
}

window.xQuery.ajax = function({url, method, body, headers}) {
    return new Promise(function (resolve, reject) {
        // 声明 XMLHttpRequest
        let request = new XMLHttpRequest()

        // 监听
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 300) {
                   resolve.call(undefined, request.responseText)
                }
                else if (request.status >= 400) {
                    reject.call(undefined, request)
                }
            }
        }

        // 配置 request
        request.open(method, url)

        // 配置 request headers
        for (let key in headers) {
            request.setRequestHeader(key, headers[key])
        }

        // 发送请求
        request.send(body)
    })
}

mybutton.addEventListener('click', () => {
    window.xQuery.ajax({
        url: '/xxx',
        method: 'POST',
        body: 'a=1&b=2',
        headers: {
            'content-type': 'x-www-form-urlencoded',
        },
    }).then(
        (responseText) => {console.log('success', responseText)},
        (request) => {console.log('error', request)}
    )
})