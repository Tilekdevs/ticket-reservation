const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.json())

const ADMIN_PASSWORD = 'supersecret'

function adminAuth(req, res, next) {
	const authHeader = req.headers['authorization']
	if (!authHeader) return res.status(401).json({ error: 'Unauthorized' })

	const token = authHeader.split(' ')[1]
	const decoded = Buffer.from(token, 'base64').toString()
	const [user, pass] = decoded.split(':')

	if (user === 'admin' && pass === ADMIN_PASSWORD) {
		next()
	} else {
		res.status(401).json({ error: 'Unauthorized' })
	}
}

let tickets = {}
let events = [
	{
		id: 1,
		name: 'Концерт Imagine Dragons',
		ticketsSold: 0,
		type: 'Stage',
		category: 'Event',
	},
	{
		id: 2,
		name: 'Футбольный матч',
		ticketsSold: 0,
		type: 'Field',
		category: 'Sport',
	},
	{
		id: 3,
		name: 'Театральная постановка',
		ticketsSold: 0,
		type: 'Stage',
		category: 'Event',
	},
	{
		id: 4,
		name: 'Концерт Мирбек Атабеков',
		ticketsSold: 0,
		type: 'Stage',
		category: 'Event',
	},

	{
		id: 5,
		name: 'КиноФильм Формула-1',
		ticketsSold: 0,
		type: 'Hall',
		category: 'Cinema',
	},
	{
		id: 6,
		name: 'Фильм Пила 66',
		ticketsSold: 0,
		type: 'Hall',
		category: 'Cinema',
	},
	{
		id: 7,
		name: 'Фильм Барби',
		ticketsSold: 0,
		type: 'Hall',
		category: 'Cinema',
	},
	{
		id: 8,
		name: 'Фильм Оппенгеймер',
		ticketsSold: 0,
		type: 'Hall',
		category: 'Cinema',
	},

	{
		id: 9,
		name: 'Матч Реал - Барселона',
		ticketsSold: 0,
		type: 'Field',
		category: 'Sport',
	},
	{
		id: 10,
		name: 'Финал Лиги Чемпионов',
		ticketsSold: 0,
		type: 'Field',
		category: 'Sport',
	},

	{
		id: 11,
		name: 'Stand-up шоу',
		ticketsSold: 0,
		type: 'Stage',
		category: 'Event',
	},
	{
		id: 12,
		name: 'Балет Лебединое Озеро',
		ticketsSold: 0,
		type: 'Stage',
		category: 'Event',
	},
]

let logs = []

function logAction(action, data) {
	logs.push({ timestamp: new Date(), action, data })
}

app.get('/events', (req, res) => {
	res.json(events)
})

app.get('/booked-seats', (req, res) => {
	const eventId = Number(req.query.eventId)
	if (!eventId || !tickets[eventId]) {
		return res.json([])
	}
	const bookedSeats = tickets[eventId].map(ticket => ticket.seat)
	res.json(bookedSeats)
})

app.post('/buy', (req, res) => {
	const { name, eventId, seat } = req.body

	const event = events.find(e => e.id === eventId)
	if (!name || !event || !seat) {
		return res.status(400).json({ error: 'Некорректные данные' })
	}

	if (!tickets[eventId]) tickets[eventId] = []

	if (tickets[eventId].some(ticket => ticket.seat === seat)) {
		return res.status(400).json({ error: 'Место уже занято' })
	}

	event.ticketsSold++

	const ticket = {
		id: tickets[eventId].length + 1,
		name,
		eventId,
		seat,
		date: new Date().toISOString(),
	}

	tickets[eventId].push(ticket)

	res.status(201).json(ticket)
})

app.post('/events', adminAuth, (req, res) => {
	const { name, type, category } = req.body
	if (!name || !type || !category) {
		return res.status(400).json({ error: 'Неверные данные' })
	}

	const newEvent = {
		id: events.length + 1,
		name,
		type,
		category,
		ticketsSold: 0,
	}

	events.push(newEvent)
	logAction('create_event', newEvent)
	res.status(201).json(newEvent)
})

app.get('/booked-seats', (req, res) => {
	const eventId = Number(req.query.eventId)
	if (!eventId || !tickets[eventId]) {
		return res.json([])
	}
	const bookedSeats = tickets[eventId].map(ticket => ticket.seat)
	res.json(bookedSeats)
})

app.delete('/ticket', adminAuth, (req, res) => {
	const { eventId, seat } = req.body
	if (!tickets[eventId]) return res.status(404).json({ error: 'Нет билетов' })
	const index = tickets[eventId].findIndex(t => t.seat === seat)
	if (index === -1) return res.status(404).json({ error: 'Место не найдено' })
	const removed = tickets[eventId].splice(index, 1)[0]
	events.find(e => e.id === eventId).ticketsSold -= 1
	logAction('delete', removed)
	res.status(200).json({ success: true })
})

app.delete('/events/:id', adminAuth, (req, res) => {
	const eventId = Number(req.params.id)
	const eventIndex = events.findIndex(e => e.id === eventId)
	if (eventIndex === -1) {
		return res.status(404).json({ error: 'Событие не найдено' })
	}
	events.splice(eventIndex, 1)
	delete tickets[eventId]
	res.json({ success: true })
})

app.get('/stats', (req, res) => {
	res.json(
		events.map(event => ({
			name: event.name,
			ticketsSold: event.ticketsSold,
		})),
	)
})

app.get('/buyers', (req, res) => {
	const buyersPerEvent = events.map(event => {
		const eventTickets = tickets[event.id] || []
		const buyersMap = {}
		for (const ticket of eventTickets) {
			buyersMap[ticket.name] = (buyersMap[ticket.name] || 0) + 1
		}
		return {
			eventName: event.name,
			buyers: Object.entries(buyersMap).map(([name, count]) => ({
				name,
				tickets: count,
			})),
		}
	})
	res.json(buyersPerEvent)
})

app.get('/export', adminAuth, (req, res) => {
	const exportData = []
	for (const [eventId, ticketList] of Object.entries(tickets)) {
		for (const ticket of ticketList) {
			exportData.push({
				event: events.find(e => e.id === ticket.eventId).name,
				name: ticket.name,
				seat: ticket.seat,
				date: ticket.date,
			})
		}
	}
	res.json(exportData)
})

app.get('/logs', adminAuth, (req, res) => {
	res.json(logs)
})

app.get('/logs', (req, res) => {
	res.json([])
})

const PORT = 3000
app.listen(PORT, () => {
	console.log(`Сервер запущен на порту ${PORT}`)
})
