import type { ContentItem, SectionKey } from '../types';

export const sections: { id: SectionKey; label: string; eyebrow: string; description: string }[] = [
  { id: 'announcements', label: 'Announcements', eyebrow: 'WHAT’S NEW', description: 'Updates and moments worth sharing with the team.' },
  { id: 'champions', label: 'Champion stories', eyebrow: 'PEOPLE OF AIBLE', description: 'Recognize the people putting AI into practice.' },
  { id: 'leaderboard', label: 'Leaderboard', eyebrow: 'COMMUNITY PULSE', description: 'Celebrate participation and progress.' },
  { id: 'learning', label: 'Learning Roads', eyebrow: 'BUILD YOUR SKILLS', description: 'Curated roads to go from curious to confident.' },
  { id: 'resources', label: 'Resources', eyebrow: 'YOUR TOOLKIT', description: 'The useful links and guides, all in one place.' },
];

export const initialContent: ContentItem[] = [
  { id: 'a1', section: 'announcements', title: 'AI Week is around the corner', detail: 'Five days of hands-on sessions, team demos, and new ways to bring AI into your everyday work.', meta: 'EVENT · NOV 20', tone: 'plum' },
  { id: 'a2', section: 'announcements', title: 'Meet the new AIBLE office hours', detail: 'Bring a prompt, a workflow, or a question. Our champions are ready to help you get unstuck.', meta: 'COMMUNITY · NOV 18', tone: 'orange' },
  { id: 'a3', section: 'announcements', title: 'The prompt library just grew', detail: 'Browse 12 new, team-tested prompts for research, writing, and everyday productivity.', meta: 'RESOURCE · NOV 14', tone: 'green' },
  { id: 'c1', section: 'champions', title: 'Maya Chen', detail: 'Turned a weekly reporting ritual into a 15-minute review with an AI-assisted workflow.', meta: 'MARKETING · CHAMPION', tone: 'orange' },
  { id: 'c2', section: 'champions', title: 'Jordan Lee', detail: 'Built a prompt kit that helps the whole team get to a sharper first draft, faster.', meta: 'PEOPLE · CHAMPION', tone: 'plum' },
  { id: 'c3', section: 'champions', title: 'Sam Rivera', detail: 'Made space for experimentation by sharing the wins, misses, and lessons along the way.', meta: 'FINANCE · CHAMPION', tone: 'green' },
  { id: 'l1', section: 'leaderboard', title: 'Maya Chen', detail: '18 points · 6 activities', meta: '01', tone: 'orange' },
  { id: 'l2', section: 'leaderboard', title: 'Sam Rivera', detail: '15 points · 5 activities', meta: '02', tone: 'plum' },
  { id: 'l3', section: 'leaderboard', title: 'Jordan Lee', detail: '12 points · 4 activities', meta: '03', tone: 'green' },
  { id: 't1', section: 'learning', title: 'AI essentials', detail: 'Start with the foundations: how generative AI works, where it helps, and how to use it responsibly.', meta: '4 LESSONS · 45 MIN', tone: 'blue' },
  { id: 't2', section: 'learning', title: 'Prompting with purpose', detail: 'Practice a repeatable framework for clear instructions, useful context, and better outputs.', meta: '5 LESSONS · 60 MIN', tone: 'plum' },
  { id: 't3', section: 'learning', title: 'Build your first workflow', detail: 'Map a real task and prototype a workflow that gives your time back.', meta: '3 LESSONS · 40 MIN', tone: 'green' },
  { id: 'r1', section: 'resources', title: 'AIBLE getting started guide', detail: 'A quick guide to the tools, guardrails, and support available to you.', meta: 'GUIDE · 8 MIN', tone: 'plum' },
  { id: 'r2', section: 'resources', title: 'Responsible AI principles', detail: 'The shared principles we use to keep experimentation thoughtful and safe.', meta: 'REFERENCE · 5 MIN', tone: 'blue' },
];
