from flask_mail import Message
from extensions import mail # Ye hum Step 4 mein banayenge
from flask import render_template

def send_order_email(user_email, product_name, price):
    try:
        msg = Message(
            subject="Order Confirmed! 🎉 | RetailX",
            sender="adminretailx01@gmail.com",
            recipients=[user_email]
        )

        # Ye hai tera Styled HTML Template
        msg.html = f"""
<div style="background:#f0f4f0;padding:2rem;font-family:'Inter',sans-serif;">
  <div style="max-width:540px;margin:auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #d4e8d4;">

    <div style="background:#0c1a12;padding:36px 40px 28px;position:relative;">
      <p style="font-family:Georgia,serif;font-size:28px;color:#fff;margin:0 0 4px;letter-spacing:0.05em;">RETAIL<span style="color:#059669;">X</span></p>
      <p style="font-size:11px;color:#4a7a5c;margin:0;letter-spacing:0.06em;">Premium Shopping Experience</p>
      <div style="display:inline-flex;align-items:center;gap:6px;background:#059669;color:#fff;font-size:11px;font-weight:500;letter-spacing:0.08em;padding:5px 12px;border-radius:20px;margin-top:14px;">
        <span style="width:6px;height:6px;background:#fff;border-radius:50%;display:inline-block;"></span>
        Order Confirmed
      </div>
    </div>

    <div style="height:3px;background:#059669;"></div>

    <div style="padding:36px 40px 32px;">
      <h2 style="font-family:Georgia,serif;font-size:24px;color:#0c1a12;margin:0 0 10px;">Thank you for your purchase.</h2>
      <p style="font-size:13px;color:#6b7c6e;line-height:1.8;margin:0 0 28px;">Your order has been received and is being carefully prepared. We'll notify you once it's on its way.</p>

      <div style="background:#f6fbf8;border:1px solid #c8e6d0;border-radius:14px;padding:22px 24px;margin-bottom:22px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <p style="font-size:10px;letter-spacing:0.14em;color:#059669;text-transform:uppercase;font-weight:500;margin:0 0 6px;">Your Item</p>
          <p style="font-family:Georgia,serif;font-size:18px;color:#0c1a12;margin:0;">{product_name}</p>
          <p style="font-size:12px;color:#8fa493;margin:5px 0 0;">Qty: 1 &middot; Standard Delivery</p>
        </div>
        <div>
          <p style="font-size:10px;letter-spacing:0.14em;color:#8fa493;text-transform:uppercase;font-weight:500;margin:0 0 4px;text-align:right;">Total</p>
          <p style="font-family:Georgia,serif;font-size:28px;color:#059669;margin:0;font-weight:700;">&#8377;{price}</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:28px;">
        <div style="background:#f9fbf9;border:1px solid #e0ede3;border-radius:10px;padding:14px 12px;">
          <p style="font-size:10px;color:#8fa493;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 5px;">Order ID</p>
          <p style="font-size:13px;color:#0c1a12;margin:0;font-weight:500;">#RX-00847</p>
        </div>
        <div style="background:#f9fbf9;border:1px solid #e0ede3;border-radius:10px;padding:14px 12px;">
          <p style="font-size:10px;color:#8fa493;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 5px;">Delivery</p>
          <p style="font-size:13px;color:#0c1a12;margin:0;font-weight:500;">3&ndash;5 days</p>
        </div>
        <div style="background:#f9fbf9;border:1px solid #e0ede3;border-radius:10px;padding:14px 12px;">
          <p style="font-size:10px;color:#8fa493;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 5px;">Payment</p>
          <p style="font-size:13px;color:#0c1a12;margin:0;font-weight:500;">Paid</p>
        </div>
      </div>

      <a href="http://localhost:3000/dashboard" style="display:block;background:#059669;color:#fff;text-align:center;padding:16px 24px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:500;letter-spacing:0.06em;">
        Track Your Order &rarr;
      </a>
    </div>

    <div style="background:#f0f7f2;padding:18px 40px;border-top:1px solid #dceee1;display:flex;justify-content:space-between;align-items:center;">
      <p style="font-size:11px;color:#8fa493;margin:0;">Questions? <a href="mailto:support@retailx.com" style="color:#059669;text-decoration:none;font-weight:500;">support@retailx.com</a></p>
      <p style="font-size:11px;color:#8fa493;margin:0;">Available 24 &times; 7</p>
    </div>

  </div>
</div>
"""
        
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False