export const REG_EXP_EMAIL = new ReqExp(
   /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
)

export const REG_EXP_PASSWORD = new ReqExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
)

export class Form {
    FIELD_NAME = {}
    FIELD_ERROR = {}

    value = {}
    error = {}
    disabled = false

    change = (name, value) => {
        const error = this.validate(name, value)
        this.value[name] = value

        if (error) {
            this.setError(name, error)
            this.error[name] = error
        } else {
            this.setError(name, null)
            delete this.error[name]
        }
    }

    setError = (name, error) => {
        const span = document.querySelector(
            `.form_error[name="${name}"]`,
        )

        const field = document.querySelector(
            `.validation[name="${name}"]`,
        )

        if (span) {
            span.classList.toggle(
                '.form_error--active',
                Boolean(error)
            )
            span.innerText = error || ''
        }

        if (field) {
            field.classList.toggle(
                'validation--active',
                Boolean(error),
            )
        }
    }

    chackDisabled = () => {
       let disabled = false

       Object.values(this.FIELD_NAME).forEach((name) => {
        const error = this.validate(name, this.value[name])

        if (error) {
            this.setError(name, error)
            disabled = true
        }
       })

       const el = document.querySelector(`.button`)

       if (el) {
         el.classList.toggle(
            'button--disabled',
            Boolean(disabled),
         )
       }

       this.disabled = disabled
    }

    validateAll = () => {
        let disabled = false

        Object.values(this.FIELD_NAME).forEach((name) => {
            const error = this.validate(name, this.value[name])

            if(error) {
                this.setError(name, error)
                disabled = true
            }
        })

        this.disabled = disabled
    }
}
