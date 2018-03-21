# Overview
Kira-node is the backend AI API that powers CASBA. It is built with node.js to handle logic for real-time processing and communication on application.

# Getting Started
Install node and start the API by running:
```
npm install

npm start
```
# Libraries
- socket.io
This framework is used for long-polling communication over an internet protocol. It is used to handle communication between Kira-the AI and CASBA-the front-end platform. Long polling communication method is used to maintain an open connection between the user and the AI.

[web link](https://www.google.com)
[github link](https://www.google.com)

- ibm_db
This service is provided by IBM. It is used to store and manage user data in a transactional format. SQL queries are made from the application as part of processing a user request.

[web link](https://www.google.com)
[github link](https://www.google.com)

- requests
This open-source is used to access REST APIs such as Paystack BVN resolve and eTranzact BankIT.

[web link](https://www.google.com)
[github link](https://www.google.com)

- watson-developer-cloud
This framework provided by IBM connects the application to leverage on Watson (IBM's AI) extensive service especially with Conversations, a natural language processing engine.

[web link](https://www.google.com)
[github link](https://www.google.com)

- nodemailer
This framework is node-native module for sending emails. The application uses a gmail client to send notification to user emails for certain events.

[web link](https://www.google.com)
[github link](https://www.google.com)

- crypto
This module provides cryptographic functionality for security within the applications.

[web link](https://www.google.com)
[github link](https://www.google.com)

- xml-js
This module makes it easy to convert SOAP request result to JSON object for easy processing within the application.

[web link](https://www.google.com)
[github link](https://www.google.com)

- bankingServices
This proprietary API provides bank specific services to improve data structure and processing.

[web link](https://www.google.com)
[github link](https://www.google.com)

# Push to Cloud
Create an account on IBM Cloud and push by running:
```
cf push
```
