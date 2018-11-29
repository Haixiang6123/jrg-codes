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
View.prototype.render = function(data) {
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

let bookView = new View({
    el: '#app',
    template: `
    <div>
      书名：<__name__>
      数量：<span id="number">__number__</span>
    </div>
      
    <div>
      <button id="addOne">Add</button>
      <button id="minusOne">Minus</button>
      <button id="reset">Reset</button>
    </div>`
})

let controller = {
    init(options) {
        let {view, model} = options
        this.view = view
        this.model = model

        this.bindEvents()

        this.model.fetch(1)
            .then(({data}) => {
                this.view.render(this.model.data)
            })
    },
    addOne() {
        let oldNumber = $('#number').text()
        let newNumber = oldNumber -0 + 1
        this.model.update(1, {number: newNumber}).then(() => {
            this.view.render(this.model.data)
        })
    },
    minusOne() {
        let oldNumber = $('#number').text()
        let newNumber = oldNumber -0 - 1
        this.model.update(1, {number: newNumber}).then(() => {
            this.view.render(this.model.data)
        })
    },
    reset() {
        this.model.update(1, {number: 0}).then(() => {
            this.view.render(this.model.data)
        })
    },
    bindEvents() {
        $(this.view.el).on('click', '#addOne', this.addOne.bind(this))
        $(this.view.el).on('click', '#minusOne', this.minusOne.bind(this))
        $(this.view.el).on('click', '#reset', this.reset.bind(this))
    }
}

controller.init({
    view: bookView,
    model: bookModel
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