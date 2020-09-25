const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireAuth = require('../middlewares/requireAuth');
const yandexMoney = require('yandex-money-sdk');
const url = require('url');

module.exports = app => {
  app.post('/api/stripe', requireAuth, async (req, res) => {
    try {
      await stripe.charges.create({
        amount: req.body.amount,
        currency: 'usd',
        description: '5$ fot 5 credits',
        source: req.body.id
      });
      req.user.credits += 5;
      const user = await req.user.save();
      res.send(user);
    } catch (err) {
      res.status(400).send({ error: `Error with payment. Please, try later! "${err.message}"` });
    }
  });

  app.get('/api/yandex', requireAuth, async (req, res) => {
    if (!req.user.yandexInstanceId) {
      yandexMoney.ExternalPayment.getInstanceId(keys.yandexAppID, async (err, { instance_id }) => {
        if (err) {
          return res.status(400).send({ error: err.message });
        }
        req.user.yandexInstanceId = instance_id;
        await req.user.save();
      });
    }

    const externalPayment = new yandexMoney.ExternalPayment(req.user.yandexInstanceId);
    const requestOptions = {
      pattern_id: "p2p",
      to: 41001761989364,
      amount_due: keys.yandexPaymentAmount,
      message: `${keys.yandexPaymentAmount} RUB for 5 credit`
    };

    externalPayment.request(requestOptions, (err, data) => {
      if (err) {
        return res.status(400).send({ error: err.message });
      }

      if (data.error === 'illegal_param_instance_id') {
        req.user.yandexInstanceId = '';
        req.user.save();
      }

      const processOptions = {
        request_id: data.request_id,
        ext_auth_success_uri: keys.redirectDomain + '/yandex/success',
        ext_auth_fail_uri: keys.redirectDomain + '/yandex/fail'
      };

      let requestCount = 0;
      setTimeout(function callProcess() {
        externalPayment.process(processOptions, (err, data) => {
          requestCount++;
          if (requestCount > 100) {
            return;
          }
          if (data.acs_params && data.acs_uri && requestCount === 1) {
            res.redirect(url.format({
              pathname: data.acs_uri,
              query: data.acs_params
            }));
            return setTimeout(callProcess, 5000);
          }
          if (err) {
            return res.status(400).send({ error: err.message });
          }
          if (data.status === 'ext_auth_required' || data.status === 'in_progress') {
            return setTimeout(callProcess, 5000);
          }
          if (data.status === 'success') {
            req.user.credits += 5;
            req.user.save();
          }
          if (data.status === 'refused') {
            return res.redirect(keys.redirectDomain + '/yandex/fail');
          }
        })
      }, 5000);
    });
  });
};
