const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service.js")
const interviewModel = require("../models/interviewReport.model.js")


async function generateInterviewReportController(req,res){
    const resumeFile = req.file

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const {selfDescription,jobDescription} = req.body;

    const interviewReportByAi = await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = interviewModel.create({
        user:req.user.id,
        resume:resumeContent,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message:"Interview Report generated succesfully"
    })
}

module.exports={
    generateInterviewReportController
}