import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";

// Підхоплюємо з .env, або дефолт
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SeatSelection() {
  const { sessionId, time } = useParams();      
  const { state } = useLocation();
  const navigate = useNavigate();
  const { poster, title } = state || {};

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(
    format(today, "yyyy-MM-dd")
  );
  const [selectedSeats, setSelectedSeats] = useState([]);

  // 7 днів вперед
  const next7Days = Array.from({ length: 7 }, (_, i) =>
    format(addDays(today, i), "yyyy-MM-dd")
  );

  const toggleSeat = (row, seat) => {
    const key = `${row}-${seat}`;
    setSelectedSeats(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // якщо неавторизовані, кидаємо на логін
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API}/api/admin/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          session: sessionId,
          date: selectedDate,
          time,
          seats: selectedSeats,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || res.statusText);
      }

      alert(`Квитки успішно заброньовано! Номер броні: ${data._id}`);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Не вдалося забронювати квитки: " + err.message);
    }
  };

  return (
    <div className="ml-[290px] p-10 text-gray-900 dark:text-white">
      {/* Заголовок і постер */}
      <div className="flex gap-6 items-start mb-10">
        <img
          src={`https://image.tmdb.org/t/p/w200${poster}`}
          alt={title}
          className="rounded w-[120px] h-auto"
        />
        <div>
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          <div className="mb-4">
            <div className="text-base font-semibold mb-2">Оберіть дату:</div>
            <div className="flex flex-wrap gap-2">
              {next7Days.map(dateStr => (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                    selectedDate === dateStr
                      ? "bg-purple-600 text-white border-purple-600 shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {format(new Date(dateStr), "dd.MM")}
                </button>
              ))}
            </div>
            <div className="mt-4 text-base">
              <span className="font-semibold">Час:</span> {time}
            </div>
          </div>
        </div>
      </div>

      {/* Екран */}
      <div className="text-center mb-6">
        <div className="h-[2px] bg-black dark:bg-white w-full max-w-xl mx-auto mb-1" />
        <div className="text-sm font-semibold">ЕКРАН</div>
      </div>

      {/* Партер */}
      <div className="flex flex-col items-center gap-1">
        {[...Array(6)].map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-1">
            {[...Array(12)].map((_, seatIdx) => {
              const key = `R${rowIdx}-${seatIdx}`;
              const sel = selectedSeats.includes(key);
              return (
                <div
                  key={seatIdx}
                  onClick={() => toggleSeat(`R${rowIdx}`, seatIdx)}
                  className={`w-6 h-6 rounded cursor-pointer border border-blue-400 transition ${
                    sel ? "bg-blue-400" : "hover:bg-blue-400"
                  }`}
                />
              );
            })}
          </div>
        ))}

        {/* VIP ряди */}
        <div className="flex gap-2 mt-4 flex-wrap justify-center">
          {[...Array(14)].map((_, i) => {
            const key = `VIP-${i}`;
            const sel = selectedSeats.includes(key);
            return (
              <div
                key={i}
                onClick={() => toggleSeat("VIP", i)}
                className={`w-6 h-6 rounded cursor-pointer border border-red-500 transition ${
                  sel ? "bg-red-500" : "hover:bg-red-500"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Кнопка бронювання */}
      {selectedSeats.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleBooking}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Забронювати ({selectedSeats.length})
          </button>
        </div>
      )}
    </div>
  );
}
