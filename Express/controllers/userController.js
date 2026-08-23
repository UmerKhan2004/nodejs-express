const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');


exports.getAllUsers = catchAsync(async (req, res , next) => {
    const user = await User.find();
    res.status(200).json({
        status : 'success',
        data : {
            user : user
        } 
    });
});

exports.getUser = (req, res) => {
    const id = req.params.id ;
    const user = users.find(el => el._id === id);

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid Id'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
};


exports.createUser = (req, res) => {
    const newID = Date.now().toString(); // simple unique id generator (see note below)
    const newUser = Object.assign({ _id: newID }, req.body);

    users.push(newUser);

    fs.writeFile(
        `${__dirname}/../dev-data/data/users.json`,
        JSON.stringify(users, null, 2),
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not save the user'
                });
            }

            res.status(201).json({
                status: 'success',
                data: {
                    user: newUser
                }
            });
        }
    );
};

exports.updateUser = (req, res) => {
    const user = users.find(el => el._id === req.params.id);

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    Object.assign(user, req.body); // merge in whatever fields the client sends

    fs.writeFile(
        `${__dirname}/../dev-data/data/users.json`,
        JSON.stringify(users, null, 2),
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not update the user'
                });
            }

           res.status(200).json({
                status: 'success',
                data: {
                    user
                }
            });
        }
    );
};