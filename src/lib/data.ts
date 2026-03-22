import { load } from 'js-yaml';
import gameContentRaw from '../../game-content.yaml?raw';
import type { Control, PageData } from './types';

const assetModules = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const assetsByName = Object.fromEntries(
  Object.entries(assetModules).map(([path, url]) => [path.split('/').pop() ?? path, url]),
);

interface GameContentConfig {
  pages: YamlPageConfig[];
}

interface YamlPageConfig {
  id: string;
  image: string;
  briefing: string;
  controls: YamlControlConfig[];
  meta?: {
    longitude?: string;
    latitude?: string;
    captureTime?: string;
    mission?: string;
  };
}

interface YamlControlConfig {
  type: 'input' | 'dropdown';
  label: string;
  answer: string | string[];
  options?: string[];
}

function parseAnswer(value: unknown, field: string): string | string[] {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      throw new Error(`Invalid game-content.yaml: ${field} must not be an empty array.`);
    }
    return value.map((item, index) => expectString(item, `${field}[${index}]`));
  }
  return expectString(value, field);
}

function expectObject(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Invalid game-content.yaml: ${field} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function expectString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid game-content.yaml: ${field} must be a non-empty string.`);
  }

  return value;
}

function optionalString(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return expectString(value, field);
}

function parseControls(value: unknown, pageId: string): Control[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Invalid game-content.yaml: ${pageId}.controls must be a non-empty array.`);
  }

  return value.map((controlValue, controlIndex) => {
    const control = expectObject(controlValue, `${pageId}.controls[${controlIndex}]`);
    const type = expectString(control.type, `${pageId}.controls[${controlIndex}].type`);

    if (type !== 'input' && type !== 'dropdown') {
      throw new Error(`Invalid game-content.yaml: ${pageId}.controls[${controlIndex}].type must be input or dropdown.`);
    }

    const parsedControl: Control = {
      type,
      label: expectString(control.label, `${pageId}.controls[${controlIndex}].label`),
      answer: parseAnswer(control.answer, `${pageId}.controls[${controlIndex}].answer`),
    };

    if (type === 'dropdown') {
      if (!Array.isArray(control.options) || control.options.length === 0) {
        throw new Error(`Invalid game-content.yaml: ${pageId}.controls[${controlIndex}].options must be a non-empty array for dropdown controls.`);
      }

      parsedControl.options = control.options.map((option, optionIndex) =>
        expectString(option, `${pageId}.controls[${controlIndex}].options[${optionIndex}]`),
      );
    }

    return parsedControl;
  });
}

function parsePage(pageValue: unknown, pageIndex: number): PageData {
  const page = expectObject(pageValue, `pages[${pageIndex}]`);
  const id = expectString(page.id, `pages[${pageIndex}].id`);
  const image = expectString(page.image, `${id}.image`);
  const imageUrl = assetsByName[image];

  if (!imageUrl) {
    throw new Error(`Invalid game-content.yaml: image '${image}' for ${id} was not found in src/assets.`);
  }

  const meta = page.meta ? expectObject(page.meta, `${id}.meta`) : undefined;

  return {
    id,
    imageUrl,
    controls: parseControls(page.controls, id),
    markdown: expectString(page.briefing, `${id}.briefing`),
    meta: meta
      ? {
          longitude: optionalString(meta.longitude, `${id}.meta.longitude`),
          latitude: optionalString(meta.latitude, `${id}.meta.latitude`),
          captureTime: optionalString(meta.captureTime, `${id}.meta.captureTime`),
          mission: optionalString(meta.mission, `${id}.meta.mission`),
        }
      : undefined,
  };
}

function parseGameContent(raw: string): PageData[] {
  const parsed = load(raw);
  const config = expectObject(parsed, 'root') as Partial<GameContentConfig>;

  if (!Array.isArray(config.pages) || config.pages.length === 0) {
    throw new Error('Invalid game-content.yaml: pages must be a non-empty array.');
  }

  return config.pages.map(parsePage);
}

export const pages: PageData[] = parseGameContent(gameContentRaw);
