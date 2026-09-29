interface BackgroundManagerProps {
  url: string;
}

const VIDEO_EXTENSION = /\.(mp4|webm|ogg|mov|m4v)$/i;
const DEFAULT_IMAGE = "bg-black.jpg";

function isVideoUrl(url: string): boolean {
  const path = url.trim().split(/[?#]/, 1)[0] ?? "";
  return VIDEO_EXTENSION.test(path);
}

export function BackgroundManager({ url }: BackgroundManagerProps) {
  let source = url.trim();
  if (!source) source = DEFAULT_IMAGE;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {isVideoUrl(source) ? (
        <video src={source} className="size-full object-cover" autoPlay muted loop playsInline />
      ) : (
        <img src={source} alt="" className="size-full object-cover" />
      )}
      <div className="absolute inset-0 bg-background/35 dark:bg-background/50" />
    </div>
  );
}
