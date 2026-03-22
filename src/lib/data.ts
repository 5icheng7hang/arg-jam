import type { PageData } from './types';
import testImg from '../assets/1.png';

export const pages: PageData[] = [
  {
    id: 'page-1',
    imageUrl: testImg,
    controls: [
      { type: 'input', label: 'What is hidden here?', answer: 'mango' },
      { type: 'dropdown', label: 'Pick the color', options: ['crimson', 'azure', 'olive', 'ivory'], answer: 'azure' },
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
    controls: [
      { type: 'input', label: 'Name the object', answer: 'prism' },
      { type: 'dropdown', label: 'How many?', options: ['seven', 'twelve', 'three', 'nine'], answer: 'twelve' },
      { type: 'input', label: 'What shape?', answer: 'helix' },
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
    controls: [
      { type: 'dropdown', label: 'What animal?', options: ['otter', 'falcon', 'lynx', 'bison'], answer: 'falcon' },
      { type: 'input', label: 'Write the word', answer: 'zephyr' },
    ],
    meta: {
      longitude: '113.2644°E',
      latitude: '23.1291°N',
      captureTime: '公元2076纪年',
      mission: '追踪协议 Gamma-1',
    },
    markdown: `# 任务简报 #03\n\n生物特征已锁定，等待确认。请根据图像中的视觉线索完成鉴定。\n\n- 分类: 生物样本\n- 置信度: 82%\n- 注意: 高频振动可能影响识别精度。`,
  },
  {
    id: 'page-4',
    imageUrl: testImg,
    controls: [
      { type: 'input', label: 'Type the number', answer: 'phosphor' },
      { type: 'dropdown', label: 'Season?', options: ['dusk', 'solstice', 'ember', 'frost'], answer: 'ember' },
      { type: 'input', label: 'Hidden letter', answer: 'quartz' },
    ],
    meta: {
      longitude: '104.0665°E',
      latitude: '30.5728°N',
      captureTime: '公元2103纪年',
      mission: '深渊协议 Delta-9',
    },
    markdown: `# 任务简报 #04\n\n多层加密信号源已定位。区域内发现 **未知能量场波动**。\n\n- 辐射指数: 偏高\n- 时序偏差: +0.003s\n- 建议: 优先处理核心目标，忽略外围噪声。`,
  },
  {
    id: 'page-5',
    imageUrl: testImg,
    controls: [
      { type: 'dropdown', label: 'Material?', options: ['obsidian', 'copper', 'velvet', 'marble'], answer: 'obsidian' },
      { type: 'input', label: 'Final answer', answer: 'nebula' },
    ],
    meta: {
      longitude: '114.0579°E',
      latitude: '22.5431°N',
      captureTime: '公元????纪年',
      mission: '最终阶段 Omega-0',
    },
    markdown: `# 最终简报 #05\n\n所有前置任务已完成。最终目标解锁。\n\n> "真相隐藏在星云之中。"\n\n- 状态: **最终确认**\n- 权限: 最高\n- 祝你好运，特工。`,
  },
];
