export function normalizeVenueImage(image?: string | null) {
  return (image?.includes('venue_placeholder.png') ? undefined : image) || undefined;
}
