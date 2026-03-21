export interface Overlay {
  id: string;
  /** X position as percentage of image width (0-100) */
  x: number;
  /** Y position as percentage of image height (0-100) */
  y: number;
  /** Width as percentage of image width */
  width: number;
  /** Height as percentage of image height */
  height: number;
  /** Color of the overlay square */
  color: string;
  /** ID of the linked control in the panel */
  linkedControlId: string;
}

export interface Control {
  id: string;
  type: 'input' | 'dropdown';
  label: string;
  /** Options for dropdown type */
  options?: string[];
  /** The correct answer for validation */
  answer: string;
  /** Color matching the linked overlay */
  color: string;
}

export interface PageData {
  id: string;
  /** Placeholder image URL */
  imageUrl: string;
  overlays: Overlay[];
  controls: Control[];
  /** Markdown content for the info panel */
  markdown: string;
  /** Metadata fields shown beside the image */
  meta?: {
    longitude?: string;
    latitude?: string;
    captureTime?: string;
    mission?: string;
  };
}
