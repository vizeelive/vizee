const logger = require('../logger')(module);
const { getUser } = require('../lib');
const { getAccount } = require('../queries');
const { createProduct } = require('../mutations');
const {
  createProduct: createStripeProduct,
  updateProduct: updateStripeProduct
} = require('../lib/stripe');

module.exports = async function (req, res) {
  const user = getUser(req);
  const { object } = req.body.input;
  object.created_by = user.id;
  try {
    let { account } = await getAccount({
      account_id: object.account_id
    });

    if (!user.isAdmin && !account.users.find((u) => u.user.id === user.id)) {
      logger.info('Unauthorized', JSON.stringify({ object, user, account }));
      return res.status(400).send({ message: 'Unauthorized' });
    }

    let stripeProduct = await createStripeProduct({
      name: `${account.name} - ${object.name}`,
      description: object.description,
      metadata: {
        account_id: object.account_id
      }
    });
    object.stripe_product_id = stripeProduct.id;

    let result = await createProduct({ object });

    await updateStripeProduct(stripeProduct.id, {
      metadata: { product_id: result.id }
    });

    res.send({ id: result.id });
  } catch (e) {
    logger.error(e.message, JSON.stringify({ object }));
    res.status(400).send({ message: e.message });
    throw e;
  }
};
