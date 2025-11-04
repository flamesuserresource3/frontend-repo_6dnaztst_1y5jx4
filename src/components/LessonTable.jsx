import { CheckCircle2, XCircle, Clock, BookOpen, Edit } from "lucide-react";

function StatusBadge({ status }) {
  const map = {
    completed: { label: "Completed", cls: "bg-green-50 text-green-700 border-green-200" },
    missed: { label: "Missed", cls: "bg-red-50 text-red-700 border-red-200" },
    planned: { label: "Planned", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  };
  const d = map[status] || { label: status, cls: "bg-gray-50 text-gray-700 border-gray-200" };
  const Icon = status === "completed" ? CheckCircle2 : status === "missed" ? XCircle : Clock;
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs ${d.cls}`}>
      <Icon className="h-3.5 w-3.5" /> {d.label}
    </span>
  );
}

export default function LessonTable({ lessons, onEdit }) {
  const sorted = [...lessons].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Lessons & Homework</h3>
        <div className="text-xs text-gray-500">Responsive table</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left font-medium px-4 py-2 whitespace-nowrap">Date</th>
              <th className="text-left font-medium px-4 py-2">Topic</th>
              <th className="text-left font-medium px-4 py-2 whitespace-nowrap">Status</th>
              <th className="text-left font-medium px-4 py-2">Homework</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-800">
            {sorted.map((l) => (
              <tr key={l.date} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{l.date}</td>
                <td className="px-4 py-2 max-w-[260px]"><div className="truncate" title={l.topic}>{l.topic || "—"}</div></td>
                <td className="px-4 py-2 whitespace-nowrap"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className={`h-4 w-4 ${l.homework?.assigned ? "text-indigo-600" : "text-gray-300"}`} />
                    {l.homework?.assigned ? (
                      <span className="text-gray-700 truncate max-w-[220px]" title={l.homework.assigned}>{l.homework.assigned}</span>
                    ) : (
                      <span className="text-gray-400">No homework</span>
                    )}
                    {l.homework?.assigned && (
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded border ${l.homework.submitted ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
                        {l.homework.submitted ? "Submitted" : "Not submitted"}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => onEdit(l.date)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No lessons yet. Click a date on the calendar to add one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
