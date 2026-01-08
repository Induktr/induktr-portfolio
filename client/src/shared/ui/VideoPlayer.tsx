import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { Slider } from '@/shared/ui/slider';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}

export function VideoPlayer({ src, poster, className, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Check if URL is YouTube
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeId(src);

  useEffect(() => {
    if (youtubeId) return; // Native video logic only for direct files

    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    if (autoPlay) {
      video.play().catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play();
      });
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [src, autoPlay, youtubeId]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  if (youtubeId) {
    return (
      <div className={cn("relative w-full aspect-video bg-black rounded-lg overflow-hidden", className)}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&rel=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        ></iframe>
      </div>
    );
  }

  return (
    <div 
      className={cn("group relative bg-black rounded-lg overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {/* Center Play/Pause Button (Overlay) */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none",
          (showControls || !isPlaying) ? "opacity-100" : "opacity-0"
        )}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="p-4 rounded-full bg-primary/20 backdrop-blur-md border border-white/20 hover:scale-110 transition-transform pointer-events-auto"
        >
          {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
        </button>
      </div>

      {/* Bottom Controls */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-transform duration-300",
          showControls ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex flex-col gap-2">
          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white font-mono min-w-[35px] text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <span className="text-[10px] text-white font-mono min-w-[35px]">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={() => videoRef.current && (videoRef.current.currentTime = 0)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={handleFullscreen}>
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
