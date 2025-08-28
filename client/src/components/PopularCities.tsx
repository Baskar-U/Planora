import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function PopularCities() {
  const [, setLocation] = useLocation();
  const [showMoreCities, setShowMoreCities] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const initialCities = [
    {
      name: "Chennai",
      services: "250+",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80"
    },
    {
      name: "Madurai",
      services: "180+",
      image: "https://images.unsplash.com/photo-1574914629385-46448b767aec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80"
    },
    {
      name: "Coimbatore",
      services: "160+",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80"
    },
    {
      name: "Trichy",
      services: "120+",
      image: "https://images.unsplash.com/photo-1574914629385-46448b767aec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80"
    },
    
  ];

  const additionalCities = [
    {
      name: "Salem",
      services: "95+",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "Vellore",
      services: "110+",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "Erode",
      services: "75+",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
    },
    
    {
      name: "Thothukudi",
      services: "55+",
      image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "Tirunelveli",
      services: "70+",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "Dindigul",
      services: "45+",
      image: "https://images.unsplash.com/photo-1574914629385-46448b767aec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "Kanchipuram",
      services: "80+",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
    },
    
    {
      name: "Cuddalore",
      services: "60+",
      image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
    }
  ];

  const allCities = [...initialCities, ...additionalCities];
  const displayedCities = showMoreCities ? allCities : initialCities;

  // Continuous scrolling animation
  useEffect(() => {
    if (showMoreCities) return; // Stop scrolling when showing all cities

    const animation = () => {
      setSlidePosition((prev) => {
        const newPosition = prev - 0.05; // Move even slower for better readability
        if (newPosition <= -100) {
          return 0; // Reset when complete
        }
        return newPosition;
      });
    };

    const interval = setInterval(animation, 30); // Update every 30ms for smoother movement
    return () => clearInterval(interval);
  }, [showMoreCities]);

  const handleCityClick = (cityName: string) => {
    setLocation(`/vendors?city=${cityName}`);
  };

  const handleMoreCitiesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMoreCities(!showMoreCities);
    if (!showMoreCities) {
      setSlidePosition(0); // Reset position when expanding
    }
  };

  return (
    <section className="pt-8 pb-16 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Popular Cities
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 px-4">
            Discover amazing services in these top destinations
          </p>
        </div>

        {showMoreCities ? (
          // Show all cities in grid when expanded
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4 sm:gap-6">
            {displayedCities.map((city, index) => (
              <div
                key={city.name}
                className="group cursor-pointer"
                onClick={() => handleCityClick(city.name)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all group-hover:shadow-xl group-hover:scale-105">
                  <img
                    src={city.image}
                    alt={`${city.name} cityscape`}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                    width="300"
                    height="200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                    <h3 className="text-white font-semibold text-base sm:text-lg">{city.name}</h3>
                    <p className="text-gray-200 text-xs sm:text-sm">{city.services} Services</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Automatic scrolling carousel with mobile improvements
          <div className="relative overflow-hidden w-full">
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-300 ease-linear"
              style={{
                transform: `translateX(${slidePosition}%)`,
                width: `${(allCities.length * 3) * 280}px` // Adjusted width
              }}
            >
              {/* Triple the cities for seamless infinite scrolling */}
              {[...allCities, ...allCities, ...allCities].map((city, index) => (
                <div
                  key={`${city.name}-${index}`}
                  className="group cursor-pointer flex-shrink-0"
                  style={{ width: '280px' }}
                  onClick={() => handleCityClick(city.name)}
                >
                  <div className="mx-1 sm:mx-2 lg:mx-3">
                    <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all group-hover:shadow-xl group-hover:scale-105 h-48 sm:h-52 w-full">
                      <img
                        src={city.image}
                        alt={`${city.name} cityscape`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width="200"
                        height="200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="text-white font-bold text-sm sm:text-base leading-tight mb-1 break-words">{city.name}</h3>
                        <p className="text-gray-200 text-xs font-medium">{city.services} Services</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          {/* More Cities Button */}
          <Button 
            onClick={handleMoreCitiesClick}
            variant="outline"
            size="lg" 
            className="px-8 py-3 text-lg"
            type="button"
          >
            {showMoreCities ? (
              <>
                <ChevronUp className="mr-2 h-5 w-5" />
                Show Less Cities
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-5 w-5" />
                More Cities
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
