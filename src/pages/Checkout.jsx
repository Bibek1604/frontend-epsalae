// src/pages/Checkout.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, Lock, AlertCircle, Loader2, Truck, Shield } from 'lucide-react'
import { useCart } from '@/store/cartstore'
import { orderApi } from '../components/api/orderapi'
import { motion } from 'framer-motion'

// Full Nepal Districts (77) with real municipalities
const NEPAL_DISTRICTS = {
  // Province 1 (Koshi Province) - 14 Districts
  'Taplejung': ['Phungling', 'Meringden', 'Sidingba', 'Phaktanglung', 'Aathrai Tribeni', 'Mikwakhola', 'Sirijangha', 'Pathivara Yangwarak'],
  'Sankhuwasabha': ['Khandbari', 'Chainpur', 'Dharmadevi', 'Madi', 'Panchkhapan', 'Makalu', 'Silichong', 'Bhotkhola', 'Sabhapokhari', 'Chichila'],
  'Solukhumbu': ['Salleri', 'Solududhkunda', 'Dudhakaushika', 'Nechasalyan', 'Mapya Dudhkoshi', 'Thulung Dudhkoshi', 'Mahakulung', 'Likhupike', 'Khumbu Pasanglhamu'],
  'Okhaldhunga': ['Siddhicharan', 'Champadevi', 'Sunkoshi', 'Likhu', 'Chisankhugadhi', 'Molung', 'Khijidemba', 'Manebhanjyang'],
  'Khotang': ['Diktel', 'Halesi Tuwachung', 'Khotehang', 'Diprung Chuichumma', 'Aiselukharka', 'Jantedhunga', 'Kepilasgadhi', 'Sakela', 'Barahpokhari', 'Rawabesi'],
  'Bhojpur': ['Bhojpur', 'Shadananda', 'Tyamkemaiyum', 'Arun', 'Pauwadungma', 'Salpasilichho', 'Aamchowk', 'Hatuwagadhi', 'Ramprasad Rai'],
  'Dhankuta': ['Dhankuta', 'Pakhribas', 'Mahalaxmi', 'Sangurigadhi', 'Chhathar Jorpati', 'Shahidbhumi', 'Chaubise'],
  'Terhathum': ['Myanglung', 'Laligurans', 'Aathrai', 'Chhathar', 'Phedap', 'Menchhayayem'],
  'Panchthar': ['Phidim', 'Hilihang', 'Kummayak', 'Miklajung', 'Phalgunanda', 'Phalelung', 'Yangwarak', 'Tumbewa'],
  'Ilam': ['Ilam', 'Deumai', 'Mai', 'Suryodaya', 'Phakphokthum', 'Maijogmai', 'Chulachuli', 'Rong', 'Mangsebung', 'Sandakpur'],
  'Jhapa': ['Mechinagar', 'Damak', 'Bhadrapur', 'Birtamod', 'Arjundhara', 'Kankai', 'Shivasatakshi', 'Gauradaha', 'Kamal', 'Buddhashanti', 'Haldibari', 'Barhadashi', 'Jhapa', 'Kachankawal', 'Gaurigunj'],
  'Morang': ['Biratnagar', 'Sunwarshi', 'Belbari', 'Pathari Shanishchare', 'Urlabari', 'Rangeli', 'Letang', 'Ratuwamai', 'Sundarharaicha', 'Kerabari', 'Budhiganga', 'Kanepokhari', 'Gramthan', 'Katahari', 'Dhanpalthan', 'Jahada', 'Miklajung'],
  'Sunsari': ['Itahari', 'Dharan', 'Inaruwa', 'Duhabi', 'Ramdhuni', 'Barahakshetra', 'Koshi', 'Gadhi', 'Barju', 'Bhokraha Narsingh', 'Harinagara', 'Dewanganj'],
  'Udayapur': ['Gaighat', 'Triyuga', 'Katari', 'Chaudandigadhi', 'Belaka', 'Udayapurgadhi', 'Rautamai', 'Limchungbung'],

  // Province 2 (Madhesh Province) - 8 Districts
  'Saptari': ['Rajbiraj', 'Kanchanrup', 'Dakneshwori', 'Saptakoshi', 'Surunga', 'Shambhunath', 'Balan Bihul', 'Bishnupur', 'Khadak', 'Agnisair Krishnasavaran', 'Bode Barsain', 'Hanumannagar Kankalini', 'Mahadeva', 'Rupani', 'Tilathi Koiladi', 'Tirahut', 'Chhinnamasta'],
  'Siraha': ['Siraha', 'Lahan', 'Golbazar', 'Mirchaiya', 'Dhangadhimai', 'Kalyanpur', 'Karjanha', 'Sukhipur', 'Bhagwanpur', 'Aurahi', 'Bishnupur', 'Bariyarpatti', 'Lakshmipur Patari', 'Naraha', 'Sakhuwanankar Katti', 'Arnama', 'Nachhap'],
  'Dhanusha': ['Janakpur', 'Chhireshwornath', 'Ganeshman Charnath', 'Dhanushadham', 'Nagarain', 'Bideha', 'Mithila', 'Sabaila', 'Kamala', 'Bateshwar', 'Janaknandini', 'Hansapur', 'Mithila Bihari', 'Mukhiyapatti Musaharmiya', 'Lakshminya', 'Aaurahi'],
  'Mahottari': ['Jaleshwar', 'Bardibas', 'Gaushala', 'Loharpatti', 'Ramgopalpur', 'Aurahi', 'Balwa', 'Bhangaha', 'Ekdara', 'Mahottari', 'Manra Siswa', 'Matihani', 'Pipra', 'Samsi', 'Sonama'],
  'Sarlahi': ['Malangwa', 'Barahathwa', 'Haripur', 'Ishworpur', 'Lalbandi', 'Godaita', 'Bagmati', 'Balara', 'Bishnu', 'Brahmpuri', 'Chakraghatta', 'Chandranagar', 'Dhankaul', 'Haripurwa', 'Kabilasi', 'Kaudena', 'Parsa', 'Ramnagar'],
  'Rautahat': ['Gaur', 'Chandrapur', 'Garuda', 'Gujara', 'Baudhimai', 'Brindaban', 'Dewahi Gonahi', 'Durga Bhagwati', 'Ishanath', 'Katahariya', 'Madhav Narayan', 'Maulapur', 'Paroha', 'Phatuwa Bijayapur', 'Rajdevi', 'Rajpur', 'Yamunamai'],
  'Bara': ['Kalaiya', 'Jitpur Simara', 'Kolhabi', 'Nijgadh', 'Mahagadhimai', 'Simraungadh', 'Pachrauta', 'Pheta', 'Prasauni', 'Adarsha Kotwal', 'Baragadhi', 'Devtal', 'Karaiyamai', 'Parwanipur', 'Suwarna', 'Bishrampur'],
  'Parsa': ['Birgunj', 'Pokhariya', 'Bahudarmai', 'Parsagadhi', 'Bindabasini', 'Chhipaharmai', 'Dhobini', 'Jagarnathpur', 'Jirabhawani', 'Kalikamai', 'Pakaha Mainpur', 'Paterwa Sugauli', 'Sakhuwa Prasauni', 'Thori'],

  // Bagmati Province - 13 Districts
  'Dolakha': ['Charikot', 'Bhimeshwor', 'Jiri', 'Melung', 'Bigu', 'Gaurishankar', 'Kalinchok', 'Tamakoshi', 'Baiteshwor', 'Sailung', 'Shailung'],
  'Sindhupalchok': ['Chautara', 'Melamchi', 'Bahrabise', 'Barhabise', 'Indrawati', 'Jugal', 'Panchpokhari Thangpal', 'Helambu', 'Bhotekoshi', 'Lisankhu Pakhar', 'Sunkoshi', 'Tripurasundari'],
  'Rasuwa': ['Dhunche', 'Gosaikunda', 'Kalika', 'Naukunda', 'Uttargaya', 'Amachodingmo'],
  'Dhading': ['Dhading Besi', 'Nilkantha', 'Dhunibesi', 'Galchi', 'Benighat Rorang', 'Gajuri', 'Gangajamuna', 'Jwalamukhi', 'Khaniyabas', 'Netrawati Dabjong', 'Rubi Valley', 'Siddhalek', 'Thakre', 'Tripurasundari'],
  'Nuwakot': ['Bidur', 'Belkotgadhi', 'Kakani', 'Tadi', 'Dupcheshwar', 'Kispang', 'Likhu', 'Meghang', 'Panchakanya', 'Shivapuri', 'Suryagadhi', 'Tarkeshwar'],
  'Kathmandu': ['Kathmandu', 'Kirtipur', 'Madhyapur Thimi', 'Budhanilkantha', 'Chandragiri', 'Dakshinkali', 'Gokarneshwor', 'Kageshwori Manohara', 'Nagarjun', 'Shankarapur', 'Tarakeshwor', 'Tokha'],
  'Bhaktapur': ['Bhaktapur', 'Madhyapur Thimi', 'Suryabinayak', 'Changunarayan'],
  'Lalitpur': ['Lalitpur', 'Godavari', 'Mahalaxmi', 'Konjyosom', 'Bagmati', 'Mahankal'],
  'Kavrepalanchok': ['Dhulikhel', 'Banepa', 'Panauti', 'Panchkhal', 'Namobuddha', 'Bethanchowk', 'Bhumlu', 'Chaurideurali', 'Khanikhola', 'Mahabharat', 'Mandandeupur', 'Roshi', 'Temal'],
  'Ramechhap': ['Manthali', 'Ramechhap', 'Doramba', 'Gokulganga', 'Khandadevi', 'Likhu Tamakoshi', 'Sunapati', 'Umakunda'],
  'Sindhuli': ['Sindhuli', 'Kamalamai', 'Dudhauli', 'Sunkoshi', 'Hariharpurgadhi', 'Golanjor', 'Ghyanglekh', 'Marin', 'Phikkal', 'Tinpatan'],
  'Makwanpur': ['Hetauda', 'Thaha', 'Bhimphedi', 'Makawanpurgadhi', 'Bakaiya', 'Bagmati', 'Indrasarowar', 'Kailash', 'Manahari', 'Raksirang'],
  'Chitwan': ['Bharatpur', 'Ratnanagar', 'Khairahani', 'Madi', 'Rapti', 'Kalika', 'Ichchhakamana'],

  // Gandaki Province - 11 Districts
  'Gorkha': ['Gorkha', 'Palungtar', 'Sulikot', 'Siranchok', 'Ajirkot', 'Aarughat', 'Barpak Sulikot', 'Bhimsen Thapa', 'Chum Nubri', 'Dharche', 'Gandaki', 'Sahid Lakhan'],
  'Manang': ['Chame', 'Narphu', 'Nashong', 'Manang Ngisyang'],
  'Mustang': ['Jomsom', 'Gharapjhong', 'Thasang', 'Barhagaun Muktichhetra', 'Lomanthang', 'Lo Ghekar Damodarkunda', 'Dalome'],
  'Myagdi': ['Beni', 'Annapurna', 'Dhaulagiri', 'Mangala', 'Malika', 'Raghuganga'],
  'Kaski': ['Pokhara', 'Annapurna', 'Machhapuchchhre', 'Madi', 'Rupa'],
  'Lamjung': ['Besisahar', 'Sundarbazar', 'Rainas', 'Madhya Nepal', 'Dordi', 'Dudhpokhari', 'Kwholasothar', 'Marsyangdi'],
  'Tanahu': ['Damauli', 'Byas', 'Shuklagandaki', 'Bhanu', 'Bhimad', 'Devghat', 'Bandipur', 'Ghiring', 'Myagde', 'Rishing'],
  'Nawalpur': ['Kawasoti', 'Gaindakot', 'Devchuli', 'Madhyabindu', 'Bulingtar', 'Binayi Triveni', 'Baudikali', 'Hupsekot'],
  'Syangja': ['Putalibazar', 'Galyang', 'Chapakot', 'Waling', 'Bhirkot', 'Harinas', 'Biruwa', 'Aandhikhola', 'Arjunchaupari', 'Kaligandaki', 'Phedikhola'],
  'Parbat': ['Kusma', 'Phalebas', 'Jaljala', 'Mahashila', 'Modi', 'Paiyun', 'Bihadi'],
  'Baglung': ['Baglung', 'Dhorpatan', 'Galkot', 'Jaimini', 'Bareng', 'Kathekhola', 'Nisikhola', 'Taman Khola', 'Tara Khola', 'Badigad'],

  // Lumbini Province - 12 Districts
  'Rukum East': ['Rukumkot', 'Bhume', 'Putha Uttarganga', 'Sisne'],
  'Rolpa': ['Liwang', 'Runtigadhi', 'Tribeni', 'Rolpa', 'Lungri', 'Madi', 'Paribartan', 'Sunchhahari', 'Sukidaha', 'Thawang'],
  'Pyuthan': ['Pyuthan', 'Swargadwari', 'Gaumukhi', 'Mandavi', 'Sarumarani', 'Mallarani', 'Jhimruk', 'Airawati', 'Naubahini'],
  'Gulmi': ['Tamghas', 'Musikot', 'Resunga', 'Isma', 'Madane', 'Malika', 'Chandrakot', 'Ruru', 'Satyawati', 'Dhurkot', 'Kaligandaki', 'Chhatrakot'],
  'Arghakhanchi': ['Sandhikharka', 'Sitganga', 'Bhumikasthan', 'Chhatradev', 'Panini', 'Malarani'],
  'Palpa': ['Tansen', 'Rampur', 'Tinau', 'Bagnaskali', 'Nisdi', 'Purbakhola', 'Mathagadhi', 'Rambha', 'Ribdikot', 'Rainadevi Chhahara'],
  'Rupandehi': ['Butwal', 'Siddharthanagar', 'Devdaha', 'Lumbini Sanskritik', 'Sainamaina', 'Tilottama', 'Gaidhawa', 'Kanchan', 'Kotahimai', 'Marchawari', 'Mayadevi', 'Omsatiya', 'Rohini', 'Sammarimai', 'Siyari', 'Sudhdhodhan'],
  'Kapilvastu': ['Kapilvastu', 'Banganga', 'Buddhabhumi', 'Shivaraj', 'Maharajganj', 'Krishnanagar', 'Mayadevi', 'Bijaynagar', 'Suddhodhan', 'Yasodhara'],
  'Dang': ['Ghorahi', 'Tulsipur', 'Lamahi', 'Bangalachuli', 'Dangisharan', 'Gadhawa', 'Rajpur', 'Rapti', 'Shantinagar'],
  'Banke': ['Nepalgunj', 'Kohalpur', 'Narainapur', 'Rapti Sonari', 'Baijanath', 'Duduwa', 'Janaki', 'Khajura'],
  'Bardiya': ['Gulariya', 'Rajapur', 'Madhuwan', 'Thakurbaba', 'Bansgadhi', 'Barbardiya', 'Badhaiyatal', 'Geruwa'],
  'Nawalparasi West': ['Ramgram', 'Sunwal', 'Bardaghat', 'Susta', 'Pratappur', 'Sarawal', 'Palhi Nandan'],

  // Karnali Province - 10 Districts
  'Dolpa': ['Dunai', 'Thuli Bheri', 'Tripurasundari', 'Dolpo Buddha', 'She Phoksundo', 'Jagadulla', 'Mudkechula', 'Kaike', 'Chharka Tangsong'],
  'Mugu': ['Gamgadhi', 'Chhayanath Rara', 'Mugum Karmarong', 'Soru', 'Khatyad'],
  'Humla': ['Simikot', 'Namkha', 'Kharpunath', 'Sarkegad', 'Chankheli', 'Adanchuli', 'Tanjakot'],
  'Jumla': ['Khalanga', 'Chandannath', 'Kanakasundari', 'Sinja', 'Hima', 'Guthichaur', 'Tatopani', 'Patarasi'],
  'Kalikot': ['Manma', 'Raskot', 'Tilagufa', 'Pachaljharana', 'Shubha Kalika', 'Narharinath', 'Mahawai', 'Palata', 'Sanni Triveni'],
  'Dailekh': ['Narayan', 'Dullu', 'Chamunda Bindrasaini', 'Aathbis', 'Bhairabi', 'Bhagawatimai', 'Dungeshwar', 'Gurans', 'Mahabu', 'Naumule', 'Thantikandh'],
  'Jajarkot': ['Khalanga', 'Bheri', 'Chhedagad', 'Barekot', 'Kuse', 'Junichande', 'Nalagad'],
  'Rukum West': ['Musikot', 'Chaurjahari', 'Aathbiskot', 'Banfikot', 'Tribeni', 'Sani Bheri'],
  'Salyan': ['Salyan', 'Bagchaur', 'Sharada', 'Bangad Kupinde', 'Chhatreshwori', 'Darma', 'Kalimati', 'Kapurkot', 'Kumakh', 'Siddha Kumakh', 'Triveni'],
  'Surkhet': ['Birendranagar', 'Bheriganga', 'Gurbhakot', 'Panchapuri', 'Lekbeshi', 'Barahatal', 'Chaukune', 'Chingad', 'Simta'],

  // Sudurpashchim Province - 9 Districts
  'Bajura': ['Martadi', 'Badimalika', 'Triveni', 'Budhinanda', 'Budhiganga', 'Chhededaha', 'Gaumul', 'Himali', 'Jagannath', 'Khaptad Chhanna', 'Swami Kartik'],
  'Bajhang': ['Chainpur', 'Bungal', 'Jayaprithvi', 'Kedarsyu', 'Thalara', 'Bitthadchir', 'Chhanna', 'Durgathali', 'Khaptadchhanna', 'Masta', 'Saipal', 'Surma'],
  'Achham': ['Mangalsen', 'Sanphebagar', 'Kamalbazar', 'Panchadewal Binayak', 'Ramaroshan', 'Chaurpati', 'Mellekh', 'Dhakari', 'Turmakhand', 'Bannigadhi Jayagadh'],
  'Doti': ['Dipayal Silgadhi', 'Shikhar', 'Purbichauki', 'Bogatan Fudsil', 'Jorayal', 'Sayal', 'Aadarsha', 'Badikedar', 'K.I. Singh'],
  'Kailali': ['Dhangadi', 'Tikapur', 'Ghodaghodi', 'Lamkichuha', 'Bhajani', 'Godawari', 'Gauriganga', 'Janaki', 'Joshipur', 'Kailari', 'Mohanyal', 'Bardagoriya', 'Chure'],
  'Kanchanpur': ['Bhimdatta', 'Mahakali', 'Shuklaphanta', 'Bedkot', 'Belauri', 'Punarbas', 'Krishnapur', 'Laljhadi', 'Beldandi'],
  'Dadeldhura': ['Amargadhi', 'Parshuram', 'Aalitaal', 'Bhageshwar', 'Navadurga', 'Ajayameru', 'Ganyapadhura'],
  'Baitadi': ['Dasharathchand', 'Patan', 'Melauli', 'Purchaudi', 'Dogadakedar', 'Dilasaini', 'Pancheshwar', 'Shivanath', 'Sigas', 'Surnaya'],
  'Darchula': ['Mahakali', 'Shailyashikhar', 'Malikarjun', 'Marma', 'Lekam', 'Naugad', 'Byas', 'Dunhu', 'Apihimal'],
};

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, getTotalPrice, clearCart } = useCart()

  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    address: '', city: '', district: '', description: '',
    paymentMethod: 'cod',
  })

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 5000 ? 0 : 250
  const total = subtotal + shipping

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      name: (name === 'first_name' || name === 'last_name')
        ? `${name === 'first_name' ? value : prev.first_name} ${name === 'last_name' ? value : prev.last_name}`.trim()
        : prev.name
    }))
  }

  const validateStep = () => {
    setError('')
    if (!formData.first_name || !formData.last_name || !formData.phone || !formData.email) {
      setError('Please fill all personal details')
      return false
    }
    if (!formData.address || !formData.district || !formData.city) {
      setError('Complete shipping address is required')
      return false
    }
    if (!formData.description) {
      setError('Add delivery note (e.g. near temple, call before delivery)')
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateStep()) return

    setIsProcessing(true)
    try {
      await new Promise(r => setTimeout(r, 1800))

      const orderData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        name: `${formData.first_name} ${formData.last_name}`,
        phone: formData.phone,
        district: formData.district,
        city: formData.city,
        address: formData.address,
        description: formData.description || 'No notes',
        items: cart.map(i => ({
          productId: i.id || i._id,
          name: i.name,
          price: Number(i.price),
          quantity: Number(i.quantity),
          imageUrl: i.image || ''
        })),
        totalAmount: Number(total.toFixed(0)),
      }

      const res = await orderApi.create(orderData)
      const orderId = res.data?.data?._id || res.data?._id || 'TEMP'

      clearCart()
      navigate(`/order-success/${orderId}`, { 
        state: { 
          order: res.data.data,
          orderData: {
            ...orderData,
            id: orderId,
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            paymentMethod: formData.paymentMethod,
            orderDate: new Date().toISOString()
          }
        } 
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 bg-gray-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-gray-200 rounded-full" />
          <h2 className="mb-4 text-4xl font-light text-gray-900">Your cart is empty</h2>
          <button onClick={() => navigate('/products')} className="px-10 py-4 font-medium text-white transition bg-gray-900 rounded-full hover:bg-gray-800">
            Continue Shopping
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-12 mx-auto max-w-7xl">

        {/* Header */}
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 mb-8 text-sm font-medium text-gray-600 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5" /> Back to Cart
        </button>
        <h1 className="mb-4 text-5xl font-light text-gray-900">Checkout</h1>
        <p className="mb-12 text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

          {/* Main Form */}
          <div className="space-y-8 lg:col-span-2">

            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: "Shipping" },
                { num: 2, label: "Payment" }
              ].map((step, i) => (
                <div key={step.num} className="flex items-center flex-1">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-medium transition-all ${
                    currentStep > step.num ? 'bg-green-600 text-white' :
                    currentStep === step.num ? 'bg-gray-900 text-white ring-4 ring-gray-200' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.num ? <Check className="w-7 h-7" /> : step.num}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Step {step.num}</p>
                    <p className="font-medium text-gray-900">{step.label}</p>
                  </div>
                  {i === 0 && <div className="flex-1 h-1 mx-8 bg-gray-200" />}
                </div>
              ))}
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-5 border border-red-200 bg-red-50 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <p className="font-medium text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 bg-white border border-gray-200 rounded-3xl">
                <h2 className="mb-8 text-2xl font-medium text-gray-900">Shipping Address</h2>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleInputChange}
                    className="px-6 py-4 text-lg transition border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900" />
                  <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleInputChange}
                    className="px-6 py-4 text-lg transition border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900" />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange}
                    className="px-6 py-4 text-lg transition border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900" />
                  <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange}
                    className="px-6 py-4 text-lg transition border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900" />
                </div>

                <input type="text" name="address" placeholder="Full Address (House no, Tole, Ward)" value={formData.address} onChange={handleInputChange}
                  className="w-full px-6 py-4 mb-6 text-lg transition border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900" />

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">District</label>
                    <select name="district" value={formData.district} onChange={handleInputChange}
                      className="w-full px-6 py-4 text-lg transition border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900">
                      <option value="">Select District</option>
                      {Object.keys(NEPAL_DISTRICTS).sort().map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">City / Municipality</label>
                    <select name="city" value={formData.city} onChange={handleInputChange} disabled={!formData.district}
                      className="w-full px-6 py-4 text-lg transition border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900 disabled:bg-gray-50">
                      <option>{formData.district ? 'Select City' : 'First select district'}</option>
                      {formData.district && NEPAL_DISTRICTS[formData.district].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <textarea name="description" placeholder="Delivery notes (e.g. Call before delivery, near school, red gate)" value={formData.description} onChange={handleInputChange} rows={4}
                  className="w-full px-6 py-4 text-lg transition border border-gray-300 resize-none rounded-xl focus:outline-none focus:border-gray-900" />

                <button onClick={() => validateStep() && setCurrentStep(2)}
                  className="flex items-center justify-center w-full gap-3 py-5 mt-10 text-xl font-semibold text-white transition bg-green-600 shadow-lg hover:bg-green-700 rounded-xl">
                  Continue to Payment
                  <ChevronLeft className="w-6 h-6 rotate-180" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 bg-white border border-gray-200 rounded-3xl">
                <h2 className="mb-8 text-2xl font-medium text-gray-900">Payment Method</h2>

                <div className="space-y-5">
                  {/* COD */}
                  <label className={`flex items-center gap-6 p-6 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="w-6 h-6 text-green-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">💵</span>
                        <span className="text-xl font-semibold text-gray-900">Cash on Delivery</span>
                      </div>
                      <p className="mt-1 text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>

                  {/* Khalti - Locked */}
                  <label className="flex items-center gap-6 p-6 transition-all border-2 border-gray-200 cursor-not-allowed rounded-2xl bg-gray-50 opacity-60">
                    <input type="radio" name="paymentMethod" value="khalti" disabled className="w-6 h-6 text-purple-600 cursor-not-allowed" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASsAAACpCAMAAABEdevhAAABaFBMVEX////9///8/////f//+//bJDb5///9//3///zSe4XUHC/gIzPbIzP8//zbJDj2///IFC7YACzegYrru7r98u7aIC7NTFnWECTcqrEAAAD/+P////nOgob/+fbYJzHCSFfWJzbjqaw9PT32//jx09LV1dXUZm/jIDjTKTf65OPsv73/8/XjITLrxMjZIC7kfofZhIfFWGHcIj7/7/bQN0TXlZW2tralpaWNjY2amppPT0/MMUnjCiu7BiXUj5bJOlDTmpfgpKz35N7DETLRKy/VR1TtaHHBMTXHU1nGXGDKOUS1Lz3GGjr82uLji5jMACDMSGXkzs62AB3Qb27AfoXKQFbXq67adYbtsLjZOFXbWWvtnqHeCyTKABWzQVrs2tfrnK+kAB+7SkvEbXizHjPvv8rRY2fXan3YgZfurLvgZW/Gd3ewJTeuWF/Lg4zcSFLUXVplZWUoKCgeHh7kvspubm7oABji4uL/rJgwAAAOXklEQVR4nO2ci1/bRhrH5yGN5NFjJLAtYmFbxgqysWwMxnkUcAI4G0IA3yRNoa253DYkabptenfvtvn37xkb0tDQvbm7n5bXfPlgW5ZsZn6fc86cMzMCIYVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUJxZaBUPprwSyTn3JqLDWEGQoZjSK1wp9ltaufdoguL4zhMGJRijLR4etlfWY3Pu0kXFoJpQcMIFePePY/rrZZfOe8mXVgKGmGYxvfL3LdKuq5HG8qufg9GzHov73HbstI0WazpZRWvzgJcD9XXvvJyrZZl67qru7Wav0bwebfrIiGKZkEYBYzXK3mfc9u2pVS6XrNL6UZdnHfzLhKUmA5xwsbUa8+3opptRaUkcWtLbqKnuVnKzrt9FwmKTIEb3VVuWaV+LbIsu1VbfPCXn3Q7WuGTiJ53+y4WDqM9D0wqskEe/WGUbkzM18AH9XQrS5VWH4CpgxvlNEoktl5L/M25Te5GkWvzDCJKqw/AmoPNR0NLh5Ae2TXXnWhu8Qiie2TzpgpXpwDLMcLm4yCXtkpRKd2ejJe4JcfBUm65CNXOebfvIkFgJKyaO7MbemKV+HK8vuxGUirdDnah5FFTDR8AVbIhqgbagXx98B/1sAzZ+lgrLusbpdUHGHJagREC5U1nv+NU/NS2x1rliwLi/nm37yIhp180SqVgjJFqc5OPqmZd5xXEkKG0+g0UESEVI45mhGurYx/06vjSDoPjyswksmenTmAMPvRpedDxRx05O4xBH2lVCBwQEyQYc6pCCA299FxdT+xZE1F2OcdBSiYnX76cm2xgSLRPncAhMsNPmzuhlDWy2cZ6g2qQLOCXbyr7a0+IRiDCC8QobRRNxlCFg1Z87g/pxp8CDZ9yzldXY+Y4p42oN/v62bPmJ32J6aC3W1tbj3uQVBFUXPC4zz/XNIbBgEg1Xnj+vGsyEn4V9e3t7B/Riz8HJ/SsNE392HGc02fy6SIffPFJX4KZlmnlWisTyDEoaGWXSq02uBrYFTHqj/WVdLVHGdsf5HJ7f0Af/iww2qhFVs6LETXFqShSTheT4BO1EmgPBB+2YYijmC5AfsCnwe3AzISx77dafes5FbjhrQyal7oS9PRIt7yYUHrasPK5RA+mPu07GMpEpVrQlmFOGGBXOp9GDGvEIBi0sqOVL4ukgJZXtrKXWCuBeGrrth8LTE3z+E0sh7V8Xy8NpsDwTGS8vxzL4XH8Uk4DG8eJkoMyPNXTNiqA4xUXci3bzowuh6i/vpG6IB0Dq/3Kb5uXNV9Astjw7FHhgQnGoaOBNSDsVEG1fMsFu8IGKppVJJNKIpdDTYdJIeFqxrRitQq1XWjCZzLccpM20swvKl8/0HUr+aqyBuwIEk5urD6d7QjQ9svV9cs8c3VKKyIaL5vx3FyzA0N8Pie1knZECRNgFaasTOhINojmGBUYK2hw3tSg/1KrdB4ShHu+n0S1Wr80XAmCg4qjQT6x0wgJcczw87Xq1dBKViV0L/C9YPCfHZBjrBVk3czsdOSlGoIab7Qu03iytltpZoUo7MSHh4eCjbTSgwmEw2+5naaWHllJpKeDSlErwPcSh1EnrILLX+YZhvdaEQju6L+8vuVaD+sCXo+1Eo392Q3fW84cCkJNiNwizPaOOPc8f6Ob7Xzjed5qVhv74FgrPbKtNHHtBMZX/kbQTm9+L/PiEMZZsEtKq+fd43+dX7XCFMXbej9N+H4o4/ZYq/AFD3L9fsvf6GnMpEwU4y2ZkdmlNOWb8UN42QqNsQ/m5hEx7yWLkIXY/VIw4IODN5g0ykEuGE5CugW5l0Yv8WrXr1pBKQI9t3XeA7ejo9huB1NtL01LbhL1V/xp0ISYO0dpUorcRTcq2fZiZNt9XqTvYzt1njSbk3ndcl83JetUaOXELflQ2giNVs1LWQmOGWtV4rGGq7M5t5auvDDxOGdouQmf6FsJ52A8/cT11gkVjTxfrEU1f/vLZZ5LU5C55MmyZWRXE5A9YGG2eUl3p0df72BcBK0iqRWRh+fa2X+TsVaWH1Ony60oSbfqx2fygZvYS6m3MDGxuWGV7EW/B5nmlGclSbJVyTIST3sQv237Q60gxcCQX420oriUlxXLFuRvk+PV+kvNiVaHpOkmaZR48UniWR66UW7xcTOEwb7iWba7sgAZQ3nRsvTl2BFC02jPi9yztGqVdP3KaqV7h9ll8CfdW3NO5qzKK26Uui9Nh2oMzVpRLX2OcJ3res6bY7hgagUavrLO1OpK25XuxQtJFEW52aI4yRbBrtxWnggBWok1XotaeYSbQyvKLWUhTBfBsqpz/GMfhBrHusp2Zbuv3DRy9TTfIdXjqlDGq34XU4MYlO37esI3TTI5zLnWa5NQ+GEFp776e1olY63MK6hVsrwV6Ulie69HM8GyJJb1YGsKQpSc2Nr3rcQuIzwZlBI+LRiFaCUo65yhFTFBK9ueZlDdQO0sx8GrpRWfW/8aArVr8cnRBAI+qXGOL5v0rcgqw3NQsq09QgsCMvhCtf70DK1Gc31pG/QUBrp6Wln8UJiPoDpJ3R/qsjpGv6OVjFfpvSJo5VThYW5wpg/alp1OmASqakaunA9arR0s6otJlNq1WSo3wqIztMojssPTmr0RO7SgUY2g9sexHdxullu2/sgUgmkOw42yfaW0kjWOMCf9GnTSX4NeInqWXZlgbXakR/fWq4ZgTOx7+sd2RVEmsnR9441mGqhoiCunlRcLWmTPPLmIfhSHAp9lV9+amqhwF8aAzbiIzWxlOyl9nF8Rp+vJrUTbe91uN4YqsNy6Slq5EW8So0DWlxMdks58luGTedHjy6RWttQqu5XYNtSGC9+1H/atoDSqB6F+PJmTMUxWnVu17H7fbgXDgwpiWj53RbSiiJeSRT2IYfRj7A23bbcf7EKujsqlxG6daLUfpHpShhw+jD3bgjLH5Ss5nX//0LVLrZCCVi1rMWgjzEwqwrwNmbsOlw0qBDfyds1embv8Ukm7aqW6FYzmkDX0V68U5SxvLmQ4nybp8L1dBWkrLVOBRLi/WmuluVIU6Ty/81C3cn62ILUq1YbzCDswijrN7dRdBGpehYli3uqXgku83Pweanp2Ypd4jIiBNLG+la6ABT1Yd1A+rUXv1wcnB5adK2uCwhDQfLTB09T23RfZztM04atZLFAml1oQrwwHwRiJmo95kAMGb5DMr1ZWgnHadrnRzB+2lrcf/xBj00GYmnNHW0ePH2+/RdpCbXlr9diutLmN7eXtHxHRNMKI1uxl5ud7zbDaefFsL/PXIkH07erqxtFbBF5qQBJqZCsTrx5sLW1NIVb88Wjp4Q/NK6AVE9lGo5PtaMx0MHTSaGSzxbDTqIpitpANi+OrRLUBFE0ql2wEc6DMCx2odAzTRGFIaFU04NpOBzsOKUBRTR3GkKZpjZCJarFRLGavwk4+KkzKNAYCUIcigQua3BeLBaXM1HD1eJ+MJsCekDA0IiDsGw7ISuWSF5gRI4amySSDUAMLw5FWVaUaAxlNJwyhBpAFpgNlovnPW3I5wKPl5PGr92+hU8cnR/gjR8L4gw+d+bErMAIqFAqFQvEbIF2ATMoJzTA05eSgzDQQhXzWMQnWIF2ohtiAJIwSeU+A+O0u5+uFnB8ep0xQSpoOpFOg1WiX92jHtuagUXImN7NrmtzYda6tPVcwRdnPJzJv32Yyvd70dLudWZO2RbReRrLfm85893a6PZ2ZBt5m0XXWimko+40XAIOf8h5fSf2jBhXUiZ8Gw+Hg4Nnm6nAYDPkgCA6G0WrdvMwbr/5doAgK4/inyN1dX1+PX9n9hE8hQc2uV0t497Ber89zPlvfgZOvuVd36Mcp/7XBZPIWku+TZE0gQSbc/+bJbBGL4taXDxYXm0wr4N5Kssdw9h/1xpJXBzO8RoZ162+nDh0YByma7fuVKqV4z+8+0LfriMWDdt7yJ6G2Rt2gNYvCLw7emK+e1oV2mXde/X+59dmpQ2O072E25RW5z3Zv8PVa0LqPcPsgfp7jc/Iupp7f+r6+/mywj3o/1p1rVUGDVrfv3EboJvwievcdkoYyG0itEJoY7MZe+i1tbD3M5lutSZk3dH27xjlvTcJrquHqlZiT+TRuzczcuTszg27eeAeC3cBjuzrWKjOYMDdTHjcHz1DeBq0gOnV9a2l+tsYnRbGuUVp1/s8/cWW4deMmPP79NvrsLkI/35Fv4fdatQe7aK0VdOfB4/I2H61wdf30FUZrq/uo/U0dktFr5IS3/i4f7/4N3fofVJS2NdaqNYpXEwdtXF/N/bT0sHFsVwi0yi0g7R/lJvrLoH6NjApJH5SPoBW6cfN9nJ+1juNV0EVos5XyNpJ2NVrh6vn2AiJhGHa2jnawcK5TvBr54Aw44J2fP7sJ+RUqPInzSbJ7eLizM+tPHHamgqH3ch3eW/w6rh/G80mS39mJ4/18i8eCatfJB2dm7t7+bKaI0LsbM6PyrvMNDw6Cg8HS0mA4/OXgfudouJxdOxj+Mjw4mH80CAbBcDAYPD34xX+6Q+ilvSP8X+Dm7Xd3fr472kw6c1uOczjbm9jtdXu7a5Ve93639wR90Z0ym7379+Hg5dR3u70enIXD7v1eRyB8jbT6lXcyspsEvGpUtuDRKinkUAQ5xni3P5XxHn2w7MPENV3OufMzknN9WoEJiNiOY1JqytU/Ku9KpQVkjpcGwxCe4NmU/6PhvNt8XszIII+oU5U6gDIGcQzqiNBkBbnoalADbA7JezJxAcHwhynB5vX+Vx/EMU/mRYn0umOPG23NPXke328o11uvtVQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAoFAqFQqFQKBQKhUKhUCgUCoVCoVAo/lD+Fx/ZoUqCTjD7AAAAAElFTkSuQmCC" alt="Khalti" className="object-contain w-12 h-12 rounded-lg" />
                        <span className="text-xl font-semibold text-gray-900">Khalti</span>
                        <span className="px-3 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">Coming Soon</span>
                      </div>
                      <p className="mt-1 text-gray-500">Digital wallet payment - Coming soon</p>
                    </div>
                    <Lock className="w-5 h-5 text-gray-400" />
                  </label>

                  {/* eSewa - Locked */}
                  <label className="flex items-center gap-6 p-6 transition-all border-2 border-gray-200 cursor-not-allowed rounded-2xl bg-gray-50 opacity-60">
                    <input type="radio" name="paymentMethod" value="esewa" disabled className="w-6 h-6 text-green-600 cursor-not-allowed" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <img src="data:image/png;base64,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" alt="eSewa" className="object-contain w-12 h-12 rounded-lg" />
                        <span className="text-xl font-semibold text-gray-900">eSewa</span>
                        <span className="px-3 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">Coming Soon</span>
                      </div>
                      <p className="mt-1 text-gray-500">Digital wallet payment - Coming soon</p>
                    </div>
                    <Lock className="w-5 h-5 text-gray-400" />
                  </label>
                </div>

                <div className="flex items-center justify-between mt-10">
                  <button onClick={() => setCurrentStep(1)} className="px-8 py-4 font-medium text-gray-900 transition border-2 border-gray-300 rounded-xl hover:bg-gray-50">
                    Back to Shipping
                  </button>

                  <button onClick={handlePlaceOrder} disabled={isProcessing}
                    className={`px-12 py-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xl transition shadow-lg flex items-center gap-4 ${isProcessing && 'opacity-75 cursor-not-allowed'}`}>
                    {isProcessing ? (
                      <>Processing <Loader2 className="w-6 h-6 animate-spin" /></>
                    ) : (
                      <>Place Order • Rs. {total.toLocaleString()}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky p-8 bg-white border border-gray-200 rounded-3xl top-8">
              <h2 className="mb-6 text-2xl font-medium text-gray-900">Order Summary</h2>

              <div className="mb-8 space-y-5 overflow-y-auto max-h-96">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-20 h-20 overflow-hidden bg-gray-100 rounded-xl">
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full grayscale" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="mt-2 font-semibold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 space-y-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                <span className="text-2xl font-light text-gray-900">Total</span>
                <span className="text-3xl font-medium text-gray-900">Rs. {total.toLocaleString()}</span>
              </div>

              {shipping === 0 && (
                <div className="p-4 mt-6 text-center border border-green-200 bg-green-50 rounded-xl">
                  <p className="flex items-center justify-center gap-2 font-semibold text-green-700">
                    <Truck className="w-5 h-5" /> Congratulations! Free shipping applied
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}