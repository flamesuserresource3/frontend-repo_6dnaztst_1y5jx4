import { Plus, Edit } from "lucide-react";

export default function ClassList({ classes, selectedId, onSelect, onAdd, onEdit }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Classes</h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <ul className="divide-y">
        {classes.map((c) => (
          <li key={c.id} className="flex items-center justify-between py-2">
            <button
              onClick={() => onSelect(c.id)}
              className={`text-left flex-1 px-2 py-1 rounded-md hover:bg-gray-50 ${selectedId === c.id ? "bg-indigo-50 text-indigo-700" : "text-gray-800"}`}
            >
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500">{c.students} students</div>
            </button>
            <button
              onClick={() => onEdit(c)}
              className="ml-2 h-8 w-8 grid place-items-center rounded-md border hover:bg-gray-50 text-gray-600"
              aria-label="Edit class"
            >
              <Edit className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
