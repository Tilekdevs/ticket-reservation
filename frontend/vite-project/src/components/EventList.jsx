import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventList.scss';

function EventList() {
	const [events, setEvents] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const navigate = useNavigate();

	useEffect(() => {
		fetch('http://localhost:3000/events')
			.then(res => res.json())
			.then(data => setEvents(data))
			.catch(err => console.error('Ошибка загрузки событий:', err));
	}, []);

	const filteredEvents = events.filter(event => {
		const matchesSearch =
			event.name.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory =
			categoryFilter === 'all' || event.category === categoryFilter;

		return matchesSearch && matchesCategory;
	});

	const grouped = {
		Спорт: filteredEvents.filter(
			e => e.category === 'Sport' || e.type === 'Football'
		),
		Кино: filteredEvents.filter(e => e.category === 'Cinema'),
		Мероприятия: filteredEvents.filter(
			e =>
				e.category === 'Event' ||
				e.category === 'Concert' ||
				e.category === 'Theater'
		),
	};

	return (
		<div className="event-container">
			<div className="header">
				<h1>Выберите событие</h1>
				<button className="admin-button" onClick={() => navigate('/admin')}>
					Админка
				</button>
			</div>

			<div className="filters">
				<input
					type="text"
					placeholder="Поиск по названию"
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>

				<select
					value={categoryFilter}
					onChange={e => setCategoryFilter(e.target.value)}
				>
					<option value="all">Все категории</option>
					<option value="Sport">Спорт</option>
					<option value="Cinema">Кино</option>
					<option value="Event">Мероприятия</option>
				</select>
			</div>

			{Object.entries(grouped).map(([groupName, groupEvents]) =>
				groupEvents.length > 0 ? (
					<div key={groupName} className="event-group">
						<h2>{groupName}</h2>
						<div className="event-list">
							{groupEvents.map(event => (
								<div
									key={event.id}
									className="event-card"
									onClick={() => navigate(`/event/${event.id}`)}
								>
									<h3>{event.name}</h3>
									<p>Продано: {event.ticketsSold}</p>
								</div>
							))}
						</div>
					</div>
				) : null
			)}
		</div>
	);
}

export default EventList;
