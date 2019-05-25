const mongoose = require('mongoose')

const Schema = mongoose.Schema

const vehicleSchema = new Schema({

    type: {
        type: string, 
        enum:["2Wheeler", "4Wheeler"]
        },
    fuelType: {
        type: string,
        enum: ["Petrol", "Diesel"]
    },
    transmissionType:{
        type: string,
        enum: ["Auto"]
    },
    model:{
        type:string
    },
    registrationNumber:{
        type: string
    },
    images:{
        type: string
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

 })

const Vehicle = mongoose.model('Vehicle', vehicleSchema)

module.exports = {
       Vehicle
}