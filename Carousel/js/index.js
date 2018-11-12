let $buttons = $('#button-group button')
let size = $buttons.length
let timeId = -1

function activeButton($button) {
    $button.addClass('red').siblings('.red').removeClass('red')
}

function playSlide(index) {
    $buttons.eq(index).trigger('click')
}

function autoPlaySlide() {
    playSlide(size % 3)
    return setInterval(() => {
        size += 1
        playSlide(size % 3)
    }, 2000)
}

for (let i = 0; i < $buttons.length; i++) {
    $($buttons[i]).on('click', function (event) {
        let index = $(event.currentTarget).index()
        let offset = index * -300

        $(images).css({
            transform: `translateX(${offset}px)`
        })
        size = index
        activeButton($buttons.eq(size))
    })
}

timeId = autoPlaySlide()

$('#window').on('mouseenter', function () {
    window.clearInterval(timeId)
})

$('#window').on('mouseleave', function () {
    timeId = autoPlaySlide()
})