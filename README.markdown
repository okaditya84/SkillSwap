# SkillSwap Platform
A collaborative platform that enables users to exchange skills and knowledge through a structured swap system.

## Team Members
**Team 2921**
- Shivanjali Srivastav - shivanjalisriv@gmail.com
- Shrey Shah - shrey.sce21@sot.pdpu.ac.in
- Mahi Shah - mahi.tech04@gmail.com
- Aditya Jethani (TL) - adityajethani11@gmail.com

## 🎯 Overview
SkillSwap is a community-driven platform where users can offer their skills and request others in return, fostering peer-to-peer learning and skill development.

## ✨ Features
### User Profiles
- Basic information (name, location, profile photo)
- Skills offered listing
- Skills wanted listing
- Availability scheduling (weekends, evenings)
- Public/private profile settings

### Skill Discovery
- Browse users by skill categories
- Search functionality for specific skills (e.g., "Photoshop", "Excel")
- Filter by location and availability

### Swap Management
- Send skill swap requests
- Accept or reject incoming offers
- View current and pending swap requests
- Delete unaccepted swap requests
- Ratings and feedback system post-swap

### Admin Controls
- Moderate skill descriptions
- User management and policy enforcement
- Monitor swap activities (pending, accepted, cancelled)
- Platform-wide messaging system
- Generate activity and feedback reports

## 🚀 Getting Started
To set up the SkillSwap platform locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/skillswap.git
   cd skillswap
   ```

2. **Install Dependencies**:
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the `backend` directory based on `.env.example`.
   - Set up database credentials and other environment variables (e.g., PORT, DATABASE_URL).

4. **Set Up the Database**:
   - Ensure MongoDB is installed and running locally or use a cloud-based MongoDB service.
   - Run the database migrations:
     ```bash
     cd backend
     npm run migrate
     ```

5. **Run the Application**:
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend development server:
     ```bash
     cd frontend
     npm start
     ```

6. **Access the Application**:
   - Open your browser and navigate to `http://localhost:3000` for the frontend.
   - The backend API will be available at `http://localhost:5000`.

## 🌿 Branches
The repository is organized into two main branches:

- **frontend**: Contains the React.js-based client-side code, including user interface components, pages, and client-side logic for interacting with the backend API. This branch handles the rendering of user profiles, skill discovery, and swap management interfaces.
- **backend**: Contains the Node.js and Express-based server-side code, including API endpoints, database interactions with MongoDB, and business logic for user management, swap requests, and admin controls.

## 🛠️ Tech Stack
- **Backend**: Node.js with Express
- **Frontend**: React.js
- **Database**: MongoDB
- **Frontend Styling**: Tailwind CSS

## 📝 User Roles
| Role | Permissions |
|------|-------------|
| User | Create profile, list skills, request swaps, rate exchanges |
| Admin | Full moderation, user management, platform oversight |

## 🤝 Contributing
Feel free to contribute to this project by submitting issues or pull requests. Please follow the contribution guidelines in `CONTRIBUTING.md`.

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.