const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!');
    })

    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');
        _.chain(req.body)
            .map(({ email, url, event }) => {
                const match = p.test(new URL(url).pathname);
                if (match && event === 'click') {
                    return { email, surveyId: match.surveyId, choice: match.choice };
                }
            })
            .compact() //удаляет все undefined элементы массива
            .uniqBy('email', 'surveyId') //получить уникальные элементы по указанным ключам
            .each(event => {
                Survey.updateOne({
                    _id: event.surveyId, // найти survey с id == surveyId, который имеет recipients:
                    recipients: {
                        $elemMatch: { email: event.email, responded: false } //перебрать всех recipients ($elemMatch) и найти подходящего по условиям
                    }   // если survey, подходящий по всем условиям был найден, обновить его в соответствии со 2-ым объектом:
                }, {
                        $inc: { [event.choice]: 1 },
                        //найти свойство choice (= 'yes' / 'no' в данном случае) и увеличить ($inc) его на 1; 
                        //грубо говоря survey['yes'] += 1; key interpolation es2016
                        $set: { 'recipients.$.responded': true },
                        //установить ($set) у найденного ранее recipient в найденном survey свойство responded на true
                        lastResponded: new Date()
                    }).exec();
            })
            .value();
        res.send({ message: 'OK' });
    });

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            //refactored from:
            //recipients: recipients.split(',').map(recipient => { return { email: recipient } })
            _user: req.user.id,
            dateSent: Date.now()
        });

        const mailer = new Mailer(survey, surveyTemplate(survey));
        try {
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
        } catch (err) {
            res.status(422).send(err);
        }


    });
};