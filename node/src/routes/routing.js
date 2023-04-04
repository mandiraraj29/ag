// import all required modules

//implement routing as per the given requirement

// export routing as module
const express = require('express');
const routing = express.Router();
const flightBookingServ = require('../service/users');
const FlightBooking = require('../model/flightBooking');

routing.get('/getAllBookings', async(req, res, next) => {
    try {
        let bookings=await flightBookingServ.getAllBookings();
        res.json(bookings);
    } catch (error) {
        next(error)
    }
})




routing.get('/customerBookings/:customerId/:flightId', async(req, res, next) => {
    let customerId = req.params.customerId;
    let flightId = req.params.flightId;

    try {
        let bookings=await flightBookingServ.customerBookingsByFlight(customerId, flightId);
        res.json({message: "Customer id is:"+ bookings[0].customerId})
    } catch (error) {
        next(error)
    }
})


routing.get('/bookingsByFlight/:flightId', async(req,res,next)=>{
    let flightid= req.params.flightId
    try{
        let bookFlight=await flightBookingServ.getbookingsByFlightId(flightid)
        res.json(bookFlight);
    }catch(err){
        next(error)
    }

})


routing.post('/bookFlight', async(req, res, next) => {
    const flightBooking = new FlightBooking(req.body);
    // console.log(flightBooking);
    try {
        let bookingId = await flightBookingServ.bookFlight(flightBooking);
        res.json({ "message": "Flight booking is successful with booking Id :" + bookingId });
    } catch (error) {
        next(error)
    }
})

routing.put('/updateBooking/:bookingId', async(req, res, next) => {
    let bookingId = parseInt(req.params.bookingId);
    let noOfTickets = parseInt(req.body.noOfTickets);
    try {
        let flight=await  flightBookingServ.updateBooking(bookingId, noOfTickets)
        res.json({ "message": "Booking successfully updated!! updated flight details " + flight })
    } catch (error) {
        next(error)
    }
})


module.exports = routing;