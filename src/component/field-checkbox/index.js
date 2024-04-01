class FieldCheckbox {
    static toggle = (target) => {
        target.toggleAttribute('active')
    }
}

window.FieldCheckbox = FieldCheckbox