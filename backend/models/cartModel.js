const mongoose = require('mongoose') 

const cartSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId ,
        required : true,
        ref : "User"
    },

   items : [{
    product : {
        required : true,
        type : String
    },
    name: {
        type: String
    },
    image: {
        type: String
    },
    quantity : {
        type : Number ,
        default : 1 ,
        required : true 
    },
    price : {
        type : Number,
        min : 0 ,
        required : true
    }
   }]
},
{
    timestamps : true 
});

cartSchema.virtual("totalPrice").get(function () {
    return this.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
});

cartSchema.set("toJSON", { virtuals: true });
cartSchema.set("toObject", { virtuals: true });


const cart = mongoose.model("Cart",cartSchema) ;
module.exports = cart ;

