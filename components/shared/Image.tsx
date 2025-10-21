import NextImage, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface CustomImageProps extends ImageProps {
  priority?: boolean;
  loading?: "lazy" | "eager";
  className?: string;
}

const Image = ({
  priority = false,
  loading = "lazy",
  className,
  alt,
  ...rest
}: CustomImageProps) => {
  return (
    <NextImage
      {...rest}
      alt={alt}
      priority={priority}
      loading={loading}
      className={cn("transition-opacity duration-300", className)}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyMzI3MmEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZjIzNzgiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+"
      onError={(e) => {
        console.warn("Image failed to load:", e.currentTarget.src);
      }}
    />
  );
};

export default Image;
