import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, User, Phone, Mail, Car, CheckCircle, AlertCircle, X } from 'lucide-react';

// --- sample Data ---
const storesData = {
  '北九州地区': [
    { id: 'yahata', name: '八幡本店', address: '北九州市八幡西区本城東1-1-1', tel: '093-691-5678', time: '10:00-18:00' },
    { id: 'kokura', name: '小倉店', address: '北九州市小倉北区木町1-2-3', tel: '093-581-5678', time: '10:00-18:00' },
    { id: 'kurosaki', name: '黒崎店', address: '北九州市八幡西区穴生1-3-5', tel: '093-641-5678', time: '10:00-18:00' },
  ],
  '京築地区': [
    { id: 'yukuhashi', name: '行橋店', address: '行橋市行事1-4-6', tel: '0930-22-5678', time: '10:00-18:00' },
    { id: 'kanda', name: '苅田店', address: '京都郡苅田町幸町1-5-8', tel: '093-434-5678', time: '10:00-18:00' },
  ],
  '福岡地区': [
    { id: 'fukuma', name: '福間店', address: '福津市中央1-7-9', tel: '0940-43-5678', time: '10:00-18:00' },
    { id: 'koga', name: '古賀店', address: '古賀市天神1-8-10', tel: '092-943-5678', time: '10:00-18:00' },
  ],
};

const availableTimes = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// --- Helper Functions ---
const formatDate = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${year}年${month}月${day}日 (${week})`;
};


// --- UI Components ---

// Loading Spinner
const Spinner = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
);

// Toast Notification
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className={`${bgColor} text-white font-bold rounded-lg shadow-lg flex items-center p-4`}>
        <Icon className="mr-3" />
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// Stepper UI
const Stepper = ({ currentStep, onStepClick }) => {
  const steps = ['地区・店舗選択', '日時選択', '情報入力', '内容確認', '予約完了'];
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = isCompleted && currentStep <= 4;

          return (
            <React.Fragment key={stepNumber}>
              <div
                className={`flex flex-col items-center text-center ${isClickable ? 'cursor-pointer hover:opacity-75' : ''}`}
                onClick={() => isClickable && onStepClick(stepNumber)}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent || isCompleted ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle size={20}/> : stepNumber}
                </div>
                <p className={`mt-2 text-xs sm:text-sm transition-all duration-300 ${
                    isCurrent || isCompleted ? 'text-gray-800 font-semibold' : 'text-gray-500'
                  }`}>{step}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${isCompleted ? 'bg-red-600' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Calendar Component
const Calendar = ({ selectedDate, onDateSelect, title }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    
    const dates = [];
    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }
    for (let i = 1; i <= days; i++) {
      dates.push(new Date(year, month, i));
    }
    return dates;
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 transition">
          <ChevronLeft className="text-gray-600" />
        </button>
        <h4 className="text-lg font-semibold text-gray-700">
          {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        </h4>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition">
          <ChevronRight className="text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="font-semibold py-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date, index) => {
          if (!date) return <div key={index}></div>;
          
          const isPast = date < today;
          const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
          const isToday = date.getTime() === today.getTime();

          return (
            <button
              key={index}
              disabled={isPast}
              onClick={() => onDateSelect(date)}
              className={`w-full aspect-square flex items-center justify-center rounded-full transition text-sm
                ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-red-100'}
                ${isSelected ? 'bg-red-600 text-white font-bold' : ''}
                ${!isSelected && isToday ? 'bg-red-200 text-red-700 font-bold' : ''}
                ${!isSelected && !isToday && !isPast ? 'text-gray-700' : ''}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// InputField Component (Moved outside for performance)
