class ScoreWindow {

    constructor(root) {
        this.id = Math.random().toString(36).substr(2, 9)
        this.root = document.getElementById(root) || document.getElementById('desktop')
        this.time = '05m00s00ms'
        this.score = 0
        this.timer = undefined // setInterval handel
        this.runTimer = true
        this.content = `
        <div>
            <span class="time" id='t${this.id}'>
                00:00:00
            </span>
        </div>
        <div>
            <span class="score" id='s${this.id}'>
                0
            </span>
        </div>
        `
    }
    addScore(sc){
        
        this.scoreEl = document.getElementById(this.id).querySelector('.score')
        console.log(this.scoreEl)
        this.score += sc
        this.scoreEl.innerText = this.score
    }
    getScore(){
        return this.score
    }
    startTimer() {
        // starts timer
        this.runTimer = true
    }
    stopTimer() {
        this.runTimer = false
    }
    destroyTimer() {
        // only clarificaiton of interval is significant here
        // this must happen when game is lost or won
        clearInterval(this.timer)
    }
    createTimer() {
        // creates timer and mechanism
        var ms = 1 * 60 * 100
        var s = Math.floor(ms/100)
        var min = Math.floor(s/60)
        var that = this;
        var timeItem = document.getElementById('t' + this.id)
        function blink() {
            timeItem.classList.add('time-red')
            that.timer = setInterval(function () {
                timeItem.classList.toggle('hidden-opacity')
            }, 1000)
        }
        this.timer = setInterval(function () {
            let dMs = ''
            let dS = ''
            let dM = ''
            if (that.runTimer == true) {
                if ((ms % 100) == 0) {
                    s--
                }
                if ((ms % 6000) == 0) {
                    min--
                }
                ms = ms - 1

                if ((ms % 100) < 10) {
                    dMs = '0' + (ms % 100)
                } else {
                    dMs = (ms % 100)
                }
                if ((s % 60) < 10) {
                    dS = '0' + (s % 60)
                } else {
                    dS = (s % 60)
                }
                if (min < 10) {

                    dM = '0' + min
                } else {
                    dM = min
                }
                that.time = `${dM}:${dS}:${dMs}`
                that.timerEl.innerHTML = that.time
            }
            if (ms == 0) {
                console.log('ms < 0')
                that.root.dispatchEvent(new CustomEvent('gameLost'))
            }
        }, 1)
        this.root.addEventListener('GameWon', function(e){
            clearInterval(that.timer)
        })
        this.root.addEventListener('gameLost', function(e){
            console.log('Game lst')
            console.log(that.timer)
            clearInterval(that.timer)
            console.log('Interval cleared: ' + that.timer)
            blink()
        })
    }

    getScore() {
        return this.score
    }
    getTime() {
        return this.time
    }
    create() {
        let el = document.createElement('div')
        el.setAttribute('id', this.id)
        el.setAttribute('class', 'points')
        el.innerHTML = this.content
        this.root.appendChild(el)
        this.timerEl = document.getElementById('t' + this.id)
        this.scoreEl = document.getElementById('s' + this.id)
    }
}
class BasicWindow {
    constructor(content, root, modal) {
        // window with no close button or no bar
        // Positioned in center, no events
        this.modal = modal || false
        this.id = Math.random().toString(36).substr(2, 9)
        this.generalContent = content || 'Some content'
        this.root = document.getElementById(root) || document.querySelector('body')
        this.classes = ['info-container-basic', 'column-layout']  // thanks to this we car override class prop and add modal class and create a modal
    }
    make() {
        let _output = undefined
        let innerOutput = document.createElement('div')
        innerOutput.setAttribute('id', this.id)
        for (let item of this.classes) {
            innerOutput.classList.add(item)
        }
        innerOutput.innerHTML =  this.generalContent
        if (this.modal == true) {
            var output = document.createElement('div')
            output.classList.add('modal')
            output.appendChild(innerOutput)
            _output = output
        } else {
            _output = innerOutput
        }

        // output.innerHTML = `
        // <div class = 'info-content'>
        //     ${this.generalContent}
        // </div>
        // `
        
        return _output
    }
    destroy() {
        document.getElementById(this.id).remove()
        if (this.modal == true) {
            document.querySelector('.modal').remove()
        }
    }

