import {
  ChevronDown,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface MusicPlayerHandle {
  play: () => void;
  pause: () => void;
}

interface MusicPlayerProps {
  url?: string;
  onOpenSettings?: () => void;
}

export function parseYouTubeUrl(url?: string): {
  videoId: string | null;
  playlistId: string | null;
} {
  if (!url) return { videoId: null, playlistId: null };
  const trimmed = url.trim();
  if (!trimmed) return { videoId: null, playlistId: null };

  let videoId: string | null = null;
  let playlistId: string | null = null;

  try {
    const urlObj = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);

    if (urlObj.searchParams.has("list")) {
      playlistId = urlObj.searchParams.get("list");
    }

    if (urlObj.hostname.includes("youtu.be")) {
      videoId = urlObj.pathname.slice(1).split("?")[0] || null;
    } else if (urlObj.pathname.includes("/embed/")) {
      videoId = urlObj.pathname.split("/embed/")[1]?.split("?")[0] || null;
    } else if (urlObj.pathname.includes("/live/")) {
      videoId = urlObj.pathname.split("/live/")[1]?.split("?")[0] || null;
    } else if (urlObj.searchParams.has("v")) {
      videoId = urlObj.searchParams.get("v");
    }
  } catch {
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      videoId = trimmed;
    } else if (/^[a-zA-Z0-9_-]{12,}$/.test(trimmed)) {
      playlistId = trimmed;
    }
  }

  return { videoId, playlistId };
}

