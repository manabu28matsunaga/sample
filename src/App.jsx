import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, User, Phone, Mail, Car, CheckCircle, AlertCircle, X, Globe } from 'lucide-react';

// --- Translation Data ---
const translations = {
  ja: {
    header: {
      emergency: "事故・故障の時は",
      stores: "店舗一覧",
      title: "車検・点検予約",
      langButton: "English"
    },
    footer: {
      copyright: "© 2025 Netz Toyota Kitakyushu. All Rights Reserved.",
      terms: "企業情報",
      privacy: "プライバシーポリシー"
    },
    topPage: {
      title: "いつでも簡単、オンライン予約",
      subtitle: "車検・点検のご予約が24時間いつでも可能です。\nお客様のご都合の良い日時をお選びください。",
      startButton: "車検・点検の予約をはじめる",
      feature1Title: "24時間受付",
      feature1Desc: "いつでもご予約いただけます",
      feature2Title: "全メーカー対応",
      feature2Desc: "トヨタ車以外も大歓迎です",
      feature3Title: "プロの整備",
      feature3Desc: "安心してお任せください"
    },
    stepper: {
      steps: ['地区・店舗選択', '日時選択', '情報入力', '内容確認', '予約完了']
    },
    step1: {
      areaTitle: "地区を選択してください",
      storeTitle: "店舗を選択してください",
      selectButton: "この店舗で予約する"
    },
    step2: {
      title: "ご希望の日時を選択してください",
      firstChoice: "第1希望日",
      secondChoice: "第2希望日（任意）",
      firstChoiceTime: "第1希望時間",
      secondChoiceTime: "第2希望時間",
      backButton: "戻る",
      nextButton: "次へ",
      error: {
        selectFirst: "第1希望の日時を選択してください。",
        selectTimeForSecond: "第2希望の日付を選択した場合、時間も選択してください。",
        differentTimes: "第1希望と第2希望は異なる日時を選択してください。"
      }
    },
    step3: {
      title: "お客様と車両の情報を入力してください",
      customerInfo: "お客様情報",
      name: "お名前",
      namePlaceholder: "山田 太郎",
      phone: "電話番号",
      phonePlaceholder: "090-1234-5678",
      email: "メールアドレス",
      emailPlaceholder: "example@email.com",
      vehicleInfo: "車両情報",
      maker: "メーカー",
      carName: "車名",
      carNamePlaceholder: "プリウス",
      carNumber: "ナンバープレート（任意）",
      carNumberPlaceholder: "北九州 300 あ 1234",
      serviceInfo: "ご用命",
      serviceType: "ご希望の整備内容",
      loanerCar: "代車の要否",
      loanerCarNeeded: "必要",
      loanerCarNotNeeded: "不要",
      comments: "ご要望・気になる点（任意）",
      commentsPlaceholder: "例：走行中に異音がする、ブレーキの効きが悪いなど",
      error: {
        required: "赤色の項目を正しく入力してください。",
      },
      serviceOptions: {
        shaken: '車検（24ヶ月点検）',
        '12m_check': '12ヶ月点検',
        '6m_check': '6ヶ月点検',
        oil_change: 'オイル交換',
        repair: '一般修理・その他',
      },
      carMakers: ['トヨタ', '日産', 'ホンダ', 'マツダ', 'スバル', 'スズキ', 'ダイハツ', 'その他'],
    },
    step4: {
      title: "予約内容の確認",
      subtitle: "ご予約内容",
      description: "以下の内容でお間違いなければ、予約を確定してください。",
      store: "ご予約店舗",
      datetime1: "第1希望日時",
      datetime2: "第2希望日時",
      name: "お名前",
      phone: "電話番号",
      email: "メールアドレス",
      maker: "メーカー",
      carName: "車名",
      serviceType: "整備内容",
      loanerCar: "代車",
      comments: "ご要望",
      none: "なし",
      policy: "{policyLink}に同意する",
      policyAlert: "プライバシーポリシーに同意してください。",
      backButton: "修正する",
      submitButton: "この内容で予約する"
    },
    step5: {
      title: "ご予約ありがとうございます",
      p1: "ご予約の受付が完了いたしました。",
      p2: "後ほど、担当者より {storeName} から予約確定のご連絡をさせていただきます。",
      p3: "ご入力いただいたメールアドレス {email} にも確認メールを送信しましたので、ご確認ください。",
      summaryTitle: "ご予約内容の概要",
      store: "店舗",
      datetime1: "第1希望",
      datetime2: "第2希望",
      name: "お名前",
      serviceType: "整備内容",
      loanerCar: "代車",
      backToTop: "トップページに戻る"
    },
    calendar: {
      weekdays: ['日', '月', '火', '水', '木', '金', '土'],
      year: "年",
      month: "月"
    }
  },
  en: {
    header: {
      emergency: "Emergency",
      stores: "Store List",
      title: "Service Booking",
      langButton: "日本語"
    },
    footer: {
      copyright: "© 2025 Netz Toyota Kitakyushu. All Rights Reserved.",
      terms: "Corporate Info",
      privacy: "Privacy Policy"
    },
    topPage: {
      title: "Easy Online Booking",
      subtitle: "Book your vehicle inspection and maintenance 24/7.\nPlease choose a convenient date and time.",
      startButton: "Start Booking",
      feature1Title: "24/7 Reception",
      feature1Desc: "Book anytime you want",
      feature2Title: "All Car Makes",
      feature2Desc: "We welcome non-Toyota cars",
      feature3Title: "Professional Service",
      feature3Desc: "Leave it to our experts"
    },
    stepper: {
      steps: ['Select Store', 'Select Date', 'Your Info', 'Confirm', 'Complete']
    },
    step1: {
      areaTitle: "Please select an area",
      storeTitle: "Please select a store",
      selectButton: "Book at this store"
    },
    step2: {
      title: "Please select your desired date and time",
      firstChoice: "1st Choice Date",
      secondChoice: "2nd Choice Date (Optional)",
      firstChoiceTime: "1st Choice Time",
      secondChoiceTime: "2nd Choice Time",
      backButton: "Back",
      nextButton: "Next",
      error: {
        selectFirst: "Please select the 1st choice date and time.",
        selectTimeForSecond: "If you select a 2nd choice date, please also select a time.",
        differentTimes: "The 1st and 2nd choices must be different."
      }
    },
    step3: {
      title: "Please enter your and your vehicle's information",
      customerInfo: "Customer Information",
      name: "Name",
      namePlaceholder: "Taro Yamada",
      phone: "Phone Number",
      phonePlaceholder: "090-1234-5678",
      email: "Email Address",
      emailPlaceholder: "example@email.com",
      vehicleInfo: "Vehicle Information",
      maker: "Manufacturer",
      carName: "Car Model",
      carNamePlaceholder: "Prius",
      carNumber: "License Plate (Optional)",
      carNumberPlaceholder: "Kitakyushu 300 A 1234",
      serviceInfo: "Service Request",
      serviceType: "Desired Service",
      loanerCar: "Loaner Car",
      loanerCarNeeded: "Needed",
      loanerCarNotNeeded: "Not Needed",
      comments: "Requests / Concerns (Optional)",
      commentsPlaceholder: "e.g., Strange noise while driving, brakes feel weak, etc.",
      error: {
        required: "Please fill in the required fields highlighted in red correctly.",
      },
      serviceOptions: {
        shaken: 'Vehicle Inspection (Shaken)',
        '12m_check': '12-Month Inspection',
        '6m_check': '6-Month Inspection',
        oil_change: 'Oil Change',
        repair: 'General Repair / Other',
      },
      carMakers: ['Toyota', 'Nissan', 'Honda', 'Mazda', 'Subaru', 'Suzuki', 'Daihatsu', 'Other'],
    },
    step4: {
      title: "Confirm Your Booking",
      subtitle: "Booking Details",
      description: "Please review the details below and confirm your booking.",
      store: "Store",
      datetime1: "1st Choice",
      datetime2: "2nd Choice",
      name: "Name",
      phone: "Phone",
      email: "Email",
      maker: "Manufacturer",
      carName: "Car Model",
      serviceType: "Service",
      loanerCar: "Loaner Car",
      comments: "Requests",
      none: "None",
      policy: "I agree to the {policyLink}",
      policyAlert: "Please agree to the Privacy Policy.",
      backButton: "Edit",
      submitButton: "Confirm Booking"
    },
    step5: {
      title: "Thank you for your booking!",
      p1: "Your booking request has been received.",
      p2: "A representative from {storeName} will contact you shortly to confirm.",
      p3: "A confirmation email has also been sent to {email}.",
      summaryTitle: "Booking Summary",
      store: "Store",
      datetime1: "1st Choice",
      datetime2: "2nd Choice",
      name: "Name",
      serviceType: "Service",
      loanerCar: "Loaner Car",
      backToTop: "Back to Top Page"
    },
    calendar: {
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      year: "",
      month: ""
    }
  }
};

