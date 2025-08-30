# eyelura - Virtual Try-On Eyewear Store

Eyelura is a modern e-commerce web application that allows users to browse, purchase, and virtually try on eyewear using augmented reality.

![Eyelura Screenshot](public/EEu.png)

## Features

-   **E-commerce Platform**: A full-featured online store with product listings, a shopping cart, and a secure checkout process.
-   **AR Virtual Try-On**: Users can try on glasses in real-time using their webcam, thanks to a combination of React, Three.js, and MediaPipe Face Mesh.
-   **User Accounts**: Users can create accounts, log in (including with Google), and manage their wishlist.
-   **Responsive Design**: A mobile-first design that works beautifully on desktops, tablets, and smartphones.
-   **Extensive Product Pages**: Detailed pages for each product, including descriptions, pricing, and virtual try-on access.

## Tech Stack

### Frontend

-   **Framework**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **3D/AR**:
    -   [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
    -   [@mediapipe/face_mesh](https://developers.google.com/mediapipe)
-   **State Management**: React Context API
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend

-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Authentication**: [Passport.js](http://www.passportjs.org/) (JWT & Google OAuth)
-   **Payments**: [Razorpay](https://razorpay.com/)

## Getting Started

### Prerequisites

-   Node.js (v18.x or higher)
-   npm / yarn / pnpm
-   MongoDB instance (local or cloud)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd eyelura
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

4.  **Set up environment variables:**

    Create a `.env` file in the `backend` directory and add the following:

    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    ```

5.  **Run the development servers:**

    -   **Frontend (in root directory):**
        ```bash
        npm run dev
        ```
        The frontend will be available at `http://localhost:5173`.

    -   **Backend (in `backend` directory):**
        ```bash
        npm start
        ```
        The backend server will start on `http://localhost:5000` (or your configured port).

## Project Structure

Here is a brief overview of the key directories:

-   `src/components`: Contains the React components.
    -   `pages`: Components that represent full pages (e.g., `Shop.jsx`, `Homepage.jsx`).
    -   `ui`: Reusable UI elements (e.g., `Header.jsx`, `ARTryOn.jsx`).
-   `src/context`: Holds the context providers for `Auth`, `Cart`, and `Wishlist`.
-   `src/hooks`: Custom React hooks, like `useARTryOn.js`.
-   `public/models`: Contains the `.glb` 3D models for the glasses.
-   `backend`: Contains the Node.js/Express server code.
    -   `controllers`: Logic for handling requests.
    -   `models`: Mongoose schemas for the database.
    -   `routes`: API route definitions.

## Next Steps & Potential Improvements

Here are a few areas where the project could be enhanced:

-   **Refactor `ARTryOn.jsx` state**: The state management in the `ARTryOn` component could be simplified by using the `useReducer` hook, which is ideal for managing complex state with multiple sub-values.
-   **Lazy Loading Routes**: To improve initial page load performance, implement lazy loading for your routes. This will split the code into smaller chunks that are loaded on demand.
-   **Add User Profile Page**: Create a dashboard where users can view their order history, update their profile information, and manage their addresses.
-   **Admin Panel**: A dedicated interface for administrators to manage products, view orders, and handle user accounts would be a great addition.
-   **Write Tests**: Implement unit and integration tests using a framework like Jest and React Testing Library to ensure code quality and prevent regressions.

