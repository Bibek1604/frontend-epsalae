import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useCart } from '@/store/cartstore'
import { orderApi } from '../components/api/orderapi'

// Nepal Districts and Cities Data (All 77 Districts with Real Municipalities)
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
    // Shipping Info (matching Order schema)
    first_name: '',
    last_name: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    description: '',
    country: 'Nepal',

    // Payment Info
    paymentMethod: 'cod', // cod, khalti, esewa
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    
    // Billing Address
    sameAsShipping: true,
  })

  const subtotal = getTotalPrice()
  const tax = (subtotal * 0.1)
  const shipping = subtotal > 10000 ? 0 : 200
  const total = subtotal + tax + shipping

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Auto-fill name from first_name and last_name
      name: name === 'first_name' || name === 'last_name' 
        ? `${formData.first_name} ${formData.last_name}`.trim()
        : prev.name
    }))
  }

  const validateStep = (step) => {
    setError('')
    if (step === 1) {
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
        setError('Please fill in all required fields (First Name, Last Name, Email, Phone)')
        return false
      }
      if (!formData.address || !formData.city || !formData.district) {
        setError('Please complete the shipping address (Address, City, District)')
        return false
      }
      if (!formData.description) {
        setError('Please add delivery instructions or notes')
        return false
      }
    }
    if (step === 2) {
      if (!formData.paymentMethod) {
        setError('Please select a payment method')
        return false
      }
    }
    return true
  }

  const handleNextStep = async () => {
    if (!validateStep(currentStep)) return

    if (currentStep === 2) {
      setIsProcessing(true)
      try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Create order - only send fields the backend accepts
        // Backend auto-generates: id, status, statusHistory, created_at
        const orderData = {
          user_id: null, // No user login system currently
          first_name: formData.first_name,
          last_name: formData.last_name,
          name: `${formData.first_name} ${formData.last_name}`.trim(),
          phone: formData.phone,
          district: formData.district,
          city: formData.city,
          address: formData.address,
          description: formData.description || 'No special instructions',
          items: cart.map(item => ({
            productId: item.id || item._id,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            imageUrl: item.image || item.imageUrl || '',
          })),
          totalAmount: Number(total),
        }

        console.log('📤 Sending order data:', JSON.stringify(orderData, null, 2))

        // Send order to backend
        const res = await orderApi.create(orderData)
        console.log('✅ Order created:', res.data)
        
        // Get the order ID from response
        const createdOrder = res.data?.data || res.data
        const orderId = createdOrder?.id || createdOrder?._id || 'ORDER'
        
        // Send WhatsApp notification to admin
        const whatsappMessage = `🛒 *New Order Received!*\n\n` +
          `📦 *Order ID:* #${orderId.toString().slice(-8)}\n` +
          `👤 *Customer:* ${formData.first_name} ${formData.last_name}\n` +
          `📞 *Phone:* ${formData.phone}\n` +
          `📍 *Location:* ${formData.city}, ${formData.district}\n` +
          `🏠 *Address:* ${formData.address}\n` +
          `💰 *Total:* Rs. ${total.toLocaleString()}\n` +
          `📝 *Items:* ${cart.length} item(s)\n` +
          `💳 *Payment:* ${formData.paymentMethod === 'cod' ? 'Cash on Delivery' : formData.paymentMethod.toUpperCase()}\n\n` +
          `🔗 Check admin panel for details.`
        
        const whatsappUrl = `https://wa.me/9779860056658?text=${encodeURIComponent(whatsappMessage)}`
        window.open(whatsappUrl, '_blank')
        
        clearCart()
        
        navigate(`/order-success/${orderId}`, {
          state: {
            orderData: createdOrder,
            paymentMethod: formData.paymentMethod,
          }
        })
      } catch (err) {
        console.error('❌ Order creation failed:', err)
        console.error('❌ Response data:', err.response?.data)
        const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to create order. Please try again.'
        setError(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ChevronLeft size={20} />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      step < currentStep
                        ? 'bg-green-500 text-white'
                        : step === currentStep
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? <Check size={20} /> : step}
                  </div>
                  <div className="flex-1 h-1 mx-2 bg-gray-300" />
                </div>
              ))}
              <div className="text-right">
                <p className="text-xs text-gray-600 uppercase">Step {currentStep} of 2</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="text-red-600 mt-0.5" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
                />

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select District</option>
                      {Object.keys(NEPAL_DISTRICTS).sort().map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!formData.district}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {formData.district ? 'Select City' : 'Select District First'}
                      </option>
                      {formData.district && NEPAL_DISTRICTS[formData.district]?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <textarea
                  name="description"
                  placeholder="Delivery instructions or special notes"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-6"
                />

                {/* Step 1 Submit Button */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <Lock className="text-blue-600 mt-0.5" size={20} />
                  <p className="text-sm text-blue-700">Your payment information is secure and encrypted</p>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-3 mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method *</label>
                  
                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💵</span>
                        <span className="font-semibold text-gray-900">Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
                    </div>
                  </label>

                  {/* Khalti */}
                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMethod === 'khalti'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="khalti"
                      checked={formData.paymentMethod === 'khalti'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🟣</span>
                        <span className="font-semibold text-gray-900">Khalti</span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Digital Wallet</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Pay instantly using Khalti wallet</p>
                    </div>
                  </label>

                  {/* eSewa */}
                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMethod === 'esewa'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="esewa"
                      checked={formData.paymentMethod === 'esewa'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-green-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🟢</span>
                        <span className="font-semibold text-gray-900">eSewa</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Digital Wallet</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Pay instantly using eSewa wallet</p>
                    </div>
                  </label>
                </div>

                {/* Card Details (only shown for online payment methods) */}
                {(formData.paymentMethod === 'khalti' || formData.paymentMethod === 'esewa') && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <p className="text-sm text-yellow-700">💡 You will be redirected to {formData.paymentMethod === 'khalti' ? 'Khalti' : 'eSewa'} to complete payment after placing order.</p>
                  </div>
                )}

                {formData.paymentMethod === 'cod' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <p className="text-sm text-green-700">✓ Pay with cash when your order is delivered. Please keep exact change ready.</p>
                  </div>
                )}

                {/* Hidden card fields - kept for future card payment integration */}
                <input
                  type="hidden"
                  name="cardName"
                  value={formData.cardName}
                />

                {/* Order Summary for Payment */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Total</h3>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Step 2 Submit Button */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-lg font-bold text-lg text-white transition-colors shadow-lg flex items-center justify-center gap-2 ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isProcessing && <Loader2 size={20} className="animate-spin" />}
                  {isProcessing ? 'Processing Order...' : '✓ Place Order Now'}
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 p-4 bg-gray-100 rounded-lg">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-3 border-2 border-gray-400 text-gray-900 rounded-lg font-semibold hover:border-gray-500 hover:bg-gray-200"
                >
                  ← Back to Shipping
                </button>
              )}
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isProcessing}
                className={`flex-1 py-4 rounded-lg font-bold text-white text-lg transition flex items-center justify-center gap-2 shadow-lg ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : currentStep === 1
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isProcessing && <Loader2 size={20} className="animate-spin" />}
                {isProcessing ? 'Processing...' : currentStep === 1 ? 'Continue to Payment →' : '✓ Place Order Now'}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : '₹' + shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-6 border-t flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">₹{total.toFixed(2)}</span>
              </div>

              {shipping === 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  ✓ Free shipping applied!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
