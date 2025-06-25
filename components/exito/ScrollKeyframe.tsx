import React, { ReactNode, useState, useEffect, useRef, useContext, useCallback } from 'react';

/**
 * Position range for a keyframe
 */
export interface ScrollPosition {
  start: number;
  end: number;
}

/**
 * Direction of scroll exit
 */
export enum ExitDirection {
  TOP = 'top', // Exited by scrolling down (content moves up)
  BOTTOM = 'bottom', // Exited by scrolling up (content moves down)
  NONE = 'none', // Not exited yet
}

/**
 * Direction of scroll entry
 */
export enum EntryDirection {
  TOP = 'top', // Entered by scrolling down (from above)
  BOTTOM = 'bottom', // Entered by scrolling up (from below)
  NONE = 'none', // Initial state or not entered yet
}

/**
 * Props for the ScrollKeyframe component
 */
export interface ScrollKeyframeProps {
  position: ScrollPosition;
  onEnter?: (direction: EntryDirection) => void;
  onExit?: (direction: ExitDirection) => void;
  children: ReactNode;
  scrollY?: number;
}

/**
 * ScrollKeyframe component that renders content when scroll position is within its range
 * With scroll direction awareness for both entry and exit
 */
export function ScrollKeyframe({
  position,
  onEnter,
  onExit,
  children,
  scrollY = 0,
}: ScrollKeyframeProps): JSX.Element | null {
  const [isActive, setIsActive] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [exitDirection, setExitDirection] = useState<ExitDirection>(ExitDirection.NONE);
  const [entryDirection, setEntryDirection] = useState<EntryDirection>(EntryDirection.NONE);
  const prevScrollYRef = useRef<number>(scrollY);
  const exitHandlersRef = useRef<((direction: ExitDirection) => Promise<void>)[]>([]);
  const entryHandlersRef = useRef<((direction: EntryDirection) => Promise<void>)[]>([]);

  // Track if entry animation has been triggered
  const hasEntryAnimated = useRef(false);

  // Store pending entry direction if handlers aren't registered yet
  const pendingEntryDirection = useRef<EntryDirection | null>(null);

  // Register an exit handler that receives direction
  const registerExitHandler = useCallback(
    (handler: (direction: ExitDirection) => Promise<void>) => {
      exitHandlersRef.current.push(handler);
      return () => {
        exitHandlersRef.current = exitHandlersRef.current.filter((h) => h !== handler);
      };
    },
    []
  );

  // Register an entry handler that receives direction
  const registerEntryHandler = useCallback(
    (handler: (direction: EntryDirection) => Promise<void>) => {
      entryHandlersRef.current.push(handler);

      // Check if there's a pending entry animation
      if (pendingEntryDirection.current !== null && !hasEntryAnimated.current) {
        // Immediately trigger the animation with the pending direction
        const direction = pendingEntryDirection.current;
        pendingEntryDirection.current = null;
        hasEntryAnimated.current = true;

        // Run the animation
        Promise.all([handler(direction)]);
      }

      return () => {
        entryHandlersRef.current = entryHandlersRef.current.filter((h) => h !== handler);
      };
    },
    []
  );

  // Convenience method for Reanimated exit animations
  const registerDirectionalExit = useCallback(
    (animationFn: (direction: ExitDirection, completeCallback: () => void) => void) => {
      const exitHandler = (direction: ExitDirection) => {
        return new Promise<void>((resolve) => {
          animationFn(direction, resolve);
        });
      };

      return registerExitHandler(exitHandler);
    },
    [registerExitHandler]
  );

  // Convenience method for Reanimated entry animations
  const registerDirectionalEntry = useCallback(
    (animationFn: (direction: EntryDirection, completeCallback: () => void) => void) => {
      const entryHandler = (direction: EntryDirection) => {
        return new Promise<void>((resolve) => {
          animationFn(direction, resolve);
        });
      };

      return registerEntryHandler(entryHandler);
    },
    [registerEntryHandler]
  );

  useEffect(() => {
    const shouldBeActive = scrollY >= position.start && scrollY <= position.end;
    const prevScrollY = prevScrollYRef.current;

    if (shouldBeActive && !isActive) {
      // Determine entry direction based on previous scroll position
      let direction: EntryDirection;

      if (prevScrollY < position.start) {
        // Entered from the top (scrolled down into the keyframe)
        direction = EntryDirection.TOP;
      } else if (prevScrollY > position.end) {
        // Entered from the bottom (scrolled up into the keyframe)
        direction = EntryDirection.BOTTOM;
      } else {
        // Initial render or can't determine
        // For initial render, make a best guess based on current position
        direction =
          scrollY <= (position.start + position.end) / 2
            ? EntryDirection.TOP
            : EntryDirection.BOTTOM;
      }

      // Reset the animation flag when becoming active
      hasEntryAnimated.current = false;

      // Entering the active zone
      setIsActive(true);
      setShouldRender(true);
      setEntryDirection(direction);

      // Run enter handlers
      const runEntryHandlers = async () => {
        onEnter?.(direction);

        if (entryHandlersRef.current.length > 0) {
          // Handlers are already registered, run them
          hasEntryAnimated.current = true;
          await Promise.all(entryHandlersRef.current.map((handler) => handler(direction)));
        } else {
          // No handlers registered yet, store the direction for later
          pendingEntryDirection.current = direction;
        }
      };

      runEntryHandlers();
    } else if (!shouldBeActive && isActive) {
      // Determine exit direction based on current position
      let direction: ExitDirection;

      if (scrollY < position.start) {
        // Exited from the top (user scrolled up)
        direction = ExitDirection.TOP;
      } else {
        // Exited from the bottom (user scrolled down)
        direction = ExitDirection.BOTTOM;
      }

      setIsActive(false);
      setExitDirection(direction);

      // Run all registered exit handlers with direction
      const runExitHandlers = async () => {
        onExit?.(direction);

        if (exitHandlersRef.current.length > 0) {
          // Run all exit handlers in parallel
          await Promise.all(exitHandlersRef.current.map((handler) => handler(direction)));
        }

        // After all handlers have completed, stop rendering
        setShouldRender(false);
        // Reset animation flags for next entry
        hasEntryAnimated.current = false;
        pendingEntryDirection.current = null;
      };

      runExitHandlers();
    }

    // Update the previous scroll position for next render
    prevScrollYRef.current = scrollY;
  }, [scrollY, position.start, position.end, isActive, onEnter, onExit]);

  // Create the context value with all our functions and data
  const contextValue = React.useMemo(
    () => ({
      isActive,
      scrollY,
      position,
      entryDirection,
      exitDirection,
      registerExitHandler,
      registerEntryHandler,
      registerDirectionalExit,
      registerDirectionalEntry,
    }),
    [
      isActive,
      scrollY,
      position,
      entryDirection,
      exitDirection,
      registerExitHandler,
      registerEntryHandler,
      registerDirectionalExit,
      registerDirectionalEntry,
    ]
  );

  // Render the provider and children
  return shouldRender ? (
    <ScrollKeyframeContext.Provider value={contextValue}>{children}</ScrollKeyframeContext.Provider>
  ) : null;
}

