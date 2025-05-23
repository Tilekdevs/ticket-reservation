/* eslint-disable react/prop-types */
import { useState } from 'react'

function AddEventForm({ onAdd }) {
	const [name, setName] = useState('')
	const [type, setType] = useState('Stage')
	const [category, setCategory] = useState('Event')

	const handleSubmit = async e => {
		e.preventDefault()
		if (!name || !type || !category) return alert('Все поля обязательны')

		const res = await fetch('http://localhost:3000/events', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + btoa('admin:supersecret'),
			},
			body: JSON.stringify({ name, type, category }),
		})

		if (!res.ok) {
			const err = await res.json()
			return alert('Ошибка: ' + err.error)
		}

		const newEvent = await res.json()
		onAdd(newEvent)
		setName('')
	}

	return (
		<form onSubmit={handleSubmit} className='event-form'>
			<input
				value={name}
				onChange={e => setName(e.target.value)}
				placeholder='Название события'
			/>
			<select value={type} onChange={e => setType(e.target.value)}>
				<option value='Stage'>Stage</option>
				<option value='Field'>Field</option>
				<option value='Hall'>Hall</option>
			</select>
			<select value={category} onChange={e => setCategory(e.target.value)}>
				<option value='Event'>Event</option>
				<option value='Sport'>Sport</option>
				<option value='Cinema'>Cinema</option>
			</select>
			<button type='submit'>Добавить</button>
		</form>
	)
}

export default AddEventForm
