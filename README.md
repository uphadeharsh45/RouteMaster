<p align="center">
  <img src="./RouteMaster/assets/readme assets/rml.png" alt="RouteMaster Logo" width="200">
</p>

<h1 align="center">RouteMaster</h1>

<p align="center">
  <b>Route Optimizer and Manager</b>  
</p>

<p align="center">
  🚚 A comprehensive tool to optimize and manage delivery routes with an intuitive map-based interface. Perfect for businesses handling time-sensitive deliveries. 📍
</p>

---

## 🚀 Demo

👉 **[Watch the demo video](https://drive.google.com/file/d/1OGlmIb4norY-01S9KQ6liRqWgWJWSCJ-/view?usp=drive_link)** to explore the application's features and functionality.

---

## 📷 Screenshots

<p align="center">
  <img src="./RouteMaster/assets/readme assets/login.jpg" alt="App Screenshot" width="300">
  <img src="./RouteMaster/assets/readme assets/signup.jpg" alt="App Screenshot" width="300">
  <img src="./RouteMaster/assets/readme assets/home.jpg" alt="App Screenshot" width="300">
  <img src="./RouteMaster/assets/readme assets/live tracking.jpg" alt="App Screenshot" width="300">
  <img src="./RouteMaster/assets/readme assets/modal.jpg" alt="App Screenshot" width="300">
  <img src="./RouteMaster/assets/readme assets/route.jpg" alt="App Screenshot" width="300">
  <img src="./RouteMaster/assets/readme assets/textual directions.jpg" alt="App Screenshot" width="300">
  <img src="./RouteMaster/assets/readme assets/saved routes.jpg" alt="App Screenshot" width="300">
  <img src="./RouteMaster/assets/readme assets/profile.jpg" alt="App Screenshot" width="300">
</p>

---

## ✨ Features

### Core Functionalities
- 📅 **Route Optimization**:  
  Create routes based on two constraints:  
  - **Time Windows**: Start and end time for each location.  
  - **Deadlines**: Only end time constraints.

- 🔄 **Dynamic Directions**:  
  Visual and textual directions for better navigation.

- 📩 **Customer Notifications**:  
  Send SMS notifications to customers about estimated delivery times.

- 📍 **Live Tracking**:  
  Real-time user location tracking and updates on the remaining path.

- ❌ **Constraint Violation Handling**:  
  If constraints can't be met, the app suggests the shortest path covering all locations.

- ⏳ **Customizable Waiting Time**:  
  Adjust default waiting time (5 mins) at delivery stops.

### Management Features
- 🗂 **Route Management**:  
  Save, delete, or modify routes.  
  Update time windows or deadlines for customers in an existing route.

- 🔒 **Password Recovery**:  
  Recover passwords via email verification.

---

## ⚙️ Setup

### Prerequisites
- Install **Android Studio** and set up an emulator.

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
   Navigate to the project directory and install dependencies:
    ```bash
    cd RouteMaster
    npm install
    ```

2. Set up the environment variables in a .env file.

3. Start the emulator and run the project:
  ```bash
  npx expo start
  ```
### 🔑 Environment Variables

Create a `.env` file in the **RouteMaster** directory and add the following:

- `API_URL`: URL of the backend server.
- `GOOGLE_API_KEY`: Your Google Maps API Key.

---

### 🛠 Tech Stack

- **Frontend**:  
  - React Native  
  - Google Maps API (Mapping & Geolocation)

- **Backend**:  
  - Node.js  
  - Express.js  
  - Flask (Python)

- **Database**:  
  - MongoDB Atlas

---


<p align="center">💡 Happy Routing with RouteMaster! 🚛📍</p>

