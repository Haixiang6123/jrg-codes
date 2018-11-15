let $buttons = $('.btn-group button')
let $slides = $('#slides')

let $images = $slides.children('div')
let curSlide = 0

$slides.css({
    transform: 'translateX(-500px)'
})

function makeFakeSlides() {
    let $firstCopy = $images.eq(0).clone(true)
    let $lastCopy = $images.eq($images.length - 1).clone(true)

    $slides.append($firstCopy)
    $slides.prepend($lastCopy)
}

function bindEventListeners() {
    $('.btn-group').on('click', 'button', function (event) {
        let $button = $(event.currentTarget)
        let index = $button.index()

        gotoSlide(index)
    })
}

function gotoSlide(index) {
    if (index >= $buttons.length) {
        index = 0
    }
    else if (index < 0) {
        index = $buttons.length - 1
    }

    if (curSlide === $buttons.length - 1 && index === 0) {
        $slides.css({
                transform: `translateX(${-($buttons.length + 1) * 500}px)`
            })
            .one('transitionend', function () {
                $slides.hide().offset()
                $slides.css({
                    transform: `translateX(${-(index + 1) * 500}px)`
                }).show()
            })
    } else if (curSlide === 0 && index === $buttons.length - 1) {
        $slides.css({
                transform: `translateX(${0}px)`
            })
            .one('transitionend', function () {
                $slides.hide().offset()
                $slides.css({
                    transform: `translateX(${-(index + 1) * 500}px)`
                }).show()
            })
    } else {
        $slides.css({
            transform: `translateX(${-(index + 1) * 500}px)`
        })
    }

    curSlide = index
}

let timer = 0

function autoPlay() {
    return timer = setInterval(() => {
        gotoSlide(curSlide + 1)
    }, 1000)
}

$(next).on('click', function() {
    gotoSlide(curSlide + 1)
})

$(prev).on('click', function() {
    gotoSlide(curSlide - 1)
})

makeFakeSlides()

bindEventListeners()

timer = autoPlay()


$('.container').on('mouseenter', function() {
    window.clearInterval(timer)
})

$('.container').on('mouseleave', function() {
    timer = autoPlay()
})