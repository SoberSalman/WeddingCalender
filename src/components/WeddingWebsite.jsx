import React, { useState, useEffect } from 'react';
import { Lock, Calendar, Heart, Clock, MapPin, Users, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';

const WeddingWebsite = () => {
  // Change default calendar date to April 2025
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
      time: "7:30 PM",
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
      time: "7:30 PM",
      location: "Gulberg Residencia",
      attire: "Shalwaar Kameez",
      details: "Join us to celebrate with family and friends",
      address: "H51, Block I, CCA Road, Gulberg Residencia, Islamabad",
      coordinates: {
        lat: 33.6476035,
        lng: 73.1049154
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
        lat: 33.6476035,
        lng: 73.1049154
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
          lat: 33.6476035,
          lng: 73.1049154
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
          lat: 33.6471192,
          lng: 73.1035052
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
        lat: 33.6471192,
        lng: 73.1035052
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
            !['Baraat', 'Walima'].some(keyword => 
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

  const AccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg p-6">
        <div className="text-center mb-6">
          <Lock className="w-12 h-12 mx-auto text-pink-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Our Wedding</h2>
          <p className="text-gray-600">Please enter your access code to view the events</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleAccessSubmit} className="space-y-4">
          <input
            type="text"
            pattern="[A-Za-z0-9]*"
            inputMode="text"
            autoCapitalize="characters"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            placeholder="Enter your access code"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            autoComplete="off"
            autoFocus
          />

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Continue to Website
          </button>
        </form>
      </div>
    </div>
  );

  // New component to render a single event
  const EventCard = ({ event }) => (
    <div className="p-4 border-b border-gray-200 last:border-b-0">
      <h3 className="text-xl font-semibold text-pink-600 mb-3">
        {event.title}
      </h3>
      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <Clock className="w-5 h-5 mr-2" />
          {event.time}
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          {event.location}
        </div>
        <div className="flex items-center text-gray-600">
          <Users className="w-5 h-5 mr-2" />
          Attire: {event.attire}
        </div>
        <p className="text-gray-600 mt-2">
          {event.details}
        </p>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">Address:</p>
              <p className="text-gray-600">{event.address}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <button
                onClick={() => openDirections(event.coordinates)}
                className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Navigation className="w-4 h-4 mr-1" />
                Get Directions
              </button>
              
              <button
                onClick={() => openGoogleCalendar(event, selectedDate)}
                className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-1" />
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
    <div className="min-h-screen bg-gray-50">
      {showAccessModal && <AccessModal />}

      {!showAccessModal && (
        <>
          <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-6">
              <div className="text-center">
                <Heart className="w-12 h-12 mx-auto text-pink-500 mb-4" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {couple.partner1} & {couple.partner2}
                </h1>
                <p className="text-gray-600"><b>The Wedding #BASH</b></p>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Calendar Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <Calendar className="w-6 h-6 mr-2" />
                    Event Calendar
                  </h2>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-medium">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button 
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 text-sm p-2">
                      {day}
                    </div>
                  ))}
                  {generateCalendarDates().map((week, weekIndex) => (
                    week.map((date, dayIndex) => (
                      <button
                        key={`${weekIndex}-${dayIndex}`}
                        onClick={() => handleDateClick(date)}
                        className={`
                          p-2 rounded-lg text-center relative
                          ${date.getMonth() !== currentDate.getMonth() ? 'text-gray-400' : ''}
                          ${isEventDate(date) ? 'bg-pink-100 hover:bg-pink-200' : 'hover:bg-gray-100'}
                          ${selectedDate === formatDate(date) ? 'ring-2 ring-pink-500' : ''}
                        `}
                      >
                        {date.getDate()}
                        {isEventDate(date) && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="w-1 h-1 bg-pink-500 rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))
                  ))}
                </div>
              </div>

              {/* Event Details Section - Updated to show multiple events */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
                {selectedDate && accessibleEvents[selectedDate] ? (
                  <div className="space-y-6">
                   {accessibleEvents[selectedDate].map((event, index) => (
                      <EventCard key={index} event={event} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Select a date to view event details
                  </p>
                )}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default WeddingWebsite;