// --- Store Data with Translations ---
const storesData = [
  {
    id: 'kitakyushu',
    name: { ja: '北九州地区', en: 'Kitakyushu Area' },
    stores: [
      { id: 'yahata', name: { ja: '八幡本店', en: 'Yahata Main Store' }, address: { ja: '北九州市八幡西区本城東1-1-1', en: '1-1-1 Honjo-higashi, Yahatanishi-ku, Kitakyushu-shi' }, tel: '093-691-5678', time: '10:00-18:00' },
      { id: 'kokura', name: { ja: '小倉店', en: 'Kokura Store' }, address: { ja: '北九州市小倉北区木町1-2-3', en: '1-2-3 Kimachi, Kokurakita-ku, Kitakyushu-shi' }, tel: '093-581-5678', time: '10:00-18:00' },
      { id: 'kurosaki', name: { ja: '黒崎店', en: 'Kurosaki Store' }, address: { ja: '北九州市八幡西区穴生1-3-5', en: '1-3-5 Ano, Yahatanishi-ku, Kitakyushu-shi' }, tel: '093-641-5678', time: '10:00-18:00' },
    ]
  },
  {
    id: 'keichiku',
    name: { ja: '京築地区', en: 'Keichiku Area' },
    stores: [
       { id: 'yukuhashi', name: { ja: '行橋店', en: 'Yukuhashi Store' }, address: { ja: '行橋市行事1-4-6', en: '1-4-6 Gyoji, Yukuhashi-shi' }, tel: '0930-22-5678', time: '10:00-18:00' },
       { id: 'kanda', name: { ja: '苅田店', en: 'Kanda Store' }, address: { ja: '京都郡苅田町幸町1-5-8', en: '1-5-8 Saiwai-cho, Kanda-machi, Miyako-gun' }, tel: '093-434-5678', time: '10:00-18:00' },
    ]
  },
  {
    id: 'fukuoka',
    name: { ja: '福岡地区', en: 'Fukuoka Area' },
    stores: [
       { id: 'fukuma', name: { ja: '福間店', en: 'Fukuma Store' }, address: { ja: '福津市中央1-7-9', en: '1-7-9 Chuo, Fukutsu-shi' }, tel: '0940-43-5678', time: '10:00-18:00' },
       { id: 'koga', name: { ja: '古賀店', en: 'Koga Store' }, address: { ja: '古賀市天神1-8-10', en: '1-8-10 Tenjin, Koga-shi' }, tel: '092-943-5678', time: '10:00-18:00' },
    ]
  }
];


