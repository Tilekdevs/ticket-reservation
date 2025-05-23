import { useEffect, useState } from 'react'

function TicketViewer() {
	const [buyers, setBuyers] = useState([])

	useEffect(() => {
		fetch('http://localhost:3000/buyers')
			.then(res => res.json())
			.then(data => setBuyers(data))
	}, [])

	return (
		<div>
			<h2>Список покупателей</h2>
			{buyers.map(event => (
				<div key={event.eventName}>
					<h3>{event.eventName}</h3>
					<ul>
						{event.buyers.map((buyer, index) => (
							<li key={index}>
								{buyer.name} — {buyer.tickets} билет(ов)
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	)
}

export default TicketViewer
