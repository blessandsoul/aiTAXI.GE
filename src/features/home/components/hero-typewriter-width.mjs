export function clampTypewriterReservedWidth(
  measuredWidth,
  caretWidth,
  availableWidth,
  clampToAvailable,
) {
  const reservedWidth = Math.ceil(measuredWidth + caretWidth);
  return clampToAvailable
    ? Math.min(reservedWidth, Math.floor(availableWidth))
    : reservedWidth;
}
