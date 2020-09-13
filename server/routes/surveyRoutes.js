const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {

  app.delete('/api/surveys/:id', requireAuth, async (req, res) => {
    try {
      const delResult = await Survey.deleteOne({ _id: req.params.id, _user: req.user.id });
      if (!delResult.deletedCount) {
        return res.status(400).send({ error: 'Survey is not found!' });
      }
      res.send({});
    } catch (err) {
      res.status(501).send({ error: err.message });
    }
  });

  app.get('/api/surveys', requireAuth, async (req, res) => {
    try {
      const surveys = await Survey.find({ _user: req.user.id })
        .select({ recipients: false }); //Исключить recipients

      res.send(surveys);
    } catch (err) {
      res.status(422).send({ error: err.message });
    }
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  })

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');
    try {
      _.chain(req.body)
        .map(({ email, url, event }) => {
          const match = p.test(new URL(url).pathname);
          if (match && event === 'click') {
            return { email, surveyId: match.surveyId, choice: match.choice };
          }
        })
        .compact() //удаляет все undefined элементы массива
        .uniqBy('email', 'surveyId') //получить уникальные элементы по указанным ключам
        .each(({ email, surveyId, choice }) => {
          Survey.updateOne({
            _id: surveyId, // найти survey с id == surveyId, который имеет recipients:
            recipients: {
              $elemMatch: { email: email, responded: false } //перебрать всех recipients ($elemMatch) и найти подходящего по условиям
            }   // если survey, подходящий по всем условиям был найден, обновить его в соответствии со 2-ым объектом:
          }, {
            $inc: { [choice]: 1 },
            //найти свойство choice (= 'yes' / 'no' в данном случае) и увеличить ($inc) его на 1; 
            //грубо говоря survey['yes'] += 1; key interpolation es2016
            $set: { 'recipients.$.responded': true },
            //установить ($set) у найденного ранее recipient в найденном survey свойство responded на true
            lastResponded: new Date()
          }).exec();
        })
        .value();

      res.send({});
    } catch (err) {
      res.status(422).send({ error: err.message });
    }
  });

  app.post('/api/surveys', requireAuth, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });
    try {
      const mailer = new Mailer(survey, surveyTemplate(survey));
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send({ error: err.message });
    }
  });
};