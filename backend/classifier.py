# AI Classification logic

categories = [
    {'id': 'sanitation', 'name': 'Sanitation', 'keywords': ['garbage', 'trash', 'waste', 'dirty', 'smell', 'dump']},
    {'id': 'roads', 'name': 'Roads & Infrastructure', 'keywords': ['pothole', 'road', 'street', 'crack', 'pavement', 'sidewalk', 'bridge']},
    {'id': 'water', 'name': 'Water Supply', 'keywords': ['water', 'leak', 'pipe', 'tap', 'supply', 'drainage']},
    {'id': 'electricity', 'name': 'Electricity', 'keywords': ['light', 'electricity', 'power', 'streetlight', 'lamp', 'wire']},
    {'id': 'safety', 'name': 'Public Safety', 'keywords': ['safety', 'danger', 'crime', 'accident', 'emergency']},
    {'id': 'other', 'name': 'Other', 'keywords': []}
]

def classify_issue(description: str) -> str:
    """Classify issue based on keywords in description"""
    lower_desc = description.lower()
    
    for category in categories:
        if any(keyword in lower_desc for keyword in category['keywords']):
            return category['name']
    
    return 'Other'
