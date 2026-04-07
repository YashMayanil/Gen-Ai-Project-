const pdfParse = require("pdf-parse")
const mammoth = require("mammoth")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res, next) {

    try {
        let resumeText = ""
        if (req.file && req.file.buffer) {
            console.log("Resume received:", req.file.originalname, req.file.mimetype, req.file.size)
            try {
                if (req.file.mimetype === "application/pdf") {
                    const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
                    resumeText = parsed.text
                } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    const parsed = await mammoth.extractRawText({ buffer: req.file.buffer })
                    resumeText = parsed.value
                } else {
                    return res.status(400).json({
                        message: "Only PDF or DOCX resume files are supported"
                    })
                }
            } catch (parseError) {
                console.error("Resume parse failed:", parseError)
                return res.status(400).json({
                    message: "Unable to parse resume file. Please upload a valid PDF or DOCX file."
                })
            }
        }

        const { selfDescription, jobDescription } = req.body
        console.log("Interview request body:", { selfDescription, jobDescription })

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required"
            })
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({
                message: "Resume or self description is required"
            })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const titleFromAi = interViewReportByAi?.title?.trim();
        const title = titleFromAi || jobDescription?.split("\n")[0]?.trim() || "Interview Report"
        const {
            matchScore = 0,
            technicalQuestions = [],
            behavioralQuestions = [],
            skillGaps = [],
            preparationPlan = []
        } = interViewReportByAi || {}

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            title,
            matchScore,
            technicalQuestions,
            behavioralQuestions,
            skillGaps,
            preparationPlan
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Interview generation error:", error)
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Interview report validation failed.",
                errors: error.errors
            })
        }
        next(error)
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }