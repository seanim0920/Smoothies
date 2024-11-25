Smoothie Recipes
This repository contains a Smoothie Recipe application built with React and TypeScript. 

Public mirror: 

Requirements covered:

#### Basic requirements

-   User can create a new smoothie with:

    -   A unique name

    -   A set of ingredients w/ quantity information (e.g. 1 cup)

-   User can delete a smoothie

-   User can edit an existing smoothie name, ingredients

-   User can return to their smoothies in a new browser session using,
    > for example, Window.localStorage

-   **Deliverable**: A website and a corresponding Github repo are
    > available at a public URL

#### Advanced requirements (optional)

-   User can search smoothies by name

-   User can tag their smoothies

-   User can save their smoothies to a database

-   User can share smoothies with others at public URL

-   User can to add new ingredients

-   Integrate a continuous integration/deployment system

Bonus (optional)

-   What other feature would you like to add to your smoothie
    > application? Feel free to be creative.

The application allows users to create, update, delete, publish, and unpublish smoothie recipes. It includes features like form validation, state management using custom hooks, and unit tests to ensure code reliability.

Table of Contents
Getting Started
Project Structure
Design Decisions
Storage Management
State Management with Custom Hooks
Handling Asynchronous Requests
Form Handling and Validation
Testing Strategy
Mocking and UUID Generation
Styling and Theming
Future Considerations
Scripts
Dependencies
Conclusion
Getting Started
To run the application locally:

Clone the repository:

bash
Copy code
git clone https://github.com/your-username/smoothie-recipes.git
cd smoothie-recipes
Install dependencies:

bash
Copy code
npm install
Run the application:

bash
Copy code
npm start
Run tests:

bash
Copy code
npm test
Project Structure
src/components: Contains React components like SmoothieForm.
src/hooks: Custom hooks for state management and form handling (useSmoothieState, useForm).
src/storage: Repository pattern implementation for local and public storage synchronization.
src/types: TypeScript type definitions for entities like Smoothie.
src/utils: Utility functions for filtering and validation.
src/tests: Unit tests for components, hooks, and utilities.
Design Decisions
Storage Management
Decision: Use local storage as the primary data storage mechanism, with a storage management layer to synchronize between private (local) and public storages.

Rationale:

Requirements Alignment: The application needed a storage solution that works offline and doesn't require server-side setup.
Simplicity: Local storage offers a straightforward way to persist data on the client side without additional infrastructure.
Extensibility: By designing a storage management layer, we can easily integrate a public database or API in the future.
Implementation Details:

Local Storage as Primary Storage:
All smoothie recipes are initially stored in the browser's local storage.
This ensures quick access and offline capability.
Storage Management Layer:
Implemented a SmoothieRepository that abstracts the storage details.
It synchronizes data between local storage and a placeholder for public storage.
The repository handles CRUD operations and determines whether to interact with local or public storage based on the smoothie’s isPublished status.
Public Storage Placeholder:
While no public database is currently set up, the storage management layer is designed to accommodate it.
This allows for easy integration with a backend API that supports standard CRUD operations when needed.
State Management with Custom Hooks
Decision: Utilize custom hooks (useSmoothieState) to manage application state instead of relying on a global state management library.

Rationale:

Encapsulation: Encapsulates the state logic within a hook, making it reusable and easier to maintain.
Isolation: Keeps the component code clean and focused on rendering.
Flexibility: Allows for independent testing and scaling of the state management logic.
Implementation Details:

The useSmoothieState hook manages an array of smoothies and provides methods to create, update, delete, publish, and unpublish smoothies.
It uses useRequest to handle the initial loading of smoothies from the repository.
State synchronization is carefully managed to avoid infinite loops, especially when dealing with asynchronous data fetching.
Handling Asynchronous Requests
Decision: Implement a useRequest hook to manage the state of asynchronous operations.

Rationale:

State Management: Simplifies handling loading, success, and error states of async requests.
Reusability: Can be reused for different asynchronous operations within the application.
Clarity: Improves code readability by abstracting the request logic.
Implementation Details:

