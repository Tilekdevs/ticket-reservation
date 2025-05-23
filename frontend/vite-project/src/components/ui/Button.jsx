/* eslint-disable react/prop-types */
import clsx from 'clsx'

export function Button({
	children,
	variant = 'default',
	size = 'md',
	className,
	...props
}) {
	const baseStyles =
		'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

	const variants = {
		default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
		outline:
			'border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
		destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
	}

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-5 py-3 text-lg',
	}

	return (
		<button
			className={clsx(baseStyles, variants[variant], sizes[size], className)}
			{...props}
		>
			{children}
		</button>
	)
}
