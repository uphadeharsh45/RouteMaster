<p align="center">
  <img src="https://github.com/user-attachments/assets/ebf1f00e-0ea8-431f-bb0d-d9d2ae5d7152" alt="RouteMaster Logo" width="200">
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
  <img src="https://github.com/user-attachments/assets/b0d86200-8e31-4369-84f2-41199e6d74e3" alt="App Screenshot" width="300">
  <img src="https://github.com/user-attachments/assets/8b38927e-c989-4db8-9abd-c39343729b0c" alt="App Screenshot" width="300">
  <img src="https://github.com/user-attachments/assets/5f535ab0-4451-4989-83f1-467381f57d90" alt="App Screenshot" width="300">
  <img src="https://github.com/user-attachments/assets/16352fa3-e230-49b9-9d24-4766639d3c7f" alt="App Screenshot" width="300">
  <img src="https://github.com/user-attachments/assets/d03eae72-8550-402c-97f4-35a3a8fa42d6" alt="App Screenshot" width="300">
  <img src="https://github.com/user-attachments/assets/b7124529-bd4a-4532-9f95-63233fd76ee2" alt="App Screenshot" width="300">
  <img src="https://github.com/user-attachments/assets/09d5929d-6b19-4a7b-84ac-8537eed7b308" alt="App Screenshot" width="300">
  <img src="https://github.com/user-attachments/assets/b7c0dc46-8447-4b24-a726-4cce2f078a8f" alt="App Screenshot" width="300">
  <img src="https://github.com/user-attachments/assets/46fb6ea7-2fa5-404f-b4f6-d2de66280d9b" alt="App Screenshot" width="300">
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

