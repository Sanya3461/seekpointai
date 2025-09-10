import crypto from 'crypto';

export function sign(body: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  return `sha256=${hmac.digest('hex')}`;
}

export function verify(rawBody: string, signature: string, secret: string): boolean {
  if (!signature) return false;
  
  const expectedSignature = sign(rawBody, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
