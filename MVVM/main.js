let book = {
    name: 'JS 高程',
    number: 12,
    id: 1
}

fakeData()

function Model(options) {
    this.data = options.data
    this.resource = options.resource
}

Model.prototype.fetch = function (id) {
    return axios.get(`/${this.resource}/${id}`).then((response) => {
        this.data = response.data
        return response
    })
}
Model.prototype.update = function (id, data) {
    return axios.put(`/${this.resource}/${id}`, data).then((response) => {
        this.data = response.data
        return response
    })
}

function View({el, template}) {
    this.el = el
    this.template = template
}

View.prototype.render = function (data) {
    let html = this.template
    for (let key in data) {
        html = html.replace(`__${key}__`, data[key])
    }
    $(this.el).html(html)
}

let bookModel = new Model({
    data: {
        name: '',
        number: 0,
        id: ''
    },
    resource: 'book'
})

let bookView = new Vue({
    el: '#app',
    data() {
        return {
            book: {
                name: '未命名',
                number: 0,
                id: ''
            },
            n: 1
        }
    },
    created() {
        bookModel.fetch(1).then(({data}) => {
            this.book = bookModel.data
        })
    },
    template: `
    <div>
        <div>
          书名：<{{book.name}}>
          数量：<span id="number">{{book.number}}</span>
        </div>
        
        <div>
            <input v-model="n" type="text">
        </div>
         
        <div>
          <button @click="addOne">Add {{n}}</button>
          <button @click="minusOne">Minus {{n}}</button>
          <button @click="reset">Reset</button>
        </div>
    </div>`,
    methods: {
        addOne() {
            bookModel.update(1, {number: this.book.number + (this.n-0)}).then(() => {
                this.book = bookModel.data
            })
        },
        minusOne() {
            bookModel.update(1, {number: this.book.number - (this.n-0)}).then(() => {
                this.book = bookModel.data
            })
        },
        reset() {
            bookModel.update(1, {number: 0}).then(() => {
                this.book = bookModel.data
            })
        },
    }
})

function fakeData() {
    axios.interceptors.response.use((response) => {
        let {config: {method, url, data}} = response
        // 下面的 data 是响应的数据
        if (url === '/book/1' && method === 'get') {
            response.data = book
        }
        else if (url === '/book/1' && method === 'put') {
            book = Object.assign(book, JSON.parse(data))
            response.data = book
        }

        return response
    })
}