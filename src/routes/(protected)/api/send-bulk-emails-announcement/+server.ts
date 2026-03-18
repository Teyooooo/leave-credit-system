import {
    announcementTemplate,
    sendBulkEmail,
    type BulkRecipient
} from '$lib/utils/emailHelper';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { title, description, validUntil, recipients } = await request.json() as {
    title: string;
    description: string;
    validUntil: string;
    recipients: BulkRecipient[];
  };

  const results = await sendBulkEmail(
    recipients,
    `Leave Credit System – ${title}`,
    () => announcementTemplate(title, description, validUntil)
  );

  const failed = results.filter((r) => !r.success);

  return json({
    sent: results.filter((r) => r.success).length,
    failed: failed.length,
    errors: failed,
  });
};