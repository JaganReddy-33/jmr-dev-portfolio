# Jaganmohan Reddy · Developer Portfolio

A full-stack, owner-managed portfolio: a 3D React front end and a Java Spring Boot REST API. Visitors browse projects, experience, skills and certificates and send messages; the owner logs in with a private key to add, edit and delete content without touching code.

> **Live demo:** [Live Portfolio](https://jmr-dev-portfolio-gilt.vercel.app) · **API:** [API URL](https://jmr-dev-portfolio.onrender.com)

<!-- Add 1-2 screenshots here: ![Home](docs/home.png) -->

## Features

- **3D, animated UI:** particle-wave background (three.js), tilting 3D photo with orbiting rings, scroll-reveal, light/dark theme, fully responsive with a mobile menu.
- **Owner mode:** add / edit / delete **projects, experience, skills (grouped boxes) and achievements** from popup forms, with image upload and preview. Buttons are hidden from visitors.
- **Live counters:** hero stats (projects, experiences, skills, certificates) update automatically from your data.
- **Projects ⇄ Achievements filter:** projects by default, certificates and publications on one click.
- **Contact form** stored in the database, with server-side validation; readable only by the owner.
- **Resume** preview and download straight from Google Drive: update the Drive file and the site stays current.
- **Graceful offline mode:** if the API is unreachable, the site still works from seeded content and browser storage.

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, three.js, plain CSS (custom properties, 3D transforms) |
| Backend | Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Bean Validation |
| Database | H2 (default, zero setup) or MySQL |
| Deploy | Vercel (frontend), Render / Railway via Docker (backend) |

## Architecture

```
Browser (React + three.js)
   │  GET /api/content/{collection}        public
   │  POST /api/contact                    public
   │  PUT|DELETE /api/content/...          owner (X-Admin-Key)
   ▼
Spring Boot  ──  AdminKeyInterceptor ──▶ Controller ─▶ Service ─▶ Repository ─▶ H2 / MySQL
```

Skills, experience, projects and achievements are stored as validated JSON documents in one table, so adding a field to a card needs no database migration.

## Project structure

```
portfolio/
├── frontend/                     # Vite + React
│   ├── index.html
│   ├── public/                   # favicon
│   └── src/
│       ├── main.jsx · App.jsx
│       ├── pages/                # Home.jsx
│       ├── components/
│       │   ├── layout/           # Navbar, Footer, ThreeBackground
│       │   ├── sections/         # Hero, Skills, Experience, ProjectsSection, Contact
│       │   ├── cards/            # ProjectCard, AchievementCard
│       │   ├── forms/            # Skill / Experience / Project / Achievement forms
│       │   ├── modals/           # ResumeModal, OwnerLoginModal
│       │   └── ui/               # Modal, Acts, AddButton, Counter, ImagePicker, ...
│       ├── context/              # OwnerContext, DataContext
│       ├── hooks/                # useCollection, useForm, useReveal, useTypewriter
│       ├── services/             # api.js (HTTP client)
│       ├── config/ · data/ · utils/ · styles/ · assets/
└── backend/                      # Spring Boot (layered)
    ├── Dockerfile · pom.xml
    └── src/main/java/com/jmr/portfolio/
        ├── controller/           # ContentController, ContactController, AuthController
        ├── service/              # ContentService, ContactService
        ├── repository/           # Spring Data JPA repositories
        ├── model/                # JPA entities
        ├── dto/                  # ContactRequest (validated record)
        ├── security/             # AdminKeyInterceptor
        ├── config/               # WebConfig (CORS + interceptor)
        └── exception/            # GlobalExceptionHandler
```

## Getting started

**Prerequisites:** Node 18+, JDK 17+, Maven 3.9+, Git.

### 1. Backend
```bash
cd backend
ADMIN_KEY=choose-a-strong-key mvn spring-boot:run     # Windows CMD: set ADMIN_KEY=... then mvn spring-boot:run
```
API runs on `http://localhost:8080`. Run the tests with `mvn test`.

### 2. Frontend
```bash
cd frontend
cp .env.example .env.local        # set VITE_API_URL and your Drive file id
npm install
npm run dev
```
Open the printed URL, scroll to the footer, click **Owner login** and enter your `ADMIN_KEY`.

## Configuration

| Variable | Where | Purpose |
|---|---|---|
| `ADMIN_KEY` | backend | Owner key for write endpoints and the inbox. **Required in production.** |
| `CORS_ORIGINS` | backend | Allowed frontend origin(s), e.g. `https://your-site.vercel.app` |
| `DB_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` | backend | Use MySQL instead of the default H2 file |
| `VITE_API_URL` | frontend | Base URL of the API |
| `VITE_RESUME_FILE_ID` | frontend | Google Drive file id of the resume (share as *Anyone with the link*) |

## API

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/content/{skills\|experience\|projects\|ach}` | public | List items |
| PUT | `/api/content/{collection}/{id}` | owner | Create or update an item (JSON object) |
| DELETE | `/api/content/{collection}/{id}` | owner | Delete an item |
| POST | `/api/contact` | public | Submit a contact message (validated) |
| GET | `/api/messages` | owner | Read messages, newest first |
| GET | `/api/auth` | owner | `204` if the key is valid |

Owner endpoints require the `X-Admin-Key` header.

## Deployment

1. **Backend (Render / Railway):** new web service from this repo, root directory `backend`, Docker runtime. Set `ADMIN_KEY` and `CORS_ORIGINS`. Use a managed MySQL database (or a persistent disk) so data survives redeploys.
2. **Frontend (Vercel):** import the repo, root directory `frontend`, framework *Vite*. Set `VITE_API_URL` to the backend URL and `VITE_RESUME_FILE_ID`.

## Security notes

- Writes and the inbox are protected by a secret key checked in the backend (constant-time comparison); the UI buttons are only a convenience.
- Use HTTPS, a long random `ADMIN_KEY`, and set `CORS_ORIGINS` to your site only.
- Free-tier servers may sleep when idle; the site falls back to local content after 3 seconds.

## Roadmap

- Rate limiting and spam protection on the contact endpoint
- Email notification for new messages
- Replace the shared key with Spring Security (JWT) and image storage (S3/Cloudinary)

## Author

**Ragipalyam Jaganmohan Reddy** · Java Full-Stack Developer · [LinkedIn](https://www.linkedin.com/in/jaganmohanreddy33/) · [GitHub](https://github.com/JaganReddy-33)
