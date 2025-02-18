import React, { useState, useEffect  } from 'react';
import { Lock } from 'lucide-react';  // Add this import
import { Calendar, Heart, Clock, MapPin, Users, ChevronLeft, ChevronRight, X, Navigation } from 'lucide-react';

const WeddingWebsite = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 1, 1));
  const [selectedImage, setSelectedImage] = useState(null);
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

  // Gallery images
  const galleryImages = [
    { id: 1, title: "Engagement Photo", src: "src/assets/Eng.jpg", description: "Our engagement photoshoot" },
    { id: 2, title: "First Date", src: "/api/placeholder/400/300", description: "Where we first met" },
    { id: 3, title: "Proposal", src: "/api/placeholder/400/300", description: "The special moment" },
    { id: 4, title: "Together", src: "/api/placeholder/400/300", description: "Our favorite memory" },
    { id: 5, title: "Family", src: "/api/placeholder/400/300", description: "With our loved ones" },
    { id: 6, title: "Adventure", src: "/api/placeholder/400/300", description: "Our travels together" }
  ];

  // Updated events data structure to handle multiple events per date
  const events = {
    "2025-02-22": [{
      title: "Dholki: Celebrations Kick-off",
      time: "7:30 PM",
      location: "Gulberg Residencia",
      attire: "Shalwaar Kameez",
      details: "Join us to celebrate with family and friends",
      address: "H51, Block I, CCA Road, Gulberg Residencia, Islamabad",
      coordinates: {
        lat: 33.596956,
        lng: 73.214340
      }
    }],
    "2025-04-08": [{
      title: "Mayon",
      time: "7:30 PM",
      location: "Gulberg Residencia",
      attire: "Shalwaar Kameez",
      details: "Join us to celebrate with family and friends",
      address: "H51, Block I, CCA Road, Gulberg Residencia, Islamabad",
      coordinates: {
        lat: 33.596956,
        lng: 73.214340
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
        lat: 33.6471192,
        lng: 73.1035052
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
          lat: 33.596956,
          lng: 73.214340
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
            !['Dholki', 'Mayon'].some(keyword => 
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
            ['Baraat', 'Walima'].some(keyword => 
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
  }, []);


  const openDirections = (coordinates) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  const generateCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
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
            inputMode="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter your access code"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            autoComplete="off"
            autoCapitalize="characters"
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
            <button
              onClick={() => openDirections(event.coordinates)}
              className="flex items-center text-blue-500 hover:text-blue-700 transition-colors ml-4"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Get Directions
            </button>
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
                {selectedDate && events[selectedDate] ? (
                  <div className="space-y-6">
                    {events[selectedDate].map((event, index) => (
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

            {/* Photo Gallery Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Our Photo Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {galleryImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-48 object-cover rounded-lg transition-transform transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                      <p className="text-white opacity-0 group-hover:opacity-100 font-medium">
                        {image.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="max-w-4xl w-full bg-white rounded-lg relative">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="p-6">
                    <img
                      src={selectedImage.src}
                      alt={selectedImage.title}
                      className="w-full h-96 object-contain mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
                    <p className="text-gray-600">{selectedImage.description}</p>
                  </div>
                </div>
              </div>
            )}
          </main>
          </>
        )}
    </div>
  );
};

export default WeddingWebsite;