import React, { useState, useEffect } from 'react';
import { Lock, Calendar, Heart, Clock, MapPin, Users, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';

const WeddingWebsite = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1)); // Month is 0-indexed, so 3 = April
  const [showAccessModal, setShowAccessModal] = useState(true);
  const [accessCode, setAccessCode] = useState('');
  const [accessLevel, setAccessLevel] = useState(null);
  const [error, setError] = useState('');

  const accessCodes = {
    'FAMILY2025': 'all',      // Can see all events
    'FRIENDS2025': 'limited',  // Can see only main events
    'GUESTS2025': 'basic'      // Can see only wedding and walima
  };
  
  // Wedding details
  const couple = {
    partner1: "Shk Aqeel Ahsan",
    partner2: "Aleena Nadeem",
    date: "April 15, 2025"
  };

  // Updated events data structure to handle multiple events per date
  const events = {
    "2025-04-08": [{
      title: "Mayon",
      time: "6:30 PM",
      location: "Askari 3",
      attire: "Shalwaar Kameez",
      details: "Join us to celebrate with family and friends",
      address: "Block 32-A, Askari 3, Chaklala Scheme 3, Rawalpindi",
      coordinates: {
        lat: 33.586003,
        lng: 73.081501
      }
    }],
    "2025-04-09": [{
      title: "Dholki",
      time: "7:00 PM",
      location: "Gulberg Residencia",
      attire: "Shalwaar Kameez",
      details: "Join us to celebrate with family and friends",
      address: "H51, Block I, CCA Road, Gulberg Residencia, Islamabad",
      coordinates: {
        lat: 33.5970417,
        lng: 73.2142652
      }
    }],
    "2025-04-10": [{
      title: "Nikkah",
      time: "2:30 PM",
      location: "Jamiya Masjid, DHA 4",
      attire: "Shalwaar Kameez",
      details: "Celebrate this beautiful beginning with us as we join in a sacred bond of love and faith.",
      address: "Jamiya Masjid, DHA 4, Islamabad.",
      coordinates: {
        lat: 33.5186542,
        lng: 73.0770022
      }
    }],
    "2025-04-11": [{
      title: "Rasm-e-Henna: Mehndi Night",
      time: "7:00 PM",
      location: "The Manor Marquee",
      attire: "Boys: Black Shalwaar Kameez, Girls: Anything you prefer :D",
      details: "Nach Panjaban Nach, Mehndi, and lots of fun",
      address: "The Manor, Marquee Complex, Islamabad Expy, Islamabad, 42000, Pakistan",
      coordinates: {
        lat: 33.64773,
        lng: 73.10765
      }
    }],
    "2025-04-12": [
      {
        title: "Pre-Baraat: Sehra Bandi",
        time: "6:00 PM",
        location: "Gulberg Residencia",
        attire: "Boys: Shalwar Kameez, Waist Coast, Sherwani ; Girls: Anything you prefer :D",
        details: "Groom's preparation and family gathering",
        address: "H51, Block I, CCA Road, Gulberg Residencia, Islamabad",
        coordinates: {
          lat: 33.5970417,
          lng: 73.2142652
        }
      },
      {
        title: "Baraat: Wedding Ceremony",
        time: "7:00 PM",
        location: "The Manor Marquee",
        attire: "Boys: Shalwar Kameez, Waist Coast, Sherwani ; Girls: Anything you prefer :D",
        details: "Sehra Bandi, and Rukhsati",
        address: "The Manor, Marquee Complex, Islamabad Expy, Islamabad, 42000, Pakistan",
        coordinates: {
          lat: 33.64773,
          lng: 73.10765
        }
      }
    ],
    "2025-04-13": [{
      title: "Walima: Reception",
      time: "7:30 PM",
      location: "The Manor Marquee",
      attire: "Boys: Suits ; Girls: Anything you prefer :D",
      details: "Enjoy the food",
      address: "The Manor, Marquee Complex, Islamabad Expy, Islamabad, 42000, Pakistan",
      coordinates: {
        lat: 33.64773,
        lng: 73.10765
      }
    }]
  };

  const getAccessibleEvents = () => {
    if (!accessLevel) return {};

    switch (accessLevel) {
      case 'all':
        return events;
      case 'limited':
        return Object.entries(events).reduce((acc, [date, eventList]) => {
          const filteredEvents = eventList.filter(event => 
            !['Mayon', 'Dholki','Nikkah','Baraat'].some(keyword => 
              event.title.includes(keyword)
            )
          );
          if (filteredEvents.length > 0) {
            acc[date] = filteredEvents;
          }
          return acc;
        }, {});
      case 'basic':
        return Object.entries(events).reduce((acc, [date, eventList]) => {
          const filteredEvents = eventList.filter(event => 
            ['Walima'].some(keyword => 
              event.title.includes(keyword)
            )
          );
          if (filteredEvents.length > 0) {
            acc[date] = filteredEvents;
          }
          return acc;
        }, {});
      default:
        return {};
    }
  };

  const handleAccessSubmit = (e) => {
    e.preventDefault();
    const level = accessCodes[accessCode.toUpperCase()];
    if (level) {
      setAccessLevel(level);
      setShowAccessModal(false);
      localStorage.setItem('weddingAccessCode', accessCode.toUpperCase());
    } else {
      setError('Invalid access code. Please try again.');
    }
  };

  useEffect(() => {
    const savedCode = localStorage.getItem('weddingAccessCode');
    if (savedCode && accessCodes[savedCode]) {
      setAccessCode(savedCode);
      setAccessLevel(accessCodes[savedCode]);
      setShowAccessModal(false);
    }
  }, []); // Make sure the dependency array is empty

  const openDirections = (coordinates) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  const openGoogleCalendar = (event, date) => {
    const url = createGoogleCalendarUrl(event, date);
    window.open(url, '_blank');
  };

  // Function to create Google Calendar URL
  const createGoogleCalendarUrl = (event, selectedDate) => {
    // Parse the time string (e.g., "7:30 PM")
    const timeParts = event.time.match(/(\d+):(\d+)\s+(AM|PM)/i);
    if (!timeParts) return '';
    
    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const period = timeParts[3].toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    // Create start and end date objects
    const [year, month, day] = selectedDate.split('-').map(Number);
    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 3); // Assuming each event lasts 3 hours
    
    // Format dates for Google Calendar URL
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    // Create Google Calendar URL
    const url = new URL('https://www.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', event.title);
    url.searchParams.append('dates', `${startDateStr}/${endDateStr}`);
    url.searchParams.append('details', `${event.details}\n\nAttire: ${event.attire}`);
    url.searchParams.append('location', `${event.location}, ${event.address}`);
    url.searchParams.append('sf', 'true');
    url.searchParams.append('output', 'xml');
    
    return url.toString();
  };

  const generateCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    
    for (let week = 0; week < 6; week++) {
      const weekDates = [];
      for (let day = 0; day < 7; day++) {
        weekDates.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
      }
      dates.push(weekDates);
    }
    
    return dates;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  };

  const isEventDate = (date) => {
    const formattedDate = formatDate(date);
    return getAccessibleEvents()[formattedDate] !== undefined;
  };

  const handleDateClick = (date) => {
    setSelectedDate(formatDate(date));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    setSelectedDate(null);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Custom flower SVG component for decorative elements
  const FlowerDecoration = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,20 C60,10 70,15 70,30 C80,20 90,30 80,40 C90,45 90,55 80,60 C90,70 80,80 70,70 C75,80 65,90 50,80 C35,90 25,80 30,70 C20,80 10,70 20,60 C10,55 10,45 20,40 C10,30 20,20 30,30 C30,15 40,10 50,20 Z" 
        fill="url(#flowerGradient)" />
      <defs>
        <linearGradient id="flowerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9EBB" />
          <stop offset="100%" stopColor="#FFD4E3" />
        </linearGradient>
      </defs>
    </svg>
  );

  const AccessModal = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-200 via-pink-200 to-rose-100 flex items-center justify-center z-50 p-4 overflow-hidden">
      {/* Decorative elements */}
      <FlowerDecoration className="absolute top-0 left-0 w-40 h-40 opacity-40 transform -translate-x-1/2 -translate-y-1/2" />
      <FlowerDecoration className="absolute bottom-0 right-0 w-40 h-40 opacity-40 transform translate-x-1/2 translate-y-1/2 rotate-45" />
      <FlowerDecoration className="absolute top-0 right-20 w-24 h-24 opacity-30 transform -translate-y-1/2 rotate-90" />
      <FlowerDecoration className="absolute bottom-20 left-0 w-28 h-28 opacity-30 transform -translate-x-1/2 rotate-180" />
      
      <div className="max-w-md w-full bg-white bg-opacity-95 rounded-xl p-8 shadow-2xl border border-pink-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-50 z-0"></div>
        
        {/* Decorative corner patterns */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-pink-300 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-pink-300 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-pink-300 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-pink-300 rounded-br-lg"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3 font-serif">Welcome to Our Wedding</h2>
          <p className="text-gray-600">Please enter your access code to view the celebration</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg relative z-10">
            {error}
          </div>
        )}
        
        <form onSubmit={handleAccessSubmit} className="space-y-6 relative z-10">
          <input
            type="text"
            pattern="[A-Za-z0-9]*"
            inputMode="text"
            autoCapitalize="characters"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            placeholder="Enter your access code"
            className="w-full p-4 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-center text-lg shadow-sm"
            autoComplete="off"
            autoFocus
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-md font-medium text-lg"
          >
            Continue to Wedding Website
          </button>
        </form>
      </div>
    </div>
  );

  // Enhanced Event Card component
  const EventCard = ({ event }) => (
    <div className="p-6 border-b border-pink-100 last:border-b-0 transform transition-all duration-300 hover:scale-[1.01] relative overflow-hidden group">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
        <FlowerDecoration className="w-full h-full rotate-45" />
      </div>
      
      <h3 className="text-2xl font-serif font-semibold text-pink-600 mb-4 relative">
        {event.title}
        <div className="h-1 w-16 bg-gradient-to-r from-pink-300 to-pink-400 mt-2 rounded-full"></div>
      </h3>
      
      <div className="space-y-3 relative">
        <div className="flex items-center text-gray-700 pl-1">
          <Clock className="w-5 h-5 mr-3 text-pink-500" />
          <span className="font-medium">{event.time}</span>
        </div>
        
        <div className="flex items-center text-gray-700 pl-1">
          <MapPin className="w-5 h-5 mr-3 text-pink-500" />
          <span className="font-medium">{event.location}</span>
        </div>
        
        <div className="flex items-center text-gray-700 pl-1">
          <Users className="w-5 h-5 mr-3 text-pink-500" />
          <span className="font-medium">Attire: </span>
          <span className="ml-1">{event.attire}</span>
        </div>
        
        <p className="text-gray-600 mt-3 pl-1 italic">
          "{event.details}"
        </p>
        
        <div className="mt-5 p-4 bg-gradient-to-br from-pink-50 to-white rounded-lg border border-pink-100 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="mb-3 sm:mb-0">
              <p className="font-bold text-gray-800 mb-1">Address:</p>
              <p className="text-gray-600">{event.address}</p>
            </div>
            
            <div className="flex flex-col w-full sm:w-auto space-y-3">
              <button
                onClick={() => openDirections(event.coordinates)}
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition-colors shadow-sm"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </button>
              
              <button
                onClick={() => openGoogleCalendar(event, selectedDate)}
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md hover:from-green-600 hover:to-emerald-700 transition-colors shadow-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const accessibleEvents = getAccessibleEvents();

  return (
    <div className="min-h-screen bg-wedding-pattern">
      {showAccessModal && <AccessModal />}

      {!showAccessModal && (
        <>
          <header className="bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 shadow-lg border-b border-pink-300 relative overflow-hidden py-10">
            {/* Decorative elements */}
            <FlowerDecoration className="absolute top-0 left-0 w-36 h-36 opacity-20 transform -translate-x-1/3 -translate-y-1/3" />
            <FlowerDecoration className="absolute top-0 right-0 w-36 h-36 opacity-20 transform translate-x-1/3 -translate-y-1/3 rotate-90" />
            
            <div className="container mx-auto px-4 py-4 relative z-10">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg mb-4 border-4 border-pink-200">
                  <Heart className="w-12 h-12 text-pink-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-serif text-shadow">
                  {couple.partner1} & {couple.partner2}
                </h1>
                <p className="text-white text-xl px-4 py-2 bg-pink-600 bg-opacity-40 inline-block rounded-full backdrop-blur-sm border border-pink-200 border-opacity-30 shadow-sm">
                  <b>The Wedding #THEBASH</b>
                </p>
              </div>
            </div>
            
            {/* Decorative wave bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24 text-wedding-bg">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" opacity=".25"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="currentColor" opacity=".5"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
              </svg>
            </div>
          </header>

          <main className="container mx-auto px-4 py-12 relative">
            {/* Decorative floating elements */}
            <FlowerDecoration className="absolute top-1/4 left-0 w-24 h-24 opacity-20 transform -translate-x-1/2 animate-float-slow" />
            <FlowerDecoration className="absolute bottom-1/4 right-0 w-20 h-20 opacity-20 transform translate-x-1/2 rotate-45 animate-float-slow-reverse" />
            
            <div className="grid md:grid-cols-2 gap-10 mb-12">
              {/* Calendar Section - Enhanced with decorative elements */}
              <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6 border border-pink-200 relative overflow-hidden">
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-pink-300 rounded-tl-lg opacity-50"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-pink-300 rounded-tr-lg opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-pink-300 rounded-bl-lg opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-pink-300 rounded-br-lg opacity-50"></div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FlowerDecoration className="w-64 h-64 opacity-5" />
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 relative">
                  <h2 className="text-2xl font-serif font-semibold flex items-center mb-4 sm:mb-0 text-gray-800">
                    <Calendar className="w-6 h-6 mr-3 text-pink-500" />
                    <span>Our Wedding Events</span>
                  </h2>
                  <div className="flex items-center space-x-4 bg-pink-50 px-4 py-2 rounded-full shadow-sm">
                    <button 
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-pink-100 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-pink-600" />
                    </button>
                    <span className="text-lg font-medium text-gray-800 font-serif">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button 
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-pink-100 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-pink-600" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-3 relative">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 text-sm p-2 bg-pink-50 rounded-md">
                      {day}
                    </div>
                  ))}
                  
                  {generateCalendarDates().map((week, weekIndex) => (
                    week.map((date, dayIndex) => (
                      <button
                        key={`${weekIndex}-${dayIndex}`}
                        onClick={() => handleDateClick(date)}
                        className={`
                          p-3 rounded-lg text-center relative transition-all duration-200
                          ${date.getMonth() !== currentDate.getMonth() ? 'text-gray-400 hover:bg-gray-50' : 'text-gray-700 hover:bg-pink-50'}
                          ${isEventDate(date) ? 'bg-gradient-to-br from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 font-medium shadow-sm' : ''}
                          ${selectedDate === formatDate(date) ? 'ring-2 ring-pink-500 shadow-md bg-pink-200' : ''}
                        `}
                      >
                        <span className={`
                          ${isEventDate(date) ? 'relative z-10' : ''}
                        `}>
                          {date.getDate()}
                        </span>
                        
                        {isEventDate(date) && (
                          <>
                            {/* Decorative indicator */}
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                            </div>
                            
                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-pink-200 opacity-0 hover:opacity-20 rounded-lg transition-opacity duration-200"></div>
                          </>
                        )}
                      </button>
                    ))
                  ))}
                </div>
              </div>

              {/* Event Details Section - Enhanced with decorative elements */}
              <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6 border border-pink-200 relative overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-pink-50 opacity-30"></div>
                <div className="absolute -right-16 -bottom-16">
                  <FlowerDecoration className="w-48 h-48 opacity-10" />
                </div>
                
                <h2 className="text-2xl font-serif font-semibold mb-6 text-gray-800 relative">
                  Event Details
                  <div className="h-1 w-24 bg-gradient-to-r from-pink-300 to-pink-400 mt-2 rounded-full"></div>
                </h2>
                
                {selectedDate && accessibleEvents[selectedDate] ? (
                  <div className="space-y-6 relative z-10 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {accessibleEvents[selectedDate].map((event, index) => (
                      <EventCard key={index} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 bg-pink-50 rounded-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-pink-400" />
                    </div>
                    <p className="text-gray-500 text-lg">
                      Select a date with a highlighted event to view details
                    </p>
                    <div className="mt-4 flex justify-center">
                      <div className="inline-flex items-center px-3 py-1 bg-pink-50 rounded-full text-sm text-pink-600">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                        Dates with events
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Add CSS for custom scrollbar */}
              <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #fff2f5;
                  border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: rgba(236, 72, 153, 0.3);
                  border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background-color: rgba(236, 72, 153, 0.5);
                }
                
                .text-shadow {
                  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                @keyframes float-slow {
                  0% { transform: translateY(0) rotate(0); }
                  50% { transform: translateY(-10px) rotate(3deg); }
                  100% { transform: translateY(0) rotate(0); }
                }
                
                @keyframes float-slow-reverse {
                  0% { transform: translateY(0) rotate(0); }
                  50% { transform: translateY(-10px) rotate(-3deg); }
                  100% { transform: translateY(0) rotate(0); }
                }
                
                .animate-float-slow {
                  animation: float-slow 6s ease-in-out infinite;
                }
                
                .animate-float-slow-reverse {
                  animation: float-slow-reverse 7s ease-in-out infinite;
                }
                
                .bg-wedding-pattern {
                  background-color: #fff8fa;
                  background-image: 
                    radial-gradient(circle at 80% 20%, rgba(255, 228, 230, 0.7) 0%, transparent 20%),
                    radial-gradient(circle at 20% 80%, rgba(254, 205, 211, 0.4) 0%, transparent 20%),
                    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fdc5ce' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
                    linear-gradient(135deg, #fff8fa 0%, #fff0f3 100%);
                  background-size: 
                    400px 400px,
                    300px 300px,
                    60px 60px,
                    100% 100%;
                  background-position: 
                    0 0,
                    0 0,
                    0 0,
                    0 0;
                  background-attachment: fixed;
                }
              `}</style>
            </div>  
</main>

          {/* Footer Section */}
          <footer className="bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 text-white py-10 relative overflow-hidden">
            {/* Decorative wave top */}
            <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden transform rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24 text-wedding-bg">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" opacity=".25"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="currentColor" opacity=".5"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
              </svg>
            </div>
            
            {/* Decorative elements */}
            <FlowerDecoration className="absolute bottom-0 left-0 w-36 h-36 opacity-20 transform -translate-x-1/3 translate-y-1/3" />
            <FlowerDecoration className="absolute bottom-0 right-0 w-36 h-36 opacity-20 transform translate-x-1/3 translate-y-1/3 rotate-90" />
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4 border border-white border-opacity-30">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-3">Join Us In Celebration</h3>
                <p className="max-w-md mx-auto opacity-90 mb-6">
                  We're excited to share our special day with you. Please use the calendar to navigate through our wedding events.
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm border border-white border-opacity-30">
                  <span className="text-lg">{'April 11th - 13th, 2025'}</span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default WeddingWebsite;