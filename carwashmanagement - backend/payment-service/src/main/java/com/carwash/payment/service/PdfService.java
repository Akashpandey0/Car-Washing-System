package com.carwash.payment.service;

import com.carwash.payment.entity.Payment;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {
    
    public byte[] generateReceipt(Payment payment) throws IOException {
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);
        
        PDPageContentStream cs = new PDPageContentStream(document, page);
        float yPosition = 750;
        
        // Company Header with Blue Background
        cs.setNonStrokingColor(new Color(41, 128, 185));
        cs.addRect(0, 760, 612, 72);
        cs.fill();
        
        // Company Name
        cs.beginText();
        cs.setNonStrokingColor(Color.WHITE);
        cs.setFont(PDType1Font.HELVETICA_BOLD, 24);
        cs.newLineAtOffset(50, 795);
        cs.showText("PREMIUM CAR WASH");
        cs.endText();
        
        // Company Tagline
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA, 10);
        cs.newLineAtOffset(50, 778);
        cs.showText("Professional Auto Detailing Services");
        cs.endText();
        
        // Company Contact Info
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA, 9);
        cs.newLineAtOffset(50, 765);
        cs.showText("123 Main Street, City, State 12345 | Phone: (555) 123-4567 | Email: info@carwash.com");
        cs.endText();
        
        cs.setNonStrokingColor(Color.BLACK);
        yPosition = 720;
        
        // Invoice Title
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA_BOLD, 20);
        cs.newLineAtOffset(50, yPosition);
        cs.showText("INVOICE");
        cs.endText();
        
        yPosition -= 30;
        
        // Invoice Details Box
        cs.setStrokingColor(new Color(200, 200, 200));
        cs.addRect(380, yPosition - 50, 180, 60);
        cs.stroke();
        
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA_BOLD, 10);
        cs.newLineAtOffset(390, yPosition - 10);
        cs.showText("Invoice #: INV-" + String.format("%06d", payment.getId()));
        cs.newLineAtOffset(0, -15);
        cs.showText("Date: " + payment.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
        cs.newLineAtOffset(0, -15);
        cs.showText("Order #: ORD-" + String.format("%06d", payment.getOrderId()));
        cs.endText();
        
        yPosition -= 70;
        
        // Bill To Section
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA_BOLD, 12);
        cs.newLineAtOffset(50, yPosition);
        cs.showText("BILL TO:");
        cs.endText();
        
        yPosition -= 20;
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA, 11);
        cs.newLineAtOffset(50, yPosition);
        cs.showText(payment.getCustomerUsername());
        cs.newLineAtOffset(0, -15);
        cs.showText("Customer ID: CUST-" + payment.getCustomerUsername().toUpperCase());
        cs.endText();
        
        yPosition -= 50;
        
        // Table Header
        cs.setNonStrokingColor(new Color(52, 73, 94));
        cs.addRect(50, yPosition - 5, 510, 25);
        cs.fill();
        
        cs.beginText();
        cs.setNonStrokingColor(Color.WHITE);
        cs.setFont(PDType1Font.HELVETICA_BOLD, 11);
        cs.newLineAtOffset(60, yPosition + 5);
        cs.showText("DESCRIPTION");
        cs.newLineAtOffset(280, 0);
        cs.showText("QTY");
        cs.newLineAtOffset(80, 0);
        cs.showText("AMOUNT");
        cs.endText();
        
        cs.setNonStrokingColor(Color.BLACK);
        yPosition -= 30;
        
        // Service Item
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA, 11);
        cs.newLineAtOffset(60, yPosition);
        String serviceType = payment.getServiceType() != null ? payment.getServiceType() : "Car Wash Service";
        cs.showText(serviceType.replace("_", " "));
        cs.newLineAtOffset(280, 0);
        cs.showText("1");
        cs.newLineAtOffset(80, 0);
        cs.showText("$" + payment.getAmount().toString());
        cs.endText();
        
        yPosition -= 20;
        
        // Horizontal Line
        cs.setStrokingColor(new Color(200, 200, 200));
        cs.moveTo(50, yPosition);
        cs.lineTo(560, yPosition);
        cs.stroke();
        
        yPosition -= 30;
        
        // Subtotal
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA, 11);
        cs.newLineAtOffset(400, yPosition);
        cs.showText("Subtotal:");
        cs.newLineAtOffset(80, 0);
        cs.showText("$" + payment.getAmount().toString());
        cs.endText();
        
        yPosition -= 20;
        
        // Tax (0%)
        BigDecimal tax = BigDecimal.ZERO;
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA, 11);
        cs.newLineAtOffset(400, yPosition);
        cs.showText("Tax (0%):");
        cs.newLineAtOffset(80, 0);
        cs.showText("$" + tax.toString());
        cs.endText();
        
        yPosition -= 25;
        
        // Total with Background
        cs.setNonStrokingColor(new Color(46, 204, 113));
        cs.addRect(380, yPosition - 5, 180, 25);
        cs.fill();
        
        cs.beginText();
        cs.setNonStrokingColor(Color.WHITE);
        cs.setFont(PDType1Font.HELVETICA_BOLD, 13);
        cs.newLineAtOffset(400, yPosition + 5);
        cs.showText("TOTAL:");
        cs.newLineAtOffset(80, 0);
        cs.showText("$" + payment.getAmount().toString());
        cs.endText();
        
        cs.setNonStrokingColor(Color.BLACK);
        yPosition -= 50;
        
        // Payment Information
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA_BOLD, 12);
        cs.newLineAtOffset(50, yPosition);
        cs.showText("PAYMENT INFORMATION");
        cs.endText();
        
        yPosition -= 20;
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA, 10);
        cs.newLineAtOffset(50, yPosition);
        cs.showText("Payment Method: " + (payment.getPaymentMethod() != null ? payment.getPaymentMethod() : "Stripe"));
        cs.newLineAtOffset(0, -15);
        cs.showText("Transaction ID: " + (payment.getTransactionId() != null ? payment.getTransactionId() : "N/A"));
        cs.newLineAtOffset(0, -15);
        cs.showText("Payment Status: " + payment.getStatus().toString());
        cs.newLineAtOffset(0, -15);
        cs.showText("Payment Date: " + payment.getCreatedAt().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")));
        cs.endText();
        
        // Footer
        cs.setStrokingColor(new Color(41, 128, 185));
        cs.moveTo(50, 80);
        cs.lineTo(560, 80);
        cs.stroke();
        
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA_BOLD, 10);
        cs.newLineAtOffset(50, 60);
        cs.showText("Thank you for your business!");
        cs.endText();
        
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA, 8);
        cs.setNonStrokingColor(new Color(100, 100, 100));
        cs.newLineAtOffset(50, 45);
        cs.showText("This is a computer-generated invoice. For any queries, please contact us at support@carwash.com");
        cs.endText();
        
        cs.close();
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        document.save(baos);
        document.close();
        
        return baos.toByteArray();
    }
}
