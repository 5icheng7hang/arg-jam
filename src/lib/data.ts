import type { PageData } from './types';
import testImg from '../assets/test03.png';

const COLORS = ['#b8ff00', '#00ffcc', '#ff3366', '#ffaa00', '#aa66ff'];

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
    meta: {
      longitude: '121.4737°E',
      latitude: '31.2304°N',
      captureTime: '公元2084纪年',
      mission: '区域扫描 Alpha-7',
    },
    markdown: `# 任务简报 #01\n\n目标区域已确认。请根据图像信息识别 **标记位置** 的内容。\n\n- 区域编号: \`SEC-A7\`\n- 威胁等级: 低\n- 备注: 初始校准阶段，注意噪声干扰。`,
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
    meta: {
      longitude: '116.4074°E',
      latitude: '39.9042°N',
      captureTime: '公元2091纪年',
      mission: '深层扫描 Beta-3',
    },
    markdown: `# 任务简报 #02\n\n多目标已检测。信号分析表明区域内存在 **三个异常源**。\n\n- 信号强度: 中等\n- 解码进度: 47%\n- 警告: 第三象限存在电磁屏蔽。`,
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
    meta: {
      longitude: '139.6917°E',
      latitude: '35.6895°N',
      captureTime: '公元2076纪年',
      mission: '追踪协议 Gamma-1',
    },
    markdown: `# 任务简报 #03\n\n生物特征已锁定，等待确认。请根据图像中的视觉线索完成鉴定。\n\n- 分类: 生物样本\n- 置信度: 82%\n- 注意: 高频振动可能影响识别精度。`,
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
    meta: {
      longitude: '2.3522°E',
      latitude: '48.8566°N',
      captureTime: '公元2103纪年',
      mission: '深渊协议 Delta-9',
    },
    markdown: `# 任务简报 #04\n\n多层加密信号源已定位。区域内发现 **未知能量场波动**。\n\n- 辐射指数: 偏高\n- 时序偏差: +0.003s\n- 建议: 优先处理核心目标，忽略外围噪声。`,
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
    meta: {
      longitude: '???',
      latitude: '???',
      captureTime: '公元????纪年',
      mission: '最终阶段 Omega-0',
    },
    markdown: `# 最终简报 #05\n\n所有前置任务已完成。最终目标解锁。\n\n> "真相隐藏在星云之中。"\n\n- 状态: **最终确认**\n- 权限: 最高\n- 祝你好运，特工。`,
  },
];
