const dbModel = require('../utilities/connection');

const flightBookingDb = {}
    //Do not modify or remove this method
flightBookingDb.generateId = async() => {
    let model = await dbModel.getFlightCollection();
    let ids = await model.distinct("bookings.bookingId");
    let bId = Math.max(...ids);
    return bId + 1;
}

flightBookingDb.checkCustomer = async(customerId) => {
    //fetch the customer object for the given customer Id
    let model = await dbModel.getCustomerCollection();
    let customer = await model.findOne({ customerId: customerId });
    if (!customer) { return null }
    else return customer;
}


flightBookingDb.checkBooking = async(bookingId) => {
    // fetch flight object which has the booking with the given bookingId
    let model = await dbModel.getFlightCollection();
    let flightBooking = await model.findOne({ "bookings.bookingId": bookingId });
    if (!flightBooking) return null;
    else return flightBooking;
}

flightBookingDb.checkAvailability = async(flightId) => {
    // fetch the flight object for the given flight Id
    let model = await dbModel.getFlightCollection();
    let flightRecord = await model.findOne({ flightId: flightId });
    if (!flightRecord) return null;
    else return flightRecord;
}

flightBookingDb.updateCustomerWallet = async(customerId, bookingCost) => {
    // update customer wallet by reducing the bookingCost with the wallet amount for the given customerId

    let model = await dbModel.getCustomerCollection();
    let savedData = await model.updateOne({ customerId: customerId }, { $inc: { walletAmount: -bookingCost } });
    if (savedData.nModified == 1) { return true }
    else return false
}

flightBookingDb.bookFlight = async(flightBooking) => {
    // book a flight ticket
    let model = await dbModel.getFlightCollection();
    let bid = await flightBookingDb.generateId();
    flightBooking.bookingId = bid;
    let data = await model.updateOne({ flightId: flightBooking.flightId }, { $push: { bookings: flightBooking } });
    if (data.nModified == 1) {
        let saved = await model.updateOne({ flightId: flightBooking.flightId }, { $inc: { availableSeats: -flightBooking.noOfTickets } });
        if (saved.nModified == 1) {
            let bookingStatus = await flightBookingDb.updateCustomerWallet(flightBooking.customerId, flightBooking.bookingCost);
            if (bookingStatus) return flightBooking.bookingId;
            else {
                let err = new Error("wallet not updated");
                err.status = 502;
                throw err;
            }
        } else {
            let err = new Error("seats not updated");
            err.status = 502;
            throw err;
        }
    } else {
        let err = new Error("Booking failed");
        err.status = 400;
        throw err;
    }
}

flightBookingDb.getAllBookings = async() => {
    //get all the bookings done in all flights
    let model = await dbModel.getFlightCollection();
    let bookings = await model.find({}, { _id: 0, bookings: 1 });
    if (!bookings || bookings.length == 0) return null;
    else return bookings;
}

flightBookingDb.customerBookingsByFlight = async(customerId, flightId) => {
    // get all customer bookings done for a flight
    let model = await dbModel.getFlightCollection();
    let bookings = await model.findOne({ flightId: flightId }, { _id: 0, bookings: 1 });
    console.log("here", bookings);
    let myBookings = []
    for (let booking of bookings.bookings) {
        if (booking.customerId == customerId) {
            myBookings.push(booking);
        } else continue;
    }
    if (!myBookings || myBookings.length == 0) return null;
    else return myBookings;
}

flightBookingDb.getbookingsByFlightId = async(flightId) => {
    // get all the bookings done for the given flightId
    let model = await dbModel.getFlightCollection();
    let bookings = model.find({ flightId: flightId }, { _id: 0, bookings: 1 });
    if (!bookings || bookings.length == 0) return null;
    else return bookings;
}

flightBookingDb.updateBooking = async (bookingId, noOfTickets) => {
    // update no of tickets for the given bookingId

    let model = await dbModel.getFlightCollection();
    let updated = await model.updateOne({ "bookings.bookingId": bookingId }, { $inc: { "bookings.$.noOfTickets": noOfTickets, availableSeats: -noOfTickets } });
    if (updated.nModified == 1) {
        let flight = await model.findOne({ "bookings.bookingId": bookingId });
        if (flight) {
            let saved = await model.updateOne({ "bookings.bookingId": bookingId }, { $inc: { "bookings.$.bookingCost": noOfTickets * flight.fare } });
            if (saved.nModified == 1) {
                for (let booking of flight.bookings) {
                    if (booking.bookingId == bookingId) { custId = booking.customerId; break; }
                    else continue;
                }
                let model1 = await dbModel.getCustomerCollection();
                let wupdated = await model1.updateOne({ customerId: custId }, { $inc: { walletAmount: -(noOfTickets * flight.fare) } });
                if (wupdated.nModified == 1) {
                    let flightData = await flightBookingDb.checkAvailability(flight.flightId);
                    return flightData;
                }
                else return null;
            }
        }
    }
}

module.exports = flightBookingDb;