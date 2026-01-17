# Lumina: Operational Intelligence Platform 

**An "X-Ray" for Business Operations.**
Lumina is a heuristic-based **Operational Intelligence Engine** designed to quantify the "invisible financial loss" in business workflows. It moves beyond standard cost tracking to measure the financial impact of operational friction—including approval delays, context switching, and rework loops.

<!-- ![Lumina Dashboard](Add your dashboard screenshot here) -->

##  Key Features

*   **Invisible Loss Quantification**: Uses heuristic algorithms to calculate the exact monetary cost of inefficiency (e.g., "This approval delay costs ₹12k/week").
*   **Editorial-Style Reporting**: A premium, document-style analysis layout with interactive charts, "Blindspot" detection, and clarity scoring.
*   **Scenario Simulator**: Real-time "What-If" engine that lets users tweak team size and tools to see projected savings instantly.
*   **Executive Export**: One-click generation of audit-ready PDF and PPTX presentations using `ReportLab` and `Python-PPTX`.
*   **Comparison Engine**: Side-by-side analysis of two different workflows to A/B test operational strategies.

##  Tech Stack

### **Frontend** (Operational Intelligence Suite)
*   **React + Vite**: For a high-performance, component-based architecture.
*   **Framer Motion**: Complex animations for data entry and report revealing.
*   **Recharts**: Custom interactive visualization (Bullet charts, Area graphs).
*   **Design System**: Custom "Neo-Glass" aesthetic with a soft editorial pink theme (`#fad1e3`).

### **Backend** (Heuristic Engine)
*   **FastAPI (Python)**: High-speed asynchronous API handling core logic.
*   **SQLAlchemy**: SQLite integration for persisting workflow and user data.
*   **Python-PPTX & ReportLab**: Server-side generation of downloadable assets.
*   **JWT Authentication**: Secure user sessions and role management.

##  Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/lumina-intelligence.git
    cd lumina-intelligence
    ```

2.  **Setup the Backend**
    ```bash
    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

3.  **Setup the Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the App**
    *   Frontend: `http://localhost:5173`
    *   Backend API Docs: `http://localhost:8000/docs`

##  Design Philosophy
Lumina moves away from the sterile "Admin Dashboard" look. It employs an **Editorial Design Philosophy**—treating analytics reports like high-end financial publications.
*   **Typography**: Serif headings paired with clean Sans-Serif data points.
*   **Mood**: Soft, ambient backgrounds with interactive floating 3D elements to reduce cognitive load.

##  Future Roadmap
*   Integration with Jira/Slack APIs for automated data ingestion.
*   LLM-powered recommendations for specific industry verticals (Gemini/OpenAI integration).

---
*Built with ❤️ by Niveda Sree*
