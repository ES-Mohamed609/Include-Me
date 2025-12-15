/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.6.0): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'dropdown'
const VERSION = '4.6.0'
const DATA_KEY = 'bs.dropdown'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const ESCAPE_KEYCODE = 27 // KeyboardEvent.which value for Escape (Esc) key
const SPACE_KEYCODE = 32 // KeyboardEvent.which value for space key
const TAB_KEYCODE = 9 // KeyboardEvent.which value for tab key
const ARROW_UP_KEYCODE = 38 // KeyboardEvent.which value for up arrow key
const ARROW_DOWN_KEYCODE = 40 // KeyboardEvent.which value for down arrow key
const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)
const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`)

const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_CLICK = `click${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`

const CLASS_NAME_DISABLED = 'disabled'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_DROPUP = 'dropup'
const CLASS_NAME_DROPRIGHT = 'dropright'
const CLASS_NAME_DROPLEFT = 'dropleft'
const CLASS_NAME_MENURIGHT = 'dropdown-menu-right'
const CLASS_NAME_POSITION_STATIC = 'position-static'

const SELECTOR_DATA_TOGGLE = '[data-toggle="dropdown"]'
const SELECTOR_FORM_CHILD = '.dropdown form'
const SELECTOR_MENU = '.dropdown-menu'
const SELECTOR_NAVBAR_NAV = '.navbar-nav'
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'

const PLACEMENT_TOP = 'top-start'
const PLACEMENT_TOPEND = 'top-end'
const PLACEMENT_BOTTOM = 'bottom-start'
const PLACEMENT_BOTTOMEND = 'bottom-end'
const PLACEMENT_RIGHT = 'right-start'
const PLACEMENT_LEFT = 'left-start'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Dropdown {
    constructor(element, config) {
        this._element = element
        this._menu = this._getMenuElement()
        this._addEventListeners()
    }

    // Getters

    static get VERSION() {
        return VERSION
    }

    // Public

    toggle() {
        if (this._element.disabled || this._element.classList.contains(CLASS_NAME_DISABLED)) {
            return
        }

        const isActive = this._menu.classList.contains(CLASS_NAME_SHOW)

        Dropdown._clearMenus()

        if (isActive) {
            return
        }

        this.show()
    }

    show() {
        if (this._element.disabled ||
            this._element.classList.contains(CLASS_NAME_DISABLED) ||
            this._menu.classList.contains(CLASS_NAME_SHOW)) {
            return
        }

        const parent = Dropdown._getParentFromElement(this._element)
        const showEvent = new CustomEvent(EVENT_SHOW, {
            bubbles: true,
            cancelable: true,
            detail: { relatedTarget: this._element }
        })

        parent.dispatchEvent(showEvent)

        if (showEvent.defaultPrevented) {
            return
        }

        this._element.focus()
        this._element.setAttribute('aria-expanded', true)

        this._menu.classList.toggle(CLASS_NAME_SHOW)
        parent.classList.toggle(CLASS_NAME_SHOW)

        const shownEvent = new CustomEvent(EVENT_SHOWN, {
            bubbles: true,
            detail: { relatedTarget: this._element }
        })
        parent.dispatchEvent(shownEvent)
    }

    hide() {
        if (this._element.disabled ||
            this._element.classList.contains(CLASS_NAME_DISABLED) ||
            !this._menu.classList.contains(CLASS_NAME_SHOW)) {
            return
        }

        const parent = Dropdown._getParentFromElement(this._element)
        const hideEvent = new CustomEvent(EVENT_HIDE, {
            bubbles: true,
            cancelable: true,
            detail: { relatedTarget: this._element }
        })

        parent.dispatchEvent(hideEvent)

        if (hideEvent.defaultPrevented) {
            return
        }

        this._menu.classList.toggle(CLASS_NAME_SHOW)
        parent.classList.toggle(CLASS_NAME_SHOW)

        const hiddenEvent = new CustomEvent(EVENT_HIDDEN, {
            bubbles: true,
            detail: { relatedTarget: this._element }
        })
        parent.dispatchEvent(hiddenEvent)
    }

    dispose() {
        this._element.removeEventListener(EVENT_CLICK, this._clickHandler)
        this._element = null
        this._menu = null
    }

    // Private

    _addEventListeners() {
        this._clickHandler = (event) => {
            event.preventDefault()
            event.stopPropagation()
            this.toggle()
        }
        this._element.addEventListener(EVENT_CLICK, this._clickHandler)
    }

    _getMenuElement() {
        const parent = Dropdown._getParentFromElement(this._element)
        if (parent) {
            return parent.querySelector(SELECTOR_MENU)
        }
        return null
    }

    // Static

    static _clearMenus(event) {
        if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH ||
            event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
            return
        }

        const toggles = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE))

        for (let i = 0, len = toggles.length; i < len; i++) {
            const parent = Dropdown._getParentFromElement(toggles[i])
            const context = toggles[i]._dropdown

            if (!context) {
                continue
            }

            const dropdownMenu = context._menu
            if (!parent.classList.contains(CLASS_NAME_SHOW)) {
                continue
            }

            if (event && (event.type === 'click' &&
                /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) &&
                parent.contains(event.target)) {
                continue
            }

            const hideEvent = new CustomEvent(EVENT_HIDE, {
                bubbles: true,
                cancelable: true,
                detail: { relatedTarget: toggles[i] }
            })
            parent.dispatchEvent(hideEvent)

            if (hideEvent.defaultPrevented) {
                continue
            }

            toggles[i].setAttribute('aria-expanded', 'false')

            dropdownMenu.classList.remove(CLASS_NAME_SHOW)
            parent.classList.remove(CLASS_NAME_SHOW)

            const hiddenEvent = new CustomEvent(EVENT_HIDDEN, {
                bubbles: true,
                detail: { relatedTarget: toggles[i] }
            })
            parent.dispatchEvent(hiddenEvent)
        }
    }

    static _getParentFromElement(element) {
        let parent
        const selector = element.getAttribute('data-target')

        if (selector) {
            parent = document.querySelector(selector)
        }

        return parent || element.parentNode
    }

    static _dataApiKeydownHandler(event) {
        if (/input|textarea/i.test(event.target.tagName) ?
            event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE &&
            (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE ||
                event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.which)) {
            return
        }

        if (this.disabled || this.classList.contains(CLASS_NAME_DISABLED)) {
            return
        }

        const parent = Dropdown._getParentFromElement(this)
        const isActive = parent.classList.contains(CLASS_NAME_SHOW)

        if (!isActive && event.which === ESCAPE_KEYCODE) {
            return
        }

        event.preventDefault()
        event.stopPropagation()

        if (!isActive || (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
            if (event.which === ESCAPE_KEYCODE) {
                parent.querySelector(SELECTOR_DATA_TOGGLE).focus()
            }

            this.click()
            return
        }

        const items = [].slice.call(parent.querySelectorAll(SELECTOR_VISIBLE_ITEMS))
            .filter(item => item.offsetParent !== null)

        if (items.length === 0) {
            return
        }

        let index = items.indexOf(event.target)

        if (event.which === ARROW_UP_KEYCODE && index > 0) { // Up
            index--
        }

        if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) { // Down
            index++
        }

        if (index < 0) {
            index = 0
        }

        items[index].focus()
    }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

document.addEventListener('keydown', function (event) {
    const toggles = document.querySelectorAll(SELECTOR_DATA_TOGGLE)
    toggles.forEach(toggle => {
        if (event.target === toggle || toggle.contains(event.target)) {
            Dropdown._dataApiKeydownHandler.call(toggle, event)
        }
    })
})

document.addEventListener('keydown', function (event) {
    const menus = document.querySelectorAll(SELECTOR_MENU)
    menus.forEach(menu => {
        if (menu.contains(event.target)) {
            const toggle = menu.parentNode.querySelector(SELECTOR_DATA_TOGGLE)
            if (toggle) {
                Dropdown._dataApiKeydownHandler.call(toggle, event)
            }
        }
    })
})

document.addEventListener('click', Dropdown._clearMenus)
document.addEventListener('keyup', Dropdown._clearMenus)

document.addEventListener('click', function (event) {
    const toggle = event.target.closest(SELECTOR_DATA_TOGGLE)
    if (toggle) {
        event.preventDefault()
        event.stopPropagation()

        if (!toggle._dropdown) {
            toggle._dropdown = new Dropdown(toggle)
        }
        toggle._dropdown.toggle()
    }
})

document.addEventListener('click', function (event) {
    if (event.target.closest(SELECTOR_FORM_CHILD)) {
        event.stopPropagation()
    }
})

// Initialize dropdowns on page load
window.addEventListener('DOMContentLoaded', function () {
    const dropdownToggles = document.querySelectorAll(SELECTOR_DATA_TOGGLE)
    dropdownToggles.forEach(toggle => {
        if (!toggle._dropdown) {
            toggle._dropdown = new Dropdown(toggle)
        }
    })
})

export default Dropdown
