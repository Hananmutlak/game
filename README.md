# Game Collection API

A RESTful API for managing  game collection built with **Fastify** and **MongoDB**. This API provides full CRUD operations for managing game data with data validation and error handling.

##  Live Demo
- **API Base URL**: [https://game-collection-api.onrender.com](https://game-collection-api.onrender.com)
- **API Endpoints**: [https://game-collection-api.onrender.com/api](https://game-collection-api.onrender.com/api)
- **Health Check**: [https://game-collection-api.onrender.com/api/health](https://game-collection-api.onrender.com/api/health)
- **Games Endpoint**: [https://game-collection-api.onrender.com/api/games](https://game-collection-api.onrender.com/api/games)

## API Endpoints

| Method | Endpoint | Description | Example URL |
|--------|----------|-------------|-------------|
| GET | `/` | Welcome page | [https://game-collection-api.onrender.com/](https://game-collection-api.onrender.com/) |
| GET | `/api` | API information | [https://game-collection-api.onrender.com/api](https://game-collection-api.onrender.com/api) |
| GET | `/api/health` | Health check | [https://game-collection-api.onrender.com/api/health](https://game-collection-api.onrender.com/api/health) |
| GET | `/api/games` | Get all games | [https://game-collection-api.onrender.com/api/games](https://game-collection-api.onrender.com/api/games) |
| GET | `/api/games/:id` | Get single game | [https://game-collection-api.onrender.com/api/games/:id](https://game-collection-api.onrender.com/api/games/:id) |
| POST | `/api/games` | Create new game | `POST` to [https://game-collection-api.onrender.com/api/games](https://game-collection-api.onrender.com/api/games) |
| PUT | `/api/games/:id` | Update game | `PUT` to [https://game-collection-api.onrender.com/api/games/:id](https://game-collection-api.onrender.com/api/games/:id) |
| DELETE | `/api/games/:id` | Delete game | `DELETE` to [https://game-collection-api.onrender.com/api/games/:id](https://game-collection-api.onrender.com/api/games/:id) |

##  Current Game Data

The API currently contains 1 sample game for demonstration:

| Title | Platform | Release Year | Price | Completed | Playtime Hours |
|-------|----------|--------------|-------|-----------|----------------|
| Super Mario | Nintendo Switch | 2017 | $59.99 | Yes | 45 |

##  Installation & Local Development

### Prerequisites
- Node.js 
- MongoDB Atlas account 
- Git

### 1.Install dependencies
bash
npm install
2. Configure environment variables
Create a .env file in the root directory:

env
MONGODB_URI=00
PORT=3000
NODE_ENV=development
4. Run the server
bash
# Development mode 
npm run dev

# Production mode
npm start
 Project Structure

game-collection-api/
├── config/
│   └── database.js         
├── controllers/
│   └── gameController.js    
├── models/
│   ├── Game.js            
│   └── index.js          
├── routes/
│   └── gameRoutes.js        
├── server.js               
├── package.json            
├── render.yaml             
├── .env.example          
└── README.md               
### Game Schema
javascript
{
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    maxlength: [100, 'Platform cannot exceed 100 characters']
  },
  release_year: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1950, 'Release year must be at least 1950'],
    max: [new Date().getFullYear() + 2, 'Release year cannot be in the far future']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  completed: {
    type: Boolean,
    default: false
  },
  playtime_hours: {
    type: Number,
    default: 0,
    min: [0, 'Playtime cannot be negative']
  }
}
 API Usage Examples
Get all games
bash
curl https://game-collection-api.onrender.com/api/games
Get a specific game
bash
# Replace :id with actual game ID
curl https://game-collection-api.onrender.com/api/games/:id
Create a new game
bash
curl -X POST https://game-collection-api.onrender.com/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cyberpunk 2077",
    "platform": "PC",
    "release_year": 2020,
    "price": 49.99,
    "completed": true,
    "playtime_hours": 85
  }'
Update a game
bash
curl -X PUT https://game-collection-api.onrender.com/api/games/:id \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true,
    "playtime_hours": 100
  }'
Delete a game
bash
curl -X DELETE https://game-collection-api.onrender.com/api/games/:id
 Testing with PowerShell
powershell
# Get all games
iwr https://game-collection-api.onrender.com/api/games | ConvertFrom-Json


 Deployment on Render
1. Create a new Web Service on Render
Connect your GitHub repository

Set build command: npm install

Set start command: npm start

Add environment variables:

MONGODB_URI: 00

NODE_ENV: production

PORT: 10000 (Render sets this automatically)

2. Automatic Deployment
Render will automatically deploy your application when you push to the main branch.

3. Health Check
Render automatically monitors: GET /api/health

 Validation Rules
title: Required, maximum 255 characters

platform: Required, maximum 100 characters

release_year: Required, between 1950 and current year + 2

price: Required, minimum 0

completed: Optional, boolean (default: false)

playtime_hours: Optional, minimum 0

 Error Responses
The API returns standardized error responses:

json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2025-12-01T23:39:33.102Z"
}

Mongoose - ODM for MongoDB
