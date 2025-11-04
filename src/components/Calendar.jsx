import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function startOfWeek(date) {
  // Sunday start
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Calendar({ month, setMonth, lessonsByDate, onDayClick }) {
  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);
  const gridStart = startOfWeek(firstDay);
  const totalDays = Math.ceil((lastDay - gridStart) / (1000 * 60 * 60 * 24)) + 1; // inclusive
  const weeks = Math.ceil(totalDays / 7);

  const today = new Date();
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <h2 className="font-semibold text-gray-900">
            {month.toLocaleString("default", { month: "long" })} {month.getFullYear()}
          </h2>
          <p className="text-xs text-gray-500">Click a date to add/edit lesson</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-xs text-gray-500 px-4 pt-3">
        {weekdayLabels.map((d) => (
          <div key={d} className="text-center pb-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {Array.from({ length: weeks * 7 }).map((_, idx) => {
          const dayDate = addDays(gridStart, idx);
          const isCurrMonth = dayDate.getMonth() === month.getMonth();
          const iso = formatISODate(dayDate);
          const lesson = lessonsByDate[iso];
          const isToday = isSameDay(dayDate, today);

          const statusColor = lesson?.status === "completed"
            ? "bg-green-100 text-green-700 border-green-200"
            : lesson?.status === "missed"
            ? "bg-red-100 text-red-700 border-red-200"
            : lesson?.status === "planned"
            ? "bg-amber-100 text-amber-700 border-amber-200"
            : "";

          return (
            <button
              key={idx}
              onClick={() => onDayClick(dayDate)}
              className={classNames(
                "relative min-h-[84px] bg-white p-2 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500",
                !isCurrMonth && "bg-gray-50 text-gray-400",
                isToday && "ring-2 ring-indigo-500",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{dayDate.getDate()}</span>
                {lesson?.homework?.submitted ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">HW ✓</span>
                ) : lesson?.homework?.assigned ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">HW</span>
                ) : null}
              </div>
              {lesson && (
                <div className={classNames("mt-2 inline-flex items-center gap-1 rounded border px-2 py-1 text-xs", statusColor)}>
                  {lesson.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {lesson.status === "missed" && <XCircle className="h-3.5 w-3.5" />}
                  {lesson.status === "planned" && <Clock className="h-3.5 w-3.5" />}
                  <span className="truncate">{lesson.topic || lesson.status}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
