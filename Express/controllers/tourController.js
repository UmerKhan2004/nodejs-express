const fs = require('fs');


const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));



// Here checking if id is valid is repeated so we make it
//param middleware
exports.checkID = (req,res,next,value) =>{
    const id = req.params.id * 1;

    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
}


exports.createTour =  (req, res) => {
    const newID = tours[tours.length - 1].id + 1; 
    const newTour = Object.assign({ id: newID }, req.body);

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`, 
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success', 
                data: {
                    tour: newTour
                }
            });
        }
    );
};


exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: "fail",
            message: "Missing name or price"
        });
    }
    next();
};


exports.getTour = (req,res) => {

    

    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    console.log(req.params);
    res.status(200).json({
    status : 'success',
    data : {
        tour
    }
    
 });
};



exports.updateTour = (req, res) => {

    const tour = tours.find(el => el.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    
    tour.duration = 15;

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not update the tour'
                });
            }

            res.status(200).json({
                status: 'success',
                data: {
                    tour
                }
            });
        }
    );
};


exports.getAllTours = (req,res) => {

 res.status(200).json({
    status : 'success',
    result : tours.length,
    Time : req.requestTime,
    data :{
        tours : tours
    }
 });
};
