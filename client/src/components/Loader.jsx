import React from "react";

const Loader = ({ size = "medium", fullScreen = false }) => {
    const isLarge = size === "large";
    const showMessage = fullScreen || isLarge;

    const ringSizes = {
        small: "w-8 h-8",
        medium: "w-14 h-14",
        large: "w-20 h-20",
    };

    const dotSizes = {
        small: "w-1.5 h-1.5",
        medium: "w-2 h-2",
        large: "w-2.5 h-2.5",
    };

    const loaderContent = (
        <div className="flex flex-col items-center justify-center text-center px-4">
            <div className="relative flex items-center justify-center">
                <div
                    className={`${ringSizes[size]} rounded-full border-4 border-[#b18597]/35`}
                ></div>
                <div
                    className={`${ringSizes[size]} absolute rounded-full border-4 border-transparent border-t-[#b18597] border-r-[#8b6b79] animate-spin`}
                    style={{ animationDuration: "900ms" }}
                ></div>
            </div>

            {showMessage && (
                <>
                    <p className="mt-5 text-base sm:text-lg font-semibold text-[#382b22]">
                        Please wait, server is starting...
                    </p>
                    <p className="mt-1 text-sm sm:text-base text-[#8b6b79]">
                        It may take 40-60 seconds on first load (Render cold
                        start).
                    </p>
                </>
            )}

            <div className="flex items-center gap-1 mt-3" aria-hidden="true">
                <span
                    className={`${dotSizes[size]} rounded-full bg-[#f9c4d2] animate-bounce`}
                    style={{ animationDelay: "0ms" }}
                ></span>
                <span
                    className={`${dotSizes[size]} rounded-full bg-[#b18597] animate-bounce`}
                    style={{ animationDelay: "150ms" }}
                ></span>
                <span
                    className={`${dotSizes[size]} rounded-full bg-[#8b6b79] animate-bounce`}
                    style={{ animationDelay: "300ms" }}
                ></span>
            </div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-[#fff6f6] via-[#fffafa] to-[#ffe9e9] backdrop-blur-sm">
                {loaderContent}
            </div>
        );
    }

    return loaderContent;
};

export default Loader;
