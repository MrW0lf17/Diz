import { ButtonHTMLAttributes, ElementType, ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'

type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

type PolymorphicButtonProps<E extends ElementType> = ButtonBaseProps & {
  as?: E
} & Omit<ComponentPropsWithoutRef<E>, keyof ButtonBaseProps>

const defaultElement = 'button'

const Button = <E extends ElementType = typeof defaultElement>({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  as,
  disabled,
  ...props
}: PolymorphicButtonProps<E>) => {
  const Component = as || defaultElement

  return (
    <Component
      className={clsx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark',
        {
          // Variants
          'bg-secondary text-white hover:bg-accent focus:ring-secondary':
            variant === 'primary',
          'bg-accent text-white hover:bg-secondary focus:ring-accent':
            variant === 'secondary',
          'border-2 border-secondary text-light hover:bg-secondary/10 focus:ring-secondary':
            variant === 'outline',
          'text-light hover:bg-secondary/10 focus:ring-secondary':
            variant === 'ghost',
          
          // Sizes
          'text-sm px-3 py-1.5': size === 'sm',
          'px-4 py-2': size === 'md',
          'text-lg px-6 py-3': size === 'lg',
          
          // States
          'opacity-50 cursor-not-allowed': disabled || isLoading,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </Component>
  )
}

export default Button 