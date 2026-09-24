// Controller for payment processing endpoints
package com.carwash.payment.controller;

import com.carwash.payment.dto.PaymentRequest;
import com.carwash.payment.dto.PaymentResponse;
import com.carwash.payment.entity.Payment;
import com.carwash.payment.exception.PaymentNotFoundException;
import com.carwash.payment.repository.PaymentRepository;
import com.carwash.payment.service.PaymentService;
import com.carwash.payment.service.PdfService;
import com.carwash.payment.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private PdfService pdfService;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/create-checkout-session")
    public ResponseEntity<String> createCheckoutSession(@RequestBody PaymentRequest request, @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7);
            String username = jwtUtil.extractUsername(jwtToken);
            request.setCustomerUsername(username);
            String checkoutUrl = paymentService.createCheckoutSession(request);
            return ResponseEntity.ok(checkoutUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(@RequestParam("session_id") String sessionId) {
        try {
            PaymentResponse response = paymentService.verifyAndCompletePayment(sessionId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/payment-success")
    public String paymentSuccess(@RequestParam("session_id") String sessionId) {
        String displayTxId = (sessionId != null && sessionId.length() > 20) ? sessionId.substring(0, 20) + "..." : (sessionId != null ? sessionId : "");
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>Payment Successful</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.container{background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-width:500px;width:100%;padding:40px;text-align:center;animation:slideUp 0.5s ease}.checkmark{width:80px;height:80px;border-radius:50%;display:block;stroke-width:3;stroke:#4CAF50;stroke-miterlimit:10;margin:20px auto;box-shadow:inset 0 0 0 #4CAF50;animation:fill 0.4s ease-in-out 0.4s forwards,scale 0.3s ease-in-out 0.9s both}.checkmark-circle{stroke-dasharray:166;stroke-dashoffset:166;stroke-width:3;stroke-miterlimit:10;stroke:#4CAF50;fill:none;animation:stroke 0.6s cubic-bezier(0.65,0,0.45,1) forwards}.checkmark-check{transform-origin:50% 50%;stroke-dasharray:48;stroke-dashoffset:48;animation:stroke 0.3s cubic-bezier(0.65,0,0.45,1) 0.8s forwards}@keyframes stroke{100%{stroke-dashoffset:0}}@keyframes scale{0%,100%{transform:none}50%{transform:scale3d(1.1,1.1,1)}}@keyframes fill{100%{box-shadow:inset 0 0 0 30px #4CAF50}}@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}h1{color:#333;font-size:28px;margin:20px 0 10px;font-weight:600}.success-text{color:#4CAF50;font-size:18px;margin-bottom:30px;font-weight:500}.details{background:#f8f9fa;border-radius:12px;padding:20px;margin:20px 0;text-align:left}.detail-row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #e0e0e0}.detail-row:last-child{border-bottom:none}.detail-label{color:#666;font-size:14px;font-weight:500}.detail-value{color:#333;font-size:14px;font-weight:600;word-break:break-all}.btn{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;border:none;padding:14px 30px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-block;margin-top:20px;transition:transform 0.2s,box-shadow 0.2s}.btn:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(102,126,234,0.3)}.footer{margin-top:20px;color:#999;font-size:12px}</style></head><body><div class='container'><svg class='checkmark' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'><circle class='checkmark-circle' cx='26' cy='26' r='25' fill='none'/><path class='checkmark-check' fill='none' d='M14.1 27.2l7.1 7.2 16.7-16.8'/></svg><h1>Payment Successful!</h1><p class='success-text'>Your transaction has been completed</p><div class='details'><div class='detail-row'><span class='detail-label'>Transaction ID</span><span class='detail-value'>" + displayTxId + "</span></div><div class='detail-row'><span class='detail-label'>Status</span><span class='detail-value' style='color:#4CAF50'>Completed</span></div><div class='detail-row'><span class='detail-label'>Payment Method</span><span class='detail-value'>Stripe</span></div></div><a href='http://localhost:8080' class='btn'>Back to Home</a><p class='footer'>Thank you for using Car Wash Service</p></div></body></html>";
    }
    
    @GetMapping("/payment-cancel")
    public String paymentCancel() {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>Payment Cancelled</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.container{background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-width:500px;width:100%;padding:40px;text-align:center;animation:slideUp 0.5s ease}@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}.cross{width:80px;height:80px;border-radius:50%;display:block;stroke-width:3;stroke:#f44336;stroke-miterlimit:10;margin:20px auto;background:#fff;position:relative}.cross-line{position:absolute;width:50px;height:3px;background:#f44336;top:50%;left:50%;transform-origin:center}.cross-line:first-child{transform:translate(-50%,-50%) rotate(45deg)}.cross-line:last-child{transform:translate(-50%,-50%) rotate(-45deg)}h1{color:#333;font-size:28px;margin:20px 0 10px;font-weight:600}.cancel-text{color:#f44336;font-size:18px;margin-bottom:30px;font-weight:500}.message{color:#666;font-size:14px;line-height:1.6;margin:20px 0}.btn{background:linear-gradient(135deg,#f093fb 0%,#f5576c 100%);color:#fff;border:none;padding:14px 30px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-block;margin-top:20px;transition:transform 0.2s,box-shadow 0.2s}.btn:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(245,87,108,0.3)}</style></head><body><div class='container'><div class='cross'><div class='cross-line'></div><div class='cross-line'></div></div><h1>Payment Cancelled</h1><p class='cancel-text'>Your transaction was not completed</p><p class='message'>Your payment has been cancelled. No charges have been made to your account.</p><a href='http://localhost:8080' class='btn'>Try Again</a></div></body></html>";
    }
    
    @GetMapping("/payment-failed")
    public String paymentFailed(@RequestParam(value = "reason", defaultValue = "Unknown error") String reason) {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>Payment Failed</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;background:linear-gradient(135deg,#fc4a1a 0%,#f7b733 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.container{background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-width:500px;width:100%;padding:40px;text-align:center;animation:slideUp 0.5s ease}@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}.warning{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:20px auto;background:#ff9800;color:#fff;font-size:48px;font-weight:bold;animation:pulse 2s infinite}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}h1{color:#333;font-size:28px;margin:20px 0 10px;font-weight:600}.failed-text{color:#ff9800;font-size:18px;margin-bottom:30px;font-weight:500}.details{background:#fff3e0;border-radius:12px;padding:20px;margin:20px 0;text-align:left;border-left:4px solid #ff9800}.detail-row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #ffe0b2}.detail-row:last-child{border-bottom:none}.detail-label{color:#666;font-size:14px;font-weight:500}.detail-value{color:#333;font-size:14px;font-weight:600}.message{color:#666;font-size:14px;line-height:1.6;margin:20px 0}.btn{background:linear-gradient(135deg,#fc4a1a 0%,#f7b733 100%);color:#fff;border:none;padding:14px 30px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-block;margin-top:20px;transition:transform 0.2s,box-shadow 0.2s}.btn:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(252,74,26,0.3)}</style></head><body><div class='container'><div class='warning'>!</div><h1>Payment Failed</h1><p class='failed-text'>Transaction could not be processed</p><div class='details'><div class='detail-row'><span class='detail-label'>Status</span><span class='detail-value' style='color:#ff9800'>Failed</span></div><div class='detail-row'><span class='detail-label'>Reason</span><span class='detail-value'>" + reason + "</span></div></div><p class='message'>Your payment was declined. Please check your payment details and try again.</p><a href='http://localhost:8080' class='btn'>Try Again</a></div></body></html>";
    }
    
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        paymentService.handleWebhook(payload, sigHeader);
        return ResponseEntity.ok("Webhook received");
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(@PathVariable Long orderId) {
        try {
            PaymentResponse response = paymentService.getPaymentByOrderId(orderId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/customer")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByCustomer(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        String username = jwtUtil.extractUsername(jwtToken);
        List<PaymentResponse> payments = paymentService.getPaymentsByCustomer(username);
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/client-secret")
    public ResponseEntity<String> createPaymentIntent(@RequestParam java.math.BigDecimal amount) {
        try {
            String clientSecret = paymentService.createPaymentIntent(amount);
            return ResponseEntity.ok(clientSecret);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/refund/order/{orderId}")
    public ResponseEntity<PaymentResponse> refundByOrderId(@PathVariable Long orderId) {
        try {
            PaymentResponse response = paymentService.refundByOrderId(orderId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<PaymentResponse> refundPayment(@PathVariable Long paymentId) {
        try {
            PaymentResponse response = paymentService.refundPayment(paymentId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{paymentId}/receipt")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long paymentId) {
        try {
            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new PaymentNotFoundException("Payment not found"));
            
            byte[] pdfBytes = pdfService.generateReceipt(payment);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "receipt_" + paymentId + ".pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (PaymentNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
