const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        // 1) BUILD QUERY
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 2) ADVANCED QUERY FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );

        // 3) CREATE QUERY
        let query = Tour.find(JSON.parse(queryStr));

        // 4) SORTING
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
            console.log(sortBy); 
        } else {
            // Default sorting
            query = query.sort('-createdAt');
        }

        //5)
        if(req.query.fields){
            const feilds = req.query.fields.split(',').join(' ');
            query = query.select(feilds);
        }else{
            query = query.select('-__v');
        }
        
        // 6)
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit *1 || 100;
        const skip = (page -1) * limit;

        query = query.skip(skip).limit(limit);
        if (req.query.page) {
         const numTours = await Tour.countDocuments();
        if (skip >= numTours) {
        throw new Error('This page does not exist');
        }
        }

        // 5) EXECUTE QUERY
        const tours = await query;

        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.createTour = async (req, res) => { 
    try{
        const newTour = await Tour.create(req.body);

        res.status(200).json({
            status : 'Success',
            data: newTour
        });

    }catch (err){
        res.status(400).json({
            status : 'Fail',
            message : 'Error creating tour'
        })
    };
};

exports.updateTour = async (req, res) => {
    try {
     const tour = await Tour.findByIdAndUpdate(req.params.id,req.body, {
        new : true,
        runValidators: true
     });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};