    changeModalColor(color){
        try{
            document.querySelector('.modal').style.backgroundColor = color;
        } catch {
            console.warn('Tried to change color of modal, but no modal added to DOM.')
        }
    }
    create() {
        this.root.appendChild(this.make())
    }
}
class AntyvirusLauncher extends BasicWindow {
    constructor(root){
        super(undefined, root)
        this.launchButtonId = this.id + 'launch'
        this.skipButtonId = this.id + 'skip'
        // this.classes = []
        this.classes.push('antyvir')
        this.generalContent = `
        
        <div class = "add-more-spacing">
        <div class = "column-layout">
        <h3>Some <span class="shout">free</span> antyvirus program 2020</h3>
        <div id = '${this.launchButtonId}' class = "button red button-wide"> Launch antyvirus</div>
        <div id = '${this.skipButtonId}' class = "button green button-wide">Dont launch antyvirys</div>
        </div>
        </div>
        
        `
    }
    create() {
        var that = this
        
        this.root.appendChild(this.make())
        document.getElementById(this.launchButtonId).addEventListener('click', function(e) {
            that.root.dispatchEvent(new CustomEvent('GameWon'))
            that.destroy()
        })
        document.getElementById(this.skipButtonId).addEventListener('click', function(e) {
            that.destroy()
        })
    }
}
class TempWindow extends BasicWindow {
    constructor(content, root, tout) {
        super(content, root)
        this.tout = tout || 1500;
    }
    setTout() { 
        var that = this
        setTimeout(function(){
            that.destroy()
        }, that.tout)
    }
    create() {
        this.root.appendChild(this.make())
        this.setTout()
        document.getElementById(this.id).addEventListener('click', function() {
            destroy()
        })
    }
}
class InfoWindow extends BasicWindow {
    constructor(title, content, root, isCloseAllowed) {
        // window with bar, close button and not implemented full screaen or minimize button
        super(undefined, root) // content will be set later
        this._Id = `_${this.id}`
        this.maxId = `max${this.id}`
        this.closeId = `x${this.id}`
        this.title = title || '[title]'
        this.content = content || 'Some content'
        this.isCloseAllowed = true // can 'x' button be used
        this.root = document.getElementById(root) || document.querySelector('body')
        this.classes.push('info-container')  // thanks to this we car override class prop and add modal class and create a modal // append class
    }
    createMessage() {

        let element = document.createElement('div')
        element.setAttribute('class', 'info-message')
        element.innerText = 'Not allowed'

        var msg = document.getElementById(this.id)
        msg.appendChild(element)
        setInterval(function () {
            element.remove()
        }, 1000)
    }
    events() {
        var that = this
        var thisItem = document.getElementById(this.id)
        function moveObject(e) {
            let computedStyle = getComputedStyle(thisItem)
            // var offsetX = e.pageX - parseInt(computedStyle.left.slice(0, -1), 10)
            // var offsetY = e.pageY - parseInt(computedStyle.top.slice(0, -1), 10)
            var getLeft = parseInt(computedStyle.left.slice(0, -1), 10)
            var getRight = parseInt(computedStyle.top.slice(0, -1), 10)
            thisItem.style.left = getLeft + e.movementX + "px" // offsetX + "px"
            thisItem.style.top = getRight + e.movementY + "px" // offsetY + "px"
        }
        document.getElementById(this.closeId).addEventListener('click', function (e) {
            if (that.isCloseAllowed == true) {
                that.destroy()
            } else {
                that.createMessage()
            }
        })
        document.getElementById(this.maxId).addEventListener('click', function (e) {
            that.createMessage()
        })
        document.getElementById(this._Id).addEventListener('click', function (e) {
            that.createMessage()
        })
        thisItem.querySelector('.info-bar').addEventListener('mousedown', function (e) {
            e.preventDefault();
            // thisItem.addEventListener('mousemove', moveObject)
            document.querySelector('body').addEventListener('mousemove', moveObject)
        })
        document.querySelector('body').addEventListener('mouseup', function (e) {
            e.preventDefault();
            // thisItem.removeEventListener('mousemove', moveObject)
            document.querySelector('body').removeEventListener('mousemove', moveObject)
        })
    }
    createAndAddContent() {
        // try {
            this.create()
            let element = document.getElementById(this.id)
            // console.log(element)
            let outputHTML = `
            <div class = 'info-bar'>
                <div class='info-title'>
                    ${this.title}
                </div>
                <div class='info-icon-wrapper'>
                    <span class = 'info-icon' id = ${this._Id}>&#10134;</span>
                    <span class = 'info-icon' id = ${this.maxId}>
                    <img src='data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%20x%3D%220px%22%20y%3D%220px%22%20widthwidth%3D%2210%22%20height%3D%2210%22%20viewBox%20%3D%20%220%200%20200%20200%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Crect%20rx%3D%2210%22%20height%3D%22180%22%20width%3D%22180%22%20y%3D%2210%22%20x%3D%2210%22%20stroke-width%3D%2210%22%20stroke%3D%22%23fff%22%20fill%3D%22%23fff%22%20fill-opacity%3D%220%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Crect%20stroke%3D%22%23fff%22%20rx%3D%2210%22%20height%3D%2220%22%20width%3D%22180%22%20y%3D%2210%22%20x%3D%2210%22%20stroke-width%3D%221.5%22%20fill%3D%22%23fff%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Crect%20stroke%3D%22%23fff%22%20height%3D%2213%22%20width%3D%22180%22%20y%3D%2220%22%20x%3D%2210%22%20fill-opacity%3D%22null%22%20stroke-opacity%3D%22null%22%20stroke-width%3D%221.5%22%20fill%3D%22%23fff%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Fsvg%3E' alt="" />
                    </span>
                    <span class = 'info-icon info-icon-red' id="${this.closeId}">&times;</span>
                </div>
            </div>
            <div class = 'info-content'>
                ${this.content}
            </div>
        `
            element.innerHTML = outputHTML
            this.events()
            return true
        // } catch (err) {
            console.error('Something went wrong. Error code: ' + err)
            return new Error('Info window not created because: ' + err)
        // }
    }
}
class AboutInfoWindow extends InfoWindow {
    // Information about author, idea and credentials for SVG images
    constructor(){
        let info = `
        <div class = "column-layout">
        <p class = "text-content">
            Hello, my name is Marek, and I develop my front end skills in order to change my current job. Idea for this game was taken from one on missions in GTA V, where Michel had to play role of some IT guy in order to place bomb in a <i>fruit</i> phone.
        </p>
        <p class = "text-content">
            SVG graphics placed on this page are not my. I borrowed them from:
        </p>
            <div class = 'links'>
                <div>
                    <a class="button blue " href = "https://store.kde.org/p/1025831/" target="_blank">
                        <img src="data:image/svg+xml;base64, ${window.btoa(ImageProvider.getImageAsString('img/svg/background'))}"/>
                    </a>
                </div>
                <div>
                    <a class="button blue button-narrow" href = "https://freeicons.io/" target="_blank">
                        <img src="data:image/svg+xml;base64,${window.btoa(ImageProvider.getImageAsString('img/svg/money'))}" alt="" />
                    </a>
                </div>
                <div>
                    <a class="button blue button-narrow" href = "https://freeicons.io/" target="_blank">
                    <img src='data:image/svg+xml;base64,${window.btoa(ImageProvider.getImageAsString('img/svg/bank'))}' alt='bank icon'/>
                    </a>
                </div>
                <div>
                    <a class="button blue button-narrow" href = "https://freeicons.io/" target="_blank">
                        <img src='data:image/svg+xml;base64,${window.btoa(ImageProvider.getImageAsString('img/svg/rich'))}' alt = 'rich'/>
                    </a>
                </div>
                <div>
                <a class="button blue button-narrow" href = "https://www.svgrepo.com/svg/59213/bug" target="_blank">
                    <img src='data:image/svg+xml;base64,${window.btoa(ImageProvider.getImageAsString('img/svg/favIcon'))}' alt = 'rich'/>
                </a>
            </div>
            </div>
            <p class="text-content">All those graphics are free to use. At least in project like this, as it was done only for learning purposes &#128515;</p>
        </div>
        `

        
        super('About this app', info, 'desktop')
    }
    //<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="989.000000pt" height="1280.000000pt" viewBox="0 0 989.000000 1280.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"><path d="M6730 12339 c-47 -4 -112 -17 -144 -28 -33 -12 -72 -21 -88 -21 -16 0 -40 -7 -53 -16 -15 -9 -33 -13 -47 -9 -14 4 -18 3 -10 -2 8 -6 -13 -20 -67 -43 -78 -32 -80 -35 -105 -89 -24 -53 -28 -58 -78 -73 -29 -9 -73 -20 -97 -23 -71 -9 -142 -45 -198 -98 -29 -28 -50 -53 -48 -57 2 -4 -7 -18 -20 -30 -14 -13 -25 -20 -25 -15 0 4 -17 -18 -38 -51 -22 -32 -54 -70 -71 -83 -34 -24 -75 -102 -125 -236 -19 -50 -46 -94 -96 -154 -38 -46 -79 -108 -91 -137 -13 -30 -26 -54 -31 -54 -4 0 -8 -34 -8 -76 0 -66 -4 -83 -31 -132 -17 -32 -49 -76 -70 -99 -21 -24 -39 -48 -39 -55 0 -7 11 0 23 16 16 20 26 25 31 18 9 -15 -2 -34 -15 -27 -5 4 -9 -5 -9 -19 0 -14 5 -28 10 -31 6 -3 10 -24 10 -45 0 -22 5 -72 11 -113 10 -68 9 -78 -12 -126 -12 -29 -22 -60 -22 -70 1 -9 -3 -41 -9 -72 -8 -42 -6 -75 5 -140 29 -157 31 -189 13 -189 -9 0 -19 -7 -22 -15 -10 -24 -96 -20 -120 6 -10 11 -27 25 -37 31 -18 9 -18 8 -1 -17 19 -30 62 -54 99 -57 15 -2 24 -7 21 -14 -21 -54 -17 -82 13 -117 17 -19 47 -42 66 -51 19 -9 35 -23 35 -31 0 -8 53 -46 118 -85 64 -39 137 -87 162 -106 25 -19 68 -46 96 -62 45 -23 244 -169 244 -178 0 -1 -51 -27 -112 -58 -220 -107 -342 -206 -516 -420 -58 -70 -139 -167 -179 -215 -237 -275 -367 -550 -501 -1051 l-28 -105 -99 3 c-120 4 -278 -12 -383 -39 -98 -25 -259 -55 -432 -79 -161 -23 -240 -46 -378 -111 -235 -110 -408 -259 -509 -437 -126 -222 -131 -531 -14 -850 50 -137 137 -293 341 -607 107 -165 256 -399 332 -519 l137 -219 -49 -54 c-28 -30 -50 -58 -50 -62 0 -5 -33 -11 -72 -14 -48 -3 -120 -21 -208 -51 -74 -25 -157 -50 -185 -56 -27 -5 -71 -20 -97 -31 l-46 -22 -34 24 c-71 51 -217 18 -304 -67 -21 -21 -62 -68 -89 -104 -50 -65 -50 -65 -105 -68 -30 -1 -93 -11 -140 -21 -47 -11 -114 -24 -150 -31 -36 -6 -87 -22 -113 -35 -27 -14 -66 -25 -87 -25 -30 0 -43 -6 -59 -26 -26 -33 -26 -34 2 -74 32 -48 70 -67 199 -100 168 -42 263 -80 411 -164 144 -83 200 -105 329 -135 222 -50 658 -275 1068 -551 244 -164 571 -323 917 -446 142 -50 257 -97 362 -148 40 -19 98 -41 127 -47 l54 -12 0 -126 c0 -175 -25 -449 -49 -551 -11 -47 -27 -142 -36 -212 -20 -153 -13 -205 28 -228 26 -14 29 -14 46 7 10 12 23 50 30 85 20 101 72 310 87 346 7 17 18 32 25 32 6 0 34 -17 61 -37 36 -28 58 -57 84 -107 18 -38 34 -75 34 -82 0 -25 120 -347 152 -405 38 -73 60 -93 104 -93 59 0 66 17 44 105 -11 42 -31 101 -45 132 -14 31 -37 98 -50 149 -13 51 -33 126 -45 166 -12 41 -19 77 -15 80 13 13 70 -66 129 -175 139 -259 288 -443 358 -443 36 0 78 23 78 43 0 7 -36 68 -81 136 -44 68 -102 166 -128 220 -26 53 -71 140 -100 194 -52 96 -58 118 -28 100 18 -10 110 -123 145 -178 14 -22 53 -71 86 -110 34 -38 79 -91 99 -117 72 -90 127 -114 173 -74 l29 25 -25 45 c-13 25 -41 69 -62 98 -21 29 -57 85 -80 123 -23 39 -92 142 -152 230 -60 87 -113 173 -118 190 -5 16 -15 74 -23 128 -14 98 -109 457 -146 552 -31 83 -25 114 20 91 44 -23 191 -48 256 -44 42 2 80 13 121 33 79 40 235 190 269 259 64 131 57 433 -16 766 -65 296 -123 471 -339 1040 -89 234 -199 531 -245 660 -45 129 -91 255 -102 280 -11 25 -18 58 -16 75 2 17 7 104 11 194 l7 164 50 17 c176 60 301 183 402 397 20 40 41 73 47 73 7 0 23 -12 37 -26 40 -44 138 -103 207 -124 127 -39 287 -18 450 60 46 22 86 40 89 40 10 0 -7 -241 -24 -350 -11 -68 -17 -167 -18 -280 0 -158 3 -190 32 -335 18 -88 51 -227 73 -310 57 -209 135 -562 172 -783 28 -165 32 -208 32 -372 -1 -191 -15 -319 -39 -357 -8 -11 -47 -37 -87 -56 -62 -30 -88 -51 -170 -140 -54 -57 -114 -133 -134 -168 -25 -44 -78 -104 -165 -188 -130 -125 -143 -146 -116 -182 56 -74 156 -31 305 129 95 104 119 120 149 103 32 -17 85 -118 134 -258 l49 -136 0 -135 c0 -276 76 -502 168 -502 51 0 56 18 31 117 -32 128 -38 473 -9 473 19 0 63 -58 126 -163 100 -170 236 -327 318 -369 37 -19 41 -19 73 -4 40 19 41 35 8 74 -31 37 -31 42 -1 42 13 0 29 7 37 16 11 13 9 23 -11 59 -13 24 -41 68 -62 97 -21 29 -72 119 -113 201 -72 141 -76 151 -82 235 -9 120 -8 382 1 662 7 194 6 257 -8 360 -36 278 -45 711 -25 1225 17 458 15 575 -15 780 -14 99 -29 199 -32 223 -11 84 -4 362 15 652 11 162 25 394 31 516 11 245 20 302 90 584 71 283 91 391 97 520 9 196 -34 332 -142 448 -73 79 -103 100 -295 201 -85 45 -157 84 -159 87 -5 4 82 265 111 336 15 35 31 54 62 72 42 24 100 82 143 141 21 30 22 30 38 10 9 -11 26 -36 39 -55 34 -52 54 -64 97 -63 38 2 57 9 92 37 24 18 41 88 24 98 -7 4 -2 10 14 17 13 5 39 15 57 23 40 16 56 59 47 123 -5 30 -4 45 4 45 6 0 11 -13 11 -29 0 -17 4 -32 9 -36 9 -5 16 -37 26 -124 2 -19 0 -42 -5 -51 -7 -13 -4 -20 15 -28 22 -10 24 -14 13 -36 -11 -25 -28 -26 -28 -2 0 8 -6 18 -12 24 -10 8 -17 -2 -29 -39 -15 -48 -15 -50 4 -60 13 -8 17 -8 13 -1 -11 18 9 21 39 6 21 -11 36 -12 57 -5 27 10 41 -2 16 -12 -10 -4 -9 -6 1 -6 8 -1 19 -9 26 -18 11 -15 14 -10 20 35 7 53 36 102 60 102 10 0 76 98 80 120 1 3 13 29 28 59 15 30 27 67 27 83 0 15 3 28 8 28 10 0 72 -92 72 -108 0 -24 15 -11 50 41 19 28 49 71 67 94 55 69 72 184 31 209 -6 4 -5 -2 1 -14 6 -11 11 -33 10 -49 -1 -27 -1 -27 -9 5 -8 36 -17 49 -26 40 -3 -4 0 -16 6 -28 17 -32 4 -83 -30 -119 -17 -17 -25 -31 -19 -31 5 0 7 -4 4 -10 -3 -5 -13 -10 -21 -10 -8 0 -13 4 -9 9 3 6 -10 17 -30 27 -19 9 -35 23 -35 31 0 8 -9 26 -20 40 -16 20 -20 41 -20 99 0 40 -11 124 -25 187 -15 70 -29 179 -35 278 -13 214 -18 255 -38 309 -24 68 -121 220 -139 220 -14 0 -13 -3 3 -22 l19 -23 -22 19 c-13 10 -20 23 -17 28 3 5 -6 26 -20 47 -18 26 -31 65 -42 127 -20 119 -28 143 -82 254 -42 84 -60 108 -162 210 -83 83 -150 139 -240 200 -69 46 -142 98 -164 116 -59 50 -184 111 -242 117 -34 4 -67 17 -103 40 -39 26 -74 39 -140 51 -95 17 -110 17 -241 5z m1504 -1413 c10 -32 15 -60 13 -63 -6 -6 -47 103 -47 124 0 30 17 0 34 -61z m-2904 8 c0 -27 -4 -43 -10 -39 -5 3 -10 24 -10 46 0 21 5 39 10 39 6 0 10 -21 10 -46z m-49 -68 c-12 -12 -19 -25 -16 -28 9 -8 -43 -50 -54 -43 -7 4 7 27 36 62 26 30 49 50 51 43 2 -6 -5 -22 -17 -34z m50 -97 l-10 -24 0 26 c-1 14 2 29 6 33 12 12 14 -9 4 -35z m-94 -176 c-3 -10 -5 -4 -5 12 0 17 2 24 5 18 2 -7 2 -21 0 -30z m2630 -135 c-3 -7 -5 -2 -5 12 0 14 2 19 5 13 2 -7 2 -19 0 -25z m3 -58 c-5 -22 -8 -27 -9 -13 -1 21 9 56 14 51 2 -2 0 -19 -5 -38z m556 -378 c-9 -8 -28 50 -32 98 -4 41 -3 39 16 -24 11 -38 18 -71 16 -74z m-566 30 c11 -41 13 -89 3 -79 -11 12 -32 -27 -26 -50 3 -14 -3 -33 -16 -51 -11 -16 -18 -32 -15 -35 8 -8 -34 -19 -46 -12 -16 10 -11 22 12 28 20 6 20 8 6 29 -14 21 -14 23 6 33 12 6 21 17 22 25 0 8 4 39 8 68 8 52 19 58 29 17 4 -15 5 -14 6 7 0 15 -3 30 -9 33 -5 3 -10 13 -10 21 0 26 19 5 30 -34z m560 -57 c14 -19 14 -19 -2 -6 -10 7 -18 18 -18 24 0 6 1 8 3 6 1 -2 9 -13 17 -24z m-3054 -62 c13 -37 23 -72 21 -77 -3 -9 -38 80 -53 134 -13 49 9 10 32 -57z m2973 60 c0 -5 -4 -17 -9 -28 -8 -18 -9 -17 -9 8 -1 15 4 27 9 27 6 0 10 -3 9 -7z m151 -28 c7 -8 23 -15 36 -15 17 0 22 -4 18 -15 -12 -30 -82 2 -84 38 0 12 17 8 30 -8z m-3090 -63 c0 -3 -7 3 -15 14 -8 10 -14 28 -14 39 0 14 4 10 14 -14 8 -18 15 -36 15 -39z m2391 25 c-13 -13 -26 -3 -16 12 3 6 11 8 17 5 6 -4 6 -10 -1 -17z m501 -17 c-1 -14 -3 -31 -4 -38 -2 -18 -38 17 -38 38 0 22 10 31 30 28 9 -2 14 -13 12 -28z m-2968 -16 c3 -8 2 -12 -4 -9 -6 3 -10 10 -10 16 0 14 7 11 14 -7z m3185 7 c8 -5 9 -11 3 -15 -5 -3 -15 1 -22 9 -14 16 -3 20 19 6z m-527 -63 c-8 -33 -54 -70 -68 -56 -9 9 13 61 39 94 17 22 21 24 29 10 5 -9 5 -30 0 -48z m-2713 6 l30 -46 -25 -33 -25 -33 -40 20 c-22 10 -44 30 -49 43 -13 34 8 73 45 84 17 5 31 10 32 10 0 1 15 -20 32 -45z m-132 -6 c-3 -7 -5 -2 -5 12 0 14 2 19 5 13 2 -7 2 -19 0 -25z m420 0 c-3 -8 -6 -5 -6 6 -1 11 2 17 5 13 3 -3 4 -12 1 -19z m2435 -40 c-6 -6 -7 0 -4 19 5 21 7 23 10 9 2 -10 0 -22 -6 -28z m-2471 -129 c-11 -28 -12 -26 -16 20 -2 29 -1 31 11 19 11 -11 12 -21 5 -39z m2364 41 c-3 -5 -11 -10 -16 -10 -6 0 -7 5 -4 10 3 6 11 10 16 10 6 0 7 -4 4 -10z m-2405 -9 c0 -17 -18 -21 -24 -6 -3 9 0 15 9 15 8 0 15 -4 15 -9z m2339 -48 l36 -14 -38 5 c-38 5 -97 40 -97 57 0 6 14 0 31 -12 18 -12 48 -28 68 -36z m-2396 -13 c14 -11 30 -20 36 -20 6 0 11 -5 11 -11 0 -6 -9 -8 -22 -3 -31 9 -98 43 -98 49 0 13 50 3 73 -15z m136 -17 c0 -25 -1 -26 -9 -8 -12 27 -12 35 0 35 6 0 10 -12 9 -27z m71 -50 c0 -7 -2 -13 -4 -13 -5 0 -36 60 -36 69 1 11 40 -44 40 -56z m2512 5 c-11 -11 -52 -2 -52 11 0 4 14 6 31 3 20 -3 27 -8 21 -14z m-1987 -28 c3 -5 1 -10 -4 -10 -6 0 -11 5 -11 10 0 6 2 10 4 10 3 0 8 -4 11 -10z m-21 -29 c-2 -3 -12 3 -22 13 -16 17 -16 18 5 5 12 -7 20 -15 17 -18z m-84 9 c0 -5 11 -10 24 -10 14 0 28 -5 31 -11 10 -15 4 -17 -31 -7 -29 7 -56 38 -34 38 6 0 10 -4 10 -10z m-456 -10 c30 -11 35 -40 8 -40 -21 0 -42 18 -42 37 0 16 2 16 34 3z m432 -68 c8 -8 12 -17 9 -20 -6 -7 -6 -6 -39 42 -14 21 -26 44 -26 50 0 6 9 -4 21 -23 11 -19 27 -41 35 -49z m170 35 c1 -20 -2 -35 -5 -33 -3 2 -22 -7 -41 -20 -27 -19 -30 -24 -15 -24 17 0 17 -2 5 -10 -8 -5 -23 -10 -32 -10 -19 0 -58 33 -58 49 0 10 80 32 92 25 4 -3 5 2 2 10 -3 9 -2 16 4 16 5 0 12 9 15 21 9 33 32 16 33 -24z m47 13 c6 -24 1 -25 -19 -6 -18 18 -18 26 0 26 7 0 16 -9 19 -20z m37 0 c0 -11 -4 -20 -10 -20 -5 0 -10 9 -10 20 0 11 5 20 10 20 6 0 10 -9 10 -20z m-200 -20 c0 -5 -7 -7 -15 -4 -8 4 -15 8 -15 10 0 2 7 4 15 4 8 0 15 -4 15 -10z m-96 -83 l57 -67 -48 -21 c-71 -31 -113 -36 -113 -14 0 9 -15 32 -34 51 l-34 34 33 0 c30 0 33 3 40 38 8 41 24 67 35 55 4 -4 33 -38 64 -76z m116 -27 c0 -5 -6 -10 -14 -10 -8 0 -18 5 -21 10 -3 6 3 10 14 10 12 0 21 -4 21 -10z m-3048 -5424 c87 -27 176 -73 228 -116 l35 -30 -75 21 c-90 23 -202 77 -250 118 -42 37 -36 37 62 7z"/><path d="M5224 10818 l-19 -23 23 19 c21 18 27 26 19 26 -2 0 -12 -10 -23 -22z"/><path d="M5881 9354 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"/><path d="M5699 11803 c-32 -39 -44 -57 -32 -50 13 8 57 67 50 67 -2 0 -10 -8 -18 -17z"/><path d="M8555 10200 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0 -7 -4 -4 -10z"/><path d="M8557 10051 c-4 -17 -3 -21 5 -13 5 5 8 16 6 23 -3 8 -7 3 -11 -10z"/><path d="M8032 9740 c0 -14 2 -19 5 -12 2 6 2 18 0 25 -3 6 -5 1 -5 -13z"/><path d="M8058 9538 c5 -5 16 -8 23 -6 8 3 3 7 -10 11 -17 4 -21 3 -13 -5z"/></g></svg>
 


}
class GameLost extends BasicWindow {
    constructor(root){
        super(undefined, root, true)
        this.buttonId = this.id + 'game-lost'
        this.generalContent = `
        <h3>Oh no...</h3>
        <div class = "text-content">
        <p>Its too late... You failed to launch antyvirus on time. Now Your hard drive will be encripted  .</br></br>
        </div>
        <div class="add-spacing">
        <div id = ${this.buttonId} class='button orange'>
            Close
        </div>
        </div>
        `
        this.classes.push('game-lost')
    }
    create() {
        this.root.appendChild(this.make())
        this.changeModalColor('rgba(255, 0, 0, 0.5')
        document.getElementById(this.buttonId).addEventListener('click', function() {
            window.location.reload(true) // reload page
        })
    }
}
class GameWon extends BasicWindow {
    constructor(root, score){
        super(undefined, root, true)
        this.buttonId = this.id + 'game-won'
        this.generalContent = `
        <h3>Congratulations</h3>
        <div class = "text-content">
        <p>
        You managed to rescue Your computer. Lucky You 
        Your score is ${score}. &#128514;
        </p>
        </div>
        <div class="add-spacing">
        <div id = ${this.buttonId} class='button orange'>
            Restart
        </div>
        </div>

        
        `
        
        this.classes.push('game-won')
    }

