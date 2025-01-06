import React from "react";
import { jsPDF } from "jspdf";
import "../Roboto-Regular-normal.js"; // Import file font nếu có

const ContractPDF = ({
    idhopdong,
    ngaytao,
    hovaten,
    ngaysinh,
    cccd,
    sodienthoai,
    sogplx,
    tenhangxe,
    tendongxe,
    biensoxe,
    thoigianbatdau,
    thoigianketthuc,
    songaythue,
    sogiothue,
    giathuemotngay,
    phutroithoigian,
    sokmgioihan,
    phutroiquangduong,
    giathuetong,
    tiendatcoc,
}) => {
    const formatDateTime = (datetime) => {
        const options = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };
        return new Date(datetime).toLocaleString("vi-VN", options);
    };

    const generateContractPDF = () => {
        const doc = new jsPDF("p", "mm", "a4");

        // Add custom font nếu có
        doc.addFont("Roboto-Regular-normal.ttf", "Roboto", "normal");
        doc.setFont("Roboto", "normal");

        // Title
        doc.setFontSize(16);
        doc.text("HỢP ĐỒNG THUÊ XE", 105, 20, { align: "center" });

        // Metadata
        doc.setFontSize(12);
        doc.text(`Số hợp đồng: ${idhopdong}`, 10, 30);
        doc.text(`Ngày lập: ${formatDateTime(ngaytao)}`, 150, 30);

        // Separator
        doc.line(10, 35, 200, 35);

        // Section: Khách thuê
        doc.setFontSize(14);
        doc.text("THÔNG TIN KHÁCH THUÊ", 10, 45);

        doc.setFontSize(12);
        doc.text(`Họ và tên: ${hovaten}`, 10, 55);
        doc.text(`Ngày sinh: ${(ngaysinh)}`, 10, 60);
        doc.text(`Căn cước công dân: ${cccd || ""}`, 10, 65);
        doc.text(`Số điện thoại: ${sodienthoai}`, 10, 70);
        doc.text(`Số giấy phép lái xe: ${sogplx}`, 10, 75);

        // Section: Xe thuê
        doc.setFontSize(14);
        doc.text("THÔNG TIN XE THUÊ", 10, 85);

        doc.setFontSize(12);
        doc.text(`Tên xe: ${tenhangxe} ${tendongxe}`, 10, 95);
        doc.text(`Biển số: ${biensoxe}`, 10, 100);

        // Section: Nội dung thuê
        doc.setFontSize(14);
        doc.text("NỘI DUNG THUÊ", 10, 110);

        doc.setFontSize(12);
        doc.text(`Thời gian bắt đầu: ${formatDateTime(thoigianbatdau)}`, 10, 120);
        doc.text(`Thời gian kết thúc: ${formatDateTime(thoigianketthuc)}`, 10, 125);
        doc.text(`Số ngày thuê: ${songaythue} ngày`, 10, 130);
        doc.text(`Số giờ thuê: ${sogiothue} giờ`, 10, 135);
        doc.text(`Giá thuê một ngày: ${giathuemotngay.toLocaleString()} VNĐ`, 10, 140);
        doc.text(`Giá thuê theo giờ: ${phutroithoigian.toLocaleString()} VNĐ`, 10, 145);
        doc.text(`Phụ trội theo giờ: ${phutroithoigian.toLocaleString()} VNĐ`, 10, 150);
        doc.text(`Số km giới hạn: ${sokmgioihan} km/ngày`, 10, 155);
        doc.text(`Phụ trội quãng đường: ${phutroiquangduong.toLocaleString()} VNĐ/km`, 10, 160);
        doc.text(`Giá thuê tổng: ${giathuetong.toLocaleString()} VNĐ`, 10, 165);
        doc.text(`Tiền đặt cọc: ${tiendatcoc.toLocaleString()} VNĐ`, 10, 170);

        // Separator
        doc.line(10, 175, 200, 175);

        // Footer: Ký tên
        doc.setFontSize(12);
        doc.text("BÊN A (Bên cho thuê)", 10, 185);
        doc.text("BÊN B (Bên thuê)", 150, 185);

        doc.text("_____________________", 10, 200);
        doc.text("_____________________", 150, 200);

        // Save PDF
        doc.save("hopdong_thuexe.pdf");
    };

    return (
        <div>
            <button className="p-2 bg-slate-300 rounded hover:bg-slate-200" onClick={generateContractPDF}>Tải xuống hợp đồng</button>
        </div>
    );
};

export default ContractPDF;