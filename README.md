# _AMPFER Finance_ :tada: (Mobile App for iOS and Android)
#### Video Demo: https://youtu.be/S4Dbx1y-LkQ
#### Description: Virtual Stock Trading on iOS and Android

-------------------------

For this project, I wanted to delve into mobile applications, and a finance app sounded like the perfect start. I had recently learned that my friend had never invested in the stock market. She complained that it was too complicated and was afraid of losing money. That is when I got inspiration to make this app, so she can practice on her phone with virtual money! I was able to utilize a familiar concept of a stock trading app, while also challenging myself with a new environment. _AMPFER Finance_ was built with React Native, Expo, and Flask.

With my app _AMPFER Finance_ the user can simulate stock trading experiences. With an initial virtual balance, users can engage in buying and selling stocks based on real-world quotes, testing strategies before venturing into actual markets. The user can monitor their portfolio and view their complete transaction history in easy-to-read tables. This app serves as an excellent tool for both educational purposes and personal financial strategy development.

Key Features
- __Virtual Trading Account__: Start with $10,000 in virtual currency to trade stocks.
- __Real-Time Stock Quotes__: Access live quotes on the Quote page.
- __Buy and Sell Stocks__: Execute trades on intuitive Buy and Sell pages.
- __Portfolio Tracking__: Monitor your holdings and account value in real-time on the Home page.
- __Transaction History__: View detailed logs of your trading activity.
- __Account Management__: Deposit, withdraw, and manage account settings.

-----

## Why React Native, Expo, and Flask? 

I started the project with zero knowledge of mobile app development. I started by researching languages and frameworks that are used and had a hard time choosing. I wanted to share my project with friends, so I decided I wanted cross-platform compatibility since I used Android, and my friends use iOS. After I pinned that down, React Native stood out to me because of its JavaScript utilization. I had very limited knowledge of JavaScript from the one class lecture, but I figured this could be leveraged to expedite my learning. I started by reading all of React Native's documentation to familiarize myself with the concepts. React Native's documentation uses Expo, and that is why I used Expo to set up and test my app on mobile devices. I had to read Expo documentation as well to set up my environment and testing.

I chose to implement a Flask-based back-end because of my familiarity with Flask from a previous problem in CS50. It was implemented for handling data persistence and logic, which React Native interfaces with via API calls.

## My journey building _AMPFER Finance_

My overall strategy was to break down the project into smaller pieces and make sure it was functional before I moved on to the next step. My game plan was to get a dummy React Native Expo project running on my device, use that to add all my screens, and then build the back-end API. I was not even sure I could use a Flask back-end, but I got the answer through a quick search. Development of this project did not go as smoothly, as I was trying to think too much like a web app instead of a mobile app.

I knew I had to get flask app running on my device, so I started with downloading VS Code and trying to start my first Expo app by following their documentation. I encountered many problems along the way of doing something as simple as this. For some reason, things I was downloading were not adding to the PATH on my laptop and therefore gave errors when I tried to use it. No answers were in the documentation, so I scoured the web and found Stack Overflow answers that helped. I learned a lot about my computer just troubleshooting the basic set up of my project.

Once I got the Expo app up and able to run on my mobile device, I ran into another problem. I did not know how to add multiple screens and navigate between them. With my web app, I had the Flask back-end redirect to whatever page, but I had the feeling that would not work for mobile. I was right. I read documentation on React Native Navigation and implemented it, making skeleton pages for each page I knew I wanted in the app.

React Native was a very steep learning curve. It was nothing like C, Python, or SQL. My initial prediction that my small amount of JavaScript would help turned out to be wrong. Through immersion and context clues, it slowly became more manageable. 

I knew from documentation that React Native had default components, but also community-built components. That is where I found React Native Paper and decided that I would use its components to make my app prettier. 

I started with building out a navigation bar and a reusable layout for consistency throughout the app. In my mind, the Title of the navigation bar was multicolored, but there was no functionality in the React Native Paper Appbar for that. I figured out I could make a separate component and use it in place of the Appbar’s title.

After the layout was complete, I built out the Registration page. The problem I encountered here is that I did not have a functional back-end, and even if I did, I did not know how to communicate with it. So, I started on the Flask API.

