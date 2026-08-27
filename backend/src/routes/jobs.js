import { Router } from 'express';
import { asyncHandler } from '../middleware/error.js';

const router = Router();

const MOCK_JOBS = [
  {
    id: 'j1',
    title: 'Senior Frontend Developer',
    company: 'TechNova',
    location: 'Remote',
    type: 'Full-time',
    salary: '$110k - $140k',
    posted: '2 days ago',
    logoColor: '#4f46e5',
    tags: ['React', 'TypeScript', 'Next.js'],
    description:
      'Build world-class web experiences for our product platform. Collaborate with designers and backend engineers to ship features used by millions.',
    url: 'https://example.com/jobs/senior-frontend',
  },
  {
    id: 'j2',
    title: 'Backend Engineer (Node.js)',
    company: 'CloudSphere',
    location: 'Berlin, Germany',
    type: 'Full-time',
    salary: '€80k - €100k',
    posted: '5 days ago',
    logoColor: '#0ea5e9',
    tags: ['Node.js', 'MongoDB', 'AWS'],
    description:
      'Design and scale our API services. Work on event-driven microservices powering our B2B SaaS platform.',
    url: 'https://example.com/jobs/backend-node',
  },
  {
    id: 'j3',
    title: 'Product Designer',
    company: 'Designly',
    location: 'Remote (EU)',
    type: 'Contract',
    salary: '$70k - $90k',
    posted: '1 day ago',
    logoColor: '#f43f5e',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    description:
      'Own end-to-end product design for our fintech app. Run user research, craft flows, and build a scalable design system.',
    url: 'https://example.com/jobs/product-designer',
  },
  {
    id: 'j4',
    title: 'Data Scientist',
    company: 'DataMind AI',
    location: 'London, UK',
    type: 'Full-time',
    salary: '£85k - £110k',
    posted: '1 week ago',
    logoColor: '#10b981',
    tags: ['Python', 'ML', 'SQL'],
    description:
      'Build ML models that power our recommendation engine. Partner with product teams to ship data-driven features.',
    url: 'https://example.com/jobs/data-scientist',
  },
  {
    id: 'j5',
    title: 'DevOps Engineer',
    company: 'InfraWorks',
    location: 'Amsterdam, NL',
    type: 'Full-time',
    salary: '€75k - €95k',
    posted: '3 days ago',
    logoColor: '#8b5cf6',
    tags: ['Kubernetes', 'Terraform', 'CI/CD'],
    description:
      'Own our cloud infrastructure, observability, and release pipelines. Drive reliability and developer experience.',
    url: 'https://example.com/jobs/devops',
  },
  {
    id: 'j6',
    title: 'Full Stack Developer',
    company: 'Startify',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90k - $120k',
    posted: '4 hours ago',
    logoColor: '#f59e0b',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    description:
      'Join an early-stage startup and build our core product from idea to launch. High ownership, fast iterations.',
    url: 'https://example.com/jobs/fullstack',
  },
];

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { q, location, type } = req.query;

    let jobs = MOCK_JOBS;

    if (q) {
      const term = q.toLowerCase();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.tags.some((t) => t.toLowerCase().includes(term)) ||
          job.description.toLowerCase().includes(term)
      );
    }

    if (location && location !== 'Anywhere') {
      jobs = jobs.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type && type !== 'All') {
      jobs = jobs.filter((job) => job.type.toLowerCase() === type.toLowerCase());
    }

    res.json({ jobs, total: jobs.length });
  })
);

export default router;