    create() {
        console.log("GameWon created")
        this.root.appendChild(this.make())
        this.changeModalColor('rgba(0, 255, 0, 0.5')
        document.getElementById(this.buttonId).addEventListener('click', function() {
            window.location.reload(true) // reload page
        })
    }
}
class StartWindow extends BasicWindow {
    // This element cerates custom events on game hardness level chose. 'easy', 'medium' or 'hard'
    // Window with game hardness choser. Thery specific
    constructor() {
        let cont = `
        <div class = "info-icon info-icon-green" id="about">?</div>
        <div class = "add-spacing">
        <div class="text-content">
        <p>
            Lately Your computer got infected with some viruses. Your task is to shut all popping windows, find a antyvirus program in start menu and lauch it
            before Your disc gets encripted. Time left to end of the game is visible in top right corner. The more popups You close before launching antyvirus,
            the more score You get for the game.
        </p>
    </div>
    <div class="text-content">
    <ul class="start-menu-form column-layout">
        <span>Chose game hardness level</span>
        <li>
            <div id="easy" class="button green">Soft</div>
        </li>
        <li>
            <div id="medium" class="button orange">Medium</div>
        </li>
        <li>
            <div id="hard" class="button red impossible">Hard</div>
        </li>
    </ul>
    </div>
    </div>
    `

        super(cont, 'desktop', true)
    }
    getThisElement() {
        return document.getElementById(this.id)
    }
    create() {
        var that = this

        this.classes.push('info-container-start-menu')
        this.root.appendChild(this.make())
        document.getElementById('easy').addEventListener('click', (e) => {
            that.getThisElement().dispatchEvent(new CustomEvent('easy'))
            that.destroy()

        })
        document.getElementById('medium').addEventListener('click', (e) => {
            that.getThisElement().dispatchEvent(new CustomEvent('medium'))
            that.destroy()
        })
        document.getElementById('hard').addEventListener('click', (e) => {
            that.getThisElement().dispatchEvent(new CustomEvent('hard'))
            that.destroy()
        })
        document.getElementById('about').addEventListener('click', (e) => {
            let about = new AboutInfoWindow()
            about.createAndAddContent()
        })
        return document.getElementById(this.id)
    }
}


