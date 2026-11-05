import "./button.css"

type Variant = "normal" | "small" | "medium" | "large"
type Emphasis = "primary" | "secondary"

type ButtonProps = {
    variant: Variant
    emphasis?: Emphasis
    pressed?: boolean
    label?: string
    icon?: string
    action?: () => void
    href?: string
    newTab?: boolean
    download?: boolean
}

const variantClasses: Record<Variant, string> = {
    normal: "button",
    small: "button button-small",
    medium: "button button-medium",
    large: "button button-large",
}

const emphasisClasses: Record<Emphasis, string> = {
    primary: "button-primary",
    secondary: "button-secondary",
}

function Button({variant, emphasis, pressed, label, icon, action, href, newTab, download}: ButtonProps) {
    const className =
        variantClasses[variant] +
        (emphasis ? " " + emphasisClasses[emphasis] : "") +
        (pressed ? " bevel-sunken" : " bevel-raised")

    if (href) {
        return (
            <a className={className} href={href}
               target={newTab ? "_blank" : undefined}
               rel={newTab ? "noopener noreferrer" : undefined}
               download={download || undefined}>
                {icon && <img src={icon} alt=""/>}
                {label}
            </a>
        )
    }

    return (
        <button className={className} onClick={action}>
            {icon && <img src={icon} alt=""/>}
            {label}
        </button>
    )
}

export default Button
