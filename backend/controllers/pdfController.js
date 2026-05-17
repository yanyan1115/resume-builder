const jsPDF = require('jspdf');
const path = require('path');

// 生成PDF的函数
const generatePDF = (resumeData) => {
    const doc = new jsPDF();

    // 添加简历内容到PDF
    doc.setFontSize(20);
    doc.text(resumeData.name, 10, 10);
    doc.setFontSize(12);
    doc.text(`Email: ${resumeData.email}`, 10, 20);
    doc.text(`Phone: ${resumeData.phone}`, 10, 30);
    // 可以继续添加更多内容

    // 保存PDF到文件系统
    const filePath = path.join(__dirname, 'uploads', 'resume.pdf');
    doc.save(filePath);
    return filePath;
};

// 控制器的处理函数
const createResumePDF = (req, res) => {
    const resumeData = req.body;  // 假设数据从请求体中获取
    const filePath = generatePDF(resumeData);

    // 返回文件下载链接
    res.download(filePath, 'resume.pdf', (err) => {
        if (err) {
            console.log("Error while downloading PDF:", err);
            res.status(500).send('Error generating PDF');
        }
    });
};

module.exports = {
    createResumePDF
};
