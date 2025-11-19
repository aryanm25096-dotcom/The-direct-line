// Mock data for The Direct Line app

export const categories = [
  { id: 'sanitation', name: 'Sanitation', keywords: ['garbage', 'trash', 'waste', 'dirty', 'smell', 'dump'] },
  { id: 'roads', name: 'Roads & Infrastructure', keywords: ['pothole', 'road', 'street', 'crack', 'pavement', 'sidewalk', 'bridge'] },
  { id: 'water', name: 'Water Supply', keywords: ['water', 'leak', 'pipe', 'tap', 'supply', 'drainage'] },
  { id: 'electricity', name: 'Electricity', keywords: ['light', 'electricity', 'power', 'streetlight', 'lamp', 'wire'] },
  { id: 'safety', name: 'Public Safety', keywords: ['safety', 'danger', 'crime', 'accident', 'emergency'] },
  { id: 'other', name: 'Other', keywords: [] }
];

export const mockTickets = [
  {
    id: 'TICK-001',
    description: 'Large pothole near Tea Lobby Cafe causing traffic issues',
    location: 'Tea Lobby Cafe, Gwalior',
    category: 'Roads & Infrastructure',
    status: 'Pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reportedBy: 'Rajesh Kumar',
    image: null
  },
  {
    id: 'TICK-002',
    description: 'Garbage not collected for 3 days, causing health hazard',
    location: 'Lashkar Area, Gwalior',
    category: 'Sanitation',
    status: 'Dispatched',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reportedBy: 'Priya Sharma',
    dispatchedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    image: null
  },
  {
    id: 'TICK-003',
    description: 'Street light not working for past week',
    location: 'City Center, Gwalior',
    category: 'Electricity',
    status: 'Pending',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    reportedBy: 'Amit Verma',
    image: null
  },
  {
    id: 'TICK-004',
    description: 'Water pipe leaking causing road flooding',
    location: 'Madhav Nagar, Gwalior',
    category: 'Water Supply',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reportedBy: 'Sunita Gupta',
    dispatchedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    image: null
  },
  {
    id: 'TICK-005',
    description: 'Broken pavement near school entrance creating danger for children',
    location: 'Model School Road, Gwalior',
    category: 'Public Safety',
    status: 'Pending',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    reportedBy: 'Mohan Singh',
    image: null
  },
  {
    id: 'TICK-006',
    description: 'Illegal dumping of construction waste',
    location: 'Residency Area, Gwalior',
    category: 'Sanitation',
    status: 'Dispatched',
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    reportedBy: 'Kavita Rao',
    dispatchedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    image: null
  }
];

export const classifyIssue = (description) => {
  const lowerDesc = description.toLowerCase();
  
  for (const category of categories) {
    if (category.keywords.some(keyword => lowerDesc.includes(keyword))) {
      return category.name;
    }
  }
  
  return 'Other';
};
