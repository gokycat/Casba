---
output:
  pdf_document: default
  html_document: default
---
# Overview
Cloud Automated Spend Bank Analytics (CASBA) is a FinTech application driven by AI. It is an alternate platform for Nigerians to carry-out 24hrs financial transactions, over the web and mobile phones. The USP of casba are that users do basic transactions such as transfer funds, top-up airtime and pay for bills using conversations (Natural Language). Also, the application provides power analytics to process and easily visualise spend.

This README is a continuous work in progress. All of the wording will need to be revised several times before it is finalised. The graphics and layout of the screens is shown here merely to illustrate the underlying functionality. The actual look and feel will be developed over time with the input of various stakeholders and iterative user feedback.

This spec does not discuss the algorithms used by Kira, the AI that powers the underlying chatbot. It simply discusses components user sees when they interact with Kira through the CASBA platform.

# Scenario
In product development, it helps to imagine a few real life stories of how actual (stereotypical) people would use them. We’ll look at two scenarios.

- Scenario 1: Tunde.
Tunde is a recent university graduate (may have just returned from studies outside the country). He has always relied on his friends and family to take-care of his financial obligations. Now he wants to take on some responsibilities by using a convenient way to transfer money to his younger siblings. Moreso, to ensure that he does not run out of airtime while on job hunt call-backs by having easy access to top-up his phone whenever it is low. Finally, he hopes to land a new job soon and move into his own apartment which will require for him to regularly attend to such bills as Electric, Internet & TV.

CASBA offers Tunde a one-stop platform for his financial transactions. More so, it is made available through his PC, mobile and other instant message platforms such as facebook and Whatsapp.

Scenario 2: Tolu.
Tolu is a young professional with just about 3 years working experience. Her first few years went by really fast because she moved a lot around the country on projects with clients. Her job provides are with access to a steady income. However, Tolu's busy schedule does not allow her the time to really analyse her monthly spend as she usually ends up with very low balance with the hope for the next month salary. Also, Kelechi just proposed to Tolu and after meeting the parents an agreed days for next year has been scheduled for the wedding.

CASBA offers Tolu a real-time analytics platform to easily manage and monitor spend. It provides both classification and time-series visualisation of spend while Tolu can also set up a budget to effectively meet her wedding day goals.

# Features
1. Certificate (Personal, Account & Card)
2. Payment (Fund Transfer, Bill Payment, Airtime Top-up)
3. Analytics (Expense series, Spend class, Budget)

# System Architecture
CASBA was built with NERDSPeW framework. This framework encompasses both open-source and proprietary toolset to build both front-end, middle-ware and back-end components. Front-end components such as chat app interface, dynamic buttons and overlays amongst others. Middle-ware components such as connection to third-party APIs (proprietary, REST & SOAP). Back-end components such as database, payment gateway and AI services. This architecture below gives an high-level story of the application inner working:

![alt text](./system-architecture.png "NERDSPeW")

# Screen by Screen Specifications
## BVN Validation
Being a financial application, there is great care to ensure that it is inline with the regulatory framework of the industry. CASBA's BVN (Bank Verification Number) validation system is built to ensure that the system can uniquely identify each customer.

![alt text](./bvn-validation.png "KYC")

## Email Authentication and Notification
To add another level of security, the system completes the registration process using email verification. This also complements the notification received from banks and vendors when transactions take place on user accounts.

![alt text](./email-verification.png "Verify")

## Conversation interface
CASBA was built on the intuition of a single interface bank on steroid. This is to deliver the most optimum experience for the user by just using textual (and auditory) input to interact with the system. Kira, the underlying AI that powers the system takes the form of a chatbot that intuitively understands the user intent and processes their request based on data available.

![alt text](./chat-app.png "ChatApp")

## Dynamic Buttons
While the aim to maintain a single-interface experience underpinned every platform interaction, we have employed the use rich UI component such as static and dynamic buttons to effectively drive conversations.

![alt text](./dynamic-button.png "Buttons")

## General Info Overlay
Another rich UI component within the application is overlays. Overlays are used to present summarised information about customer, accounts and transactions. It only presents itself at the end of a transaction, so as not to interface with the clean interface of the ChatApp.

![alt text](./general-verlay.png "Overlay1")

### Carousel
Understanding that a particular user can have more than one account, the system uses a carousel framework to present such array of dynamic innformation to the user in a very convenient and automated way.

![alt text](./account-carousel.png "Carousel")

### Transaction Stream
## Receipt Overlay
### Total Spend
### Payment Receipt
## Analytics Overlay
### Time-series
### Classification
### Budget Monitor
## Admin Dashboard
