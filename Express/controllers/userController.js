const fs = require('fs');

const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));

exports.getAllUsers = (req, res) => {
    res.status(200).json({
        status : 'success',
        result : users.length,
        time   : req.requestTime,
        data : {
            users : users
        } 
    });
};

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