useRequest accepts an asynchronous function and returns an object containing status, data, and error.
The hook updates its state based on the promise's lifecycle (loading, success, error).
Form Handling and Validation
Decision: Use a custom useForm hook for form state management and validation, including an isDirty flag to track unsaved changes.

Rationale:

Customization: Allows for tailored validation logic specific to the application's needs.
Efficiency: Avoids adding external dependencies for simple form management.
User Experience: The isDirty flag enhances UX by warning users about unsaved changes.
Implementation Details:

The useForm hook manages form values, errors, and validation logic.
Validation functions (validateName, validateIngredients) are provided for specific fields.
An isDirty flag is computed using useMemo by comparing current values with initial values.
The form component uses the isDirty flag to alert users about unsaved changes when navigating away.
Testing Strategy
Decision: Write comprehensive unit tests for custom hooks, validation functions, and components using Jest and React Testing Library.

Rationale:

Reliability: Ensures that individual units of code function as expected.
Maintainability: Facilitates easier refactoring and code updates.
Confidence: Provides assurance that the application logic is sound before deployment.
Implementation Details:

Tests for useSmoothieState cover all CRUD operations and state changes.
Validation functions are tested against various input scenarios to ensure robustness.
Mocks are used to simulate repository behavior and asynchronous functions.
Addressed challenges with mocking crypto.randomUUID by implementing a simple random string generator for testing purposes.
Mocking and UUID Generation
Decision: Implement a simple UUID generation function for testing purposes due to limitations with crypto.randomUUID in the testing environment.

Rationale:

Compatibility: crypto.randomUUID is not supported in Jest's JSDOM environment by default.
Simplicity: A simple function suffices for generating unique IDs in tests.
Isolation: Keeps tests independent of environment-specific APIs.
Implementation Details:

Created a generateRandomString function to replace crypto.randomUUID in tests.
Ensured consistency in tests by generating predictable IDs.
Avoided the complexity of mocking Node.js crypto module in the testing environment.
Styling and Theming
Decision: Extend existing CSS to include classes for secondary and destructive buttons.

Rationale:

Consistency: Maintains a consistent look and feel across different button types.
Accessibility: Uses color schemes that are distinguishable and accessible.
User Feedback: Provides visual cues for different actions (e.g., destructive actions are styled in red).
Implementation Details:

Defined new CSS classes .secondary and .destructive for buttons.
Adjusted hover states and focus outlines for better user experience.
Ensured styles adapt to light and dark themes via media queries.
Future Considerations
Authentication and Cloud Storage:

Potential Feature: Implement authentication to allow users to save their smoothies to the cloud and access them across devices.
Rationale: Enhances user experience by providing data persistence and accessibility from any device.
Considerations:
Data Consistency: Would need to ensure synchronization between client and server data.
Security: Implement secure authentication mechanisms.
Scalability: Design the system to handle multiple users and concurrent data access.
Out of Scope: This feature was considered but deemed out of scope for the current project.
Scripts
npm start: Starts the development server.
npm test: Runs the test suite.
npm run build: Builds the application for production.
Dependencies
React: Front-end library for building user interfaces.
TypeScript: Provides static type checking.
Jest: Testing framework for unit tests.
React Testing Library: For testing React components and hooks.
Conclusion
This application demonstrates a modular approach to building a React application with TypeScript, focusing on maintainability, testability, and user experience. The design decisions made throughout the development process aim to balance simplicity with functionality, ensuring that the application is both robust and easy to understand.

Key Takeaways:

Storage Flexibility: By using a storage management layer, the application can easily integrate with a public API or database in the future.
Custom Hooks: Utilizing custom hooks for state and form management leads to cleaner, more maintainable code.
Testing: Comprehensive testing is crucial for ensuring application reliability and facilitating future enhancements.
Note to Interviewer:

Throughout the development process, careful consideration was given to best practices in React and TypeScript development. The choices made aim to address the project requirements effectively while laying a foundation for future scalability and feature additions. I'm open to feedback and discussions on any of the design decisions outlined above.