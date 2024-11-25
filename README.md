# Smoothie Recipes

**Live Demo:** https://seanim0920.github.io/Smoothies/

This repository contains a Smoothie Recipe application to enable users to create and manage smoothie recipes, built with React and TypeScript.

## Requirements covered:

-   User can create a new smoothie with:
    -   A unique name
    -   A set of ingredients w/ quantity information (e.g. 1 cup)
    -   Tags (optional)
-   User can delete a smoothie
-   User can edit an existing smoothie name and add new ingredients
-   Smoothies are persisted between browser sessions
-   User can search smoothies by name, ingredients or tags
-   Confetti

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
    - [Storage Management](#storage-management)
    - [User Experience](#user-experience)
    - [Testing](#testing)
- [Future Considerations](#future-considerations)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Conclusion](#conclusion)

## Getting Started

To run the application locally:

1. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the application:**

    ```bash
    npm start
    ```

4. **Export the site:**

    ```bash
    npm build
    ```

## Design Decisions

### Storage Management

**Decision:** Use local storage as the primary data storage mechanism, with a storage management layer to synchronize between private (local) and public storages.

**Rationale:** The requirements specified that the application needed to persist data between browser sessions, while also giving the user the option to share their data with others on demand. Local storage offers a straightforward way to persist data on the client side without additional infrastructure, and keeps the user's data private. By designing a storage management layer, we can easily integrate a public database or API in the future and allow users to publish their data to the cloud if they prefer. A user management and authentication system was not in the requirements, but would need to be implemented if we were to allow cloud storage to uphold data privacy and security, and give the user more ownership and control over their data. Extra care would also need to go towards data consistency and error handling if the user wants to manage their smoothies from multiple devices.

**Implementation Details:**
-   **Local Storage as Primary Storage:**
    -   All smoothie recipes are initially stored in the browser's local storage to ensure quick access and offline capability.
-   **Storage Management Layer:**
    -   A separate repository class synchronizes the primary local storage provider with a secondary cloud storage provider. That functionality is stubbed out for the scope of this project.
    -   The repository determines whether to interact with local or public storage based on the `isPublished` status of the data.
-   **React Hook:**
    -   A react hook is used to interface between the repository and end-user UI, and sync the repository with in-memory state.

Thorough testing was performed on this logic to ensure data integrity between the different layers.

### User Experience

Care was taken to reduce confusion and ambiguity in the UX, including different colors of buttons to represent different levels of actions, displaying confirmation dialogue if a user is about to leave a form that they left in-progress, and showing different header text if there are no smoothies visible.

### Testing

Tests cover a wide range of functionality, including storage management, state management and form management, while ensuring the features remain focused and valuable to the end-user.

## Scripts

-   `npm start`: Starts the development server.
-   `npm test`: Runs the test suite.
-   `npm run build`: Builds the application for production.

## Dependencies

-   **React:** Front-end library for building user interfaces.
-   **TypeScript:** Provides static type checking.
-   **Jest:** Testing framework for unit tests.
-   **React Testing Library:** For testing React components and hooks.

## Conclusion

This application demonstrates a modular approach to building a React application with TypeScript, focusing on maintainability, testability, and user experience. The design decisions made throughout the development process aim to balance simplicity with functionality, ensuring that the application is both robust and easy to understand.

**Key Takeaways:**

-   **Storage Flexibility:** By using a storage management layer, the application can easily integrate with a public API or database in the future.
-   **Custom Hooks:** Utilizing custom hooks for state and form management leads to cleaner, more maintainable code.
-   **Testing:** Comprehensive testing is crucial for ensuring application reliability and facilitating future enhancements.

**Note to Interviewer:**

Throughout the development process, careful consideration was given to best practices in React and TypeScript development. The choices made aim to address the project requirements effectively while laying a foundation for future scalability and feature additions. I'm open to feedback and discussions on any of the design decisions outlined above.