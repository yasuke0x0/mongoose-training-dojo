import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema({
    street: String,
    city: String
})

const AddressModel = mongoose.model('Address', addressSchema)

export default AddressModel
