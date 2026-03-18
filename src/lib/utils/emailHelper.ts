import { GMAIL_APP_PASSWORD, GMAIL_USER } from '$env/static/private';
import nodemailer from 'nodemailer';

export interface BulkRecipient {
  email: string;
  name?: string;
}

export interface BulkSendResult {
  email: string;
  success: boolean;
  error?: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

export async function sendLeaveEmail(
  status: 'approved' | 'declined',
  to: string,
  html: string
) {
  await transporter.sendMail({
    from: "Leave Credit System",
    to,
    subject: `Leave Credit System - Leave Request ${status === 'approved' ? 'Approved' : 'Declined'}`,
    html,
  });
}

export async function sendBulkEmail(
  recipients: BulkRecipient[],
  subject: string,
  htmlFn: (recipient: BulkRecipient) => string,
  delayMs: number = 1500
): Promise<BulkSendResult[]> {
  const results: BulkSendResult[] = [];

  for (const recipient of recipients) {
    try {
      await transporter.sendMail({
        from: 'Leave Credit System',
        to: recipient.email,
        subject,
        html: htmlFn(recipient),
      });

      results.push({ email: recipient.email, success: true });
      await new Promise((res) => setTimeout(res, delayMs));

    } catch (err: unknown) {
      results.push({
        email: recipient.email,
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return results;
}

export function leaveApprovedTemplate(
  name: string,
  leaveType: string,
  startDate: string,
  endDate: string,
  days: number,
  approvedBy: string
) {
  return `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8;">
        <tr>
        <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

            <!-- Status Bar -->
            <tr>
                <td style="background-color:#16a34a;padding:6px 0;"></td>
            </tr>

            <!-- Header -->
            <tr>
                <td style="padding:40px 40px 24px;text-align:center;">
                
                <p style="margin:0;font-size:28px;font-weight:bold;margin-bottom:15px;">Leave Credit System</p>

                <!-- Icon -->
                <div style="display:inline-block;width:56px;height:56px;background-color:#dcfce7;border-radius:50%;line-height:56px;font-size:26px;margin-bottom:16px;">✓</div>
                <h2 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;">Leave Approved</h2>
                <p style="margin:0;font-size:14px;color:#6b7280;">Your leave request has been approved.</p>
                </td>
            </tr>

            <!-- Divider -->
            <tr><td style="padding:0 40px;"><div style="border-top:1px solid #f0f0f0;"></div></td></tr>

            <!-- Details -->
            <tr>
                <td style="padding:24px 40px;">
                <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">
                    Hi <strong>${name}</strong>,
                </p>
                <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                    Great news! Your leave request has been reviewed and <strong style="color:#16a34a;">approved</strong> by your HR. Here's a summary:
                </p>

                <!-- Info Table -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;border-radius:6px;overflow:hidden;">
                    <tr>
                    <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;">
                        <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Leave Type</span>
                        <span style="font-size:14px;color:#111827;font-weight:600;">${leaveType}</span>
                    </td>
                    </tr>
                    <tr>
                    <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;">
                        <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Duration</span>
                        <span style="font-size:14px;color:#111827;font-weight:600;">${startDate} – ${endDate} (${days} ${days > 1 ? 'days' : 'days'})</span>
                    </td>
                    </tr>
                    <tr>
                    <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;">
                        <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Approved By</span>
                        <span style="font-size:14px;color:#111827;font-weight:600;">${approvedBy}</span>
                    </td>
                    </tr>
                    <tr>
                    <td style="padding:14px 20px;">
                        <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Status</span>
                        <span style="display:inline-block;background-color:#dcfce7;color:#16a34a;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:0.5px;">APPROVED</span>
                    </td>
                    </tr>
                </table>

                <p style="margin:20px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
                    Please ensure your tasks are handed over before your leave starts. Enjoy your time off!
                </p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f0f0f0;">
                <p style="margin:0;font-size:12px;color:#9ca3af;">
                    This is an automated message from Leave Credit System. Please do not reply to this email.
                </p>
                </td>
            </tr>

            </table>
        </td>
        </tr>
    </table>
  `;
}

export function leaveDeclinedTemplate(
  name: string,
  leaveType: string,
  startDate: string,
  endDate: string,
  days: number,
  reviewedBy: string,
  reason: string,
  isHr: boolean = true
) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Status Bar -->
          <tr>
            <td style="background-color:#dc2626;padding:6px 0;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 24px;text-align:center;">

              <p style="margin:0;font-size:28px;font-weight:bold;margin-bottom:15px;">Leave Credit System</p>

              <div style="display:inline-block;width:56px;height:56px;background-color:#fee2e2;border-radius:50%;line-height:56px;font-size:26px;margin-bottom:16px;">✕</div>
              <h2 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#111827;">Leave Declined</h2>
              <p style="margin:0;font-size:14px;color:#6b7280;">Your leave request has been declined.</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 40px;"><div style="border-top:1px solid #f0f0f0;"></div></td></tr>

          <!-- Details -->
          <tr>
            <td style="padding:24px 40px;">
              <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">
                Hi <strong>${name}</strong>,
              </p>
              <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                We regret to inform you that your leave request has been <strong style="color:#dc2626;">declined</strong> by your ${isHr ? 'HR' : 'Department Head'}. Here's a summary:
              </p>

              <!-- Info Table -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;border-radius:6px;overflow:hidden;">
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Leave Type</span>
                    <span style="font-size:14px;color:#111827;font-weight:600;">${leaveType}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Duration</span>
                    <span style="font-size:14px;color:#111827;font-weight:600;">${startDate} – ${endDate} (${days} ${days > 1 ? 'days' : 'days'})</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Reviewed By</span>
                    <span style="font-size:14px;color:#111827;font-weight:600;">${reviewedBy}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Status</span>
                    <span style="display:inline-block;background-color:#fee2e2;color:#dc2626;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:0.5px;">DECLINED</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;">
                    <span style="font-size:12px;color:#9ca3af;display:block;margin-bottom:2px;">Reason</span>
                    <span style="font-size:14px;color:#111827;">${reason}</span>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:13px;color:#9ca3af;line-height:1.6;">
                If you have questions, please reach out to your manager or the HR department directly.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f0f0f0;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                This is an automated message from Leave Credit System. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  `;
}


export function announcementTemplate(
  title: string,
  description: string,
  validUntil: string
){
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8;">
  <tr>
    <td align="center">
      <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Top Accent -->
        <tr>
          <td style="background-color:#2563eb;padding:6px 0;"></td>
        </tr>

        <!-- Header -->
        <tr>
          <td style="padding:40px 40px 24px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:bold;margin-bottom:15px;">
              Leave Credit System
            </p>

            <div style="display:inline-block;width:56px;height:56px;background-color:#dbeafe;border-radius:50%;line-height:56px;font-size:26px;margin-bottom:16px;">
              📢
            </div>

            <!-- TITLE -->
            <h2 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#111827;">
              ${title}
            </h2>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding:0 40px;">
            <div style="border-top:1px solid #f0f0f0;"></div>
          </td>
        </tr>

        <!-- Description -->
        <tr>
          <td style="padding:24px 40px;text-align:center;">
            <p style="margin:0 0 16px;font-size:14px;color:#6b7280;line-height:1.6;">
              ${description}
            </p>

            <!-- Valid Until -->
            <p style="margin:0;font-size:13px;color:#9ca3af;">
              Valid until: <strong style="color:#374151;">${validUntil}</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f0f0f0;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              This is an automated announcement from Leave Credit System.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
  `
}