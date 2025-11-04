export default function Modal({ open, title, children, onClose, onSubmit, submitLabel = "Save" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-[95vw] max-w-lg rounded-xl shadow-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100 text-gray-500"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={onSubmit} className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium">{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}
