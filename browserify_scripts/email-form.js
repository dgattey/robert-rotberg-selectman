var nodemailer = require('nodemailer');

module.exports = function(clientEmail, clientName, clientMessage, clientPhone) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dylan.gattey@gmail.com',
            pass: 'bodsvqakcbonwjej'
        }
    });

    var emails = [
        {
            from: '✔ Committee to Elect Rotberg Selectman <robert_rotberg@hks.harvard.edu>',
            to: clientEmail,
            subject: 'Thanks for your message',
            text: 'Hello '+clientName.first+',\n\nThanks for the note you sent us through http://robertrotberg.com. We\'ll get back to you about it as soon as possible.\n\nBest,\nRobert'
        },
        {
            from: 'AutoSender <contact@robertrotberg.com>',
            to: 'dylan_gattey@brown.edu', // TODO: CHANGE
            subject: 'Contact from ' + clientName.first + ' ' + clientName.last,
            text: 'An automated message from the contact form on robertrotberg.com. Client: \n\nName: '+clientName.first + ' ' + clientName.last+'\nPhone: '+clientPhone+'\nEmail: '+clientEmail+'\nMessage: '+clientMessage
        }
    ];

    for (var i = emails.length - 1; i >= 0; i--) {
        transporter.sendMail(emails[i], function(error, info){
            if(error){
                console.log(error);
            } else{
                console.log('Message sent: ' + info.response);
            }
        });
    };

}
