import { useCallback, useEffect, useState } from "react";

/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement,
): boolean {
  const bounds = getElementBounds(element);
  return Boolean(
    coordinate.x >= bounds.left &&
      coordinate.x <= bounds.left + bounds.width &&
      coordinate.y >= bounds.top &&
      coordinate.y <= bounds.top + bounds.height,
  );
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  const { fontSize } = window.getComputedStyle(element);

  return parseFloat(fontSize);
}

export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
export function useHoveredParagraphCoordinate(
  parsedElements: Element[],
): HoveredElementInfo | null {
  const [elementInfo, setElementInfo] = useState<HoveredElementInfo | null>(
    null,
  );
  const hoverListener = useCallback(
    (event: MouseEvent) => {
      const mousePosition = {
        x: event.clientX + window.scrollX,
        y: event.clientY + window.scrollY,
      };

      for (const element of parsedElements) {
        if (isPointInsideElement(mousePosition, element as HTMLElement)) {
          const { top, left } = getElementBounds(element as HTMLElement);
          const heightOfFirstLine = getLineHeightOfFirstLine(
            element as HTMLElement,
          );
          setElementInfo({
            element: element as HTMLElement,
            top,
            left,
            heightOfFirstLine,
          });
          return;
        }
      }

      setElementInfo(null);
    },
    [parsedElements],
  );

  useEffect(() => {
    window.addEventListener("mouseover", hoverListener);

    return () => {
      window.removeEventListener("mouseover", hoverListener);
    };
  }, [hoverListener]);
  return elementInfo;
}