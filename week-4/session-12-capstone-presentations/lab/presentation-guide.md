# Capstone Presentation Guide

## Overview

Your capstone presentation is your chance to showcase everything you have built and learned over the past four weeks. This is not just about showing a working app -- it is about demonstrating your understanding of fullstack development concepts.

**Time:** 8-10 minutes per student (5-7 min demo + 2-3 min Q&A)

---

## What to Demo

### 1. Live Application Walkthrough (3-4 minutes)

Walk through your app as a user would experience it:

1. **Registration** - Create a new account
   - Show the form validation (try submitting empty fields)
   - Show a successful registration

2. **Login** - Log in with the account you just created
   - Show that the JWT token is stored (briefly show DevTools > Application > Local Storage)
   - Show that the navigation changes after login (e.g., Login button becomes Logout)

3. **Create a Task** - Add a new task
   - Fill in all fields (title, description, status, priority)
   - Show the task appearing in the list

4. **Read Tasks** - Show the task list
   - If you have filtering, demonstrate it
   - Show what an empty state looks like vs. populated state

5. **Update a Task** - Edit an existing task
   - Change the status (e.g., pending to in-progress)
   - Show the update reflected in the UI

6. **Delete a Task** - Remove a task
   - Show a confirmation dialog if you have one
   - Show the task disappearing from the list

7. **Logout** - Log out of the application
   - Show that protected routes redirect to login

### 2. Code Walkthrough (2-3 minutes)

Pick 2-3 interesting code snippets to highlight. Choose things that were challenging or that you are proud of:

**Backend suggestions:**
- Authentication middleware (how JWT verification works)
- A Prisma query with relations or filtering
- Error handling pattern (try/catch + appropriate status codes)
- Input validation logic

**Frontend suggestions:**
- React Context for auth state management
- A custom hook (e.g., useAuth, useTasks)
- Protected Route component
- Form handling with state management
- API service with Axios/fetch interceptors

**Testing suggestions:**
- Show your test file structure
- Highlight an interesting test case
- Show test coverage results (if you ran coverage)

### 3. Architecture Overview (optional, 1 minute)

If time permits, briefly explain your project architecture:
- How the frontend communicates with the backend (API calls)
- How authentication flows from login to protected routes
- Your database schema and relationships

---

## Code Walkthrough Suggestions

### Things That Impress

- **Error handling:** Show how your app handles errors gracefully (network failures, invalid input, unauthorized access)
- **Security:** Explain how you protect against common vulnerabilities (password hashing, JWT expiration, input sanitization, CORS)
- **Code organization:** Show clean file structure, separation of concerns, reusable components
- **Testing:** Demonstrate that you wrote tests and they pass

### Things to Avoid

- Reading code line by line (focus on the "why," not the "what")
- Spending too much time on boilerplate (package.json, imports)
- Showing code you do not understand (be honest if something was a stretch)
- Apologizing for bugs (everyone has them; talk about what you learned)

---

## Common Questions to Prepare For

### Technical Questions

1. **"How does authentication work in your app?"**
   - Explain the JWT flow: login -> receive token -> store in localStorage -> send in Authorization header -> server verifies token

2. **"Why did you choose Prisma over raw SQL?"**
   - Type safety, auto-generated client, easy migrations, readable schema definition

3. **"How do you handle errors?"**
   - Try/catch blocks, appropriate HTTP status codes, user-friendly error messages on the frontend

4. **"What happens if the database is down?"**
   - Server returns 500, frontend shows error message to user (or a loading/error state)

5. **"How do you prevent one user from accessing another user's tasks?"**
   - Every task query includes `userId` from the JWT token, so queries only return the authenticated user's data

6. **"What would you add with more time?"**
   - Be honest: real-time updates (WebSockets), email verification, password reset, drag-and-drop task ordering, team collaboration, etc.

### Process Questions

7. **"What was the hardest part?"**
   - Be specific: a particular bug, understanding async/await, getting CORS to work, debugging JWT issues

8. **"What did you learn that surprised you?"**
   - Think about something that clicked during the course

9. **"How did you debug an issue?"**
   - Walk through your debugging process: console.log, Postman/Thunder Client, browser DevTools, reading error messages

---

## Rubric Reminder

Your project will be evaluated on these criteria:

| Category | Points | What Graders Look For |
|----------|--------|----------------------|
| **Functionality** | 30 | All CRUD operations work; auth flow is complete |
| **Code Quality** | 25 | Clean code, good naming, separation of concerns, comments |
| **UI/UX** | 15 | Responsive design, loading states, error messages, intuitive navigation |
| **Testing** | 15 | Unit tests for validators, integration tests for API endpoints |
| **Documentation** | 10 | README with setup instructions, API docs, clear git history |
| **Presentation** | 5 | Clear demo, confident code walkthrough, good answers to questions |

### Quick Self-Check

- [ ] Can I register, login, create/read/update/delete tasks, and logout?
- [ ] Do I handle error states (not just the happy path)?
- [ ] Is my code organized and readable?
- [ ] Do my tests pass?
- [ ] Can someone else set up my project using just my README?

---

## Tips for a Great Presentation

1. **Practice your demo** at least twice before presenting
2. **Have a backup plan** if the live demo fails (screenshots, pre-recorded video)
3. **Start strong** with the most impressive feature
4. **Keep it focused** - do not try to show everything
5. **Be enthusiastic** - you built a fullstack app! That is a real accomplishment
6. **Know your code** - be ready to explain any part of it
7. **Pre-seed your database** with some data so the demo looks realistic
8. **Close unnecessary tabs** and notifications before presenting
