import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Camera, CheckCircle2, Loader2, Upload } from 'lucide-react'
import { profileEndpoints } from '@/components/api/userapi'

export default function ProfileSetup(){
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', addressLine: '', city: '', postalCode: '', country: ''
  })
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [uploadError, setUploadError] = useState('')

  useEffect(()=>{
    const fetchProfile = async ()=>{
      try{
        const res = await profileEndpoints.me()
        const user = res.data?.data || res.data
        if(user){
          setForm({
            name: user.name || '',
            phone: user.phone || '',
            email: user.email || '',
            addressLine: (user.address && user.address.addressLine) || '',
            city: (user.address && user.address.city) || '',
            postalCode: (user.address && user.address.postalCode) || '',
            country: (user.address && user.address.country) || ''
          })
          setAvatarUrl(user.avatarUrl || '')
          setAvatarPreview(user.avatarUrl || '')
        }
      }catch(e){/* ignore */}
    }
    fetchProfile()
  },[])

  const handle = (k,v)=> setForm(s=>({ ...s, [k]: v }))

  const submit = async ()=>{
    setLoading(true)
    try{
      await profileEndpoints.update({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: { addressLine: form.addressLine, city: form.city, postalCode: form.postalCode, country: form.country },
        avatarUrl,
      })
      toast.success('Profile updated')
      navigate('/account')
    }catch(err){
      toast.error(err.response?.data?.message || 'Update failed')
    }finally{setLoading(false)}
  }

  const initials = useMemo(() => {
    const parts = form.name.trim().split(' ').filter(Boolean)
    return (parts[0]?.[0] || 'U') + (parts[1]?.[0] || '')
  }, [form.name])

  const uploadAvatar = async (file) => {
    if (!file) return
    setUploadError('')
    setAvatarUploading(true)
    const localPreview = URL.createObjectURL(file)
    setAvatarPreview(localPreview)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await profileEndpoints.uploadAvatar(fd)
      const uploaded = res.data?.data?.avatarUrl || res.data?.avatarUrl
      if (uploaded) {
        setAvatarUrl(uploaded)
        setAvatarPreview(uploaded)
        toast.success('Avatar uploaded')
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Avatar upload failed')
      toast.error(err.response?.data?.message || 'Avatar upload failed')
    } finally {
      setAvatarUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbff_52%,_#eef3ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_70px_-50px_rgba(15,23,42,0.55)]">
          <div className="border-b border-slate-100 bg-[linear-gradient(135deg,_rgba(26,60,138,0.08),_rgba(255,107,53,0.08))] px-6 py-5 sm:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Profile Setup</h2>
            <p className="mt-1 text-sm text-slate-600">Complete your profile so checkout can autofill shipping details securely.</p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
            <div className="border-b border-slate-100 p-6 lg:border-b-0 lg:border-r lg:border-slate-100">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,_#1A3C8A,_#FF6B35)] text-4xl font-semibold text-white shadow-lg">
                    {avatarPreview ? <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" /> : initials}
                  </div>
                  <label className="absolute -bottom-2 -right-2 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white bg-slate-900 text-white shadow-lg transition hover:scale-105">
                    {avatarUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadAvatar(e.target.files?.[0])} />
                  </label>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-900">Profile avatar</p>
                <p className="mt-1 text-xs text-slate-500">JPG, PNG or WebP</p>
                {uploadError && <p className="mt-3 text-sm text-red-600">{uploadError}</p>}
                {avatarUrl && <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Uploaded</p>}
                <button onClick={()=>navigate('/account')} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Back to dashboard</button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input value={form.name} onChange={e=>handle('name', e.target.value)} placeholder="Full name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#1A3C8A] focus:bg-white focus:ring-4 focus:ring-[#1A3C8A]/10" />
                <input value={form.phone} onChange={e=>handle('phone', e.target.value)} placeholder="Phone" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#1A3C8A] focus:bg-white focus:ring-4 focus:ring-[#1A3C8A]/10" />
                <input value={form.email} onChange={e=>handle('email', e.target.value)} placeholder="Email" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#1A3C8A] focus:bg-white focus:ring-4 focus:ring-[#1A3C8A]/10" />
                <input value={form.postalCode} onChange={e=>handle('postalCode', e.target.value)} placeholder="Postal Code" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#1A3C8A] focus:bg-white focus:ring-4 focus:ring-[#1A3C8A]/10" />
                <input value={form.city} onChange={e=>handle('city', e.target.value)} placeholder="City" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#1A3C8A] focus:bg-white focus:ring-4 focus:ring-[#1A3C8A]/10" />
                <input value={form.country} onChange={e=>handle('country', e.target.value)} placeholder="Country" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#1A3C8A] focus:bg-white focus:ring-4 focus:ring-[#1A3C8A]/10" />
              </div>

              <textarea value={form.addressLine} onChange={e=>handle('addressLine', e.target.value)} placeholder="Shipping address" className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-[#1A3C8A] focus:bg-white focus:ring-4 focus:ring-[#1A3C8A]/10" rows={5} />

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button onClick={()=>navigate(-1)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Cancel</button>
                <button onClick={submit} disabled={loading || avatarUploading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,_#1A3C8A_0%,_#2550b7_55%,_#FF6B35_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(26,60,138,0.55)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {loading ? 'Saving...' : 'Save & Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
