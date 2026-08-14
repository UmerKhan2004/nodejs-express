const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getTourStats = async (req, res, next) => {
    try {
        const stats = await Tour.aggregate([
            { $match: { ratingsAverage: { $gte: 4.5 } } },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: { $sum: 1 },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            { $sort: { avgPrice: -1 } },
            { $match: { _id: { $ne: 'easy' } } }
        ]);

        res.status(200).json({
            status: 'success',
            data: { stats }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllTours = async (req, res, next) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields();

        await features.paginate();

        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: { tours }
        });
    } catch (err) {
        next(err);
    }
};

exports.getTour = async (req, res, next) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: { tour }
        });
    } catch (err) {
        next(err);
    }
};

exports.createTour = async (req, res, next) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { tour: newTour }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateTour = async (req, res, next) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: { tour }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteTour = async (req, res, next) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if (!tour) {
            return res.status(404).json({
                status: 'fail',
                message: 'No tour found with that ID'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

exports.getMonthlyPlan = async (req, res, next) => {
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            { $unwind: '$startDates' },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            { $addFields: { month: '$_id' } },
            { $project: { _id: 0 } },
            { $sort: { numTourStarts: -1 } }
        ]);

        res.status(200).json({
            status: 'success',
            data: { plan }
        });
    } catch (err) {
        next(err);
    }
};