import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full p-3 rounded-lg bg-gray-800 text-light border transition-colors',
            'focus:outline-none focus:ring-1',
            {
              'border-gray-700 focus:border-primary focus:ring-primary':
                !error,
              'border-red-500 focus:border-red-500 focus:ring-red-500':
                error,
            },
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input 