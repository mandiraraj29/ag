let Validator = {};

Validator.validateFlightId = function (flightId) {
    // validate the flightId

    if (!flightId.match(/^(IND)-[1-9]{1}[0-9]{2}$/)) {
        let err = new Error('Error in flight Id');
        err.status = 406;
        throw err;
    }
}

Validator.validateBookingId = function (bookingId) {
    // validate the bookingId

    if (! String(bookingId).match(/^[1-9]{1}[0-9]{3}$/)){
    let err = new Error('Error in booking Id');
    err.status = 406;
    throw err;
}

}

module.exports = Validator;