import { Resend } from 'resend';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const EMAIL_STYLES = `
  body { background-color: #050505; margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; -webkit-font-smoothing: antialiased; }
  .wrapper { background-color: #050505; padding: 40px 20px; width: 100%; height: 100%; }
  .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #333333; color: #e0e0e0; }
  .header { padding: 20px 30px; border-bottom: 1px solid #333333; background-color: #0f0f0f; }
  .content { padding: 30px; }
  .logo { color: #ffffff; font-size: 20px; font-weight: bold; letter-spacing: -1px; text-decoration: none; }
  .accent { color: #ccff00; }
  .h1 { color: #ffffff; font-size: 24px; margin: 0 0 20px; text-transform: uppercase; letter-spacing: 1px; }
  .text { color: #a0a0a0; font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
  .box { background-color: #050505; border: 1px solid #333; padding: 20px; margin: 20px 0; }
  .label { color: #ccff00; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px; }
  .value { color: #ffffff; font-size: 14px; display: block; margin-bottom: 15px; }
  .button { display: inline-block; padding: 15px 30px; background-color: #ccff00; color: #000000; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; margin-top: 20px; }
  .footer { border-top: 1px solid #333333; padding: 20px 30px; font-size: 12px; color: #666666; text-align: center; background-color: #0f0f0f; }
  ul { list-style-type: none; padding: 0; }
  li { margin-bottom: 10px; color: #a0a0a0; font-size: 14px; }
  li:before { content: "Z>"; color: #ccff00; margin-right: 10px; font-weight:bold; }
  .warning-box { background-color: #1a0a0a; border: 1px solid #ff4444; padding: 20px; margin: 20px 0; }
  .warning-text { color: #ff6666; }
`;

