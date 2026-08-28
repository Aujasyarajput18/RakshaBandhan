const { verifyToken } = require('./auth');
const {
  getAllOrders,
  clearAllOrders,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  sanitizeOrderPayload
} = require('./db');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. PUBLIC INTAKE: POST /api/orders (Client Submits Order)
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) {}
      }

      const sanitizedOrder = sanitizeOrderPayload(body);
      if (!sanitizedOrder) {
        return res.status(400).json({ error: 'Invalid order data payload' });
      }

      const saved = await addOrder(sanitizedOrder);
      return res.status(201).json({
        success: true,
        orderId: saved.orderId,
        order: saved
      });
    } catch (err) {
      console.error('Order creation error:', err);
      return res.status(500).json({ error: 'Failed to process order' });
    }
  }

  // 2. PROTECTED ADMIN OPERATIONS: Require Valid Bearer Token
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!verifyToken(token)) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid or expired master token. Please log in.'
    });
  }

  // GET /api/orders (Fetch all orders for Admin)
  if (req.method === 'GET') {
    try {
      const orders = await getAllOrders();
      return res.status(200).json({
        success: true,
        orders: orders
      });
    } catch (err) {
      console.error('Fetch orders error:', err);
      return res.status(500).json({ error: 'Failed to retrieve orders' });
    }
  }

  // PATCH /api/orders (Update status)
  if (req.method === 'PATCH') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) {}
      }
      const { orderId, status } = body || {};
      if (!orderId || !status) {
        return res.status(400).json({ error: 'orderId and status are required' });
      }
      const updated = await updateOrderStatus(orderId, status);
      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.status(200).json({ success: true, order: updated });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update order status' });
    }
  }

  // DELETE /api/orders (Delete single order or clear all)
  if (req.method === 'DELETE') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) {}
      }
      const orderId = (req.query && req.query.orderId) || (body && body.orderId);
      const isAll = (req.query && (req.query.all === 'true' || req.query.all === '1')) || (body && body.all === true) || orderId === 'ALL';

      if (isAll) {
        await clearAllOrders();
        return res.status(200).json({ success: true, message: 'All client orders cleared successfully' });
      }

      if (!orderId) {
        return res.status(400).json({ error: 'orderId is required' });
      }
      await deleteOrder(orderId);
      return res.status(200).json({ success: true, message: `Order ${orderId} deleted` });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete order' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
