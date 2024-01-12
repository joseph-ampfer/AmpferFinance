from datetime import datetime, timedelta
import os
from cs50 import SQL
from flask import Flask, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from helpers import lookup
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

# Configure application
app = Flask(__name__)


app.config['JWT_SECRET_KEY'] = 'ewroiufdsjadsfjklfds'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)
# NEW
CORS(app)


# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")

db.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, username TEXT NOT NULL, hash TEXT NOT NULL, cash NUMERIC NOT NULL DEFAULT 10000)" )
db.execute("CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, symbol TEXT NOT NULL, shares INTEGER NOT NULL, price REAL NOT NULL, time NUMERIC NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id) )" )


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/", methods=["GET"])
@jwt_required()
def index():
    """Show portfolio of stocks"""
    user_id = get_jwt_identity()

    # Get their portfolio, group by user and symbol to get all the different symbols from same user
    portfolio = db.execute("SELECT symbol, t_shares FROM (SELECT symbol, SUM(shares) AS t_shares FROM transactions WHERE user_id = ? GROUP BY symbol) WHERE t_shares > 0", user_id)

    # Get the current price of each stock they own, and the value of their stock
    stock_prices = {}
    stock_values = {}
    for stock in portfolio:
        symbol = stock["symbol"]
        foo = lookup(symbol)
        price = foo["price"]
        stock_prices[symbol] = price
        stock_values[symbol] = price * stock["t_shares"]

    # Get the cash they have and calculate grand total value of account
    rows = db.execute("SELECT cash FROM users WHERE id = ?", user_id)
    cash = rows[0]["cash"]
    grand_total = cash
    for key in stock_values:
        grand_total += stock_values[key]

    return jsonify(portfolio=portfolio, cash=cash, grand_total=grand_total, stock_prices=stock_prices, stock_values=stock_values), 200


@app.route("/buy", methods=["POST"])
@jwt_required()
def buy():
    """Buy shares of stock"""
    if request.is_json:
        
        # Get the symbol and check for no input
        symbol = request.json.get('symbol')
        if not symbol:
            return jsonify({'msg': 'Must enter a symbol', 'error': 'no_symbol'}), 400
        
        # Check if symbol exists
        symbol = str(symbol)
        symbol = symbol.upper()
        symbol = symbol.strip()
        stock = lookup(symbol)
        if stock == None:
            return jsonify({'msg': 'Could not find stock', 'error': 'no_stock'}), 400
        
        # Check for positive number of shares
        shares = request.json.get('shares')

        # Make sure they gave an integer
        try:
            shares = int(shares)
        except ValueError:
            return jsonify({'msg': 'Must input whole number of shares', 'error': 'not_whole'}), 400
        
        # Positive check
        if shares <= 0:
            return jsonify({'msg': 'Must input positive number of shares', 'error': 'not_positive'}), 400
        
        # See how much their request costs
        price = stock['price']
        total_price = price * shares

        # See how much money they have
        user_id = get_jwt_identity()
        user = db.execute('SELECT * FROM users WHERE id = ?', user_id)

        # Compare request with how much money they have
        if total_price > user[0]['cash']:
            return jsonify({'msg': 'Insufficient funds', 'error': 'bad_funds'}), 400
        
        # Get time
        time = datetime.now()

        # Updating orders table for their purchase and update their cash
        db.execute("INSERT INTO transactions (user_id, symbol, shares, price, time) VALUES(?, ?, ?, ?, ?)", user_id, symbol, shares, price, time)
        db.execute("UPDATE users SET cash = cash - ? WHERE id = ?", total_price, user_id)

        return jsonify({'msg': 'Transaction complete'}), 200

    else:
        return jsonify({'msg': 'Did not recieve json', 'error': 'no_json'}), 400


@app.route("/history", methods=["GET"])
@jwt_required()
def history():
    """Show history of transactions"""
    user_id = get_jwt_identity()
    rows = db.execute("SELECT * FROM transactions WHERE user_id = ?", user_id)
    if not rows:
        return ({'msg': 'No data found'}), 400

    return jsonify(rows), 200