const InputField = ({ icon, name, label, placeholder, value, onChange, required = false, type = 'text', hasError = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 ${
          hasError ? 'bg-red-100 border-red-500' : 'border-gray-300'
        }`}
      />
    </div>
  </div>
);

// TopPage Component (Moved outside for best practice)
const TopPage = ({ onStart }) => (
  <div className="text-center py-10 sm:py-20 bg-white rounded-lg shadow-xl border border-gray-200">
    <img src="https://placehold.co/300x80/e81922/ffffff?text=Netz+TOYOTA" alt="ネッツトヨタ北九州" className="mx-auto mb-6 h-16 sm:h-20" />
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
      いつでも簡単、オンライン予約
    </h1>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
      車検・点検のご予約が24時間いつでも可能です。
      <br className="hidden sm:block" />
      お客様のご都合の良い日時をお選びください。
    </p>
    <button 
      onClick={onStart} 
      className="bg-red-600 text-white font-bold text-lg py-4 px-10 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
      車検・点検の予約をはじめる
    </button>
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center">
        <div className="bg-red-100 p-4 rounded-full mb-3">
          <CalendarIcon className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="font-bold text-lg text-gray-800">24時間受付</h3>
        <p className="text-gray-600">いつでもご予約いただけます</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-red-100 p-4 rounded-full mb-3">
          <Car className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="font-bold text-lg text-gray-800">全メーカー対応</h3>
        <p className="text-gray-600">トヨタ車以外も大歓迎です</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-red-100 p-4 rounded-full mb-3">
          <CheckCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="font-bold text-lg text-gray-800">プロの整備</h3>
        <p className="text-gray-600">安心してお任せください</p>
      </div>
    </div>
  </div>
);

// --- Step Components ---

const Step1_SelectStore = ({ onNext, reservation, setReservation }) => {
  const [selectedArea, setSelectedArea] = useState(reservation.area || '');

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setReservation({ ...reservation, area: area, store: null });
  };

  const handleStoreSelect = (store) => {
    setReservation({ ...reservation, store: store });
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">地区を選択してください</h2>
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {Object.keys(storesData).map(area => (
          <button
            key={area}
            onClick={() => handleAreaSelect(area)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              selectedArea === area ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {area}
          </button>
        ))}
      </div>

      {selectedArea && (
        <div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">店舗を選択してください</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storesData[selectedArea].map(store => (
              <div key={store.id} 
                   className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                   onClick={() => handleStoreSelect(store)}>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h3>
                  <p className="flex items-center text-gray-600 mb-2"><MapPin size={16} className="mr-2 text-red-500"/>{store.address}</p>
                  <p className="flex items-center text-gray-600"><Phone size={16} className="mr-2 text-red-500"/>{store.tel}</p>
                </div>
                <div className="bg-red-600 text-white text-center font-bold py-3">
                  この店舗で予約する
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Step2_SelectDateTime = ({ onNext, onBack, reservation, setReservation, showToast }) => {
  const handleSelect = (field, value) => {
    setReservation(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!reservation.date1 || !reservation.time1) {
      showToast('第1希望の日時を選択してください。', 'error');
      return;
    }
    if (reservation.date2 && !reservation.time2) {
      showToast('第2希望の日付を選択した場合、時間も選択してください。', 'error');
      return;
    }
    if (reservation.date1 && reservation.date2 && reservation.date1.getTime() === reservation.date2.getTime() && reservation.time1 === reservation.time2) {
      showToast('第1希望と第2希望は異なる日時を選択してください。', 'error');
      return;
    }
    onNext();
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">ご希望の日時を選択してください</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* First Choice */}
        <div className="space-y-4">
          <Calendar title="第1希望日" selectedDate={reservation.date1} onDateSelect={(date) => handleSelect('date1', date)} />
          {reservation.date1 && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">第1希望時間</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    onClick={() => handleSelect('time1', time)}
                    className={`p-2 rounded-md font-semibold text-sm transition ${
                      reservation.time1 === time ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Second Choice */}
        <div className="space-y-4">
          <Calendar title="第2希望日（任意）" selectedDate={reservation.date2} onDateSelect={(date) => handleSelect('date2', date)} />
          {reservation.date2 && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">第2希望時間</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    onClick={() => handleSelect('time2', time)}
                    className={`p-2 rounded-md font-semibold text-sm transition ${
                      reservation.time2 === time ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition shadow-md">戻る</button>
        <button onClick={handleNext} className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition shadow-md">次へ</button>
      </div>
    </div>
  );
};

const Step3_InputUserInfo = ({ onNext, onBack, reservation, setReservation, showToast }) => {
  const [formData, setFormData] = useState({
    name: reservation.name || '',
    phone: reservation.phone || '',
    email: reservation.email || '',
    carMaker: reservation.carMaker || 'トヨタ',
    carName: reservation.carName || '',
    carNumber: reservation.carNumber || '',
    serviceType: reservation.serviceType || 'shaken',
    carLoaner: reservation.carLoaner || 'no',
    comments: reservation.comments || '',
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^0\d{1,4}-?\d{1,4}-?\d{3,4}$|^0\d{9,10}$/.test(phone.replace(/[-－]/g, ''));

    if (!formData.name) newErrors.name = true;
    if (!formData.phone || !validatePhone(formData.phone)) newErrors.phone = true;
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = true;
    if (!formData.carName) newErrors.carName = true;
    
    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      window.scrollTo(0, 0);
      showToast('赤色の項目を正しく入力してください。', 'error');
      return;
    }
    
    setReservation({ ...reservation, ...formData });
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">お客様と車両の情報を入力してください</h2>
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200 space-y-6">
        {/* Customer Info */}
        <fieldset className="border-t border-gray-200 pt-6">
          <legend className="text-lg font-semibold text-gray-900 mb-4">お客様情報</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField icon={<User size={18} className="text-gray-400"/>} name="name" label="お名前" placeholder="山田 太郎" value={formData.name} onChange={handleChange} required hasError={errors.name} />
            <InputField icon={<Phone size={18} className="text-gray-400"/>} name="phone" label="電話番号" placeholder="090-1234-5678" value={formData.phone} onChange={handleChange} required type="tel" hasError={errors.phone} />
            <div className="md:col-span-2">
              <InputField icon={<Mail size={18} className="text-gray-400"/>} name="email" label="メールアドレス" placeholder="example@email.com" value={formData.email} onChange={handleChange} required type="email" hasError={errors.email} />
            </div>
          </div>
        </fieldset>

        {/* Vehicle Info */}
        <fieldset className="border-t border-gray-200 pt-6">
          <legend className="text-lg font-semibold text-gray-900 mb-4">車両情報</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="carMaker" className="block text-sm font-medium text-gray-700 mb-1">メーカー</label>
              <select id="carMaker" name="carMaker" value={formData.carMaker} onChange={handleChange} className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                <option>トヨタ</option>
                <option>日産</option>
                <option>ホンダ</option>
                <option>マツダ</option>
                <option>スバル</option>
                <option>スズキ</option>
                <option>ダイハツ</option>
                <option>その他</option>
              </select>
            </div>
            <InputField icon={<Car size={18} className="text-gray-400"/>} name="carName" label="車名" placeholder="プリウス" value={formData.carName} onChange={handleChange} required hasError={errors.carName} />
            <InputField icon={<Car size={18} className="text-gray-400"/>} name="carNumber" label="ナンバープレート（任意）" placeholder="北九州 300 あ 1234" value={formData.carNumber} onChange={handleChange} />
          </div>
        </fieldset>

        {/* Service Request */}
        <fieldset className="border-t border-gray-200 pt-6">
          <legend className="text-lg font-semibold text-gray-900 mb-4">ご用命</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">ご希望の整備内容</label>
              <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                <option value="shaken">車検（24ヶ月点検）</option>
                <option value="12m_check">12ヶ月点検</option>
                <option value="6m_check">6ヶ月点検</option>
                <option value="oil_change">オイル交換</option>
                <option value="repair">一般修理・その他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">代車の要否</label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center">
                  <input type="radio" name="carLoaner" value="yes" checked={formData.carLoaner === 'yes'} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500" />
                  <span className="ml-2 text-gray-700">必要</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="carLoaner" value="no" checked={formData.carLoaner === 'no'} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500" />
                  <span className="ml-2 text-gray-700">不要</span>
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">ご要望・気になる点（任意）</label>
              <textarea id="comments" name="comments" rows="4" value={formData.comments} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" placeholder="例：走行中に異音がする、ブレーキの効きが悪いなど"></textarea>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition shadow-md">戻る</button>
        <button onClick={handleNext} className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition shadow-md">次へ</button>
      </div>
    </div>
  );
};

const Step4_Confirmation = ({ onNext, onBack, reservation, setStep }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolicyChecked, setIsPolicyChecked] = useState(false);

  const handleSubmit = () => {
    if (!isPolicyChecked) {
      alert('プライバシーポリシーに同意してください。');
      return;
    }
    setIsSubmitting(true);
    // Simulate backend submission
    console.log("Reservation Data:", reservation);
    setTimeout(() => {
      setIsSubmitting(false);
      onNext();
    }, 2000);
  };

  const serviceTypeMap = {
    shaken: '車検（24ヶ月点検）',
    '12m_check': '12ヶ月点検',
    '6m_check': '6ヶ月点検',
    oil_change: 'オイル交換',
    repair: '一般修理・その他',
  };

  const InfoRow = ({ label, value, icon }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
      <dt className="text-sm font-medium text-gray-500 flex items-center">{icon}{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-semibold">{value || 'ー'}</dd>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">予約内容の確認</h2>
      <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg font-semibold leading-6 text-gray-900">ご予約内容</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">以下の内容でお間違いなければ、予約を確定してください。</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200 px-4 sm:px-6">
            <InfoRow label="ご予約店舗" value={reservation.store?.name} icon={<MapPin size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label="第1希望日時" value={`${formatDate(reservation.date1)} ${reservation.time1}`} icon={<CalendarIcon size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label="第2希望日時" value={reservation.date2 ? `${formatDate(reservation.date2)} ${reservation.time2}` : 'なし'} icon={<CalendarIcon size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label="お名前" value={reservation.name} icon={<User size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label="電話番号" value={reservation.phone} icon={<Phone size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label="メールアドレス" value={reservation.email} icon={<Mail size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label="メーカー" value={reservation.carMaker} icon={<Car size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label="車名" value={reservation.carName} icon={<Car size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label="整備内容" value={serviceTypeMap[reservation.serviceType]} icon={<CheckCircle size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label="代車" value={reservation.carLoaner === 'yes' ? '必要' : '不要'} icon={<Car size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label="ご要望" value={reservation.comments} icon={<Mail size={16} className="mr-2 text-gray-400"/>} />
          </dl>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="policy"
              name="policy"
              type="checkbox"
              checked={isPolicyChecked}
              onChange={(e) => setIsPolicyChecked(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="policy" className="font-medium text-gray-700">
              <a href="#" className="text-red-600 hover:underline">プライバシーポリシー</a>に同意する
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition shadow-md">修正する</button>
        <button onClick={handleSubmit} disabled={isSubmitting || !isPolicyChecked} className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition shadow-md flex items-center justify-center disabled:bg-red-300 disabled:cursor-not-allowed">
          {isSubmitting ? <Spinner /> : 'この内容で予約する'}
        </button>
      </div>
    </div>
  );
};

const Step5_Complete = ({ reservation, onReset }) => {
  const serviceTypeMap = {
    shaken: '車検（24ヶ月点検）',
    '12m_check': '12ヶ月点検',
    '6m_check': '6ヶ月点検',
    oil_change: 'オイル交換',
    repair: '一般修理・その他',
  };

  return (
    <div className="text-center py-10">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">ご予約ありがとうございます</h2>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        ご予約の受付が完了いたしました。
        <br />
        後ほど、担当者より <strong className="text-red-600">{reservation.store.name}</strong> から予約確定のご連絡をさせていただきます。
      </p>
      <p className="mt-2 text-gray-600">
        ご入力いただいたメールアドレス <strong className="text-red-600">{reservation.email}</strong> にも確認メールを送信しましたので、ご確認ください。
      </p>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg mx-auto text-left">
        <h3 className="font-bold text-lg mb-4 text-gray-800">ご予約内容の概要</h3>
        <p className="text-gray-700"><strong className="font-semibold">店舗:</strong> {reservation.store.name}</p>
        <p className="text-gray-700"><strong className="font-semibold">第1希望:</strong> {formatDate(reservation.date1)} {reservation.time1}</p>
        {reservation.date2 && (
          <p className="text-gray-700"><strong className="font-semibold">第2希望:</strong> {formatDate(reservation.date2)} {reservation.time2}</p>
        )}
        <p className="text-gray-700"><strong className="font-semibold">お名前:</strong> {reservation.name}</p>
        <p className="text-gray-700"><strong className="font-semibold">整備内容:</strong> {serviceTypeMap[reservation.serviceType]}</p>
        <p className="text-gray-700"><strong className="font-semibold">代車:</strong> {reservation.carLoaner === 'yes' ? '必要' : '不要'}</p>
      </div>
      <button 
        onClick={onReset} 
        className="mt-10 bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition shadow-md">
        トップページに戻る
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  const [step, setStep] = useState(0); // 0: Top Page
  const [reservation, setReservation] = useState({});
  const [toast, setToast] = useState(null);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const initialReservationState = {
    area: null,
    store: null,
    date1: null,
    time1: null,
    date2: null,
    time2: null,
    name: '',
    phone: '',
    email: '',
    carMaker: 'トヨタ',
    carName: '',
    carNumber: '',
    serviceType: 'shaken',
    carLoaner: 'no',
    comments: '',
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  const handleReset = () => {
    setReservation(initialReservationState);
    setStep(0);
  };
  
  const handleStepClick = (stepNumber) => {
    if (stepNumber < step) {
      setStep(stepNumber);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1_SelectStore onNext={handleNext} reservation={reservation} setReservation={setReservation} />;
      case 2:
        return <Step2_SelectDateTime onNext={handleNext} onBack={handleBack} reservation={reservation} setReservation={setReservation} showToast={showToast} />;
      case 3:
        return <Step3_InputUserInfo onNext={handleNext} onBack={handleBack} reservation={reservation} setReservation={setReservation} showToast={showToast} />;
      case 4:
        return <Step4_Confirmation onNext={handleNext} onBack={handleBack} reservation={reservation} setStep={setStep} />;
      case 5:
        return <Step5_Complete reservation={reservation} onReset={handleReset} />;
      default:
        return <TopPage onStart={() => setStep(1)} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center cursor-pointer" onClick={handleReset}>
              <img src="https://placehold.co/150x40/e81922/ffffff?text=Netz" alt="Logo" className="h-8 sm:h-10" />
              <span className="ml-3 text-lg sm:text-xl font-bold text-gray-700 hidden sm:block">車検・点検予約</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-red-600 transition flex items-center">
                <AlertCircle size={16} className="mr-1" />
                事故・故障の時は
              </a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-red-600 transition flex items-center">
                <MapPin size={16} className="mr-1" />
                店舗一覧
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {step > 0 && <Stepper currentStep={step} onStepClick={handleStepClick} />}
          <div className="mt-8">
            {renderStep()}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>&copy; 2025 Netz Toyota Kitakyushu. All Rights Reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-sm hover:underline">利用規約</a>
              <a href="#" className="text-sm hover:underline">プライバシーポリシー</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
