import React from 'react'

// Components
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';

type Props = {}

const Footer = (props: Props) => {
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();

	return (
		<div className="flex justify-between align-middle p-2 text-sm">
			<div className="flex justify-center flex-grow">© Copyright {currentYear}</div>
			<ThemeToggle />
		</div>
	)
}

export default Footer