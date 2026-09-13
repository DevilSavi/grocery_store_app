# 🛒 Grocery Store Management System

A full-stack, robust, and scalable backend system for managing a retail Grocery Store ecosystem. Built with **Flask** and **MySQL**, this project provides comprehensive APIs and Data Access Objects (DAOs) for inventory tracking, unit of measure (UOM) definitions, order creation, dynamic order line-item manipulation, and automated total updates.

---

## 🌟 Features

- **Product Management**: Full CRUD operations for products (name, unit price, UOM mapping).
- **Unit of Measure (UOM) Management**: Manage measurement units (e.g., kg, liters, pcs, packs) dynamic link to items.
- **Order Processing**:
  - Multi-item batch order placement.
  - Automated tracking of sub-totals, discounts, and order grand totals.
  - Order breakdown retrieval (detailed line items per order).
- **Line-Item Granular Control**:
  - Add, update, or remove specific order detail records.
  - Automatic re-calculation and update of grand total on order item modification.
- **RESTful API**: Clean Flask routes configured with Cross-Origin Resource Sharing (CORS) header integration.

---

## 📐 Architecture & Database Schema

The system uses a relational database model (`gs` schema) structured around core retail entities:

```
+------------------+         +--------------------+         +------------------+
|       uom        |         |      products      |         |     orders       |
+------------------+         +--------------------+         +------------------+
| PK uom_id        |<-------1| PK product_id      |         | PK order_id      |
|    uom_name      |        *|    name            |         |    customer_name |
+------------------+         | FK uom_id          |         |    total         |
                             |    price_per_unit  |         |    datetime      |
                             +--------------------+         +------------------+
                                       ^                             ^
                                       | 1                           | 1
                                       |                             |
                                       |*                           *|
                                  +---------------------------------------+
                                  |             order_details             |
                                  +---------------------------------------+
                                  | PK/FK order_id                        |
                                  | PK/FK product_id                      |
                                  |       quantity                        |
                                  |       total_price                     |
                                  |       discount                        |
                                  +---------------------------------------+
```

---

## 📁 Project Structure

```text
.
├── backend/
│   ├── order_dao.py                # Data Access Object for High-level Orders
│   ├── orderDetail_dao.py          # Data Access Object for Line Items & Total Calculations
│   ├── product_dao.py              # Data Access Object for Products
│   ├── server.py                   # Flask application entry point and REST API routes
│   ├── sql_connection.py           # MySQL database connection pooled context provider
│   └── uom_dao.py                  # Data Access Object for Units of Measure (UOM)
└── ui/
    ├── images/                 
    ├── css/
    │   ├── custom.css              # Application custom stylesheet
    │   └── style.css               # Main stylesheet
    ├── js/
    │   ├── custom/
    │   │   ├── common.js           # Shared UI utility methods and API helpers
    │   │   ├── dashboard.js        # Dashboard page logic
    │   │   ├── manage-product.js   # Product management page interactions
    │   │   ├── manage-units.js     # Units management page interactions
    │   │   ├── order.js            # Order entry and detail modal controls
    │   │   └── order-details.js    # Order edit, delete and add modal controls
    │   └── packages/               # Third-party JavaScript libraries (jQuery, DataTables, etc.)
    ├── index.html                  # Main dashboard / Orders view
    ├── manage-product.html         # Product inventory control page
    ├── manage-units.html           # Unit inventory control page
    ├── order.html                  # New order creation form
    └── order-details.html          # Show Orders with details
```

---

## 🛠️ API Reference

### 📦 Products & UOM

| Method | Endpoint | Description | Request Payload / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/getProducts` | Fetch all products with UOM names | *None* |
| `POST` | `/insertProduct` | Add a new product | `data`: JSON string `{"product_name", "uom_id", "price_per_unit"}` |
| `POST` | `/updateProduct` | Update product details | `data`: JSON string `{"product_id", "product_name", "uom_id", "price_per_unit"}` |
| `POST` | `/deleteProduct` | Delete a product by ID | Form data: `product_id` |
| `GET` | `/getUOM` | Get list of all UOMs | *None* |
| `POST` | `/insertUOM` | Create a new UOM | `data`: JSON string `{"uom_name"}` |
| `POST` | `/updateUOM` | Edit an existing UOM | `data`: JSON string `{"uom_id", "uom_name"}` |
| `POST` | `/deleteUOM` | Delete a UOM entry | Form data: `uom_id` |

---

### 🧾 Orders & Order Details

| Method | Endpoint | Description | Request Payload / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/getAllOrders` | Get summary of all placed orders | *None* |
| `POST` | `/insertOrder` | Place a complete order with items | `data`: JSON string `{"customer_name", "grand_total", "order_details": [...]}` |
| `GET` | `/getOrderDetails` | Get line items for a specific order | Query string: `?order_id=<id>` |
| `POST` | `/insertOrderDetails` | Add a single line item to order | `data`: JSON string `{"order_id", "product_id", "quantity", "total_price", "discount"}` |
| `POST` | `/updateOrderDetail` | Modify a line item in an order | `data`: JSON string `{"order_id", "product_id", "old_product_id", "quantity", "total_price", "discount"}` |
| `POST` | `/deleteOrderDetail` | Remove an item from an order | Form data: `order_id`, `product_id` |

---

## ⚡ Setup & Installation

### Prerequisites

- **Python**: 3.8 or higher
- **MySQL Server**: 8.0 or higher
- Required Python libraries: `flask`, `mysql-connector-python`

### 1. Database Setup

Create the schema in your MySQL instance:

```sql
CREATE DATABASE IF NOT EXISTS gs;
USE gs;

CREATE TABLE uom (
    uom_id INT AUTO_INCREMENT PRIMARY KEY,
    uom_name VARCHAR(45) NOT NULL
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    uom_id INT NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (uom_id) REFERENCES uom(uom_id)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    datetime DATETIME NOT NULL
);

CREATE TABLE order_details (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.0,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
```

### 2. Configure Credentials

Update your database credentials in `backend/sql_connection.py`:

```python
__cnx = mysql.connector.connect(
    user='your_mysql_user',
    password='your_mysql_password',
    host='127.0.0.1',
    database='gs'
)
```

### 3. Install Dependencies & Run

```bash
# Navigate to the project directory
cd backend

# Install dependencies
pip install flask mysql-connector-python

# Start the server
python server.py
```

The Flask server will start running on `http://127.0.0.1:5000/`.

---

## 🛡️ Best Practices & Known Caveats

- **SQL Injection Prevention**: Prepared statements with parameterized queries (`%s`) are implemented across all DAO queries to prevent SQL injection vulnerabilities.
- **Data Integrity**: Modifying or removing order line items automatically triggers an internal transaction update on the parent order's grand total calculation.
