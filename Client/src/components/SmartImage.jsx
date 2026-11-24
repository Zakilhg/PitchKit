import { useCallback, useState } from "react";
import { imageSources } from "@/lib/jersey";
import { cn } from "@/lib/utils";

/**
 * A catalog photo that fills its (positioned) parent and loads gracefully:
 * the photo's own colour plus a shimmer first, then a short blur-to-sharp fade.
 * Picks a small WebP from srcset and falls back to the original if that fails.
 */
const SmartImage = ({
  file,
  alt = "",
  sizes = "100vw",
  priority = false,
  className,
  wrapperClassName,
  ...imgProps
}) => {
  const { src, srcSet, color } = imageSources(file);
  const [loaded, setLoaded] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);

  // Cached images can finish before React attaches onLoad.
  const ref = useCallback((img) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <span
      className={cn("absolute inset-0 block overflow-hidden", wrapperClassName)}
      style={{ backgroundColor: color }}
    >
      {!loaded && <span className="skeleton-shimmer absolute inset-0 block" aria-hidden="true" />}
      <img
        ref={ref}
        src={src}
        srcSet={useOriginal ? undefined : srcSet}
        sizes={srcSet && !useOriginal ? sizes : undefined}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (srcSet && !useOriginal) setUseOriginal(true);
          else setLoaded(true);
        }}
        className={cn(
          "size-full object-cover transition-[opacity,filter,scale] duration-700 ease-out",
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
          className,
        )}
        {...imgProps}
      />
    </span>
  );
};

export default SmartImage;
