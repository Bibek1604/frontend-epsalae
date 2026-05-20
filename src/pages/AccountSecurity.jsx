export default function SecurityPage(){
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_70px_-50px_rgba(15,23,42,0.55)] sm:p-8">
      <h3 className="text-2xl font-semibold text-slate-900">Security Settings</h3>
      <p className="mt-1 text-sm text-slate-500">Change password and manage sessions.</p>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-6 text-slate-600">
        Password management and active sessions can be added here.
      </div>
    </div>
  )
}
