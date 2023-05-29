# PromptifAI

![faviconLogo](https://github.com/FL0REN1/PromptifAI/assets/118763451/b859477a-0aaf-4f30-9a7c-01363d2b1c69)

Introduction
PromptifAI is a full-stack project aimed at facilitating the purchase of prompts and related products through an online platform. The project provides a user-friendly interface and a range of features to enhance the user experience and streamline the buying process. This README file serves as a guide to understand the project structure, features, and technologies used.

Features
• Authentication/Registration and User Persistence: The project provides a secure authentication and registration system, allowing users to create accounts and login. User data and preferences are stored for future sessions.

• Password Recovery and Verification: In case a user forgets their password, they can initiate a recovery process through email or phone verification. Verification codes are sent to the registered email or phone number.

• Main Window with Interactive Elements: The main window of the application offers various sections for user interaction. One of the sections allows users to purchase prompts from three different packages: Standard, Enormous, and Exclusive. Each package has a different price. Payments are processed through the PayPal API, supporting both PayPal and credit card payments. Before making a payment, users need to top up their account balance in the personal account section. The main window is divided into multiple sections, including the header, About us, Products, Reviews, and Contacts (footer).

• Personal Account Management: The personal account section provides six navigation buttons: Personal Information, My Orders, Write Review, Delete Account, Go Back, and Log Out. In the Personal Information section, users can modify their profile information, change their avatar, update their name and description, and verify new email addresses or phone numbers. The My Orders section displays the user's purchase history and allows them to top up their account balance. The Write Review section enables users to write reviews, which are displayed in real-time in the main window's Reviews section. The Delete Account, Go Back, and Log Out buttons handle account deletion, navigation, and logging out functionalities, respectively.

• Support Chat Bot and User Chat Window: The support chat bot is located in the main window's bottom right corner. It offers scripted questions and answers to guide users. For example:

Bot: Hello! Choose the option below that suits you best ⬇
Problems with replenishment/purchase
Problems with the account
I found bugs on the site
User: Problems with replenishment/purchase
Bot: Write everything we need to know
User: I can't deposit money into my account
Bot: Do you want to contact customer service?
Yes
No
User: Yes
Bot: Redirecting to another page...
Users are then redirected to their personal chat room for support, where messages are delivered in real-time using the Firebase API.

• Chat Support Window: The chat support window first prompts users to log in. Once authenticated, they are redirected to their dedicated support window, where they can assist different types of users. The support window has two modes: one with room messages and one without. The former is for users who responded "Yes" to contacting customer service, while the latter is for users who responded "No." In the support window with room messages, support agents are greeted with five navigation buttons: Replenishment/Purchase, The Account, Bugs on the Site, Closed Appeals, and Go Back. Clicking on any of these buttons and then selecting a user from the list opens a chat window for communication. If the support agent successfully resolves the user's issue, they can close the appeal and move it to the Closed Appeals section. Closed appeals can be viewed and reopened if necessary. In the message without room mode, support agents only see the user's message, their name, surname, and a button to close the appeal. No appeal is sent in this case; it is simply deleted.

• Important Notes: The entire website is fully responsive, adapting to screens of all resolutions. It handles various user behaviors, such as displaying warnings when entering an existing email address or showing a modal window with options when attempting to change an already verified email address. The modal window asks, "You already have a verified email! Are you sure you want to confirm the new login?" with Yes/No buttons and a "Don't show this modal window again" option.

Technologies Used
Front-end:
• HTML
• CSS
• TypeScript
• React (JavaScript library for building user interfaces)
• Redux (State management)
• Axios (HTTP client for making API requests)
• Various other libraries

Back-end:
• C# (ASP.NET Core Web API)
• RabbitMQ (message broker)
• MSSQL (with user secrets)
