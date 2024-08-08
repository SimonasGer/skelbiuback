const Dish = require("../models/dishModel");

// ROUTE FUNCTIONS
exports.getAllDishes = async (req, res) => {
    try {
    // Filtering:
        const queryObject = { ...req.query };
        const excludedFields = ["sort", "limit", "fields"];
        excludedFields.forEach((element) => delete queryObject[element]);

        // Advanced filtering:
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}` // query rasyti reikia taip: http://localhost:3000/api/v1/hotels?comfort[gte]=5
        );
        // console.log(JSON.parse(queryString));

        let query = Dish.find(JSON.parse(queryString));

        // Sorting:
    if (req.query.sort){
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy); // http://localhost:3000/api/v1/hotels?comfort[gte]=6&sort=-price
    } else {
        query = query.sort("-created_at"); // http://localhost:3000/api/v1/hotels?comfort[gte]=6&sort
    }

    // Field limiting:
    if (req.query.fields){
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields); // http://localhost:3000/api/v1/hotels?fields=name,address
    }

    // Execute query
    const dishes = await query;
    res.status(200).json({
        status: "success",
        results: dishes.length,
        data: {
            dishes,
        },
    });
    } catch (err) {
        console.log(err);
    }
};

exports.createDish = async (req, res) => {
    try {
        const newDish = await Dish.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                dish: newDish,
            },
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getDishById = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id).populate("likes"); // populate, kad sudeti users is duomenu bazes
        if (!dish) {
            res.status(404).json({
                status: "failed",
                message: "invalid id",
            });
        } else {
            res.status(200).json({
                status: "success",
                data: {
                    dish,
                },
            });
        }
    } catch (err) {
        console.log(err);
    }
};

// kitam kartui
exports.updateDish = async (req, res) => {
    try{
        const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        dish.likes.push(req.body.likes)
        res.status(200).json({
            status: "success",
            data: {
                dish,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "failed",
            message: err.message,
        });
    }
};

exports.updateLikes = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id);
        if (!dish) {
            return res.status(404).json({
                status: "failed",
                message: "Dish not found",
            });
        }
        
        const existingLikeIndex = dish.likes.indexOf(req.body.likes);

        if (existingLikeIndex === -1) {
            // Item does not exist, so add it
            dish.likes.push(req.body.likes);
        } else {
            // Item exists, so remove it
            dish.likes.splice(existingLikeIndex, 1);
        }

        await dish.save();

        res.status(200).json({
            status: "success",
            data: {
                dish,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "failed",
            message: err.message,
        });
    }
};

exports.deleteDish = async (req, res) => {
    try {
        await Dish.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                dish: "deleted",
            },
        });
    } catch (err) {
        console.log(err);
    }
};