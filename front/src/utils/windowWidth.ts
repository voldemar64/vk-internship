import { useEffect, useState } from "react";

interface WindowWidth {
  width: number;
}

export function getWindowWidth(): WindowWidth {
  const { innerWidth: width } = window;
  return {
    width,
  };
}

export function useWindowWidth(): WindowWidth {
  const [windowWidth, setWindowWidth] = useState<WindowWidth>(getWindowWidth());

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowWidth());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
}