I used the web application Flask back-end that I had from a previous problem as a starting point. Flask documentation helped to configure it for mobile, like using JWT instead of Cookies, and storing tokens on the client side instead of the server side. I was also used to Jinja2 for rendering new content and data on the web side and had to shake that habit and replace it with JSON and JavaScript conditional rendering.

I then designed my database two have two relational tables to avoid redundancy. One for the users and one for transactions. The Flask API would create new entries for new users, be used to authenticate users, and keep track of every financial aspect of their account. They are used to update the tables that are seen in _AMPFER Finance_.

Once I had my first route looking functional, I learned how to make a fetch request to my API and handle errors. I decided to use React Native Paper's Snackbar to display custom error messages.

I began building out subsequent pages and their corresponding routes. I had trouble with the table in the history section because it was too large horizontally but solved it by adding horizonal scroll.

## Takeaways

This project represents not just a culmination of the technical skills acquired during the CS50 course but also an exploration into the realms of mobile app development and financial technology. It was a challenging and rewarding experience, pushing the boundaries of my understanding of software development, and providing a solid foundation for my future as a software engineer.

----

## Front-end Project Files Description (finance-app):

- `BuyScreen.js`: Facilitates the stock purchasing process. It includes input validation to ensure correct data entry and communicates with the back-end to execute trades.

- `SellScreen.js`: Allows users to sell stocks they own. It features a dropdown list for selecting stocks and communicates with the back-end for transaction processing.

- `IndexScreen.js`: The main dashboard of the app, displaying the user's current portfolio, including cash balance and stock holdings.

- `HistoryScreen.js`: Shows a complete history of the user's transactions, helping users track their trading activity over time.

- `LoginScreen.js` & `RegisterScreen.js`: Handles user authentication. The Login screen allows existing users to access their accounts, while the Register screen enables new users to create an account.

- `ChangePasswordScreen.js`: Provides functionality for users to securely change their password.

- `QuoteScreen.js`: Offers real-time stock prices, enabling users to research before trading.

- `DepositScreen.js` & `WithdrawlScreen.js`: These screens manage the virtual fund transactions – depositing and withdrawing virtual money from the user's account.

- `getToken.js` (tokenGetter Directory): A crucial utility for handling JSON Web Tokens (JWTs), ensuring secure communication with the back-end.

- `layout.js` and `layoutLogin.js`: Reusable layouts for consistent UI across the app.

- `NavigationBar.js`: Custom navigation bar with responsive menu for seamless app navigation.

-  `title.js`: A multi-colored title component enhancing the app's visual appeal.

- `.prettierrc.js` includes the settings that were used to format the JavaScript files

- `App.js` is the main entry point for _AMPFER Finance_. It is responsible for setting up the application's navigation structure, integrating various screens, and providing a consistent layout for the user interface. 

- The rest of the files are unchanged from the default files included in opening a new Expo app.

---
## Back-end Project Files Description (flask-finance):

- `app.py` is the core of the Flask-based back-end for _AMPFER Finance_. It handles user interactions including account management, stock transactions, and data retrieval, interfacing with the front-end React Native app for secure and efficient processing. 

- `finance.db` is the relational database I created for the app using sqlite. Contains two tables "users" and "transactions".
    - users 
        - id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        - username TEXT NOT NULL, 
        - hash TEXT NOT NULL, 
        - cash NUMERIC NOT NULL DEFAULT 10000
        
    - transactions 
        - id INTEGER PRIMARY KEY AUTOINCREMENT, 
        - user_id INTEGER NOT NULL, 
        - symbol TEXT NOT NULL, 
        - shares INTEGER NOT NULL, 
        - price REAL NOT NULL, 
        - time NUMERIC NOT NULL, 
        - FOREIGN KEY(user_id) REFERENCES users(id)

- `helpers.py` is the helper function borrowed from the finance problem set in Harvard`s CS50 course, includes a lookup function for stocks. Lookup is a function used by app.y to communicate with Yahoo finance.

---

## Interaction Between Front-end and Back-end:

_AMPFER Finance_'s front-end and back-end interact to provide a stock trading simulation. The front end sends requests to the Flask back-end for operations like user authentication, stock buying/selling, and retrieving financial data. The back-end processes these requests, interfacing with the database and external APIs as needed, and returns the necessary data to the front-end for display. This interaction is crucial for real-time updates and maintaining the app's overall functionality and security.
