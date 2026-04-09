export default function PortalLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-salama-500/25 border-t-salama-500 rounded-full animate-spin" />
        <p className="text-slate-700 text-xs">Loading module...</p>
      </div>
    </div>
  )
}
