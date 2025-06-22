const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  transaction_id: { type: String, required: true },
  payment_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