// Enhanced context type with entry and exit direction
export interface ScrollKeyframeContextType {
  isActive: boolean;
  scrollY: number;
  position: { start: number; end: number };
  entryDirection: EntryDirection;
  exitDirection: ExitDirection;
  registerExitHandler: (handler: (direction: ExitDirection) => Promise<void>) => () => void;
  registerEntryHandler: (handler: (direction: EntryDirection) => Promise<void>) => () => void;
  registerDirectionalExit: (
    animationFn: (direction: ExitDirection, completeCallback: () => void) => void
  ) => () => void;
  registerDirectionalEntry: (
    animationFn: (direction: EntryDirection, completeCallback: () => void) => void
  ) => () => void;
}

// Default context values
export const ScrollKeyframeContext = React.createContext<ScrollKeyframeContextType>({
  isActive: false,
  scrollY: 0,
  position: { start: 0, end: 0 },
  entryDirection: EntryDirection.NONE,
  exitDirection: ExitDirection.NONE,
  registerExitHandler: () => () => {},
  registerEntryHandler: () => () => {},
  registerDirectionalExit: () => () => {},
  registerDirectionalEntry: () => () => {},
});

// Enhanced hook with scroll direction info
export function useScrollKeyframe() {
  const context = useContext(ScrollKeyframeContext);

  // Calculate normalized progress within the keyframe range (0-1)
  const progress = React.useMemo(() => {
    if (!context.isActive) return 0;

    const { start, end } = context.position;
    const range = end - start;

    if (range <= 0) return 0;

    // Clamp progress between 0 and 1
    const raw = (context.scrollY - start) / range;
    return Math.max(0, Math.min(1, raw));
  }, [context.isActive, context.scrollY, context.position]);

  // Return the enhanced context
  return {
    ...context,
    progress, // Normalized progress (0-1) within the keyframe
  };
}
