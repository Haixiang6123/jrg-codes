let n = 0

function init() {
    getSlide(n).addClass('current')
        .siblings().addClass('enter')
}

function makeCurrent($node) {
    return $node.removeClass('enter leave').addClass('current')
}

function makeLeave($node) {
    return $node.removeClass('enter current').addClass('leave')
}

function makeEnter($node) {
    return $node.removeClass('leave current').addClass('enter')
}

function getSlide(n) {
    return $(`.images > div:nth-child(${findIndex(n)})`)
}

function findIndex(n) {
    return n % 3 + 1
}

function autoPlay() {
    // Set clock
    return setInterval(() => {
        // Leave current window
        makeLeave(getSlide(n))
            .one('transitionend', (event) => {
                // Make it to enter state when it finishes the transition
                makeEnter($(event.currentTarget))
            })

        // Next slide will get into the window
        makeCurrent(getSlide(n + 1))

        n += 1
    }, 2000)
}

// Initialize classes
init()

let timer = autoPlay()

document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        window.clearInterval(timer)
    } else {
        timer = autoPlay()
    }
})