//This middleware serves as a temporary solution to the lack of a real payment system
const makeCardsMiddleware = (req, res, next) => {
    const cards = [
        {
            cardName: '${res.locals.profile.firstName} ${res.locals.profile.lastName}',
            cardNumber: 4242424242424242,
            card_token: 'tok_visa',
            cardExp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            card_cvc: 123,
            amount: 10000.63,
        },
        {
            cardName: '${res.locals.profile.firstName} ${res.locals.profile.lastName}',
            cardNumber: 4242424242424242,
            card_token: 'tok_visa',
            cardExp: new Date(Date.now() + 5 * 60 * 1000),
            card_cvc: 123,
            amount: 15.23
        },
        {
            cardName: '${res.locals.profile.firstName} ${res.locals.profile.lastName}',
            cardNumber: 4242424242424242,
            card_token: 'tok_visa',
            cardExp: new Date(Date.now() + 1 * 60 * 60 * 1000),
            card_cvc: 123,
            amount: 10000.72,
        }
    ]; // first element is 3 days ago, second element is 5 minutes from now, third element is 1 hour from now
    res.locals.cards = cards;
    next();
};
export default makeCardsMiddleware;
//# sourceMappingURL=cards.js.map