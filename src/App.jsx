import { useMemo, useState } from "react";
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import ClassList from "./components/ClassList";
import LessonTable from "./components/LessonTable";
import Modal from "./components/Modal";
import { Check, X } from "lucide-react";

function iso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const seed = () => {
  const today = new Date();
  const d1 = new Date(today.getFullYear(), today.getMonth(), Math.max(1, today.getDate() - 3));
  const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const d3 = new Date(today.getFullYear(), today.getMonth(), Math.min(new Date(today.getFullYear(), today.getMonth()+1,0).getDate(), today.getDate() + 3));
  return [
    {
      id: "c1",
      name: "Grade 7A - English",
      students: 24,
      lessons: [
        { date: iso(d1), status: "completed", topic: "Past Simple vs. Past Continuous", homework: { assigned: "Workbook p.12-13", submitted: true } },
        { date: iso(d2), status: "planned", topic: "Storytelling with Sequencers", homework: { assigned: "Prepare a 1-min story", submitted: false } },
      ],
    },
    {
      id: "c2",
      name: "Grade 8B - Math",
      students: 27,
      lessons: [
        { date: iso(d2), status: "missed", topic: "Linear Equations Review", homework: { assigned: "Khan Academy set A", submitted: false } },
        { date: iso(d3), status: "planned", topic: "Systems of Equations", homework: { assigned: "Worksheet 5", submitted: false } },
      ],
    },
  ];
};

export default function App() {
  const [classes, setClasses] = useState(seed());
  const [selectedId, setSelectedId] = useState(classes[0]?.id);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const selectedClass = useMemo(() => classes.find((c) => c.id === selectedId) || classes[0], [classes, selectedId]);
  const lessonsByDate = useMemo(() => {
    const map = {};
    if (selectedClass) {
      for (const l of selectedClass.lessons) map[l.date] = l;
    }
    return map;
  }, [selectedClass]);

  const [lessonModal, setLessonModal] = useState({ open: false, date: null });
  const [classModal, setClassModal] = useState({ open: false, editing: null });

  const openLessonModal = (dateObjOrIso) => {
    const date = typeof dateObjOrIso === "string" ? dateObjOrIso : iso(dateObjOrIso);
    setLessonModal({ open: true, date });
  };

  const upsertLesson = (payload) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== selectedClass.id) return c;
        const exists = c.lessons.find((l) => l.date === payload.date);
        let lessons;
        if (exists) {
          lessons = c.lessons.map((l) => (l.date === payload.date ? { ...exists, ...payload } : l));
        } else {
          lessons = [...c.lessons, payload];
        }
        return { ...c, lessons };
      })
    );
  };

  const addClass = (name, students) => {
    const id = `c${Math.random().toString(36).slice(2, 7)}`;
    setClasses((p) => [...p, { id, name, students: Number(students) || 0, lessons: [] }]);
    setSelectedId(id);
  };
  const updateClass = (id, patch) => {
    setClasses((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Header title="Lesson Planner" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ClassList
              classes={classes}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onAdd={() => setClassModal({ open: true, editing: null })}
              onEdit={(c) => setClassModal({ open: true, editing: c })}
            />
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-sm text-indigo-800">
                Tip: Click any date on the calendar to quickly add or edit a lesson and homework. Status colors help you see progress at a glance.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Calendar month={month} setMonth={setMonth} lessonsByDate={lessonsByDate} onDayClick={openLessonModal} />
            <LessonTable lessons={selectedClass?.lessons || []} onEdit={openLessonModal} />
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Teacher Tools</span>
          <span>Built for clarity and speed</span>
        </div>
      </footer>

      {/* Lesson modal */}
      <Modal
        open={lessonModal.open}
        title={`Lesson on ${lessonModal.date || ""}`}
        onClose={() => setLessonModal({ open: false, date: null })}
        onSubmit={() => {
          const form = document.getElementById("lesson-form");
          const fd = new FormData(form);
          const payload = {
            date: lessonModal.date,
            status: fd.get("status") || "planned",
            topic: fd.get("topic")?.toString().trim() || "",
            homework: {
              assigned: fd.get("homework")?.toString().trim() || "",
              submitted: fd.get("submitted") === "on",
            },
          };
          upsertLesson(payload);
          setLessonModal({ open: false, date: null });
        }}
        submitLabel="Save lesson"
      >
        <form id="lesson-form" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" defaultValue={lessonsByDate[lessonModal.date]?.status || "planned"} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                <option value="planned">Planned</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input name="topic" defaultValue={lessonsByDate[lessonModal.date]?.topic || ""} placeholder="e.g., Fractions practice" className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Homework</label>
            <input name="homework" defaultValue={lessonsByDate[lessonModal.date]?.homework?.assigned || ""} placeholder="e.g., Worksheet 3" className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="submitted" defaultChecked={Boolean(lessonsByDate[lessonModal.date]?.homework?.submitted)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            Homework submitted
          </label>
        </form>
      </Modal>

      {/* Class modal */}
      <Modal
        open={classModal.open}
        title={classModal.editing ? "Edit class" : "Add new class"}
        onClose={() => setClassModal({ open: false, editing: null })}
        onSubmit={() => {
          const form = document.getElementById("class-form");
          const fd = new FormData(form);
          const name = fd.get("name")?.toString().trim() || "Untitled";
          const students = Number(fd.get("students")) || 0;
          if (classModal.editing) {
            updateClass(classModal.editing.id, { name, students });
          } else {
            addClass(name, students);
          }
          setClassModal({ open: false, editing: null });
        }}
        submitLabel={classModal.editing ? "Save changes" : "Add class"}
      >
        <form id="class-form" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class name</label>
            <input name="name" defaultValue={classModal.editing?.name || ""} placeholder="e.g., Grade 7A - English" className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Students</label>
            <input name="students" type="number" min="0" defaultValue={classModal.editing?.students ?? 0} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
