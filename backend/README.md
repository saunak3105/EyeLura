
# EyeLura Backend API

A Node.js + Express backend for the EyeLura ecommerce platform with Google Sheets integration for dynamic product management and order processing.

## 🚀 Features

- **Google Sheets Integration**: Dynamic product data management
- **RESTful API**: Clean and consistent API endpoints
- **Order Management**: Handle orders with inventory validation
- **Stock Management**: Automatic stock updates after orders
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Rate limiting, CORS, and security headers
- **Modular Architecture**: Clean, maintainable code structure

## 📁 Project Structure

```
backend/
├── index.js                 # Main server file
├── routes/
│   ├── products.js          # Product-related routes
│   └── orders.js            # Order-related routes
├── services/
│   └── googleSheetService.js # Google Sheets API service
├── utils/
│   └── formatProduct.js     # Product formatting utilities
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Environment variables template
├── credentials.json         # Google Service Account key (add this file)
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Google Sheets API Setup

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API

#### Step 2: Create Service Account
1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Fill in the details and click "Create"
4. Grant the service account "Editor" role
5. Click "Done"

#### Step 3: Generate Key File
1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Select "JSON" format
5. Download the key file and rename it to `credentials.json`
6. Place it in the `backend/` directory

#### Step 4: Create Google Sheets
Create two sheets in your Google Spreadsheet:

**Sheet 1: "Products"** (Column headers in row 1):
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| ProductID | Name | Price | Category | ImageURL | Stock | SKU | Description |

**Sheet 2: "Orders"** (Column headers in row 1):
| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| OrderID | ProductID | ProductName | Quantity | TotalPrice | CustomerEmail | CustomerName | CustomerPhone | Status | Timestamp |

#### Step 5: Share the Sheet
1. Get the Google Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
2. Share the sheet with the service account email (found in `credentials.json`)
3. Give it "Editor" permissions

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` file with your values:
```env
GOOGLE_SHEET_ID=your_actual_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./credentials.json
PORT=5000
NODE_ENV=development
```

### 4. Run the Server

```bash
# Development with auto-restart
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Products

#### Get All Products
```http
GET /api/products
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "EYE001",
      "name": "Classic Aviator",
      "price": 1299,
      "category": "sunglasses",
      "imageUrl": "https://example.com/image.jpg",
      "stock": 25,
      "sku": "AVI-001",
      "description": "Classic aviator sunglasses",
      "inStock": true,
      "priceFormatted": "₹1,299",
      "stockStatus": "in_stock"
    }
  ]
}
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Get Products by Category
```http
GET /api/products/category/:category
```

#### Search Products
```http
GET /api/products/search?q=aviator
```

### Orders

#### Create Order
```http
POST /api/orders
```

**Request Body:**
```json
{
  "productId": "EYE001",
  "quantity": 2,
  "customerInfo": {
    "email": "customer@example.com",
    "name": "John Doe",
    "phone": "+91-9876543210"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "ORD-1703123456789-ABC123",
    "product": {
      "id": "EYE001",
      "name": "Classic Aviator",
      "price": 1299,
      "sku": "AVI-001"
    },
    "quantity": 2,
    "totalPrice": 2598,
    "customer": {
      "name": "John Doe",
      "email": "customer@example.com",
      "phone": "+91-9876543210"
    },
    "status": "confirmed",
    "remainingStock": 23
  }
}
```

#### Validate Order
```http
POST /api/orders/validate
```

**Request Body:**
```json
{
  "productId": "EYE001",
  "quantity": 2
}
```

### Health Check
```http
GET /health
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Input Validation**: Request body validation
- **Error Handling**: Comprehensive error responses

## 🚀 Deployment on Replit

1. Create a new Repl and upload your backend code
2. Add your `credentials.json` file to the Repl
3. Set environment variables in Replit Secrets:
   - `GOOGLE_SHEET_ID`
   - `PORT` (set to 5000)
   - `NODE_ENV` (set to production)
4. The server will automatically bind to `0.0.0.0:5000`

## 🧪 Testing the API

### Using curl:

```bash
# Get all products
curl http://localhost:5000/api/products

# Get single product
curl http://localhost:5000/api/products/EYE001

# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "EYE001",
    "quantity": 1,
    "customerInfo": {
      "email": "test@example.com",
      "name": "Test User",
      "phone": "+91-9876543210"
    }
  }'
```

## 🔧 Future Enhancements

This backend is structured to easily accommodate:
- Payment gateway integration (Razorpay, Stripe)
- User authentication & authorization
- Advanced inventory management
- Order status tracking
- Email notifications
- Admin dashboard APIs
- Product image upload
- Reviews and ratings system

## 📞 Support

For issues and questions, check the Google Sheets API setup and ensure:
1. Service account has proper permissions
2. Google Sheet is shared with the service account email
3. Environment variables are correctly set
4. `credentials.json` is in the correct location

## 📄 License

MIT License - Feel free to use this code for your projects.
