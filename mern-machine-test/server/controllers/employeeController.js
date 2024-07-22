const Employee = require('../models/Employee');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) return cb(null, true);
    else cb('Error: Images Only!');
}

exports.createEmployee = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(400).json({ msg: err });
        }

        const { name, email, mobile, designation, gender, courses } = req.body;
        try {
            let employee = await Employee.findOne({ email });
            if (employee) {
                console.error('Employee already exists');
                return res.status(400).json({ msg: 'Employee already exists' });
            }

            employee = new Employee({
                image: req.file ? req.file.path : '', // Handle cases where no image is uploaded
                name,
                email,
                mobile,
                designation,
                gender,
                courses: Array.isArray(courses) ? courses : [courses] // Ensure courses is an array
            });
            await employee.save();
            console.log('Employee added successfully');
            res.json({ msg: 'Employee added successfully' });
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).send('Server error');
        }
    });
};



exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ msg: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.updateEmployee = (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ msg: err });

        const { name, email, mobile, designation, gender, courses } = req.body;

        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) return res.status(404).json({ msg: 'Employee not found' });

            // Update fields
            if (req.file) {
                employee.image = req.file.path;
            }
            employee.name = name;
            employee.email = email;
            employee.mobile = mobile;
            employee.designation = designation;
            employee.gender = gender;
            // Ensure courses is always an array
            employee.courses = Array.isArray(courses) ? courses : [];

            await employee.save();
            res.json(employee);
        } catch (err) {
            console.error('Server error:', err);
            res.status(500).send('Server error');
        }
    });
};




exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Employee removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};
