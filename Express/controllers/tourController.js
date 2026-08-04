const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        //1) BUILD QUERY
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

          
        //2) ADVANCED QUERY FILTERING
        let queryStr = JSON.stringify(queryObj);
        console.log(queryStr);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(queryStr);
        // EXECUTE QUERY
        const tours = await Tour.find(JSON.parse(queryStr));

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