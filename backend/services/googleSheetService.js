
const { google } = require('googleapis');
const path = require('path');

class GoogleSheetService {
  constructor() {
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID;
    this.initialize();
  }

  async initialize() {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || path.join(__dirname, '../credentials.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      console.log('✅ Google Sheets API initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets API:', error.message);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Products!A:H', // ProductID, Name, Price, Category, ImageURL, Stock, SKU, Description
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return [];
      }

      // Skip header row and convert to objects
      const products = rows.slice(1).map((row, index) => ({
        id: row[0] || `product_${index + 1}`,
        name: row[1] || '',
        price: parseFloat(row[2]) || 0,
        category: row[3] || '',
        imageUrl: row[4] || '',
        stock: parseInt(row[5]) || 0,
        sku: row[6] || '',
        description: row[7] || ''
      }));

      return products.filter(product => product.name); // Filter out empty rows
    } catch (error) {
      console.error('Error fetching products from Google Sheets:', error);
      throw new Error('Failed to fetch products from database');
    }
  }

  async getProductById(productId) {
    try {
      const products = await this.getAllProducts();
      return products.find(product => product.id === productId);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error('Failed to fetch product');
    }
  }

  async updateProductStock(productId, newStock) {
    try {
      // First, find the row index of the product
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Products!A:A',
      });

      const rows = response.data.values;
      const rowIndex = rows.findIndex((row, index) => index > 0 && row[0] === productId);

      if (rowIndex === -1) {
        throw new Error('Product not found');
      }

      // Update the stock (column F, index 5)
      const updateRange = `Products!F${rowIndex + 1}`;
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: updateRange,
        valueInputOption: 'RAW',
        resource: {
          values: [[newStock]]
        }
      });

      return true;
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw new Error('Failed to update product stock');
    }
  }

  async logOrder(orderData) {
    try {
      const timestamp = new Date().toISOString();
      const orderRow = [
        orderData.orderId,
        orderData.productId,
        orderData.productName,
        orderData.quantity,
        orderData.totalPrice,
        orderData.customerEmail,
        orderData.customerName,
        orderData.customerPhone,
        orderData.status || 'pending',
        timestamp
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Orders!A:J', // OrderID, ProductID, ProductName, Quantity, TotalPrice, CustomerEmail, CustomerName, CustomerPhone, Status, Timestamp
        valueInputOption: 'RAW',
        resource: {
          values: [orderRow]
        }
      });

      return true;
    } catch (error) {
      console.error('Error logging order:', error);
      throw new Error('Failed to log order');
    }
  }
}

module.exports = new GoogleSheetService();
