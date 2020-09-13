const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');
const yandexMoney = require('yandex-money-sdk');
const url = require('url');
const async = require('async');

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '5$ fot 5 credits',
      source: req.body.id
    });
    req.user.credits += 5;
    const user = await req.user.save();
    res.send(user);
  });

  app.get('/api/yandex', requireLogin, (req, res) => {
    if (!req.user.yandexInstanceId) {
      yandexMoney.ExternalPayment.getInstanceId(keys.yandexAppID, (err, data) => {
        if (err) { res.status(500).send({ 'Error': err }); }
        req.user.yandexInstanceId = data.instance_id;
        req.user.save();
      });
    }
    const externalPayment = new yandexMoney.ExternalPayment(req.user.yandexInstanceId);
    const requestOptions = {
      pattern_id: 'p2p',
      to: 41001761989364,
      amount_due: 1,
      message: '1RUB for 1 credit'
    }

    externalPayment.request(requestOptions, (err, data) => {
      if (err) { res.status(500).send({ 'Error': err }); }
      const processOptions = {
        request_id: data.request_id,
        ext_auth_success_uri: keys.redirectDomain + '/yandex/success',
        ext_auth_fail_uri: keys.redirectDomain + '/yandex/fail'
      }
      externalPayment.process(processOptions, async (err, data) => {
        if (err) { res.status(500).send({ 'Error': err }); }
        res.redirect(url.format({
          pathname: data.acs_uri,
          query: data.acs_params
        }));
        checkPaymentStatus(processOptions, (result) => {
          if (result.status === 'success') {
            req.user.credits += 5;
            req.user.save();
          }
        });
      });
    });
  });
};

function checkPaymentStatus(options, done) {
  const externalPayment = new yandexMoney.ExternalPayment(options.instance_id);
  let response = null;
  async.whilst(
    function () {
      if (response === null ||
        response.status === 'ext_auth_required' ||
        response.status === 'in_progress') { return true; }
      return false;
    },
    function checkStatus(callback) {
      externalPayment.process(options, (err, data) => {
        response = data;
        setTimeout(callback, 3000);
      });
    },
    function complete(err) {
      done(response);
    }
  )
}
