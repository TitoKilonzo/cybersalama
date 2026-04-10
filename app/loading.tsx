export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#020617'}}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{borderColor:'rgba(20,179,116,0.2)',borderTopColor:'#14b374'}} />
        <p className="text-slate-600 text-sm font-medium">Loading CyberSalama…</p>
      </div>
    </div>
  )
}
