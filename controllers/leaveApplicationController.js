const application = require('./../models/leaveApplicationModels')
const multer = require('multer')
const nodemailer = require("nodemailer")

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'views/img/applications')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `application-obj-${Date.now()}.${ext}`)
    }
})

const upload = multer({
    storage: multerStorage,
    fileFilter: (req, file, cb) => {
        // Validate file types (e.g., accept only .doc, .docx, .pdf)
        if (file.mimetype === 'application/msword' || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Please upload a word or PDF document.', 400), false);
        }
    },
});

exports.application_file = upload.single('file');

exports.getAllApplication = async (req, res, next) => {
    try {
        const applications = await application.find()
        res.status(200).json({
            status: 'success',
            results: applications.length,
            data: {
                applications,
            },
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Invalid data sent!',
        })
    }
}

exports.createApplication = async (req, res) => {
    try {
        const { leaveCategory } = req.body;

        // Check if the 'leaveCategory' is 'longTerm' or 'travel' and a file is uploaded
        if ((leaveCategory === 'longTerm' || leaveCategory === 'travel') && req.file) {
            // Handle the file upload and st ore the file path in the 'file' field
            req.body.file = req.file.path; // Assuming req.file.path contains the file path
        }

        // Create a new LeaveApplication instance
        const newApplication = await application.create(req.body);

        res.status(200).json({
            status: 'success',
            data: {
                application: newApplication,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.getApplication = async (req, res) => {
    try {
        const applications = await application.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            results: applications.length,
            data: {
                applications,
            },
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getApplicationByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const applications = await application.find({ user: userId });

        res.status(200).json({
            status: 'success',
            results: applications.length,
            data: {
                applications,
            }
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.updateApplication = async (req, res) => {
    try {
        const applications = await application.findById(req.params.id);
        const mail = req.body.email;
        if (!applications) {
            return res.status(404).json({ error: 'Leave application not found' });
        }

        // Check if the status is "pending"
        if (applications.status === 'pending') {
            let transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                port: 465,
                secure: true,
                auth: {
                    user: "dalaix@zohomail.com",
                    pass: "tKV6TjUQKkq$Y6x"
                }
            })
            let approvedMessage = {
                from: "dalaix@zohomail.com",
                to: mail,
                subject: "Application Status Update",
                text: "Your application has been approved"
            }
            let rejectedMessage = {
                from: "dalaix@zohomail.com",
                to: mail,
                subject: "Application Status Update",
                text: "Your application has been rejected"
            }
            if (req.body.status === "approved") {
                transporter.sendMail(approvedMessage).then(async () => {
                    const updatedApplication = await application.findByIdAndUpdate(req.params.id, req.body, { new: true });
                    return res.json({ data: updatedApplication, status: 'success' });
                }).catch(err => {
                    return res.status(500).json({ err })
                })
            }
            if (req.body.status === "rejected") {
                transporter.sendMail(rejectedMessage).then(async () => {
                    const updatedApplication = await application.findByIdAndUpdate(req.params.id, req.body, { new: true });
                    return res.json({ data: updatedApplication, status: 'success' });
                }).catch(err => {
                    return res.status(500).json({ err })
                })
            }

            // Allow the update if the status is "pending"
        } else {
            // If not "pending," prevent the update
            return res.status(403).json({ error: 'Cannot edit a non-pending leave application' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



exports.deleteApplication = async (req, res) => {
    try {
        const applications = await application.findById(req.params.id);

        if (!applications) {
            return res.status(404).json({ error: 'Leave Application not found' })
        }

        if (applications.status === 'pending' || application.status === 'rejected') {
            // Delete the leave application if it's in a "pending" or "rejected" status
            await application.findByIdAndRemove(req.params.id);
            // return res.status(204).send();
            return res.status(200).json({ status: 'success', message: 'Leave Application deleted successfully' });
        } else {
            // If not Pending, return an error
            return res.status(403).json({ error: 'Cannot delete an approved leave application' });
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        })
    }
}


