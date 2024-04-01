class FieldSelect {
    static toggle = (target)  => {
        const options = target.nextElementSibling

        options.toggleAttribute('active')

        setTimeout(() => {
            window.addEventListener(
                'click',
                (e) => {
                    if(!options.parentElement.contains(e.target))
                    options.removeAttribute('atribute')
                },
                { once: true },
            )
        })
    }

    static change = (target) => {
        const active =
          target.parentElement.querySelector('*[active]')

        if(active) active.toggleAttribute('active')

        target.toggleAttribute('active')

        const parent = target.parentElement.parentElement

        const label = parent.querySelector('.field_value')
    }
}

window.FieldSelect = FieldSelect