import Order from '../models/order.js';
import User from '../models/user.js';

// Get sales and revenue per month
export const getSalesAnalytics = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          sales: { $sum: { $size: '$items' } },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(sales.map(s => ({ month: s._id, sales: s.sales, revenue: s.revenue })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales analytics' });
  }
};

// Get new users per month
export const getUserGrowthAnalytics = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          users: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(users.map(u => ({ month: u._id, users: u.users })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user growth analytics' });
  }
};
