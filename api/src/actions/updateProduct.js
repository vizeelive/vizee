const logger = require('../logger');
const { getUser } = require('../lib');
const { getAccountAndProduct } = require('../queries');
const { updateProduct } = require('../mutations');
const {
  createProduct: createStripeProduct,
  updateProduct: updateStripeProduct
} = require('../lib/stripe');

module.exports = async function (req, res) {
  const user = getUser(req);
  const { id: product_id, object } = req.body.input;
  try {
    let { account, product } = await getAccountAndProduct({
      product_id
    });

    if (!user.isAdmin && !account.users.find((u) => u.user.id === user.id)) {
      logger.info('Unauthorized', JSON.stringify({ object, user, account }));
      return res.status(400).send({ message: 'Unauthorized' });
    }

    await updateStripeProduct(product.stripe_product_id, {
      name: `${account.name} - ${object.name}`,
      description: object.description
    });
    let result = await updateProduct({ product_id: product_id, object });
    res.send({ id: result.id });
  } catch (e) {
    logger.error(e.message, JSON.stringify({ object }));
    res.status(400).send({ message: e.message });
    throw e;
  }
};
