import Review from "../../../DB/Models/review.model";

export const getReviews = async (req, res, next) => {  
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId });
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
} 
 
// =============Controller function to add a review==========//
export const addReview = async (req, res, next) => {
    try {
        // Extract data from the request body
        const { user, product, rating, content } = req.body;

        // Create a new review object
        const review = new Review({
            user,
            product,
            rating,
            content
        });

        // Save the review to the database
        const savedReview = await review.save();

        res.status(201).json({ success: true, message: 'Review added successfully', data: savedReview });
    } catch (error) {
        next(error);
    }
}; 


 
// Controller function to delete a review
export const deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;

        // Find the review by its ID and delete it
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        next(error);
    }
};