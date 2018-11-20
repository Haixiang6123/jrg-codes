mybutton.addEventListener('click', () => {
    // 声明 XMLHttpRequest
    let request = new XMLHttpRequest()

    // 监听
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status >= 200 && request.status < 300) {
                let string = request.responseText
                let object = JSON.parse(string)
                console.log(object)
            }
            else if (request.status >= 400) {
                console.log('请求失败')
            }
        }
    }

    // 配置 request
    request.open('GET', 'http://localhost:8002/xxx')

    // 发送请求
    request.send()
})