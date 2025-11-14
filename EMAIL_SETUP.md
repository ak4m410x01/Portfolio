# Email Setup Guide

This guide explains how to configure the contact form to send emails using Gmail SMTP.

## Option 1: Backend API (Recommended)

### Step 1: Set Up Gmail App Password

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already enabled)
3. Go to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "Portfolio Contact Form" as the name
6. Click **Generate**
7. Copy the 16-character app password (you'll need this)

### Step 2: Backend Setup

#### For Node.js/Express (Example provided)

1. Install dependencies:
```bash
npm install express nodemailer cors dotenv
```

2. Create a `.env` file:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
RECIPIENT_EMAIL=your-email@gmail.com
PORT=3000
```

3. Update the email endpoint in `js/form-handler.js`:
```javascript
const emailEndpoint = "https://your-backend-url.com/api/send-email";
```

4. Deploy your backend (Heroku, Vercel, Railway, etc.)

#### For ASP.NET Core

Create a controller endpoint:

```csharp
[HttpPost("api/send-email")]
public async Task<IActionResult> SendEmail([FromBody] ContactFormModel model)
{
    var message = new MailMessage
    {
        From = new MailAddress("your-email@gmail.com"),
        To = { "your-email@gmail.com" },
        Subject = $"Portfolio Contact: {model.Subject}",
        Body = $"Name: {model.Name}\nEmail: {model.Email}\n\nMessage:\n{model.Message}",
        IsBodyHtml = false
    };

    using var smtp = new SmtpClient("smtp.gmail.com", 587)
    {
        Credentials = new NetworkCredential("your-email@gmail.com", "your-app-password"),
        EnableSsl = true
    };

    await smtp.SendMailAsync(message);
    return Ok(new { success = true, message = "Email sent successfully" });
}
```

### Step 3: Update Frontend

Update the `emailEndpoint` in `js/form-handler.js` to point to your deployed backend URL.

## Option 2: Third-Party Services

### Using EmailJS (No Backend Required)

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service
3. Update `js/form-handler.js`:

```javascript
async submitForm() {
  const formData = new FormData(this.form);
  
  // Load EmailJS SDK
  await loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js');
  
  emailjs.init('YOUR_PUBLIC_KEY');
  
  try {
    await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    });
    
    return { success: true };
  } catch (error) {
    throw new Error('Failed to send email');
  }
}
```

### Using Formspree

1. Sign up at [Formspree](https://formspree.io/)
2. Create a new form
3. Update the form action in `index.html`:

```html
<form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

## Security Notes

- **Never commit** your Gmail app password or API keys to version control
- Use environment variables for sensitive data
- Consider implementing rate limiting to prevent spam
- Add reCAPTCHA for additional spam protection
- Validate all input on both client and server side

## Testing

1. Fill out the contact form
2. Check your email inbox
3. Verify the email contains all form data
4. Test error handling by temporarily breaking the connection

## Troubleshooting

- **"Authentication failed"**: Check your app password is correct
- **"Connection timeout"**: Verify firewall/network settings allow SMTP
- **"Rate limit exceeded"**: Gmail has daily sending limits; consider using a service like SendGrid for higher volumes

