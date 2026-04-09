export default function Loading() {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-salama-500/30 border-t-salama-500 rounded-full animate-spin" />
        <p className="text-slate-600 text-sm font-medium">Loading CyberSalama...</p>
      </div>
    </div>
  )
}
