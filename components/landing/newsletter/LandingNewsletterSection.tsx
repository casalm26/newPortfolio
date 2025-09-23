"use client";

import clsx from "clsx";
import Image from "@/components/shared/Image";
import { GlowBg } from "@/components/shared/ui/glow-bg";
import { LandingNewsletterInput } from "@/components/landing/newsletter/LandingNewsletterInput";
import { LazySection } from "@/components/shared/LazySection";
import { getResponsiveImageProps, imageSizes, responsiveSizes } from "@/lib/image-utils";

/**
 * A component meant to be used in the landing page.
 * It shows a newsletter input form with a title, description.
 */
export const LandingNewsletterSection = ({
  children,
  className,
  innerClassName,
  title,
  titleComponent,
  description,
  descriptionComponent,
  buttonLabel = "Subscribe",
  placeholderLabel = "Enter your email",
  inputLabel = "Email address",
  textPosition = "center",
  minHeight = 350,
  withBackground = false,
  withBackgroundGlow = false,
  withAvatars = false,
  variant = "primary",
  backgroundGlowVariant = "primary",
  disabled = false,
  onSubmit = () => {},
}: {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
  title?: string | React.ReactNode;
  titleComponent?: React.ReactNode;
  description?: string | React.ReactNode;
  descriptionComponent?: React.ReactNode;
  buttonLabel?: string;
  placeholderLabel?: string;
  inputLabel?: string;
  textPosition?: "center" | "left";
  minHeight?: number;
  withBackground?: boolean;
  withBackgroundGlow?: boolean;
  withAvatars?: boolean;
  variant?: "primary" | "secondary";
  backgroundGlowVariant?: "primary" | "secondary";
  disabled?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <section
      className={clsx(
        "w-full flex flex-col justify-center items-center gap-8 py-12 lg:py-16",
        withBackground && variant === "primary"
          ? "bg-primary-100/20 dark:bg-primary-900/10"
          : "",
        withBackground && variant === "secondary"
          ? "bg-secondary-100/20 dark:bg-secondary-900/10"
          : "",
        withBackgroundGlow ? "relative overflow-hidden" : "",
        className,
      )}
    >
      {withBackgroundGlow ? (
        <div className="hidden lg:flex justify-center w-full h-full absolute -bottom-1/2 pointer-events-none">
          <GlowBg
            className={clsx(
              "w-full lg:w-1/2 h-auto z-0 dark:opacity-50 opacity-100",
            )}
            variant={backgroundGlowVariant}
          />
        </div>
      ) : null}

      <div
        className={clsx(
          "container-wide w-full pt-12 p-6 flex flex-col items-center justify-center relative",
          innerClassName,
        )}
        style={{
          minHeight,
        }}
      >
        <div
          className={clsx(
            "flex flex-col gap-4",
            textPosition === "center"
              ? "md:max-w-lg xl:max-w-2xl items-center text-center"
              : "items-start",
          )}
        >
          {withAvatars ? (
            <LazySection
              fallback={
                <div className="flex mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={clsx(
                        "shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse",
                        i === 1 && "w-14 h-14",
                        i === 2 && "w-16 h-16 -ml-6",
                        i === 3 && "w-20 h-20 -ml-4",
                        i === 4 && "w-16 h-16 -ml-4",
                        i === 5 && "w-14 h-14 -ml-6"
                      )}
                    />
                  ))}
                </div>
              }
              rootMargin="50px"
            >
              <div className="flex mb-6">
                <Image
                  {...getResponsiveImageProps({
                    src: "/static/images/people/1.webp",
                    alt: "Newsletter subscriber",
                    ...imageSizes.avatar.md,
                    sizes: responsiveSizes.avatar,
                  })}
                  className="w-14 h-14 shrink-0 rounded-full"
                />

                <Image
                  {...getResponsiveImageProps({
                    src: "/static/images/people/2.webp",
                    alt: "Newsletter subscriber",
                    ...imageSizes.avatar.md,
                    sizes: responsiveSizes.avatar,
                  })}
                  className={clsx(
                    "w-16 h-16 shrink-0 rounded-full rotate-12 -ml-6",
                    variant === "primary" ? "border-2 border-primary-500" : "",
                    variant === "secondary"
                      ? "border-2 border-secondary-500"
                      : "",
                  )}
                />

                <Image
                  {...getResponsiveImageProps({
                    src: "/static/images/people/3.webp",
                    alt: "Newsletter subscriber",
                    ...imageSizes.avatar.lg,
                    sizes: responsiveSizes.avatar,
                  })}
                  className={clsx(
                    "w-20 h-20 shrink-0 rounded-full relative z-10 -ml-4",
                    variant === "primary" ? "border-2 border-primary-500" : "",
                    variant === "secondary"
                      ? "border-2 border-secondary-500"
                      : "",
                  )}
                />

                <Image
                  {...getResponsiveImageProps({
                    src: "/static/images/people/4.webp",
                    alt: "Newsletter subscriber",
                    ...imageSizes.avatar.md,
                    sizes: responsiveSizes.avatar,
                  })}
                  className={clsx(
                    "w-16 h-16 shrink-0 rounded-full -rotate-12 -ml-4",
                    variant === "primary" ? "border-2 border-primary-500" : "",
                    variant === "secondary"
                      ? "border-2 border-secondary-500"
                      : "",
                  )}
                />

                <Image
                  {...getResponsiveImageProps({
                    src: "/static/images/people/5.webp",
                    alt: "Newsletter subscriber",
                    ...imageSizes.avatar.sm,
                    sizes: responsiveSizes.avatar,
                  })}
                  className={clsx(
                    "w-14 h-14 shrink-0 rounded-full -ml-6",
                    variant === "primary" ? "border-2 border-primary-500" : "",
                    variant === "secondary"
                      ? "border-2 border-secondary-500"
                      : "",
                  )}
                />
              </div>
            </LazySection>
          ) : null}

          {titleComponent ||
            (title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
                {title}
              </h2>
            ))}

          {descriptionComponent ||
            (description && <p className="md:text-lg -mt-3">{description}</p>)}

          <LandingNewsletterInput
            className="mt-4 max-w-sm"
            onSubmit={onSubmit}
            buttonLabel={buttonLabel}
            placeholderLabel={placeholderLabel}
            inputLabel={inputLabel}
            disabled={disabled}
          />

          {children}
        </div>
      </div>
    </section>
  );
};
