import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './EventList.scss'

function EventList() {
	const [events, setEvents] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		fetch('http://localhost:3000/events')
			.then(res => res.json())
			.then(data => setEvents(data))
			.catch(err => console.error('Ошибка загрузки событий:', err))
	}, [])

	const grouped = {
		Спорт: events.filter(e => e.category === 'Sport' || e.type === 'Football'),
		Кино: events.filter(e => e.category === 'Cinema'),
		Мероприятия: events.filter(
			e =>
				e.category === 'Event' ||
				e.category === 'Concert' ||
				e.category === 'Theater',
		),
	}

	return (
		<div className='event-container'>
			<div className='header'>
				<h1>Выберите событие</h1>
				<button className='admin-button' onClick={() => navigate('/admin')}>
					Админка
				</button>
			</div>

			{Object.entries(grouped).map(([groupName, groupEvents]) => (
				<div key={groupName} className='event-group'>
					<h2>{groupName}</h2>
					<div className='event-list'>
						{groupEvents.map(event => (
							<div
								key={event.id}
								className='event-card'
								onClick={() => navigate(`/event/${event.id}`)}
							>
								<h3>{event.name}</h3>
								<p>Продано: {event.ticketsSold}</p>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}

export default EventList
