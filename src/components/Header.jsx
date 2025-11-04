import { Calendar as CalendarIcon, Users } from "lucide-react";

export default function Header({ title }) {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-600 text-white grid place-items-center">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">Plan, track, and manage your classes</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>Teacher Dashboard</span>
        </div>
      </div>
    </header>
  );
}
