const asyncHandler = require("express-async-handler")
const Report = require("../models/report");


//@desc Submit report request
//@routes POST api/report/submit
//@access private isUser
const submitReport = asyncHandler(async (req, res) => {

    const { title, desc, location, category, subcategory } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    };

    if (!title || !desc || !location) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const report = await Report.create({
        title,
        desc,
        location,
        imagePath,
        category,
        subcategory,
        status: "Pending",
        resolvedAt: null,
        ngo_resolved: null,
        user_id: req.user.role? req.user.id : req.user.user.id,
    });

    if (report) {
        console.log("Report Submitted Successfully");
        res.status(201).json({ _id: report.id, title: report.title, imagePath });
    } else {
        res.status(400);
        throw new Error("Report Submission Unsuccessful");
    }
});



//@desc Get all the report by NGO
//@routes POST api/report/fetch
//@access private isNGO
const allReports = asyncHandler( async (req, res) => {
    if (req.user.role !== "ngo") {
        res.status(403);
        throw new Error("Access denied. Only NGOs can fetch reports.");
    }

    const reports = await Report.find({ category: req.user.category });
    
    if (!reports || reports.length === 0) {
        res.status(404);
        throw new Error("No reports found.");
    }

    res.status(200).json(reports);
});

//@desc Get all the request made by user
//@routes POST api/report/user
//@access private isUser
const userReports = asyncHandler( async (req, res) => {
    console.log(req.user);
    const userId = req.user.user.id;

    if (!userId) {
        res.status(400);
        throw new Error("User ID is required");
    }

    const reports = await Report.find({ user_id: userId });

    if (reports.length === 0) {
        res.status(404);
        throw new Error("No reports found for this user");
    }

    res.status(200).json(reports);

});

//@desc Update status of the report
//@routes PATCH api/report/:id/accept
//@access private isNGO
const updateStatus = asyncHandler( async(req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (req.user.role !== "ngo") {
            res.status(403);
            throw new Error("Access denied. Only NGOs can update resolve status.");
        }

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        report.status = "Accepted";
        report.ngo_resolved = req.user.id;
        await report.save();

        res.status(200).json({ message: "Report marked as resolved", report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   
);


//@desc update the issue as resolved
//@route PATCH api/report/:id/resolve
//@access private isNGO
const updateResolved = asyncHandler( async(req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (req.user.role !== "ngo") {
            res.status(403);
            throw new Error("Access denied. Only NGOs can update resolve status.");
        }

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        report.resolvedAt = new Date();
        report.status = "Resolved";
        report.ngo_resolved = req.user.id;
        await report.save();

        res.status(200).json({ message: "Report marked as resolved", report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = { submitReport, allReports, userReports, updateResolved, updateStatus };