const availableTimes = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// --- Helper Functions ---
const formatDate = (date, lang = 'ja') => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = lang === 'ja' 
    ? ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  
  return lang === 'ja'
    ? `${year}年${month}月${day}日 (${week})`
    : `${year}/${month}/${day} (${week})`;
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
    <div className="fixed top-24 right-5 z-50">
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
const Stepper = ({ currentStep, onStepClick, t }) => {
  const steps = t.stepper.steps;
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
const Calendar = ({ selectedDate, onDateSelect, title, lang, t }) => {
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
  
  const monthNames = lang === 'ja'
    ? [...Array(12).keys()].map(i => `${i + 1}${t.calendar.month}`)
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 transition">
          <ChevronLeft className="text-gray-600" />
        </button>
        <h4 className="text-lg font-semibold text-gray-700">
          {lang === 'ja'
            ? `${currentDate.getFullYear()}${t.calendar.year} ${monthNames[currentDate.getMonth()]}`
            : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
          }
        </h4>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition">
          <ChevronRight className="text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
        {t.calendar.weekdays.map(day => (
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

// InputField Component
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

// TopPage Component
const TopPage = ({ onStart, t }) => (
  <div className="text-center py-10 sm:py-20 bg-white rounded-lg shadow-xl border border-gray-200">
    <img src="https://placehold.co/300x80/e81922/ffffff?text=Netz+TOYOTA" alt="ネッツトヨタ北九州" className="mx-auto mb-6 h-16 sm:h-20" />
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
      {t.topPage.title}
    </h1>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 whitespace-pre-line">
      {t.topPage.subtitle}
    </p>
    <button 
      onClick={onStart} 
      className="bg-red-600 text-white font-bold text-lg py-4 px-10 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
      {t.topPage.startButton}
    </button>
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center">
        <div className="bg-red-100 p-4 rounded-full mb-3">
          <CalendarIcon className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="font-bold text-lg text-gray-800">{t.topPage.feature1Title}</h3>
        <p className="text-gray-600">{t.topPage.feature1Desc}</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-red-100 p-4 rounded-full mb-3">
          <Car className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="font-bold text-lg text-gray-800">{t.topPage.feature2Title}</h3>
        <p className="text-gray-600">{t.topPage.feature2Desc}</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-red-100 p-4 rounded-full mb-3">
          <CheckCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="font-bold text-lg text-gray-800">{t.topPage.feature3Title}</h3>
        <p className="text-gray-600">{t.topPage.feature3Desc}</p>
      </div>
    </div>
  </div>
);

// --- Step Components ---

const Step1_SelectStore = ({ onNext, reservation, setReservation, t, lang }) => {
  const [selectedArea, setSelectedArea] = useState(reservation.area || null);

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
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {storesData.map(area => (
          <button
            key={area.id}
            onClick={() => handleAreaSelect(area)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              selectedArea?.id === area.id ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {area.name[lang]}
          </button>
        ))}
      </div>

      {selectedArea && (
        <div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{t.step1.storeTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedArea.stores.map(store => (
              <div key={store.id} 
                   className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                   onClick={() => handleStoreSelect(store)}>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name[lang]}</h3>
                  <p className="flex items-center text-gray-600 mb-2"><MapPin size={16} className="mr-2 text-red-500"/>{store.address[lang]}</p>
                  <p className="flex items-center text-gray-600"><Phone size={16} className="mr-2 text-red-500"/>{store.tel}</p>
                </div>
                <div className="bg-red-600 text-white text-center font-bold py-3">
                  {t.step1.selectButton}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Step2_SelectDateTime = ({ onNext, onBack, reservation, setReservation, showToast, lang, t }) => {
  const handleSelect = (field, value) => {
    setReservation(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!reservation.date1 || !reservation.time1) {
      showToast(t.step2.error.selectFirst, 'error');
      return;
    }
    if (reservation.date2 && !reservation.time2) {
      showToast(t.step2.error.selectTimeForSecond, 'error');
      return;
    }
    if (reservation.date1 && reservation.date2 && reservation.date1.getTime() === reservation.date2.getTime() && reservation.time1 === reservation.time2) {
      showToast(t.step2.error.differentTimes, 'error');
      return;
    }
    onNext();
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* First Choice */}
        <div className="space-y-4">
          <Calendar title={t.step2.firstChoice} selectedDate={reservation.date1} onDateSelect={(date) => handleSelect('date1', date)} lang={lang} t={t} />
          {reservation.date1 && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t.step2.firstChoiceTime}</h3>
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
          <Calendar title={t.step2.secondChoice} selectedDate={reservation.date2} onDateSelect={(date) => handleSelect('date2', date)} lang={lang} t={t} />
          {reservation.date2 && (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t.step2.secondChoiceTime}</h3>
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
        <button onClick={onBack} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition shadow-md">{t.step2.backButton}</button>
        <button onClick={handleNext} className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition shadow-md">{t.step2.nextButton}</button>
      </div>
    </div>
  );
};

const Step3_InputUserInfo = ({ onNext, onBack, reservation, setReservation, showToast, t }) => {
  const [formData, setFormData] = useState({
    name: reservation.name || '',
    phone: reservation.phone || '',
    email: reservation.email || '',
    carMaker: reservation.carMaker || t.step3.carMakers[0],
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
      showToast(t.step3.error.required, 'error');
      return;
    }
    
    setReservation({ ...reservation, ...formData });
    onNext();
  };

  return (
    <div>
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200 space-y-6">
        <fieldset className="border-t border-gray-200 pt-6">
          <legend className="text-lg font-semibold text-gray-900 mb-4">{t.step3.customerInfo}</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField icon={<User size={18} className="text-gray-400"/>} name="name" label={t.step3.name} placeholder={t.step3.namePlaceholder} value={formData.name} onChange={handleChange} required hasError={errors.name} />
            <InputField icon={<Phone size={18} className="text-gray-400"/>} name="phone" label={t.step3.phone} placeholder={t.step3.phonePlaceholder} value={formData.phone} onChange={handleChange} required type="tel" hasError={errors.phone} />
            <div className="md:col-span-2">
              <InputField icon={<Mail size={18} className="text-gray-400"/>} name="email" label={t.step3.email} placeholder={t.step3.emailPlaceholder} value={formData.email} onChange={handleChange} required type="email" hasError={errors.email} />
            </div>
          </div>
        </fieldset>

        <fieldset className="border-t border-gray-200 pt-6">
          <legend className="text-lg font-semibold text-gray-900 mb-4">{t.step3.vehicleInfo}</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="carMaker" className="block text-sm font-medium text-gray-700 mb-1">{t.step3.maker}</label>
              <select id="carMaker" name="carMaker" value={formData.carMaker} onChange={handleChange} className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                {t.step3.carMakers.map(maker => <option key={maker}>{maker}</option>)}
              </select>
            </div>
            <InputField icon={<Car size={18} className="text-gray-400"/>} name="carName" label={t.step3.carName} placeholder={t.step3.carNamePlaceholder} value={formData.carName} onChange={handleChange} required hasError={errors.carName} />
            <InputField icon={<Car size={18} className="text-gray-400"/>} name="carNumber" label={t.step3.carNumber} placeholder={t.step3.carNumberPlaceholder} value={formData.carNumber} onChange={handleChange} />
          </div>
        </fieldset>

        <fieldset className="border-t border-gray-200 pt-6">
          <legend className="text-lg font-semibold text-gray-900 mb-4">{t.step3.serviceInfo}</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">{t.step3.serviceType}</label>
              <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                {Object.entries(t.step3.serviceOptions).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.step3.loanerCar}</label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center">
                  <input type="radio" name="carLoaner" value="yes" checked={formData.carLoaner === 'yes'} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500" />
                  <span className="ml-2 text-gray-700">{t.step3.loanerCarNeeded}</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="carLoaner" value="no" checked={formData.carLoaner === 'no'} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500" />
                  <span className="ml-2 text-gray-700">{t.step3.loanerCarNotNeeded}</span>
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">{t.step3.comments}</label>
              <textarea id="comments" name="comments" rows="4" value={formData.comments} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" placeholder={t.step3.commentsPlaceholder}></textarea>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition shadow-md">{t.step2.backButton}</button>
        <button onClick={handleNext} className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition shadow-md">{t.step2.nextButton}</button>
      </div>
    </div>
  );
};

const Step4_Confirmation = ({ onNext, onBack, reservation, lang, t }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolicyChecked, setIsPolicyChecked] = useState(false);

  const handleSubmit = () => {
    if (!isPolicyChecked) {
      alert(t.step4.policyAlert);
      return;
    }
    setIsSubmitting(true);
    console.log("Reservation Data:", reservation);
    setTimeout(() => {
      setIsSubmitting(false);
      onNext();
    }, 2000);
  };

  const InfoRow = ({ label, value, icon }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
      <dt className="text-sm font-medium text-gray-500 flex items-center">{icon}{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-semibold">{value || 'ー'}</dd>
    </div>
  );
  
  const policyTextParts = t.step4.policy.split('{policyLink}');

  return (
    <div>
      <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg font-semibold leading-6 text-gray-900">{t.step4.subtitle}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{t.step4.description}</p>
        </div>
        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200 px-4 sm:px-6">
            <InfoRow label={t.step4.store} value={reservation.store?.name[lang]} icon={<MapPin size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label={t.step4.datetime1} value={`${formatDate(reservation.date1, lang)} ${reservation.time1}`} icon={<CalendarIcon size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label={t.step4.datetime2} value={reservation.date2 ? `${formatDate(reservation.date2, lang)} ${reservation.time2}` : t.step4.none} icon={<CalendarIcon size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label={t.step4.name} value={reservation.name} icon={<User size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label={t.step4.phone} value={reservation.phone} icon={<Phone size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label={t.step4.email} value={reservation.email} icon={<Mail size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label={t.step4.maker} value={reservation.carMaker} icon={<Car size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label={t.step4.carName} value={reservation.carName} icon={<Car size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label={t.step4.serviceType} value={t.step3.serviceOptions[reservation.serviceType]} icon={<CheckCircle size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label={t.step4.loanerCar} value={reservation.carLoaner === 'yes' ? t.step3.loanerCarNeeded : t.step3.loanerCarNotNeeded} icon={<Car size={16} className="mr-2 text-gray-400"/>} />
            <InfoRow label={t.step4.comments} value={reservation.comments} icon={<Mail size={16} className="mr-2 text-gray-400"/>} />
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
              {policyTextParts[0]}
              <a href="https://www.hellonetz.jp/privacypolicy.html" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">{t.footer.privacy}</a>
              {policyTextParts[1]}
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition shadow-md">{t.step4.backButton}</button>
        <button onClick={handleSubmit} disabled={isSubmitting || !isPolicyChecked} className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition shadow-md flex items-center justify-center disabled:bg-red-300 disabled:cursor-not-allowed">
          {isSubmitting ? <Spinner /> : t.step4.submitButton}
        </button>
      </div>
    </div>
  );
};

const Step5_Complete = ({ reservation, onReset, lang, t }) => {
  return (
    <div className="text-center py-10">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800">{t.step5.title}</h2>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
        {t.step5.p1}
        <br />
        {t.step5.p2.replace('{storeName}', reservation.store.name[lang])}
      </p>
      <p className="mt-2 text-gray-600">
        {t.step5.p3.replace('{email}', reservation.email)}
      </p>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg mx-auto text-left">
        <h3 className="font-bold text-lg mb-4 text-gray-800">{t.step5.summaryTitle}</h3>
        <p className="text-gray-700"><strong className="font-semibold">{t.step5.store}:</strong> {reservation.store.name[lang]}</p>
        <p className="text-gray-700"><strong className="font-semibold">{t.step5.datetime1}:</strong> {formatDate(reservation.date1, lang)} {reservation.time1}</p>
        {reservation.date2 && (
          <p className="text-gray-700"><strong className="font-semibold">{t.step5.datetime2}:</strong> {formatDate(reservation.date2, lang)} {reservation.time2}</p>
        )}
        <p className="text-gray-700"><strong className="font-semibold">{t.step5.name}:</strong> {reservation.name}</p>
        <p className="text-gray-700"><strong className="font-semibold">{t.step5.serviceType}:</strong> {t.step3.serviceOptions[reservation.serviceType]}</p>
        <p className="text-gray-700"><strong className="font-semibold">{t.step5.loanerCar}:</strong> {reservation.carLoaner === 'yes' ? t.step3.loanerCarNeeded : t.step3.loanerCarNotNeeded}</p>
      </div>
      <button 
        onClick={onReset} 
        className="mt-10 bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition shadow-md">
        {t.step5.backToTop}
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  const [step, setStep] = useState(0);
  const [reservation, setReservation] = useState({});
  const [toast, setToast] = useState(null);
  const [lang, setLang] = useState('ja');
  const [currentTitle, setCurrentTitle] = useState('');

  const t = translations[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    const titles = {
      1: t.step1.areaTitle,
      2: t.step2.title,
      3: t.step3.title,
      4: t.step4.title,
    };
    setCurrentTitle(titles[step] || '');
  }, [step, t]);

  const initialReservationState = {
    area: null, store: null, date1: null, time1: null, date2: null, time2: null,
    name: '', phone: '', email: '', carMaker: t.step3.carMakers[0], carName: '',
    carNumber: '', serviceType: 'shaken', carLoaner: 'no', comments: '',
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

  const toggleLanguage = () => {
    setLang(prevLang => (prevLang === 'ja' ? 'en' : 'ja'));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1_SelectStore onNext={handleNext} reservation={reservation} setReservation={setReservation} t={t} lang={lang} />;
      case 2:
        return <Step2_SelectDateTime onNext={handleNext} onBack={handleBack} reservation={reservation} setReservation={setReservation} showToast={showToast} lang={lang} t={t} />;
      case 3:
        return <Step3_InputUserInfo onNext={handleNext} onBack={handleBack} reservation={reservation} setReservation={setReservation} showToast={showToast} t={t} />;
      case 4:
        return <Step4_Confirmation onNext={handleNext} onBack={handleBack} reservation={reservation} lang={lang} t={t} />;
      case 5:
        return <Step5_Complete reservation={reservation} onReset={handleReset} lang={lang} t={t} />;
      default:
        return <TopPage onStart={() => setStep(1)} t={t} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <header className="bg-white shadow-md fixed top-0 w-full z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center cursor-pointer" onClick={handleReset}>
              <img src="https://placehold.co/150x40/e81922/ffffff?text=Netz" alt="Logo" className="h-8 sm:h-10" />
              <span className="ml-3 text-lg sm:text-xl font-bold text-gray-700 hidden sm:block">{t.header.title}</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a href="https://www.hellonetz.com/support" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-red-600 transition flex items-center p-2">
                <AlertCircle size={16} className="mr-1" />
                <span className="hidden sm:inline">{t.header.emergency}</span>
              </a>
              <a href="https://www.hellonetz.com/shop-info" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-red-600 transition flex items-center p-2">
                <MapPin size={16} className="mr-1" />
                <span className="hidden sm:inline">{t.header.stores}</span>
              </a>
              <button onClick={toggleLanguage} className="text-sm font-medium text-gray-600 hover:text-red-600 transition flex items-center p-2 rounded-md border">
                <Globe size={16} className="mr-1" />
                {t.header.langButton}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="pt-20">
        {step > 0 && step < 5 && (
          <div className="sticky top-20 bg-gray-50 z-30 border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Stepper currentStep={step} onStepClick={handleStepClick} t={t} />
                <h2 className="text-2xl font-bold text-center pb-4">{currentTitle}</h2>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`${step > 0 && step < 5 ? '' : 'mt-8'}`}>
            {renderStep()}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>{t.footer.copyright}</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="https://www.hellonetz.com/corporate" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">{t.footer.terms}</a>
              <a href="https://www.hellonetz.jp/privacypolicy.html" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">{t.footer.privacy}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
