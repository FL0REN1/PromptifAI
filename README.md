![faviconLogo](https://github.com/FL0REN1/PromptifAI/assets/118763451/b859477a-0aaf-4f30-9a7c-01363d2b1c69)

# Introduction
PromptifAI is a full-stack project aimed at facilitating the purchase of prompts and related products through an online platform. The project provides a user-friendly interface and a range of features to enhance the user experience and streamline the buying process. This README file serves as a guide to understand the project structure, features, and technologies used.

## Features
- **Authentication/Registration and User Persistence:** The project provides a secure authentication and registration system, allowing users to create accounts and login. User data and preferences are stored for future sessions.
- **Password Recovery and Verification:** In case a user forgets their password, they can initiate a recovery process through email or phone verification. Verification codes are sent to the registered email or phone number.
- **Main Window with Interactive Elements:** The main window of the application offers various sections for user interaction. One of the sections allows users to purchase prompts from three different packages: Standard, Enormous, and Exclusive. Each package has a different price. Payments are processed through the PayPal API, supporting both PayPal and credit card payments. Before making a payment, users need to top up their account balance in the personal account section. The main window is divided into multiple sections, including the header, About us, Products, Reviews, and Contacts (footer).
- **Personal Account Management:** The personal account section provides six navigation buttons: Personal Information, My Orders, Write Review, Delete Account, Go Back, and Log Out. In the Personal Information section, users can modify their profile information, change their avatar, update their name and description, and verify new email addresses or phone numbers. The My Orders section displays the user's purchase history and allows them to top up their account balance. The Write Review section enables users to write reviews, which are displayed in real-time in the main window's Reviews section. The Delete Account, Go Back, and Log Out buttons handle account deletion, navigation, and logging out functionalities, respectively.
- **Support Chat Bot and User Chat Window:** The support chat bot is located in the main window's bottom right corner. It offers scripted questions and answers to guide users. Users can interact with the bot and get redirected to a dedicated support chat room for further assistance. Messages are delivered in real-time using the Firebase API.
- **Chat Support Window:** The chat support window allows support agents to assist users in different areas. Support agents can select a user from the list and open a chat window for communication. If the support agent successfully resolves the user's issue, they can close the appeal and move it to the Closed Appeals section. Closed appeals can be viewed and reopened if necessary.
- **Important Notes:** The entire website is fully responsive, adapting to screens of all resolutions. It handles various user behaviors, such as displaying warnings when entering an existing email address or showing a modal window with options when attempting to change an already verified email address.

## Technologies Used
**Front-end:**
- HTML
- CSS
- TypeScript
- React (JavaScript library for building user interfaces)
- Redux (State management)
- Axios (HTTP client for making API requests)
- Various other libraries

**Back-end:**
- C# (ASP.NET Core Web API)
- RabbitMQ (message broker)
- MSSQL (with user secrets)
