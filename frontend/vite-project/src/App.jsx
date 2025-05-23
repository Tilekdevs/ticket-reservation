import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import AdminDashboard from './admin/AdminDashboard'
import EventList from './components/EventList'
import TicketApp from './components/TicketApp'

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<EventList />} />
				<Route path='/event/:eventId' element={<TicketApp />} />
				<Route path='/admin' element={<AdminDashboard />} />
			</Routes>
		</Router>
	)
}

export default App
