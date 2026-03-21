export interface Control {
  type: 'input' | 'dropdown';
  label: string;
  /** Options for dropdown type */
  options?: string[];
  /** The correct answer for validation */
  answer: string;
}

export interface PageData {
  id: string;
  /** Placeholder image URL */
  imageUrl: string;
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
