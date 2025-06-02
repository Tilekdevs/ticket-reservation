import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import HallLayout from './layout/HallLayout'
import StageLayout from './layout/StageLayout'
import './TicketApp.scss'

function TicketApp() {
	const { eventId } = useParams()
	const navigate = useNavigate()

	const [event, setEvent] = useState(null)
	const [bookedSeats, setBookedSeats] = useState([])
	const [isModalOpen, setModalOpen] = useState(false)
	const [selectedSeat, setSelectedSeat] = useState(null)
	const [name, setName] = useState('')

	useEffect(() => {
		fetch(`http://localhost:3000/events`)
			.then(res => res.json())
			.then(data => {
				const foundEvent = data.find(e => e.id === Number(eventId))
				setEvent(foundEvent)
			})
			.catch(err => console.error('Ошибка загрузки события:', err))

		fetch(`http://localhost:3000/booked-seats?eventId=${eventId}`)
			.then(res => res.json())
			.then(data => setBookedSeats(data))
			.catch(err => console.error('Ошибка загрузки мест:', err))
	}, [eventId])

	const openModal = seatId => {
		if (bookedSeats.includes(seatId)) return
		setSelectedSeat(seatId)
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
		setSelectedSeat(null)
		setName('')
	}

	const bookSeat = () => {
		if (!name) {
			alert('Введите имя!')
			return
		}
		if (selectedSeat === null) {
			alert('Выберите место!')
			return
		}

		fetch('http://localhost:3000/buy', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name,
				eventId: Number(eventId),
				seat: selectedSeat,
			}),
		})
			.then(res => {
				if (!res.ok) throw new Error('Ошибка бронирования!')
				return res.json()
			})
			.then(data => {
				alert(`Место ${selectedSeat} забронировано на имя ${data.name}`)
				setBookedSeats([...bookedSeats, selectedSeat])
				closeModal()
			})
			.catch(err => alert(err.message))
	}

	const cancelBooking = seat => {
		if (!window.confirm(`Отменить бронь места ${seat}?`)) return

		fetch('http://localhost:3000/ticket', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Basic ' + btoa('admin:supersecret'),
			},
			body: JSON.stringify({ eventId: Number(eventId), seat }),
		})
			.then(res => {
				if (!res.ok) throw new Error('Ошибка отмены брони')
				setBookedSeats(bookedSeats.filter(s => s !== seat))
				alert(`Бронь места ${seat} отменена`)
			})
			.catch(err => alert(err.message))
	}

	return (
		<div className='container' style={{ padding: 20 }}>
			<button onClick={() => navigate('/')}>Назад</button>
			{event ? <h1>{event.name}</h1> : <h1>Загрузка...</h1>}

			{event &&
				(event.type === 'Stage' ? (
					<StageLayout
						bookedSeats={bookedSeats}
						onSeatClick={openModal}
						onCancelBooking={cancelBooking}
					/>
				) : (
					<HallLayout
						bookedSeats={bookedSeats}
						onSeatClick={openModal}
						onCancelBooking={cancelBooking}
					/>
				))}

			{isModalOpen && (
				<div className='modal-overlay'>
					<div className='modal-content'>
						<h2>Бронирование места {selectedSeat}</h2>
						<input
							type='text'
							placeholder='Ваше имя'
							value={name}
							onChange={e => setName(e.target.value)}
							style={{ width: '95%', padding: 8, marginBottom: 12 }}
						/>
						<button onClick={bookSeat} style={{ marginRight: 10 }}>
							Забронировать
						</button>
						<button onClick={closeModal}>Отмена</button>
					</div>
				</div>
			)}

			<div className='legend' style={{ marginTop: 20 }}>
				<div>
					<span className='legend-box available'></span> Свободное место
				</div>
				<div>
					<span className='legend-box booked'></span> Забронировано
				</div>
			</div>
		</div>
	)
}

export default TicketApp
