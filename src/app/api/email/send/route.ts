import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type EmailType = "welcome" | "order-confirmed" | "order-dispatched" | "order-shipped" | "order-delivered" | "password-reset" | "cart-reminder";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function getEmailContent(type: EmailType, data: any) {
  const baseStyle = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #f9fafb; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #2C3E50; margin: 0;">The House Of Gnapakam</h2>
        <p style="color: #89C4E1; font-size: 12px; margin-top: 4px;">Handcrafted Gifts, Delivered With Love</p>
      </div>
  `;
  const footer = `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px;">Need help? Call or WhatsApp us at +91 9346630240</p>
        <p style="color: #9ca3af; font-size: 12px;">Follow us on <a href="https://www.instagram.com/the_house_of_gnapakam" style="color: #5EAED4;">Instagram</a></p>
      </div>
    </div>
  `;

  switch (type) {
    case "welcome":
      return {
        subject: "Welcome to The House Of Gnapakam! 🌸",
        html: `${baseStyle}
          <div style="background: white; border-radius: 12px; padding: 24px; text-align: center;">
            <h1 style="color: #2C3E50; font-size: 24px;">Welcome! 🎉</h1>
            <p style="color: #555; line-height: 1.6;">Thank you for creating an account with The House Of Gnapakam!</p>
            <div style="background: #f0f9ff; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: left;">
              <p style="margin: 4px 0; color: #333;"><strong>Email:</strong> ${data.email}</p>
              <p style="margin: 4px 0; color: #333;"><strong>Password:</strong> ${data.password}</p>
            </div>
            <p style="color: #888; font-size: 13px;">Please keep these credentials safe. You can use them to login anytime.</p>
            <a href="http://localhost:3000" style="display: inline-block; margin-top: 16px; padding: 12px 32px; background: linear-gradient(to right, #89C4E1, #F8C8DC); color: white; text-decoration: none; border-radius: 25px; font-weight: bold;">Start Shopping</a>
          </div>
          ${footer}`,
      };

    case "order-confirmed":
      return {
        subject: `Order Confirmed! 📋 #${data.orderId?.slice(-8).toUpperCase()}`,
        html: `${baseStyle}
          <div style="background: white; border-radius: 12px; padding: 24px;">
            <h1 style="color: #2C3E50; font-size: 22px; text-align: center;">Order Confirmed! ✅</h1>
            <p style="color: #555; text-align: center;">Thank you ${data.customerName}! Your order has been confirmed.</p>
            
            <div style="background: #f0f9ff; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 4px 0; font-size: 13px; color: #666;"><strong>Order ID:</strong> #${data.orderId?.slice(-8).toUpperCase()}</p>
              <p style="margin: 4px 0; font-size: 13px; color: #666;"><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              <p style="margin: 4px 0; font-size: 13px; color: #666;"><strong>Payment:</strong> ${data.paymentMethod === "online" ? "Paid Online" : "Cash on Delivery"}</p>
            </div>

            <h3 style="color: #2C3E50; font-size: 16px; margin-top: 20px;">Items Ordered:</h3>
            ${data.items?.map((item: any) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                <span style="color: #333; font-size: 14px;">${item.name} × ${item.quantity}</span>
                <span style="color: #333; font-size: 14px; font-weight: bold;">₹${item.price * item.quantity}</span>
              </div>
            `).join("") || ""}
            
            <div style="display: flex; justify-content: space-between; padding: 12px 0; margin-top: 8px; border-top: 2px solid #e5e7eb;">
              <span style="color: #2C3E50; font-weight: bold;">Total</span>
              <span style="color: #5EAED4; font-weight: bold; font-size: 18px;">₹${data.totalAmount}</span>
            </div>

            <div style="background: #f9fafb; border-radius: 8px; padding: 12px; margin-top: 16px;">
              <p style="margin: 0; font-size: 13px; color: #666;"><strong>Delivery to:</strong></p>
              <p style="margin: 4px 0; font-size: 13px; color: #333;">${data.address}, ${data.city} - ${data.pincode}</p>
            </div>
          </div>
          ${footer}`,
      };

    case "order-dispatched":
      return {
        subject: `Order Dispatched! 📦 #${data.orderId?.slice(-8).toUpperCase()}`,
        html: `${baseStyle}
          <div style="background: white; border-radius: 12px; padding: 24px; text-align: center;">
            <h1 style="color: #2C3E50; font-size: 22px;">Order Dispatched! 📦</h1>
            <p style="color: #555;">Hi ${data.customerName}, your order is being prepared and will be dispatched soon.</p>
            <div style="background: #fff7ed; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 4px 0; font-size: 14px; color: #333;"><strong>Order ID:</strong> #${data.orderId?.slice(-8).toUpperCase()}</p>
              <p style="margin: 4px 0; font-size: 14px; color: #333;"><strong>Status:</strong> Processing & Packing</p>
            </div>
            <p style="color: #888; font-size: 13px;">We'll notify you once it's shipped!</p>
          </div>
          ${footer}`,
      };

    case "order-shipped":
      return {
        subject: `Order Shipped! 🚚 #${data.orderId?.slice(-8).toUpperCase()}`,
        html: `${baseStyle}
          <div style="background: white; border-radius: 12px; padding: 24px; text-align: center;">
            <h1 style="color: #2C3E50; font-size: 22px;">Order Shipped! 🚚</h1>
            <p style="color: #555;">Hi ${data.customerName}, your order is on its way!</p>
            <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 4px 0; font-size: 14px; color: #333;"><strong>Order ID:</strong> #${data.orderId?.slice(-8).toUpperCase()}</p>
              <p style="margin: 4px 0; font-size: 14px; color: #333;"><strong>Status:</strong> Shipped & In Transit</p>
              <p style="margin: 4px 0; font-size: 14px; color: #333;"><strong>Delivery to:</strong> ${data.city} - ${data.pincode}</p>
            </div>
            <p style="color: #888; font-size: 13px;">Your package will arrive soon!</p>
          </div>
          ${footer}`,
      };

    case "order-delivered":
      return {
        subject: `Order Delivered! 🎉 #${data.orderId?.slice(-8).toUpperCase()}`,
        html: `${baseStyle}
          <div style="background: white; border-radius: 12px; padding: 24px; text-align: center;">
            <h1 style="color: #2C3E50; font-size: 22px;">Order Delivered! 🎉</h1>
            <p style="color: #555;">Hi ${data.customerName}, your order has been delivered successfully!</p>
            <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 4px 0; font-size: 14px; color: #333;"><strong>Order ID:</strong> #${data.orderId?.slice(-8).toUpperCase()}</p>
              <p style="margin: 4px 0; font-size: 14px; color: #333;"><strong>Status:</strong> ✅ Delivered</p>
            </div>
            <p style="color: #555; font-size: 14px;">We hope you love your handcrafted gift! 🌸</p>
            <p style="color: #888; font-size: 13px; margin-top: 12px;">Follow us on Instagram for more beautiful creations.</p>
          </div>
          ${footer}`,
      };

    case "password-reset":
      return {
        subject: "Password Reset Successful - The House Of Gnapakam",
        html: `${baseStyle}
          <div style="background: white; border-radius: 12px; padding: 24px; text-align: center;">
            <h1 style="color: #2C3E50; font-size: 22px;">Password Reset Successful! 🔑</h1>
            <p style="color: #555;">Your password has been successfully changed for:</p>
            <div style="background: #f0f9ff; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 4px 0; font-size: 14px; color: #333;"><strong>Email:</strong> ${data.email}</p>
            </div>
            <p style="color: #888; font-size: 13px;">If you did not make this change, please contact us immediately at +91 9346630240.</p>
          </div>
          ${footer}`,
      };

    case "cart-reminder":
      return {
        subject: `${data.productName} is waiting in your cart! 🛒`,
        html: `${baseStyle}
          <div style="background: white; border-radius: 12px; padding: 24px; text-align: center;">
            <h1 style="color: #2C3E50; font-size: 22px;">Don't forget your favourite! 💝</h1>
            <p style="color: #555;">Hi ${data.customerName}, you added a beautiful handcrafted item to your cart:</p>
            <div style="background: #f0f9ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <img src="${data.image}" alt="${data.productName}" style="max-width: 150px; max-height: 150px; border-radius: 12px; margin: 0 auto; display: block;" />
              <p style="margin: 12px 0 4px; font-size: 16px; color: #2C3E50; font-weight: bold;">${data.productName}</p>
              <p style="margin: 0; font-size: 18px; color: #5EAED4; font-weight: bold;">₹${data.price}</p>
            </div>
            <p style="color: #555; font-size: 14px;">Complete your order before it's gone!</p>
            <a href="http://localhost:3000" style="display: inline-block; margin-top: 16px; padding: 12px 32px; background: linear-gradient(to right, #89C4E1, #F8C8DC); color: white; text-decoration: none; border-radius: 25px; font-weight: bold;">Complete Your Order</a>
          </div>
          ${footer}`,
      };

    default:
      return { subject: "", html: "" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, to, data } = await request.json();

    if (!type || !to) {
      return NextResponse.json({ error: "Missing type or recipient" }, { status: 400 });
    }

    const transporter = getTransporter();
    const { subject, html } = getEmailContent(type, data);

    if (!subject) {
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    await transporter.sendMail({
      from: `"The House Of Gnapakam" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email send error:", error.message);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