export class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'system@zerogrid.io';
  }

  private async send(options: EmailOptions): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (error) {
      console.error('Email send error:', error);
    }
  }

  public async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${EMAIL_STYLES}</style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <span class="logo">ZERO<span class="accent">GRID</span>_</span>
              </div>
              <div class="content">
                <h1 class="h1">OPERATIVE_ACCESS_GRANTED</h1>
                <p class="text">Greetings ${name},</p>
                <p class="text">Your identity has been verified. Welcome to the ZEROGRID defense infrastructure. Your terminal is ready for initialization.</p>
                
                <div class="box">
                  <p class="label">AUTHORIZED PROTOCOLS:</p>
                  <ul>
                    <li>Manage Vector Incidents</li>
                    <li>Vulnerability Tracking</li>
                    <li>Cloud Perimeter Monitoring</li>
                    <li>VAPT Reporting Modules</li>
                  </ul>
                </div>

                <p class="text">Proceed to your console to begin operations:</p>
                
                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">INITIATE_SESSION</a>
                </div>
              </div>
              <div class="footer">
                SECURE CONNECTION // 256-BIT ENCRYPTION<br>
                &copy; ZEROGRID SYSTEMS.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send({
      to: email,
      subject: 'ZEROGRID: New Operative Access',
      html,
    });
  }

  public async sendIssueCreatedEmail(
    email: string,
    name: string,
    issue: { type: string; title: string; description: string }
  ): Promise<void> {
    const typeLabels: Record<string, string> = {
      'cloud-security': 'CLOUD_SECURITY',
      'reteam-assessment': 'RED_TEAM_OPS',
      'vapt': 'VAPT_PROTOCOL',
    };

    const displayType = typeLabels[issue.type] || issue.type.toUpperCase();

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${EMAIL_STYLES}</style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <span class="logo">ZERO<span class="accent">GRID</span>_</span>
              </div>
              <div class="content">
                <h1 class="h1">NEW_VECTOR_DETECTED</h1>
                <p class="text">Operative ${name},</p>
                <p class="text">A new security incident has been logged in the ZEROGRID registry. Review details below:</p>
                
                <div class="box">
                  <span class="label">VECTOR_TYPE</span>
                  <span class="value">${displayType}</span>
                  
                  <span class="label">INCIDENT_TITLE</span>
                  <span class="value">${issue.title}</span>
                  
                  <span class="label">TECHNICAL_DETAILS</span>
                  <span class="value" style="margin-bottom: 0;">${issue.description}</span>
                </div>

                <p class="text">Our SOC team has been notified. Pending analysis.</p>
                
                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">VIEW_INCIDENT_LOG</a>
                </div>
              </div>
              <div class="footer">
                AUTOMATED SYSTEM ALERT // DO NOT REPLY<br>
                ZEROGRID SYSTEMS INC.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send({
      to: email,
      subject: `ALERT: ${issue.title}`,
      html,
    });
  }

  public async sendProfileUpdatedEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${EMAIL_STYLES}</style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <span class="logo">ZERO<span class="accent">GRID</span>_</span>
              </div>
              <div class="content">
                <h1 class="h1">PROFILE_UPDATE_CONFIRMED</h1>
                <p class="text">Operative ${name},</p>
                <p class="text">Your security profile has been successfully updated in the ZEROGRID system.</p>
                
                <div class="box">
                  <span class="label">SECURITY_NOTICE</span>
                  <span class="value">If this change was not initiated by you, immediately secure your access point and notify command.</span>
                </div>

                <p class="text">Your credentials remain under continuous monitoring. Any anomalous activity will trigger lockdown protocols.</p>
                
                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile" class="button">REVIEW_PROFILE</a>
                </div>
              </div>
              <div class="footer">
                AUTOMATED SECURITY NOTIFICATION<br>
                ZEROGRID SYSTEMS // ALL RIGHTS RESERVED
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send({
      to: email,
      subject: 'SECURITY: Profile Updated',
      html,
    });
  }

  public async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${EMAIL_STYLES}</style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <span class="logo">ZERO<span class="accent">GRID</span>_</span>
              </div>
              <div class="content">
                <h1 class="h1">PASSWORD_RESET_PROTOCOL</h1>
                <p class="text">Operative ${name},</p>
                <p class="text">A password reset request has been initiated for your ZEROGRID account. If you did not request this action, disregard this transmission immediately.</p>
                
                <div class="warning-box">
                  <span class="label warning-text">⚠ SECURITY_NOTICE</span>
                  <span class="value">This reset link will expire in <strong style="color: #ccff00;">1 HOUR</strong>. Do not share this link with anyone.</span>
                </div>

                <div class="box">
                  <span class="label">RESET_PROTOCOL</span>
                  <span class="value">Click the button below to establish new credentials for your account.</span>
                </div>

                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">RESET_PASSWORD</a>
                </div>

                <p class="text" style="margin-top: 30px; font-size: 12px; color: #666;">
                  If the button doesn't work, copy and paste this URL into your browser:<br>
                  <span style="color: #ccff00; word-break: break-all;">${resetUrl}</span>
                </p>
              </div>
              <div class="footer">
                AUTOMATED SECURITY ALERT // DO NOT REPLY<br>
                ZEROGRID SYSTEMS INC.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send({
      to: email,
      subject: 'ZEROGRID: Password Reset Request',
      html,
    });
  }

  public async sendPasswordChangedEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${EMAIL_STYLES}</style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <span class="logo">ZERO<span class="accent">GRID</span>_</span>
              </div>
              <div class="content">
                <h1 class="h1">PASSWORD_UPDATED</h1>
                <p class="text">Operative ${name},</p>
                <p class="text">Your ZEROGRID account password has been successfully updated. Your new credentials are now active.</p>
                
                <div class="warning-box">
                  <span class="label warning-text">⚠ SECURITY_ALERT</span>
                  <span class="value">If you did not perform this action, your account may be compromised. Contact command immediately and secure your access point.</span>
                </div>

                <div style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">ACCESS_TERMINAL</a>
                </div>
              </div>
              <div class="footer">
                AUTOMATED SECURITY NOTIFICATION<br>
                ZEROGRID SYSTEMS // ALL RIGHTS RESERVED
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send({
      to: email,
      subject: 'ZEROGRID: Password Changed Successfully',
      html,
    });
  }
}