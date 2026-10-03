export function nextScreenshotIndex(index, direction, count) {
  if (count < 2) return 0;
  return (index + direction + count) % count;
}

export function swipeDirection(deltaX, deltaY) {
  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return 0;
  return deltaX < 0 ? 1 : -1;
}
