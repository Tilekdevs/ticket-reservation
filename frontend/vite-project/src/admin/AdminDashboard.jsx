import { useEffect, useState } from 'react'
import EventEditor from './EventEditor'
import AddEventForm from './AddEventForm'

function AdminDashboard() {
	const [events, setEvents] = useState([])

	useEffect(() => {
		fetch('http://localhost:3000/events')
			.then(res => res.json())
			.then(data => setEvents(data))
			.catch(err => console.error('Ошибка загрузки событий:', err))
	}, [])

	const handleAddEvent = newEvent => {
    setEvents(prev => [...prev, newEvent])
  }

	const deleteEvent = id => {
		fetch(`http://localhost:3000/events/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Basic ' + btoa('admin:supersecret'),
			},
		})
			.then(res => {
				if (!res.ok) throw new Error('Ошибка удаления события')
				setEvents(events.filter(e => e.id !== id))
			})
			.catch(err => alert(err.message))
	}

	const cancelBooking = (eventId, seat) => {
		fetch('http://localhost:3000/ticket', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + btoa('admin:supersecret'),
			},
			body: JSON.stringify({ eventId, seat }),
		})
			.then(res => {
				if (!res.ok) throw new Error('Ошибка отмены брони')
				alert(`Бронь места ${seat} отменена`)
			})
			.catch(err => alert(err.message))
	}

	return (
		<div className='p-4'>
			<h1 className='text-xl font-bold mb-4'>Админ панель</h1>
			<AddEventForm onAdd={handleAddEvent} />
			<EventEditor
				events={events}
				setEvents={setEvents}
				onDelete={deleteEvent}
				onCancelBooking={cancelBooking}
			/>
		</div>
	)
}

export default AdminDashboard
