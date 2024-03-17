import slugify from 'slugify'

import Brand from '../../../DB/Models/brand.model.js'
import subCategory from '../../../DB/Models/sub-category.model.js'
import cloudinaryConnection from '../../utils/cloudinary.js'
import generateUniqueString from '../../utils/generate-Unique-String.js'

//======================= add brand =======================//
export const addBrand = async (req, res, next) => {
    // 1- desturcture the required data from teh request object
    const { name } = req.body
    const { categoryId, subCategoryId } = req.query
    const { _id } = req.authUser
    // category check , subcategory check
    // 2- subcategory check
    const subCategoryCheck = await subCategory.findById(subCategoryId).populate('categoryId', 'folderId')
    if (!subCategoryCheck) return next({ message: 'SubCategory not found', cause: 404 })

    // 3- duplicate  brand document check 
    const isBrandExists = await Brand.findOne({ name, subCategoryId })
    if (isBrandExists) return next({ message: 'Brand already exists for this subCategory', cause: 400 })

    // 4- categogry check
    if (categoryId != subCategoryCheck.categoryId._id) return next({ message: 'Category not found', cause: 404 })

    // 5 - generate the slug
    const slug = slugify(name, '-')

    // 6- upload brand logo
    if (!req.file) return next({ message: 'Please upload the brand logo', cause: 400 })

    const folderId = generateUniqueString(4)
    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/Categories/${subCategoryCheck.categoryId.folderId}/SubCategories/${subCategoryCheck.folderId}/Brands/${folderId}`,
    })

    const brandObject = {
        name, slug,
        Image: { secure_url, public_id },
        folderId,
        addedBy: _id,
        subCategoryId,
        categoryId
    }

    const newBrand = await Brand.create(brandObject)

    res.status(201).json({
        status: 'success',
        message: 'Brand added successfully',
        data: newBrand
    })

} 

//======================= Update Brand =======================//
export const updateBrand = async (req, res, next) => {
    try {
        // Extract required data from the request object
        const { name, categoryId, subCategoryId } = req.body;
        const { brandId } = req.params;
        const { _id } = req.authUser;

        // Find the brand to update
        const brand = await Brand.findById(brandId);

        if (!brand) {
            return next({ message: 'Brand not found', cause: 404 });
        }

        // Check if the requested category and subcategory match with the brand
        if (brand.categoryId.toString() !== categoryId || brand.subCategoryId.toString() !== subCategoryId) {
            return next({ message: 'Brand not found in the specified category and subcategory', cause: 404 });
        }

        // Update the brand data
        brand.name = name || brand.name;

        // Save the updated brand
        await brand.save();

        res.status(200).json({ success: true, message: 'Brand updated successfully', data: brand });
    } catch (error) {
        next(error);
    }
};
 

//======================= Delete Brand =======================//
export const deleteBrand = async (req, res, next) => {
    try {
        // Extract the brand ID from the request parameters
        const { brandId } = req.params;

        // Find and delete the brand
        const deletedBrand = await Brand.findByIdAndDelete(brandId);

        if (!deletedBrand) {
            return next({ message: 'Brand not found', cause: 404 });
        }

        res.status(200).json({ success: true, message: 'Brand deleted successfully' });
    } catch (error) {
        next(error);
    }
};
 
// ======== Get all brands for specific subCategory ============// 
export const getBrandsForSubCategory = async (req, res, next) => {
    try {
        const { subCategoryId } = req.params;
        // Find all brands with the specified subcategory ID
        const brands = await Brand.find({ subCategoryId });

        res.status(200).json({ success: true, message: 'Brands fetched successfully', data: brands });
    } catch (error) {
        next(error);
    }
};


// =======Get all brands for Category=====// 
export const getBrandsForCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        // Find all subcategories belonging to the specified category
        const subCategories = await SubCategory.find({ categoryId });

        // Extract subcategory IDs
        const subCategoryIds = subCategories.map(subCategory => subCategory._id);

        // Find a ll brands associated with these subcategories
        const brands = await Brand.find({ subCategoryId: { $in: subCategoryIds } });

        res.status(200).json({ success: true, message: 'Brands fetched successfully', data: brands });
    } catch (error) {
        next(error);
    }
};
