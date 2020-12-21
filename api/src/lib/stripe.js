const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: ''
});

module.exports = {
  getCustomer: (customer) => {
    return stripe.customers.retrieve(customer);
  },
  getPaymentIntent: (payment_intent) => {
    return stripe.paymentIntents.retrieve(payment_intent);
  },
  createSubscription: (data) => {
    return stripe.subscriptions.create(data);
  },
  findCustomer: async (email) => {
    if (!email) return null;
    const customers = await stripe.customers.list({
      email: email.toLowerCase(),
      limit: 1
    });
    return customers.data.length ? customers.data[0].id : null;
  },
  createSession: (data) => {
    return stripe.checkout.sessions.create(data);
  }
};
