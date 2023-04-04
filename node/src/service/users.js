//import required modules
const db = require('../model/users');
const validator = require('../utilities/validator');

let fBookingService = {}


fBookingService.bookFlight = async(flightBooking) => {
    validator.validateFlightId(flightBooking.flightId);
    let customer = await db.checkCustomer(flightBooking.customerId);
    if (customer == null) {
        let err = new Error("Customer not registered. Register to proceed");
        err.status = 404;
        throw err;
    } else {
        let flight = await db.checkAvailability(flightBooking.flightId);
        if (flight == null) {
            let err = new Error("Flight Unavailable");
            err.status = 404;
            throw err;
        } else if (flight.status == "Cancelled") {
            let err = new Error("Sorry for the Inconvinience... " + flight.flightId + " is cancelled!!");
            err.status = 404;
            throw err;
        } else if (flight.availableSeats == 0) {
            let err = new Error("Flight " + flight.flightId + " is already full!!");
            err.status = 400;
            throw err;
        } else if (flight.availableSeats < flightBooking.noOfTickets) {
            let err = new Error("Flight almost Full... Only " + flight.availableSeats + " left!!");
            err.status = 404;
            throw err;
        } else {
            flightBooking.bookingCost = flightBooking.noOfTickets * flight.fare;
            if (customer.walletAmount < flightBooking.bookingCost) {
                let amountNeeded = flightBooking.bookingCost - customer.walletAmount;
                let err = new Error("Insufficient Wallet Amount. Add more Rs." + amountNeeded + " to continue booking");
                err.status = 400;
                throw err;
            } else {
                let bookingId = await db.bookFlight(flightBooking);
                return bookingId;
            }
        }
    }
}


fBookingService.getAllBookings = async() => {
    let bookings = await db.getAllBookings();
    if (bookings == null) {
        let err = new Error("No Bookings is found in any flight");
        err.status = 404;
        throw err;
    } else {
        return bookings;
    }
}

fBookingService.customerBookingsByFlight = async (customerId, flightId) => {
    let customer = await db.checkCustomer(customerId);
    if (customer == null) {
        let err = new Error("Customer not found");
        err.status = 404;
        throw err;
    } else {
        let flight = await db.checkAvailability(flightId);
        if (flight == null) {
            let err = new Error("Flight detail not found");
            err.status = 404;
            throw err;
        } else {
            let bookingDetails = await db.customerBookingsByFlight(customerId, flightId);
            if (bookingDetails == null) {
                let err = new Error("No Bookings found for " + customerId + " in " + flightId);
                err.status = 404;
                throw err;
            } else {
                return bookingDetails;
            }
        }
    }
}

fBookingService.getbookingsByFlightId = async(flightId) => {
    let bookings=await db.getbookingsByFlightId(flightId);
    if (bookings === null) {
        let err = new Error("No Bookings found in" + flightId);
        err.status = 404;
        throw err;
    } else {
        return bookings;
    }
}

fBookingService.updateBooking = async(bookingId, noOfTickets) => {
    let booking=await db.checkBooking(bookingId);
    if (booking == null) {
        let err = new Error("No Bookings with bookingId " + bookingId);
        err.status = 404;
        throw err;
    } else if (booking.status == "Cancelled") {
        let err = new Error("Sorry for the Inconvinience... " + booking.flightId + " has been cancelled!!");
        err.status = 404;
        throw err;
    } else if (booking.availableSeats == 0) {
        let err = new Error("Flight is already Full. Can't Book more tickets");
        err.status = 400;
        throw err;
    } else if (booking.availableSeats < noOfTickets) {
        let err = new Error("Flight almost Full. Only " + booking.availableSeats + " seat left");
        err.status = 400;
        throw err;
    }else{
        for (let i of booking.bookings) {
            if (i.bookingId == bookingId) { custId = i.customerId; break; }
            else continue;
        }
        let customer=await db.checkCustomer(custId);
        if (customer.walletAmount < booking.fare * noOfTickets) {
            let amountNeeded = booking.fare * noOfTickets - customer.walletAmount;
            let err = new Error("Insufficient Wallet Amount. Add more Rs." + amountNeeded + " to continue booking");
            err.status = 400;
            throw err;
        }else{
            let flight=await db.updateBooking(bookingId, noOfTickets);
            if (flight) return flight;
            else {
                let err = new Error("update failed");
                err.status = 500;
                throw err;
            }
        }
    }
}

module.exports = fBookingService;