class PopupGeneral extends InfoWindow {
    constructor(hardnes, title, content, svg) {
        super(title || "Join hot chat", content, 'desktop', true)
        hardnes = hardnes || 'easy' // 'easy', 'medium, hard
        if (hardnes == 'easy') {
            this.hardnes = 3000
        } else if (hardnes == 'medium') {
            this.hardnes = 2000
        } else {
            this.hardnes = 1000
        }
        this.points = 1 // points to get for closing this popup
        this.svg = svg
        this.timeout = Math.ceil((Math.random() * 3000)) + this.hardnes
        this.timeoutInterval = undefined // just a handle
        this.cb = undefined  // callback for adding points
        this.classes.push('popup')
        // this.classes.push('row-layout')
        this.content = content
    }

    // <img src='data:image/svg+xml;utf8,${this.svg}'/>
    addPopupContent() {
        let output = `
        <div class = "row-layout">
                <div class="add-spacing">
                    ${this.svg}
                </div>
                <div class="add-spacing text-content">
                    ${this.content}
                </div>
        </div>
        `
        this.createAndAddContent()
        var thisItem = document.getElementById(this.id).querySelector('.info-content')
        thisItem.innerHTML = output
    }
    beforeDestroy(callBack) {
        // event listener calls this on close button, cb is for adding points somewhere
        clearInterval(this.timeoutInterval)
        callBack(this.points)
    }
    place(root) {
        this.addPopupContent()
        let thisEl = document.getElementById(this.id)
        let cord = this._getRandCord()
        thisEl.style.top = cord.x
        thisEl.style.left = cord.y

    }
    _getRandCord() {
        let thisEl = document.getElementById(this.id)
        let parentWidth = thisEl.parentNode.clientWidth - thisEl.clientWidth;
        let parentHeight = thisEl.parentNode.clientHeight - thisEl.clientHeight;

        let newx = Math.ceil((Math.random() * parentWidth))
        let newy = Math.ceil((Math.random() * parentHeight))
        return { x: newx, y: newy }
    }
    setTimer() {
        // at random time move this div
        var that = this
        // document.getElementById('desktop').addEventListener('gameLost', function(e) {
        //     console.log('In execute - event launched')
        //     clearInterval(that.timeoutInterval)
        // })

        this.timeoutInterval = setInterval(function () {
            var cord = that._getRandCord()
            var end = cord
            var thisEl = document.getElementById(that.id)
            var computedStyle = getComputedStyle(thisEl)
            var startX = parseInt(computedStyle.left.slice(0, -1), 10)
            var startY = parseInt(computedStyle.top.slice(0, -1), 10)
            var byX = (-startX + cord.x) / 50
            var byY = (-startY + cord.y) / 50

            // **************** ANIMATION ********  MOVE DIV ***************************
            var counter = 0
            var int = setInterval(function () {
                startX += byX
                startY += byY
                thisEl.style.top = startY + 'px'
                thisEl.style.left = startX + 'px'
                counter++
                if (counter > 49) {
                    clearInterval(int)
                }
            }, 20)
            // ***********  NO ANIMATION ***********************************************
            // thisEl.style.top = cord.x + 'px'
            // thisEl.style.left = cord.y + 'px'
            // *************************************************************************

        }, this.hardnes)
    }

