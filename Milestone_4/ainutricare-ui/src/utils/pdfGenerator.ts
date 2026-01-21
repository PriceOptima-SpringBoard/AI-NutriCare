import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PlanDietResponse } from '../types';

export const generatePDF = (data: PlanDietResponse, userInfo: { name: string; email: string }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    let yPos = 20;

    // --- Header ---
    // Brand Color Strip
    doc.setFillColor(6, 182, 212); // Cypress/Teal-ish (matches app primary)
    doc.rect(0, 0, pageWidth, 5, 'F');

    doc.setFontSize(22);
    doc.setTextColor(33, 33, 33);
    doc.setFont('helvetica', 'bold');
    doc.text('AI-NutriCare', margin, yPos);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Clinical Nutrition Intelligence Platform', margin, yPos + 6);

    // Date and User Info
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, yPos, { align: 'right' });
    doc.text(`Patient: ${userInfo.name}`, pageWidth - margin, yPos + 6, { align: 'right' });
    doc.text(`Email: ${userInfo.email}`, pageWidth - margin, yPos + 12, { align: 'right' });

    yPos += 25;

    // --- Title ---
    doc.setFontSize(16);
    doc.setTextColor(6, 182, 212);
    doc.setFont('helvetica', 'bold');
    doc.text('Clinical Analysis & Diet Plan', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // --- Clinical Summary Section ---
    doc.setFillColor(240, 253, 250); // Light teal bg
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 35, 3, 3, 'F');

    doc.setFontSize(12);
    doc.setTextColor(13, 148, 136); // Darker teal
    doc.text('Clinical Summary', margin + 5, yPos + 10);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(data.clinical.summary, pageWidth - (margin * 2) - 10);
    doc.text(summaryLines, margin + 5, yPos + 18);

    yPos += 45;

    // --- Risk & Biomarkers ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 33, 33);
    doc.text('Patient Metrics & Risk Assessment', margin, yPos);
    yPos += 5;

    const metricsData = [
        ['Risk Level', `${(data.clinical.patient_metrics.mortality_risk * 100).toFixed(1)}% (Mortality/ICU Risk)`],
        ['Glucose', `${data.clinical.patient_metrics.glucose} mg/dL`],
        ['Creatinine', `${data.clinical.patient_metrics.creatinine} mg/dL`],
    ];

    autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: metricsData,
        theme: 'striped',
        headStyles: { fillColor: [6, 182, 212] },
        margin: { left: margin, right: margin },
    });

    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 15;

    // --- Conditions & Reasoning ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Medical Reasoning & Conditions', margin, yPos);
    yPos += 5;

    const reasoningLines = doc.splitTextToSize(data.diet.medical_reasoning, pageWidth - (margin * 2));
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(reasoningLines, margin, yPos + 5);

    yPos += (reasoningLines.length * 5) + 15;

    // Check if we need a new page for Diet Plan
    if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = 20;
    }

    // --- 7-Day Diet Plan ---
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 182, 212);
    doc.text('7-Day Personalized Diet Plan', margin, yPos);
    yPos += 10;

    const days = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];
    const tableBody: any[] = [];

    days.forEach((dayKey, index) => {
        // @ts-ignore
        const dayPlan = data.diet.week_plan[dayKey];
        if (dayPlan) {
            // Grouping day rows
            tableBody.push([{ content: `Day ${index + 1}`, colSpan: 4, styles: { fillColor: [220, 252, 231], fontStyle: 'bold', textColor: [22, 101, 52] } }]);

            const meals = [
                { name: 'Breakfast', items: dayPlan.breakfast },
                { name: 'Lunch', items: dayPlan.lunch },
                { name: 'Snacks', items: dayPlan.snacks },
                { name: 'Dinner', items: dayPlan.dinner },
            ];

            meals.forEach(meal => {
                const itemsText = meal.items.map((item: any) =>
                    `${item.item} (${item.calories} kcal)`
                ).join('\n');

                tableBody.push([
                    meal.name,
                    itemsText,
                    // Calculate total cals for this meal slot roughly if needed, otherwise just list items
                    meal.items.reduce((acc: number, item: any) => acc + item.calories, 0) + ' kcal',
                    meal.items.reduce((acc: number, item: any) => acc + item.protein, 0).toFixed(1) + 'g'
                ]);
            });
        }
    });

    autoTable(doc, {
        startY: yPos,
        head: [['Meal Time', 'Recommended Items', 'Calories', 'Protein']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [6, 182, 212] },
        columnStyles: {
            0: { cellWidth: 30, fontStyle: 'bold' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 25 },
            3: { cellWidth: 25 }
        },
        margin: { left: margin, right: margin },
        didParseCell: function (data: any) {
            if (data.row.raw[0] && typeof data.row.raw[0] === 'object') {
                // Header row for the day
            }
        }
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} - Generated by AI-NutriCare`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    doc.save(`AI-NutriCare_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
