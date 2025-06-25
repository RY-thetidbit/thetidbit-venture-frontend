"use client";
import React, { useState, useEffect } from 'react';
import { Play, Home, Search, User, Clock, Eye, ThumbsUp, Share2, ArrowLeft, Calendar } from 'lucide-react';

const MovieTrailerApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrailers, setFilteredTrailers] = useState([]);

  // Sample movie trailer data with working video URLs
  const movieTrailers = [
    {
      "id": 1,
      "title": "WAR 2 : Continue – Official Trailer",
      "thumbnail": "https://i.ytimg.com/vi/LZ7lEjkXkW0/hqdefault.jpg",
      "duration": "2:34",
      "views": "8.5M views",
      "uploadDate": "3 months ago",
      "channel": "YRF Spy Universe",
      "description": "Hrithik Roshan and Jr NTR reunite in the high‑octane spy sequel set to release on August 14, 2025.",
      "likes": "520K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/LZ7lEjkXkW0",
      "genre": "Action/Spy",
      "releaseDate": "2025-08-14"
    },
    {
      "id": 2,
      "title": "Dhurandhar – Official Teaser Concept",
      "thumbnail": "https://i.ytimg.com/vi/MrdZjrSD9Kc/hqdefault.jpg",
      "duration": "1:15",
      "views": "993K views",
      "uploadDate": "6 days ago",
      "channel": "Bollywood Studioz",
      "description": "Ranveer Singh stars in Aditya Dhar’s spy thriller; teaser launched on his birthday.",
      "likes": "12K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/MrdZjrSD9Kc",
      "genre": "Spy/Action",
      "releaseDate": "2025-07-06"
    },
    {
      "id": 3,
      "title": "WAR 2 – Official Teaser",
      "thumbnail": "https://i.ytimg.com/vi/S9wsfWnraiM/hqdefault.jpg",
      "duration": "1:05",
      "views": "4.2M views",
      "uploadDate": "last month",
      "channel": "YRF Spy Universe",
      "description": "Agent Kabir (Hrithik) and Zorawar (NTR) bring double the fire in this explosive spy teaser.",
      "likes": "310K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/S9wsfWnraiM",
      "genre": "Action/Spy",
      "releaseDate": "2025-08-14"
    },
    {
      "id": 4,
      "title": "Aap Jaisa Koi – Official Trailer",
      "thumbnail": "https://i.ytimg.com/vi/IC_2jSsWpZk/hqdefault.jpg",
      "duration": "2:10",
      "views": "1.1M views",
      "uploadDate": "today",
      "channel": "Madhavan Films",
      "description": "R. Madhavan & Fatima Sana Sheikh star in this heartfelt drama—perfect for a cinema release.",
      "likes": "45K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/IC_2jSsWpZk",
      "genre": "Drama/Romance",
      "releaseDate": "2025-TBA"
    },
    {
      "id": 5,
      "title": "MAKTOOB – Official Trailer",
      "thumbnail": "https://i.ytimg.com/vi/B6e7jvDKA7w/hqdefault.jpg",
      "duration": "2:45",
      "views": "3.9M views",
      "uploadDate": "2 months ago",
      "channel": "B4U",
      "description": "Rajpal Yadav & Palaash Muchhal in this new 2025 drama about destiny and family.",
      "likes": "85K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/B6e7jvDKA7w",
      "genre": "Drama",
      "releaseDate": "2025-TBA"
    },
    {
      "id": 6,
      "title": "Maalik – Teaser",
      "thumbnail": "https://i.ytimg.com/vi/fI_Cg4r4FpU/hqdefault.jpg",
      "duration": "1:30",
      "views": "750K views",
      "uploadDate": "3 weeks ago",
      "channel": "ZEE5 Originals",
      "description": "Rajkummar Rao stars in this gripping teaser for a powerful Hindi drama ‘Maalik’.",
      "likes": "18K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/fI_Cg4r4FpU",
      "genre": "Drama",
      "releaseDate": "2025-TBA"
    },
    {
      "id": 7,
      "title": "MAA – Official Trailer",
      "thumbnail": "https://i.ytimg.com/vi/lVvMbXiJjko/hqdefault.jpg",
      "duration": "1:58",
      "views": "620K views",
      "uploadDate": "3 weeks ago",
      "channel": "Kajol Studios",
      "description": "Kajol returns in ‘MAA’, a horror‑thriller hitting screens June 27, 2025.",
      "likes": "52K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/lVvMbXiJjko",
      "genre": "Horror/Thriller",
      "releaseDate": "2025-06-27"
    },
    {
      "id": 8,
      "title": "SPIRIT – Official Hindi Trailer",
      "thumbnail": "https://i.ytimg.com/vi/9h6TULs4uNk/hqdefault.jpg",
      "duration": "2:20",
      "views": "1.7M views",
      "uploadDate": "last month",
      "channel": "Sandeep Reddy Vanga Films",
      "description": "Prabhas pairs with Tripti Dimri in this intense concept trailer from director Sandeep Reddy Vanga.",
      "likes": "110K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/9h6TULs4uNk",
      "genre": "Drama",
      "releaseDate": "2025-TBA"
    },
    {
      "id": 9,
      "title": "Bhool Chuk Maaf – Official Teaser",
      "thumbnail": "https://i.ytimg.com/vi/RLpq04C9kRw/hqdefault.jpg",
      "duration": "1:12",
      "views": "2.3M views",
      "uploadDate": "4 months ago",
      "channel": "Rajkummar Rao Films",
      "description": "Rajkummar Rao & Wamiqa Gazaratha star in this emotional drama teaser.",
      "likes": "65K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/RLpq04C9kRw",
      "genre": "Drama",
      "releaseDate": "2025-TBA"
    },
    {
      "id": 10,
      "title": "Param Sundari – Official Teaser",
      "thumbnail": "https://i.ytimg.com/vi/eINBi8ibQ-U/hqdefault.jpg",
      "duration": "1:05",
      "views": "1.5M views",
      "uploadDate": "last month",
      "channel": "Maddock Films",
      "description": "Janhvi Kapoor & Sidharth Malhotra in new cross‑cultural rom‑com releasing July 25, 2025.",
      "likes": "75K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/eINBi8ibQ-U",
      "genre": "Romantic Comedy",
      "releaseDate": "2025-07-25"
    },
    {
      "id": 11,
      "title": "Fantastic Four: First Steps – Final Trailer",
      "thumbnail": "https://i.ytimg.com/vi/abcdef/hqdefault.jpg",
      "duration": "2:30",
      "views": "5M",
      "uploadDate": "Today",
      "channel": "Marvel Entertainment",
      "description": "Team faces Galactus & Silver Surfer ahead of July 25, 2025 release.",
      "likes": "200K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/abcdef",
      "genre": "Superhero",
      "releaseDate": "2025-07-25"
    },
    {
      "id": 12,
      "title": "Roofman – Official Trailer",
      "thumbnail": "https://i.ytimg.com/vi/ghijkl/hqdefault.jpg",
      "duration": "2:15",
      "views": "1.2M",
      "uploadDate": "Today",
      "channel": "Paramount Pictures",
      "description": "Channing Tatum in true story drama set to release October 10, 2025.",
      "likes": "85K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/ghijkl",
      "genre": "Drama/Biographical",
      "releaseDate": "2025-10-10"
    },
    {
      "id": 13,
      "title": "Toxic Avenger – Official Trailer",
      "thumbnail": "https://i.ytimg.com/vi/mnopqr/hqdefault.jpg",
      "duration": "2:05",
      "views": "800K",
      "uploadDate": "4 days ago",
      "channel": "Legendary Pictures",
      "description": "Peter Dinklage as Toxic Avenger in gory reboot releasing August 29, 2025.",
      "likes": "45K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/mnopqr",
      "genre": "Superhero/Action",
      "releaseDate": "2025-08-29"
    },
    {
      "id": 14,
      "title": "Mission: Impossible 8 – Official Teaser",
      "thumbnail": "https://i.ytimg.com/vi/stuvwx/hqdefault.jpg",
      "duration": "1:45",
      "views": "10M",
      "uploadDate": "Nov 11, 2024",
      "channel": "Paramount Pictures",
      "description": "Tom Cruise returns as Ethan Hunt; &quot;Final Reckoning&quot; drops May&nbsp;23,&nbsp;2025.", // Fixed unescaped quotes
      "likes": "650K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/stuvwx",
      "genre": "Action",
      "releaseDate": "2025-05-23"
    },
    {
      "id": 15,
      "title": "Superman (2025) – Official Trailer",
      "thumbnail": "https://i.ytimg.com/vi/yzabcd/hqdefault.jpg",
      "duration": "2:10",
      "views": "7M",
      "uploadDate": "6 months ago",
      "channel": "DC Studios",
      "description": "David Corenswet debuts as Superman in James Gunn&rsquo;s DC re‑launch, due July&nbsp;2025.", // Fixed unescaped quotes
      "likes": "400K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/yzabcd",
      "genre": "Superhero",
      "releaseDate": "2025-07"
    },
    {
      "id": 16,
      "title": "Kiss of the Spider Woman – Teaser Trailer",
      "thumbnail": "https://i.ytimg.com/vi/efghij/hqdefault.jpg",
      "duration": "1:50",
      "views": "2M",
      "uploadDate": "Jun 5, 2025",
      "channel": "Lionsgate",
      "description": "Jennifer Lopez in musical‑drama debut from Sundance, releasing fall 2025.",
      "likes": "120K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/efghij",
      "genre": "Musical/Drama",
      "releaseDate": "2025-Fall"
    },
    {
      "id": 17,
      "title": "28 Years Later – Official Trailer",
      "thumbnail": "https://i.ytimg.com/vi/klmnop/hqdefault.jpg",
      "duration": "1:55",
      "views": "10M",
      "uploadDate": "Dec 10, 2024",
      "channel": "Sony Pictures",
      "description": "Danny Boyle’s sequel trailer went viral with 10M+ within 48h.",
      "likes": "350K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/klmnop",
      "genre": "Horror",
      "releaseDate": "2025-06-20"
    },
    {
      "id": 18,
      "title": "Avatar 3: Fire and Ash – Teaser",
      "thumbnail": "https://i.ytimg.com/vi/qrstuv/hqdefault.jpg",
      "duration": "2:58",
      "views": "3M",
      "uploadDate": "2 days ago",
      "channel": "20th Century Studios",
      "description": "James Cameron returns to Pandora in this epic sci‑fi teaser.",
      "likes": "180K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/qrstuv",
      "genre": "Sci‑Fi",
      "releaseDate": "2025-12"
    },
    {
      "id": 19,
      "title": "Mickey 17 – Official Teaser",
      "thumbnail": "https://i.ytimg.com/vi/wxyz12/hqdefault.jpg",
      "duration": "2:20",
      "views": "1.5M",
      "uploadDate": "2 days ago",
      "channel": "Amazon MGM",
      "description": "Sci‑fi adaptation starring Robert Pattinson, coming 2025.",
      "likes": "90K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/wxyz12",
      "genre": "Sci‑Fi",
      "releaseDate": "2025"
    },
    {
      "id": 20,
      "title": "The Last Train from Hiroshima – Trailer",
      "thumbnail": "https://i.ytimg.com/vi/abcd34/hqdefault.jpg",
      "duration": "2:05",
      "views": "1.8M",
      "uploadDate": "3 days ago",
      "channel": "Hollywood Streams",
      "description": "Historical drama trailer depicting aftermath of WWII.",
      "likes": "70K",
      "videoUrl": "https://www.youtube-nocookie.com/embed/abcd34",
      "genre": "Historical/Drama",
      "releaseDate": "2025"
    }    
  ];  

  useEffect(() => {
    // Update filtered trailers only when searchTerm changes
    setFilteredTrailers(
      movieTrailers.filter(trailer =>
        trailer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trailer.genre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setCurrentPage('video');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedVideo(null);
  };

  // Home Page Component
  const HomePage = () => (
    <div>
      <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        {/* Hero Section */}
        <div className="position-relative" style={{height: '400px', overflow: 'hidden'}}>
          <div 
            className="position-absolute w-100 h-100"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.8) 50%, transparent 100%)',
              zIndex: 2
            }}
          ></div>
          <img 
            src="https://images.unsplash.com/photo-1489599735658-af1d4e5040c0?w=1200&h=400&fit=crop" 
            alt="Featured Movie"
            className="w-100 h-100 object-fit-cover"
          />
          <div className="position-absolute top-50 start-0 translate-middle-y ps-5" style={{zIndex: 3}}>
            <div style={{maxWidth: '600px'}}>
              <h1 className="display-4 fw-bold mb-3 text-dark">
                Latest Movie Trailers
              </h1>
              <p className="lead text-secondary mb-4">
                Discover the most anticipated films and watch their exclusive trailers
              </p>
              <button 
                onClick={() => handleVideoClick(movieTrailers[0])}
                className="btn btn-danger btn-lg rounded-pill px-4 py-2 d-flex align-items-center"
                style={{
                  background: 'linear-gradient(135deg, #dc3545, #c82333)',
                  border: 'none',
                  transform: 'scale(1)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                <Play size={20} className="me-2" />
                Watch Now
              </button>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="container py-5">
          <div className="mb-4">
            <h2 className="h3 fw-bold text-dark mb-2">Latest Trailers</h2>
            <p className="text-muted">
              {filteredTrailers.length} {filteredTrailers.length === 1 ? 'trailer' : 'trailers'} available
            </p>
          </div>
          
          {/* Handle empty search results */}
          {filteredTrailers.length === 0 ? (
            <p className="text-muted">No trailers found for "{searchTerm}".</p>
          ) : (
            <div className="row g-4">
              {filteredTrailers.map((trailer) => (
                <div key={trailer.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                  <div 
                    className="card h-100 border-0 shadow-sm"
                    style={{cursor: 'pointer', transition: 'transform 0.2s'}}
                    onClick={() => handleVideoClick(trailer)}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div className="position-relative overflow-hidden">
                      <img
                        src={trailer.thumbnail}
                        alt={trailer.title}
                        className="card-img-top"
                        style={{height: '200px', objectFit: 'cover'}}
                      />
                      <div 
                        className="position-absolute bottom-0 end-0 m-2 px-2 py-1 rounded text-white"
                        style={{backgroundColor: 'rgba(0,0,0,0.8)', fontSize: '0.75rem'}}
                      >
                        {trailer.duration}
                      </div>
                      <div 
                        className="position-absolute top-50 start-50 translate-middle opacity-0"
                        style={{transition: 'opacity 0.2s'}}
                        onMouseOver={(e) => e.target.style.opacity = '1'}
                      >
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: '60px',
                            height: '60px',
                            background: 'rgba(220, 53, 69, 0.9)'
                          }}
                        >
                          <Play size={24} color="white" style={{marginLeft: '2px'}} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <h5 className="card-title text-dark fw-semibold mb-2" style={{fontSize: '1rem'}}>
                        {trailer.title}
                      </h5>
                      <p className="card-text text-muted mb-1" style={{fontSize: '0.875rem'}}>
                        {trailer.channel}
                      </p>
                      <div className="d-flex align-items-center text-muted" style={{fontSize: '0.75rem'}}>
                        <span>{trailer.views}</span>
                        <span className="mx-1">•</span>
                        <span>{trailer.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Video Page Component
  const VideoPage = () => (
    <div>
      <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        {/* Header */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
          <div className="container">
            <div className="d-flex align-items-center">
              <button
                onClick={handleBackToHome}
                className="btn btn-light rounded-circle me-3 p-2"
              >
                <ArrowLeft size={20} className="text-secondary" />
              </button>
              <div className="navbar-brand d-flex align-items-center mb-0">
                <div 
                  className="d-flex align-items-center justify-content-center me-2 rounded" 
                  style={{
                    width: '32px', 
                    height: '32px', 
                    background: 'linear-gradient(135deg, #dc3545, #c82333)'
                  }}
                >
                  <Play size={20} color="white" />
                </div>
                <span className="fw-bold" style={{
                  background: 'linear-gradient(135deg, #dc3545, #c82333)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.25rem'
                }}>
                  TrailerFlix
                </span>
              </div>
            </div>
            
            <div className="d-flex align-items-center">
              <button className="btn btn-light rounded-circle me-2 p-2">
                <Search size={20} className="text-secondary" />
              </button>
              <button className="btn btn-light rounded-circle p-2">
                <User size={20} className="text-secondary" />
              </button>
            </div>
          </div>
        </nav>

        {selectedVideo ? (
          <div className="container py-4">
            <div className="row g-4">
              {/* Video Player and Info */}
              <div className="col-12 col-lg-8">
                {/* Video Player */}
                <div className="position-relative rounded overflow-hidden mb-4 shadow-lg">
                  <iframe
                    width="100%"
                    height="400"
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    style={{ border: 'none' }} // Replace frameBorder with style
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Video Info */}
                <div className="mb-4">
                  <h1 className="h2 fw-bold text-dark mb-3">
                    {selectedVideo.title}
                  </h1>
                  
                  <div className="d-flex flex-wrap align-items-center gap-3 mb-3 text-muted">
                    <div className="d-flex align-items-center">
                      <Eye size={16} className="me-1" />
                      <span>{selectedVideo.views}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <Clock size={16} className="me-1" />
                      <span>{selectedVideo.uploadDate}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <Calendar size={16} className="me-1" />
                      <span>{selectedVideo.releaseDate}</span>
                    </div>
                    <span className="badge bg-danger">
                      {selectedVideo.genre}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2 mb-4">
                    <button className="btn btn-outline-secondary rounded-pill d-flex align-items-center">
                      <ThumbsUp size={16} className="me-2" />
                      {selectedVideo.likes}
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill d-flex align-items-center">
                      <Share2 size={16} className="me-2" />
                      Share
                    </button>
                  </div>

                  {/* Channel Info */}
                  <div className="card border-0 shadow-sm mb-4" style={{backgroundColor: '#f8f9fa'}}>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle me-3"
                          style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #dc3545, #c82333)'
                          }}
                        >
                          <span className="text-white fw-bold">
                            {selectedVideo.channel.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fw-semibold text-dark">{selectedVideo.channel}</h5>
                          <small className="text-muted">Official Channel</small>
                        </div>
                        <button 
                          className="btn btn-danger rounded-pill px-4"
                          style={{background: 'linear-gradient(135deg, #dc3545, #c82333)', border: 'none'}}
                        >
                          Subscribe
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="card border-0 shadow-sm" style={{backgroundColor: '#f8f9fa'}}>
                    <div className="card-body">
                      <h5 className="fw-semibold text-dark mb-2">About this trailer</h5>
                      <p className="text-dark mb-0">
                        {selectedVideo.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Videos */}
              <div className="col-12 col-lg-4">
                <h4 className="fw-bold text-dark mb-3">Up Next</h4>
                <div className="d-flex flex-column gap-3">
                  {movieTrailers
                    .filter(trailer => trailer.id !== selectedVideo.id)
                    .slice(0, 5)
                    .map((trailer) => (
                      <div
                        key={trailer.id}
                        onClick={() => handleVideoClick(trailer)}
                        className="d-flex gap-3"
                        style={{cursor: 'pointer'}}
                      >
                        <div className="position-relative flex-shrink-0">
                          <img
                            src={trailer.thumbnail}
                            alt={trailer.title}
                            className="rounded"
                            style={{width: '120px', height: '68px', objectFit: 'cover'}}
                          />
                          <div 
                            className="position-absolute bottom-0 end-0 m-1 px-1 rounded text-white"
                            style={{backgroundColor: 'rgba(0,0,0,0.8)', fontSize: '0.6rem'}}
                          >
                            {trailer.duration}
                          </div>
                        </div>
                        <div className="flex-grow-1 min-width-0">
                          <h6 className="fw-semibold text-dark mb-1" style={{fontSize: '0.875rem'}}>
                            {trailer.title}
                          </h6>
                          <p className="text-muted mb-0" style={{fontSize: '0.75rem'}}>
                            {trailer.channel}
                          </p>
                          <p className="text-muted mb-0" style={{fontSize: '0.75rem'}}>
                            {trailer.views}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted text-center py-5">No video selected.</p>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'video' && <VideoPage />}
    </div>
  );
};

export default MovieTrailerApp;