function loadYouTubeIframeApi(): Promise<any> {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existing) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve(window.YT);
    };
  });
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(function MusicPlayer(
  { url = "", onOpenSettings },
  ref,
) {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [trackTitle, setTrackTitle] = useState("");
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const shouldPlayOnReady = useRef(false);
  const iframeContainerId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);

  const { videoId, playlistId } = parseYouTubeUrl(url);
  const hasSource = Boolean(videoId || playlistId);

  // Expose play/pause imperatively to parent components
  useImperativeHandle(ref, () => ({
    play: () => {
      if (playerRef.current && isReady) {
        try {
          playerRef.current.playVideo();
        } catch (err) {
          console.error("Failed to play video:", err);
        }
      } else {
        shouldPlayOnReady.current = true;
      }
    },
    pause: () => {
      shouldPlayOnReady.current = false;
      if (playerRef.current) {
        try {
          playerRef.current.pauseVideo();
        } catch (err) {
          console.error("Failed to pause video:", err);
        }
      }
    },
  }));

  // Helper to extract track title from the YouTube player instance
  const syncTrackTitle = (player?: any) => {
    const activePlayer = player || playerRef.current;
    if (!activePlayer) return;
    try {
      const data = activePlayer.getVideoData?.();
      if (data?.title) {
        setTrackTitle(data.title);
      }
    } catch (e) {
      console.error("Failed to read video title:", e);
    }
  };

  // Pre-fetch video title via oEmbed when URL changes
  useEffect(() => {
    if (!videoId) {
      if (!playlistId) setTrackTitle("");
      return;
    }
    let isCurrent = true;
    fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isCurrent && data?.title) {
          setTrackTitle(data.title);
        }
      })
      .catch(() => {
        // Fallback to player.getVideoData() on load
      });
    return () => {
      isCurrent = false;
    };
  }, [videoId, playlistId]);

  // Initialize or update YouTube Player
  useEffect(() => {
    if (!hasSource) {
      setIsReady(false);
      setIsPlaying(false);
      setTrackTitle("");
      return;
    }

    let isMounted = true;

    loadYouTubeIframeApi().then((YT) => {
      if (!isMounted) return;

      // If player already exists, load the new track/playlist
      if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
        try {
          if (playlistId) {
            playerRef.current.loadPlaylist({ list: playlistId, listType: "playlist" });
          } else if (videoId) {
            playerRef.current.cueVideoById(videoId);
          }
          setIsReady(true);
          setTimeout(() => syncTrackTitle(playerRef.current), 300);
          if (shouldPlayOnReady.current) {
            playerRef.current.playVideo();
            shouldPlayOnReady.current = false;
          }
        } catch (e) {
          console.error("Failed to update YouTube player:", e);
        }
        return;
      }

      // Create new player instance
      try {
        playerRef.current = new YT.Player(iframeContainerId.current, {
          height: "100%",
          width: "100%",
          videoId: videoId || undefined,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            list: playlistId || undefined,
            listType: playlistId ? "playlist" : undefined,
            origin: typeof window !== "undefined" ? window.location.origin : undefined,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setIsReady(true);
              event.target.setVolume(volume);
              syncTrackTitle(event.target);
              if (shouldPlayOnReady.current) {
                try {
                  event.target.playVideo();
                } catch (e) {
                  console.error("Failed to play on ready:", e);
                }
                shouldPlayOnReady.current = false;
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              syncTrackTitle(event.target);
              // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                setIsPlaying(false);
              }
            },
            onError: (err: any) => {
              if (!isMounted) return;
              console.warn("YouTube Player error:", err);
            },
          },
        });
      } catch (err) {
        console.error("Error creating YouTube player:", err);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [hasSource, videoId, playlistId]);

  const handleTogglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
        setTimeout(() => syncTrackTitle(playerRef.current), 500);
      }
    } catch (err) {
      console.error("Failed to toggle playback:", err);
    }
  };

  const handleNext = () => {
    if (!playerRef.current) return;
    try {
      if (playlistId) {
        playerRef.current.nextVideo();
        setTimeout(() => syncTrackTitle(playerRef.current), 500);
      } else {
        const current = playerRef.current.getCurrentTime?.() || 0;
        playerRef.current.seekTo?.(current + 10, true);
      }
    } catch (err) {
      console.error("Failed to skip next:", err);
    }
  };

  const handlePrev = () => {
    if (!playerRef.current) return;
    try {
      if (playlistId) {
        playerRef.current.previousVideo();
        setTimeout(() => syncTrackTitle(playerRef.current), 500);
      } else {
        const current = playerRef.current.getCurrentTime?.() || 0;
        if (current > 3) {
          playerRef.current.seekTo?.(0, true);
        } else {
          playerRef.current.previousVideo?.();
        }
      }
    } catch (err) {
      console.error("Failed to skip prev:", err);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (err) {
      console.error("Failed to toggle mute:", err);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (!playerRef.current) return;
    try {
      playerRef.current.setVolume(newVol);
      if (newVol > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    } catch (err) {
      console.error("Failed to set volume:", err);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-4 z-30 flex items-center transition-all duration-300"
      aria-label="YouTube Music Player"
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Hidden zero-interference IFrame Container for continuous audio */}
      <div className="pointer-events-none fixed -bottom-96 -left-96 h-1 w-1 opacity-0 overflow-hidden">
        <div id={iframeContainerId.current} />
      </div>

      {!expanded ? (
        /* Collapsed minimal square button overlay */
        <button
          type="button"
          onMouseEnter={() => setExpanded(true)}
          aria-label={trackTitle ? `Open music player: ${trackTitle}` : "Open music player"}
          title={trackTitle ? `Playing: ${trackTitle}` : "Music player"}
          className="glass-surface relative grid size-11 place-items-center rounded-2xl border border-glass-border text-foreground shadow-sm transition-all duration-200 hover:scale-105 hover:bg-accent/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Music
            size={19}
            strokeWidth={1.5}
            className={isPlaying ? "text-primary animate-pulse" : "text-muted-foreground"}
          />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
          )}
        </button>
      ) : (
        /* Expanded minimal control widget */
        <div className="glass-surface w-72 sm:w-80 rounded-2xl border border-glass-border p-4 shadow-xl backdrop-blur-md transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Music
                size={16}
                className={isPlaying ? "text-primary animate-pulse" : "text-muted-foreground"}
              />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Music
              </span>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Minimize player"
              title="Minimize"
              className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronDown size={17} strokeWidth={1.5} />
            </button>
          </div>

          {/* Status or empty prompt */}
          {!hasSource ? (
            <div className="py-4 text-center">
              <p className="text-xs text-muted-foreground">No YouTube URL configured</p>
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="mt-2 text-xs text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  Configure in Settings
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Name of the track being played */}
              <div className="py-2.5 px-2 text-center min-h-[2.25rem] flex items-center justify-center">
                <p
                  className="text-xs font-medium text-foreground truncate max-w-full"
                  title={trackTitle || "Track name"}
                >
                  {trackTitle || "Loading track..."}
                </p>
              </div>

              {/* Primary Transport Controls */}
              <div className="flex items-center justify-center gap-6 py-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!isReady}
                  aria-label="Previous track"
                  title="Previous"
                  className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30 disabled:pointer-events-none"
                >
                  <SkipBack size={19} strokeWidth={1.5} />
                </button>

                <button
                  type="button"
                  onClick={handleTogglePlay}
                  disabled={!isReady}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  title={isPlaying ? "Pause" : "Play"}
                  className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30 disabled:pointer-events-none"
                >
                  {isPlaying ? (
                    <Pause size={22} strokeWidth={2} />
                  ) : (
                    <Play size={22} strokeWidth={2} className="ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isReady}
                  aria-label="Next track"
                  title="Next"
                  className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30 disabled:pointer-events-none"
                >
                  <SkipForward size={19} strokeWidth={1.5} />
                </button>
              </div>

              {/* Volume & Mute control */}
              <div className="mt-2 flex items-center justify-center gap-2.5 pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  title={isMuted ? "Unmute" : "Mute"}
                  className="grid size-6 place-items-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {isMuted ? (
                    <VolumeX size={15} strokeWidth={1.5} />
                  ) : (
                    <Volume2 size={15} strokeWidth={1.5} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  aria-label="Volume"
                  className="h-1 w-24 accent-primary cursor-pointer"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
});