    execute(cb) {
        this.place('desktop')
        this.setTimer()
        this.cb = cb
        var that = this
        let av = document.querySelector('.antyvir')
        if (av != null)  {
            av.remove()
        }
        document.getElementById(this.closeId).addEventListener('click', function (e) {
            that.beforeDestroy(that.cb)
        });
        document.getElementById('desktop').addEventListener('gameLost', function(e) {
            console.log('Timeout before clearing: ' + that.timeoutInterval)
            clearInterval(that.timeoutInterval)
            console.log('Timeout interval cleared : ' + that.timeoutInterval)
        })
    }
}

class PopupContentGetter {
    constructor(){}
    static getContentNr(nr){
        let output = {};
        switch (nr) {
            case 0:
                return PopupContentGetter._get1();
            case 1:
                return PopupContentGetter._get2();
            case 2:
                return PopupContentGetter._get3();
            default:
                throw new TypeError(`${this.constructor.name}: content ${nr} not available`)
        }
        return output
    }
        static _get1(){
            return {
                img: ImageProvider.getImageAsString('img/svg/money'),
                content: `Do You want to win free cash? Just install this free software`,
                title: `WINN FREE CASH`
            }
        }
        static _get2(){
            return {
                img: ImageProvider.getImageAsString('img/svg/bank'),
                content: `Your bank wants to refresh Your data. Please fill in the form`,
                title: `Your data at bank have expired`                
            }
        }
        static _get3(){
            return {
                img: ImageProvider.getImageAsString('img/svg/rich'),
                content: `He earns 50 000$ per week working only 2h per day and not leaving his house. You must see this.`,
                title: `Want to become rich?`                
            }
        }
    }