@app.route("/register", methods=["POST"])
def register():
    """Register user"""

    if request.is_json:
        
        username = request.json.get('username')
        password = request.json.get('password')

        # Check for blanks
        if not username or not password:
             return jsonify({'msg': 'Username and password are required', 'error': 'no_input'}), 400

        # Check if username is taken
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)
        if rows:
            return jsonify({'msg': 'Username taken', 'error': 'name_taken'}), 400
            
        # Enter new user into database (users)
        password_hash = generate_password_hash(password)
        db.execute("INSERT INTO users (username, hash) VALUES(?, ?)", username, password_hash)
        return jsonify({"msg": "Registered"}), 200

    else:
        return jsonify({'msg': 'Did not recieve json', 'error': 'no_json'}), 400


@app.route("/login", methods=["POST"])
def login():
    """Log user in"""

    if request.is_json:
        
        username = request.json.get('username')
        password = request.json.get('password')

        # Check for blanks
        if not username or not password:
            return jsonify({'msg': 'Username and password are required', 'error': 'no_input'}), 400
        
        # Check if username is registered
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)

        # Check for only one row and check password
        if len(rows) != 1 or not check_password_hash(rows[0]['hash'], password):
            return ({'msg': 'Invalid username or password', 'error': 'invalid'}), 400
        
        # Create and send JWT to remember user
        # Need to send rows[0]["id"] to save the id number for our database lookups
        access_token = create_access_token(identity=rows[0]["id"])
        return jsonify(access_token=access_token), 200

    else:
        return jsonify({'msg': 'Did not recieve json'}), 400
    

@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id

    # Redirect user to login form
    return


@app.route("/quote", methods=["POST"])
@jwt_required()
def quote():
    """Get stock quote."""
    if request.is_json:

        # Check for input
        symbol = request.json.get('symbol')
        if not symbol:
            return jsonify({'msg': 'Symbol required', 'error': 'no_input'}), 400
        
        # Strip spaces and make uppercase
        symbol = str(symbol)
        symbol = symbol.strip()
        symbol = symbol.upper() 

        # Lookup stock and return the quote data, or apologize for not finding it
        stock = lookup(symbol)
        if stock == None:
            return jsonify({'msg': 'Could not find stock', 'error': 'no_stock'}), 400
        else:
            return jsonify(stock), 200

    else:
        return jsonify({'msg': 'Did not recieve json', 'error': 'no_json'}), 400


@app.route("/sell", methods=["GET", "POST"])
@jwt_required()
def sell():
    """Sell shares of stock"""
    if request.is_json:
        user_id = get_jwt_identity()

        # Load list of stocks they own to choose from
        if request.method == "GET":
            symbols = db.execute("SELECT symbol FROM (SELECT symbol, SUM(shares) AS t_shares FROM transactions WHERE user_id = ? GROUP BY symbol) WHERE t_shares > 0", user_id)
            return jsonify(symbols=symbols)
        
        # Sell stock
        if request.method == "POST":
            # Check for stock symbol input
            symbol = request.json.get('selected')
            if not symbol:
                return jsonify({'msg': 'Must enter a symbol', 'error': 'no_input'}), 400
            
            # Check that they own that stock
            rows = db.execute("SELECT symbol, t_shares FROM (SELECT symbol, SUM(shares) AS t_shares FROM transactions WHERE user_id = ? GROUP BY symbol) WHERE t_shares > 0 AND symbol = ?", user_id, symbol)
            if not rows:
                return jsonify({'msg': 'Please select a stock you own', 'error': 'no_ownership'}), 400
            
            # Check for positive integer of shares
            shares = request.json.get('shares')
            try:
                shares = int(shares)
            except ValueError:
                return jsonify({'msg': 'Must input whole number of shares', 'error': 'not_whole'}), 400
            if shares <= 0:
                return jsonify({'msg': 'Must input positive number of shares', 'error': 'not_positive'}), 400
            
            # Check if they own that many shares
            if shares > rows[0]["t_shares"]:
                return jsonify({'msg': 'You do not own that many shares', 'error': 'no_ownership'}), 400
            
            # Update the transactions table of the transaction and the users table cash!
            # Need current value of the stock they are trying to sell
            
            # Check if symbol exists
            stock = lookup(symbol)
            if stock == None:
                return jsonify({'msg': 'Could not find stock', 'error': 'no_stock'}), 400
            price = stock["price"]
            total_money = shares * price
            time = datetime.now()

            # Update tables and return
            db.execute("INSERT INTO transactions (user_id, symbol, shares, price, time) VALUES(?, ?, ?, ?, ?)", user_id, symbol, -1 * shares, price, time,)
            db.execute("UPDATE users SET cash = cash + ? WHERE id = ?", total_money, user_id)
            return jsonify({'msg': 'Transaction complete'}), 200

    else:
        return jsonify({'msg': 'Did not recieve json', 'error': 'no_json'}), 400


