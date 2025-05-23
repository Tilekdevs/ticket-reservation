/* eslint-disable react/prop-types */

export function Card({ children, className }) {
	return (
		<div
			className={`bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden ${
				className || ''
			}`}
		>
			{children}
		</div>
	)
}

export function CardContent({ children, className }) {
	return <div className={`p-4 ${className || ''}`}>{children}</div>
}
