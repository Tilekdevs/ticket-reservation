/* eslint-disable react/prop-types */
import './SeatLayout.scss';

const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
const seatsPerRow = 6;

function StageLayout({ bookedSeats, onSeatClick }) {
  return (
    <div className="seat-layout stage-layout">
      {rows.map(row => (
        <div key={row} className="seat-row">
          {Array(seatsPerRow).fill(null).map((_, i) => {
            const seatId = `${row}${i + 1}`;
            const isBooked = bookedSeats.includes(seatId);

            return (
              <button
                key={seatId}
                className={`seat ${isBooked ? 'booked' : 'available'}`}
                onClick={() => !isBooked && onSeatClick(seatId)}
                disabled={isBooked}
              >
                {seatId}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default StageLayout;
