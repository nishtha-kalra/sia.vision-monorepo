"use client";
import * as React from "react";
import { useState, useRef } from "react";

const MeetSiaSection: React.FC = () => {
  const [video1Muted, setVideo1Muted] = useState(true);
  const [video2Muted, setVideo2Muted] = useState(true);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  const handleVideoHover = (videoNumber: number, isHovering: boolean) => {
    if (videoNumber === 1 && video1Ref.current) {
      if (isHovering) {
        video1Ref.current.play();
        video1Ref.current.muted = false;
        setVideo1Muted(false);
      } else {
        video1Ref.current.pause();
        video1Ref.current.muted = true;
        setVideo1Muted(true);
      }
    } else if (videoNumber === 2 && video2Ref.current) {
      if (isHovering) {
        video2Ref.current.play();
        video2Ref.current.muted = false;
        setVideo2Muted(false);
      } else {
        video2Ref.current.pause();
        video2Ref.current.muted = true;
        setVideo2Muted(true);
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
      className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-red-700 to-red-800"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        {/* Dotted Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="grid grid-cols-12 gap-4 h-full w-full p-8">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-yellow-300 rounded-full"></div>
            ))}
          </div>
        </div>
        
        {/* Large Circular Element */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4">
          <div className="w-96 h-96 md:w-[600px] md:h-[600px] bg-gradient-to-br from-creative-tech-secondary/30 to-yellow-400/40 rounded-full"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Main Headline */}
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-bold font-serif text-white mb-6 drop-shadow-lg">
            Meet Sia
          </h2>
          <p className="text-xl md:text-2xl text-yellow-100/90 max-w-4xl mx-auto leading-relaxed">
            The First Genesis IP • A Living Storyworld Born from Ancient Indian Wisdom
          </p>
        </div>

        {/* Story Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Character Origin */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold font-serif text-yellow-300 mb-4">
              🌟 The Character
            </h3>
            <p className="text-lg text-yellow-100/90 leading-relaxed">
              SIA is a young visionary from an ancient Indian lineage, blessed with a mystical <strong className="text-yellow-300">visualization bracelet</strong> passed down through generations. This sacred artifact allows her to perceive and traverse multiple realities, timelines, and dimensions.
            </p>
            <p className="text-lg text-yellow-100/90 leading-relaxed">
              Born in contemporary India but deeply connected to her ancestral wisdom, SIA bridges the gap between <strong className="text-yellow-300">timeless spiritual knowledge</strong> and <strong className="text-yellow-300">infinite future possibilities</strong>.
            </p>
          </div>

          {/* Genesis Story */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold font-serif text-yellow-300 mb-4">
              📜 The Genesis
            </h3>
            <p className="text-lg text-yellow-100/90 leading-relaxed">
              SIA represents the inaugural <strong className="text-yellow-300">&#34;Living Storyworld&#34;</strong> on Sia.vision—a narrative universe that evolves through community collaboration, AI co-creation, and blockchain-verified ownership.
            </p>
            <p className="text-lg text-yellow-100/90 leading-relaxed">
              Her story begins in the sacred ghats of Varanasi, where she discovers her bracelet&#39;s true power during a cosmic convergence. Each vision she experiences becomes a <strong className="text-yellow-300">new chapter, world, or reality</strong> that creators worldwide can expand upon.
            </p>
          </div>

          {/* The Vision */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold font-serif text-yellow-300 mb-4">
              🔮 The Vision
            </h3>
            <p className="text-lg text-yellow-100/90 leading-relaxed">
              Through SIA, we demonstrate how <strong className="text-yellow-300">profound cultural heritage</strong> can birth globally resonant adventures. Her bracelet&#39;s visions span from ancient Indian epics reimagined to futuristic interstellar civilizations.
            </p>
            <p className="text-lg text-yellow-100/90 leading-relaxed">
              Each reality she explores becomes a <strong className="text-yellow-300">collaborative canvas</strong> where storytellers, artists, developers, and dreamers co-create interconnected narratives that honor the past while embracing limitless futures.
            </p>
          </div>
        </div>

        {/* Vertical Video Layout */}
        <div className="relative max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold font-serif text-white text-center mb-12">
            Witness SIA&#39;s Journey Unfold
          </h3>
          
          {/* Vertical Video Stack */}
          <div className="space-y-8">
            {/* Video 1 - Universe Teaser */}
            <div className="relative group">
              <div 
                className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-300/30 hover:border-yellow-300/60 transition-all duration-300"
                onMouseEnter={() => handleVideoHover(1, true)}
                onMouseLeave={() => handleVideoHover(1, false)}
              >
                <video
                  ref={video1Ref}
                  loop
                  muted={video1Muted}
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
                    className="bg-black/50 text-yellow-300 p-2 rounded-full backdrop-blur-sm hover:bg-black/70 hover:text-yellow-200 transition-all duration-200"
                    aria-label={video1Muted ? "Unmute video" : "Mute video"}
                  >
                    {video1Muted ? "🔇" : "🔊"}
                  </button>
                </div>
                
                {/* Restart Button */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleVideoRestart(1)}
                    className="bg-black/50 text-yellow-300 p-2 rounded-full backdrop-blur-sm hover:bg-black/70 hover:text-yellow-200 transition-all duration-200"
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
              <div className="w-16 h-16 bg-gradient-to-b from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-red-800 text-2xl font-bold">✦</span>
              </div>
            </div>

            {/* Video 2 - Journey Begins */}
            <div className="relative group">
              <div 
                className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-300/30 hover:border-yellow-300/60 transition-all duration-300"
                onMouseEnter={() => handleVideoHover(2, true)}
                onMouseLeave={() => handleVideoHover(2, false)}
              >
                <video
                  ref={video2Ref}
                  loop
                  muted={video2Muted}
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
                    className="bg-black/50 text-yellow-300 p-2 rounded-full backdrop-blur-sm hover:bg-black/70 hover:text-yellow-200 transition-all duration-200"
                    aria-label={video2Muted ? "Unmute video" : "Mute video"}
                  >
                    {video2Muted ? "🔇" : "🔊"}
                  </button>
                </div>
                
                {/* Restart Button */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleVideoRestart(2)}
                    className="bg-black/50 text-yellow-300 p-2 rounded-full backdrop-blur-sm hover:bg-black/70 hover:text-yellow-200 transition-all duration-200"
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

        {/* Story Continuation */}
        <div className="mt-16 text-center space-y-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-300/20">
            <h3 className="text-3xl font-bold text-yellow-300 mb-6">
              A Living Storyworld Awaits Your Vision
            </h3>
            <p className="text-xl text-yellow-100/90 max-w-4xl mx-auto leading-relaxed">
              SIA&#39;s bracelet has shown her countless realities—<strong className="text-yellow-300">ancient kingdoms where dharma shapes destiny</strong>, <strong className="text-yellow-300">future worlds where consciousness transcends form</strong>, and <strong className="text-yellow-300">parallel dimensions where Indian philosophy guides galactic civilizations</strong>.
            </p>
            <p className="text-lg text-yellow-100/80 max-w-3xl mx-auto leading-relaxed mt-6">
              Each vision becomes a collaborative opportunity. Writers can craft new adventures, artists can visualize unexplored realms, developers can build interactive experiences, and dreamers can expand the mythology—all while maintaining ownership through Story Protocol.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetSiaSection; 