/* eslint-disable react/prop-types */
import { Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import './EventEditor.scss'

function EventEditor({ events, onDelete, onCancelBooking }) {
	const [selectedEvent, setSelectedEvent] = useState(null)
	const [buyers, setBuyers] = useState([])

	useEffect(() => {
		if (selectedEvent) {
			fetch(`http://localhost:3000/buyers`)
				.then(res => res.json())
				.then(data => {
					const found = data.find(d => d.eventName === selectedEvent.name)
					setBuyers(found ? found.buyers : [])
				})
				.catch(err => console.error('Ошибка загрузки покупателей:', err))
		}
	}, [selectedEvent])

	const closeModal = () => {
		setSelectedEvent(null)
		setBuyers([])
	}

	return (
		<>
			<h2 className='event-editor__title'>Список событий</h2>

			<div className='event-editor__grid'>
				{events.map(event => (
					<div
						key={event.id}
						className='event-card'
						onClick={() => setSelectedEvent(event)}
						tabIndex={0}
						role='button'
						onKeyDown={e =>
							e.key === 'Enter' ? setSelectedEvent(event) : null
						}
					>
						<div className='event-card__info'>
							<h3 className='event-card__name'>{event.name}</h3>
							<p className='event-card__type'>{event.type}</p>
						</div>
						<button
							className='event-card__delete-btn'
							onClick={e => {
								e.stopPropagation()
								if (window.confirm(`Удалить событие "${event.name}"?`)) {
									onDelete(event.id)
									if (selectedEvent?.id === event.id) closeModal()
								}
							}}
							aria-label={`Удалить событие ${event.name}`}
							title='Удалить событие'
						>
							<Trash2 size={18} />
						</button>
					</div>
				))}
			</div>

			{selectedEvent && (
				<div
					className='modal'
					onClick={closeModal}
					role='dialog'
					aria-modal='true'
				>
					<div className='modal__content' onClick={e => e.stopPropagation()}>
						<button
							className='modal__close-btn'
							onClick={closeModal}
							aria-label='Закрыть модалку'
						>
							<X size={24} />
						</button>

						<h3 className='modal__title'>
							Событие:{' '}
							<span className='modal__event-name'>{selectedEvent.name}</span>
						</h3>

						{buyers.length === 0 ? (
							<p className='modal__empty'>Нет покупателей.</p>
						) : (
							<ul className='buyers-list'>
								{buyers.map(buyer => (
									<li key={buyer.name} className='buyers-list__item'>
										<span className='buyers-list__text'>
											{buyer.name} — {buyer.tickets} билет(ов)
										</span>
										<button
											className='buyers-list__cancel-btn'
											onClick={() => {
												const seat = prompt(
													`Введите место для отмены (например: A1):`,
												)
												if (seat) onCancelBooking(selectedEvent.id, seat)
											}}
											title='Отменить бронь'
											aria-label={`Отменить бронь места у ${buyer.name}`}
										>
											Отменить бронь
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			)}
		</>
	)
}

export default EventEditor