class Popup extends PopupGeneral {
    // customise - add randomly one of 3 contents
    // hsrdness - game hardness level
    // type - optional, for developement  puoposes. Force type of popup, do not chose rndomly
    constructor(hardness, type){
        let randNum = type || Math.floor(3*Math.random())
        console.log(randNum)
        let svg = PopupContentGetter.getContentNr(randNum).img;
        let title = PopupContentGetter.getContentNr(randNum).title
        let content = PopupContentGetter.getContentNr(randNum).content
        super(hardness, title, content, svg)
    }
}
class Manager {

    // !!!!!!!!!  Here in create3Element should be choosen wich popup will appear. All popup types should be classes inheriting from info window
    // Manager is called when game hardness level is already known

    constructor(root, pointsId) {
        this.hardnes = 'easy'
        this.root = root
        this.rootHandel = document.getElementById(this.root)
        this.timeoutInterval = undefined
        this.points = 0 // calculate total points and display in this.pointsId
        this.areAllClosed = false  // true if all popups are closed and start menu can be oppened
        this.interval = undefined
        this.scoreHandel = undefined
    }
    addPoints(p) {
        console.log(this)
        this.points = this.points + p;

    }
    createElement() {

        let popup = new Popup(this.hardnes)
        popup.execute(this.callBack.bind(this))
        this.checkAreAllClosed()
    }
    callBack(points) {
        // this.points = this.points + points
        // document.getElementById(this.pointsId).innerText = this.points
        this.scoreHandel.addScore(points)
    }
    checkAreAllClosed() {
        let popups = document.querySelectorAll('.popup')
        if (popups.length == 0) {
            this.areAllClosed = true
            return true
            // this.rootHandel.dispatchEvent(new CustomEvent('PopupsCleared'))
        } else {
            this.areAllClosed = false
            return false
            // this.rootHandel.dispatchEvent(new CustomEvent('PopupsNotCleared'))
        }
        // console.log("%cSet menu start to disabled/enabled here", "{background-color: yellow}")
    }
    setTimeInterval() {
        var that = this
        this.interval = setInterval(function () {
            that.createElement()
        }, that.timeoutInterval)
    }
    // gameWon() {
    //     clearInterval(this.interval)
    //     this.makeWonLostInfo('won', '<b>CONGRATULATIONS!</b> You cleared your computer on time. No one will ever know :)')
    // }
    // gameLost() {
    //     clearInterval(this.interval)
    //     this.makeWonLostInfo('lost', '<b>YOU FAILED!</b> Your filthy habbit was discovered! A shame on You :(')
    // }

