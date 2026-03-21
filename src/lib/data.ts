import type { PageData } from './types';
import testImg from '../assets/test.jpg';

const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];

export const pages: PageData[] = [
  {
    id: 'page-1',
    imageUrl: testImg,
    overlays: [
      { id: 'o1-1', x: 10, y: 15, width: 25, height: 25, color: COLORS[0], linkedControlId: 'c1-1' },
      { id: 'o1-2', x: 60, y: 50, width: 20, height: 20, color: COLORS[1], linkedControlId: 'c1-2' },
    ],
    controls: [
      { id: 'c1-1', type: 'input', label: 'What is hidden here?', answer: 'mango', color: COLORS[0] },
      { id: 'c1-2', type: 'dropdown', label: 'Pick the color', options: ['crimson', 'azure', 'olive', 'ivory'], answer: 'azure', color: COLORS[1] },
    ],
  },
  {
    id: 'page-2',
    imageUrl: testImg,
    overlays: [
      { id: 'o2-1', x: 30, y: 10, width: 30, height: 20, color: COLORS[2], linkedControlId: 'c2-1' },
      { id: 'o2-2', x: 5, y: 60, width: 22, height: 22, color: COLORS[3], linkedControlId: 'c2-2' },
      { id: 'o2-3', x: 65, y: 65, width: 18, height: 18, color: COLORS[4], linkedControlId: 'c2-3' },
    ],
    controls: [
      { id: 'c2-1', type: 'input', label: 'Name the object', answer: 'prism', color: COLORS[2] },
      { id: 'c2-2', type: 'dropdown', label: 'How many?', options: ['seven', 'twelve', 'three', 'nine'], answer: 'twelve', color: COLORS[3] },
      { id: 'c2-3', type: 'input', label: 'What shape?', answer: 'helix', color: COLORS[4] },
    ],
  },
  {
    id: 'page-3',
    imageUrl: testImg,
    overlays: [
      { id: 'o3-1', x: 40, y: 35, width: 28, height: 28, color: COLORS[0], linkedControlId: 'c3-1' },
      { id: 'o3-2', x: 5, y: 5, width: 20, height: 20, color: COLORS[1], linkedControlId: 'c3-2' },
    ],
    controls: [
      { id: 'c3-1', type: 'dropdown', label: 'What animal?', options: ['otter', 'falcon', 'lynx', 'bison'], answer: 'falcon', color: COLORS[0] },
      { id: 'c3-2', type: 'input', label: 'Write the word', answer: 'zephyr', color: COLORS[1] },
    ],
  },
  {
    id: 'page-4',
    imageUrl: testImg,
    overlays: [
      { id: 'o4-1', x: 15, y: 40, width: 20, height: 20, color: COLORS[2], linkedControlId: 'c4-1' },
      { id: 'o4-2', x: 55, y: 20, width: 25, height: 25, color: COLORS[3], linkedControlId: 'c4-2' },
      { id: 'o4-3', x: 35, y: 70, width: 15, height: 15, color: COLORS[4], linkedControlId: 'c4-3' },
    ],
    controls: [
      { id: 'c4-1', type: 'input', label: 'Type the number', answer: 'phosphor', color: COLORS[2] },
      { id: 'c4-2', type: 'dropdown', label: 'Season?', options: ['dusk', 'solstice', 'ember', 'frost'], answer: 'ember', color: COLORS[3] },
      { id: 'c4-3', type: 'input', label: 'Hidden letter', answer: 'quartz', color: COLORS[4] },
    ],
  },
  {
    id: 'page-5',
    imageUrl: testImg,
    overlays: [
      { id: 'o5-1', x: 20, y: 20, width: 22, height: 22, color: COLORS[0], linkedControlId: 'c5-1' },
      { id: 'o5-2', x: 55, y: 55, width: 22, height: 22, color: COLORS[1], linkedControlId: 'c5-2' },
    ],
    controls: [
      { id: 'c5-1', type: 'dropdown', label: 'Material?', options: ['obsidian', 'copper', 'velvet', 'marble'], answer: 'obsidian', color: COLORS[0] },
      { id: 'c5-2', type: 'input', label: 'Final answer', answer: 'nebula', color: COLORS[1] },
    ],
  },
];
