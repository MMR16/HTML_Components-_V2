class Modal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpend = false;
        this.shadowRoot.innerHTML = `
        <style>
        #backdrop{
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100vh;
            background: rgba(0, 0, 0, .75);
            z-index:10;
            opacity:0;
            pointer-events:none;
        }

        :host([opend]) #backdrop,
        :host([opend]) #modal{
            pointer-events:all;
            opacity:1;
        }
        :host([opend]) #modal{
            top:15vh;
        }
        #modal{
            position:fixed;
            z-index:100;
            top:10vh;
            left:25%;
            width:50%;
        background:white;
        border-radius:3px;
        box-shadow:0 2px 8px rgba(0,0,0,0,.26);
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        opacity:0;
        transition:all .5s ease-out;
        }
        header{
            padding:1rem;
            border-bottom: 1px solid black;
        }
        header h1{
            font-size:1.3rem;
        }

        #actions {
        border-top: 1px solid black;
        padding:1rem;
        display:flex;
        justify-content:flex-end;
        }

        #actions button{
            margin:0 .25rem;
        }

        #cancel{
            background-color:red;;
            color:white;
        }
        #ok{
            background-color:green;;
            color:white;
        }

        ::sloted(h2){
            margin:0;
        }
        #main{
            padding:1rem;
        }
        </style>


        <div id='backdrop'></div>
        <div id='modal'>
        <header>
        <slot name='title'>Please Confirme Payment</slot>
        </header>
        <section id='main'>
        <slot> </slot>
        </section>
        <section id="actions">
        <button id='cancel'>Cancel</button>
        <button id='ok'>ok</button>
        </section>
        </div>
        `
        const slots = this.shadowRoot.querySelectorAll('slot');
        slots[1].addEventListener('slotchange', e => console.dir(slots[1].assignedNodes()))
        const cancelBtn = this.shadowRoot.querySelector('#cancel');
        const okBtn = this.shadowRoot.querySelector('#ok');
        cancelBtn.addEventListener('click', this._cancel.bind(this))
        okBtn.addEventListener('click', this._confirm.bind(this))
        cancelBtn.addEventListener('cancel', () => {
            console.log('cancel from component')
        })

        const divBackdrop = this.shadowRoot.querySelector('#backdrop');
        const divModal = this.shadowRoot.querySelector('#modal');

        const events = ['mouseleave', 'click', 'contextmenu']
        divModal.addEventListener(events[0], () => {
            this.hide();
        })

        for (let i = 1; i < events.length; i++) {
            divBackdrop.addEventListener(events[i], (e) => {
                if (events[i] == 'contextmenu') {
                    e.preventDefault();
                }
                this.hide();
            });


        }
        // function addMultipleListeners(element, events, handler, useCapture, args) {
        //     if (!(events instanceof Array)) {
        //         throw 'addMultipleListeners: ' +
        //             'please supply an array of eventstrings ' +
        //             '(like ["click","mouseover"])';
        //     }
        //     //create a wrapper to be able to use additional arguments
        //     var handlerFn = function(e) {
        //         handler.apply(this, args && args instanceof Array ? args : []);
        //     }
        //     for (var i = 0; i < events.length; i += 1) {
        //         element.addEventListener(events[i], handlerFn, useCapture);
        //     }
        // }




        // divModal.addEventListener('mouseleave', () => {
        //     this.hide();
        // })

        // divBackdrop.addEventListener(`'click'&'contextmenu '`, () => {
        //     this.hide();
        // })


    }
    attributeChangedCallback(name, oldValue, newValue) {
        // if (name === 'opend') {
        if (this.hasAttribute('opend')) {
            this.isOpend = true;
            //             this.shadowRoot.querySelector('#backdrop').style.opacity = 1;
            //             this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
            //             this.shadowRoot.querySelector('#modal').style.opacity = 1;
            //             this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';
        } else {
            this.isOpend = false;
        }
        // }

    }

    static get observedAttributes() { return ['opend']; } //using css host instead

    open() {
        this.setAttribute('opend', '');
        this.isOpend = true;
    }

    hide() {
        if (this.hasAttribute('opend')) {

            this.removeAttribute('opend');
        }
        this.isOpend = false;
    }
    _cancel(e) {
        this.hide();
        const cancelEvent = new Event('cancel', { bubbles: true, composed: true })
        e.target.dispatchEvent(cancelEvent);

    }

    _confirm() {
        this.hide();
        const confirmEvent = new Event('confirm')
        this.dispatchEvent(confirmEvent);

    }


}

customElements.define('uc-modal', Modal)