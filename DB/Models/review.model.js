// Import mongoose
import mongoose from 'mongoose';

// Define the schema for the Reviews model
const reviewSchema = new mongoose.Schema({
    // User who wrote the review
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    // Product being reviewed
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Assuming you have a Product model
        required: true
    },
    // Rating (1 to 5 stars)
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    // Review content
    content: {
        type: String,
        required: true
    },
    // Date when the review was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Reviews model
const Review = mongoose.model('Review', reviewSchema);

// Export the Reviews model
export default Review;