@app.route("/change", methods=["POST"])
@jwt_required()
def change():
    """Change password"""
    if request.is_json:

        # Get username 
        username = request.json.get('username')
        password = request.json.get('currentPassword')

        # Check if username exists and password matches
        rows = db.execute("SELECT * FROM users WHERE username = ?", username)
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], password):
            return jsonify({'msg': 'Invalid username or password', 'error': 'invalid'}), 400
        
        # Make sure they are changing themselves
        if username != rows[0]["username"]:
            return jsonify({'msg': 'Not logged in as username', 'error': 'invalid'}), 400
        
        # Check if new password and confirmation match
        new_password = request.json.get("newPassword")
        if not new_password or new_password != request.json.get('confirm'):
            return jsonify({'msg': 'Make sure new password and confirmation match', 'error': 'not_matched'}), 400
        
        # Update users password
        user_id = get_jwt_identity()
        db.execute("UPDATE users SET hash = ? WHERE id = ?", generate_password_hash(new_password), user_id)
        return jsonify({'msg': 'Change complete'}), 200

    else:
        return jsonify({'msg': 'Did not recieve json', 'error': 'no_json'}), 400


@app.route("/deposit", methods=["POST"])
@jwt_required()
def deposit():
    """Deposit cash into account"""
    if request.is_json:
        
        # Check for input
        amount = request.json.get('deposit')
        if not amount:
            return jsonify({'msg': 'Enter an amount to deposit', 'error': 'no_input'}), 400
        
        # Convert to float
        try:
            amount = float(amount)
        except ValueError:
            return jsonify({'msg': 'Enter a number', 'error': 'not_number'}), 400
        
        # Make sure it is positive 
        if amount < 0:
            return jsonify({'msg': 'Enter a positive amount', 'error': 'not_positive'}), 400
        
        # Update their cash by adding amount
        user_id = get_jwt_identity()
        db.execute("UPDATE users SET cash = cash + ? WHERE id = ?", amount, user_id)
        return jsonify({'msg': 'Deposit complete'}), 200

    else:
        return jsonify({'msg': 'Did not recieve json', 'error': 'no_json'}), 400


@app.route("/withdrawl", methods=["POST"])
@jwt_required()
def withdrawl():
    """Withdrawl cash out of account"""
    if  request.is_json:
        
        # Check for integer and positive amount
        amount = request.json.get('withdrawl')
        if not amount:
            return jsonify({'msg': 'Enter a number', 'error': 'no_input'}), 400
        
        try:
            amount = float(amount)
        except ValueError:
            return jsonify({'msg': 'Enter a number', 'error': 'not_number'}), 400
        
        if amount < 0:
            return jsonify({'msg': 'Enter a positive number', 'error': 'not_positive'}), 400
        
        # Update their cash by subtracting amount
        user_id = get_jwt_identity()
        db.execute("UPDATE users SET cash = cash - ? WHERE id = ?", amount, user_id)

        return jsonify({'msg': 'Withdrawl complete'}), 200

    else:
        return jsonify({'msg': 'Did not recieve json', 'error': 'no_json'}), 400



if __name__ == '__main__':
    app.run(host='0.0.0.0')
    app.run(debug=True)

