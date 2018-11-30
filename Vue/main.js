let view = new Vue({
    el: '#app',
    data() {
        return {
            selected: 'a',
            tabs: [
                {
                    name: 'a', content: 'aaa'
                },
                {
                    name: 'b', content: 'bbb'
                },
                {
                    name: 'c', content: 'ccc'
                }
            ]
        }
    },
    template: ` <div>
<div class="window">
{{selected}}
    <ol>
        <li v-for="tab in tabs" @click="selected = tab.name">{{tab.name}}</li>
    </ol>
    <ol id="show">
        <li v-for="tab in tabs" v-show="tab.name === selected">{{tab.content}}</li> 
    </ol>
</div>`,
    methods: {
    }
})