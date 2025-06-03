"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";

const MeetSiaSection: React.FC = () => {
  const [video1Muted, setVideo1Muted] = useState(true);
  const [video2Muted, setVideo2Muted] = useState(true);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  // Auto-start videos when component mounts
  useEffect(() => {
    const startVideos = async () => {
      try {
        if (video1Ref.current) {
          video1Ref.current.muted = true;
          await video1Ref.current.play();
        }
        if (video2Ref.current) {
          video2Ref.current.muted = true;
          await video2Ref.current.play();
        }
      } catch (error) {
        console.log("Autoplay prevented by browser:", error);
      }
    };

    startVideos();
  }, []);

  const handleVideoHover = (videoNumber: number, isHovering: boolean) => {
    if (videoNumber === 1 && video1Ref.current) {
      if (isHovering) {
        video1Ref.current.play();
        video1Ref.current.muted = false;
        setVideo1Muted(false);
      } else {
        video1Ref.current.muted = true;
        setVideo1Muted(true);
        // Keep playing but muted
      }
    } else if (videoNumber === 2 && video2Ref.current) {
      if (isHovering) {
        video2Ref.current.play();
        video2Ref.current.muted = false;
        setVideo2Muted(false);
      } else {
        video2Ref.current.muted = true;
        setVideo2Muted(true);
        // Keep playing but muted
      }
    }
  };

  const handleAudioToggle = (videoNumber: number) => {
    if (videoNumber === 1) {
      setVideo1Muted(!video1Muted);
      if (video1Ref.current) {
        video1Ref.current.muted = !video1Muted;
      }
    } else {
      setVideo2Muted(!video2Muted);
      if (video2Ref.current) {
        video2Ref.current.muted = !video2Muted;
      }
    }
  };

  const handleVideoRestart = (videoNumber: number) => {
    if (videoNumber === 1 && video1Ref.current) {
      video1Ref.current.currentTime = 0;
      video1Ref.current.play();
    } else if (videoNumber === 2 && video2Ref.current) {
      video2Ref.current.currentTime = 0;
      video2Ref.current.play();
    }
  };

  return (
    <section 
      id="meet-sia" 
      className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-hero-blue-900 via-hero-blue-800 to-hero-blue-900"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-creative-tech-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-creative-tech-secondary/30 rotate-45"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-hero-blue-500/25 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-6 bg-creative-tech-primary/15 rounded-full"></div>
        
        {/* Mystical Dotted Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="grid grid-cols-16 gap-8 h-full w-full p-8">
            {Array.from({ length: 64 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-1 bg-creative-tech-primary rounded-full"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animation: 'twinkle 3s ease-in-out infinite'
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Large Mystical Element */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/3">
          <div className="w-80 h-80 md:w-[500px] md:h-[500px] bg-gradient-to-br from-hero-blue-600/20 to-creative-tech-primary/30 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Main Headline */}
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-bold font-serif text-white mb-6 drop-shadow-lg">
            Meet Sia
          </h2>
          <p className="text-xl md:text-2xl text-creative-tech-secondary max-w-4xl mx-auto leading-relaxed font-medium">
            The Genesis IP • A Living Storyworld Born from Ancient Indian Wisdom
          </p>
        </div>

        {/* Simplified Story Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-hero-blue-800/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-creative-tech-primary/30">
            <div className="text-center space-y-6">
              <div className="flex justify-center space-x-4 mb-6">
                <span className="text-4xl">🌟</span>
                <span className="text-4xl">✨</span>
              </div>
              
              <p className="text-lg md:text-xl text-white leading-relaxed">
                <strong className="text-creative-tech-primary">Sia is a young visionary from an ancient Indian lineage</strong>, blessed with a mystical 
                <strong className="text-creative-tech-secondary"> visualization bracelet</strong> passed down through generations. 
                This sacred artifact allows her to perceive and traverse multiple realities, timelines, and dimensions.
              </p>
              
              <p className="text-lg md:text-xl text-white leading-relaxed">
                Born in contemporary India but deeply connected to her ancestral wisdom, Sia bridges the gap between 
                <strong className="text-creative-tech-primary"> timeless spiritual knowledge</strong> and 
                <strong className="text-creative-tech-secondary"> infinite future possibilities</strong>.
              </p>

            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="relative max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold font-serif text-white text-center mb-12">
            Witness Sia&#39;s Journey Unfold
          </h3>
          
          {/* Vertical Video Stack */}
          <div className="space-y-8">
            {/* Video 1 - Universe Teaser */}
            <div className="relative group">
              <div 
                className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-creative-tech-primary/30 hover:border-creative-tech-primary/60 transition-all duration-300"
                onMouseEnter={() => handleVideoHover(1, true)}
                onMouseLeave={() => handleVideoHover(1, false)}
              >
                <video
                  ref={video1Ref}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-64 md:h-96 object-cover"
                >
                  <source src="/sia-a-universe-reimagined.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Sound Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleAudioToggle(1)}
                    className="bg-black/50 text-creative-tech-primary p-2 rounded-full backdrop-blur-sm hover:bg-black/70 hover:text-creative-tech-secondary transition-all duration-200"
                    aria-label={video1Muted ? "Unmute video" : "Mute video"}
                  >
                    {video1Muted ? "🔇" : "🔊"}
                  </button>
                </div>
                
                {/* Restart Button */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleVideoRestart(1)}
                    className="bg-black/50 text-creative-tech-primary p-2 rounded-full backdrop-blur-sm hover:bg-black/70 hover:text-creative-tech-secondary transition-all duration-200"
                    aria-label="Restart video"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Connecting Element */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-b from-creative-tech-primary to-creative-tech-secondary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">✦</span>
              </div>
            </div>

            {/* Video 2 - Journey Begins */}
            <div className="relative group">
              <div 
                className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-creative-tech-primary/30 hover:border-creative-tech-primary/60 transition-all duration-300"
                onMouseEnter={() => handleVideoHover(2, true)}
                onMouseLeave={() => handleVideoHover(2, false)}
              >
                <video
                  ref={video2Ref}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-64 md:h-96 object-cover"
                >
                  <source src="/sia-journey_begins.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Sound Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleAudioToggle(2)}
                    className="bg-black/50 text-creative-tech-primary p-2 rounded-full backdrop-blur-sm hover:bg-black/70 hover:text-creative-tech-secondary transition-all duration-200"
                    aria-label={video2Muted ? "Unmute video" : "Mute video"}
                  >
                    {video2Muted ? "🔇" : "🔊"}
                  </button>
                </div>
                
                {/* Restart Button */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleVideoRestart(2)}
                    className="bg-black/50 text-creative-tech-primary p-2 rounded-full backdrop-blur-sm hover:bg-black/70 hover:text-creative-tech-secondary transition-all duration-200"
                    aria-label="Restart video"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-hero-blue-800/40 backdrop-blur-md rounded-2xl p-8 border border-creative-tech-primary/30 max-w-3xl mx-auto">
            <div className="flex justify-center space-x-2 mb-4">
              <span className="text-4xl">📿</span>
              <span className="text-4xl">🤝</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-creative-tech-primary mb-4">
              A Living Storyworld Awaits Your Vision
            </h3>
            <p className="text-lg text-white max-w-2xl mx-auto leading-relaxed">
              Join creators worldwide in expanding Sia&#39;s universe. Every vision her bracelet reveals becomes a
              <strong className="text-creative-tech-secondary"> collaborative opportunity</strong> to build something extraordinary together.
            </p>
          </div>
        </div>
      </div>
      
      {/* CSS for twinkling animation */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </section>
  );
};

export default MeetSiaSection; 