    run() {
        var scoreW = new ScoreWindow('desktop');
        scoreW.create();
        this.scoreHandel = scoreW;
        let stWin = new StartWindow()
        var startMenu = stWin.create()
        var that = this
        function doLaunchAntyvir() {
            let arePopupsClosed = that.checkAreAllClosed()
            if (arePopupsClosed == false){
                let tW = new TempWindow('Cannot launch antyvirus while popups are displayed. Would be too easy :)')
                tW.create()
            } else {
                let antvirWindow = new AntyvirusLauncher(that.root)
                antvirWindow.create()
            }
        }
        document.getElementById('launchAntyvir').addEventListener('click', doLaunchAntyvir);
        document.getElementById(this.root).addEventListener('GameWon', function(e) {
            clearInterval(that.interval)
            that.points = that.scoreHandel.getScore();
            let gameInfo = new GameWon(that.root, that.points)
            gameInfo.create()
        })
        document.getElementById(this.root).addEventListener('gameLost', function(e) {
            clearInterval(that.interval)
            let gameInfo = new GameLost(that.root)
            gameInfo.create()
        })
        startMenu.addEventListener('easy', function (e) {
            console.log('Game started in easy mode')
            scoreW.createTimer()
            scoreW.startTimer()
            that.timeoutInterval = 4250
            that.hardnes = 'easy'
            that.setTimeInterval()
        })
        startMenu.addEventListener('medium', function (e) {
            console.log('Game started in medium mode')
            scoreW.createTimer()
            scoreW.startTimer()
            that.hardnes = 'medium'
            that.timeoutInterval = 3000
            that.setTimeInterval()
        })
        startMenu.addEventListener('hard', function (e) {
            console.log('Game started in hard mode')
            scoreW.createTimer()
            scoreW.startTimer()
            that.hardnes = 'hard'
            that.timeoutInterval = 1000
            that.setTimeInterval()    
        })
        
    }

}

class Starter {
    constructor() {
        // document.querySelector('.start-menu').classList.remove('hidden')
        this.level = undefined // hard, medium or easy - game hardnes level
        this.tout = undefined // timeout handler - clear if game won
        this.manager = undefined
    }
    // events() {
    //     var that = this

    //     document.querySelector('.launch-antyvir').addEventListener('click', function (e) {
    //         clearTimeout(that.tout)
    //         that.manager.gameWon()
    //     })
    // }
    makeInfoWindow() {

        // let a = new GameWon('desktop')
    
        //  let a = new GameLost('desktop')
        // let a = new AntyvirusLauncher('desktop')
    //  a.create()
//     let a = new Popup('easy', 0)
// a.execute()

        // UNCOMMENT THIS TO WORK
        // console.warn('IIFE in class runs before constructor?')
        let man = new Manager('desktop', 'score')
        this.manager = man
        man.run()
    //   this.events()

    }

}
