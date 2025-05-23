/* eslint-disable react/prop-types */

function EventTable({ events, onDelete }) {
	return (
		<table>
			<thead>
				<tr>
					<th>Название</th>
					<th>Тип</th>
					<th>Категория</th>
					<th>Продано</th>
					<th>Действия</th>
				</tr>
			</thead>
			<tbody>
				{events.map(event => (
					<tr key={event.id}>
						<td>{event.name}</td>
						<td>{event.type}</td>
						<td>{event.category}</td>
						<td>{event.ticketsSold}</td>
						<td>
							<button onClick={() => onDelete(event.id)}>Удалить</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default EventTable
