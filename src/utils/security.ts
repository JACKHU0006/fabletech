export function sanitizeHtml(text: string): string {
  const entityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return text.replace(/[&<>"'`=\/]/g, (char) => entityMap[char] || char);
}

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    
    const allowedProtocols = ['https:', 'http:'];
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return '#';
    }
    
    const allowedHosts = [
      'www.fabletech.cc.cd',
      'fabletech.cc.cd',
      'res.cloudinary.com',
      'fonts.googleapis.com',
      'www.googletagmanager.com',
      'www.google-analytics.com',
      'cdn.jsdelivr.net',
      'cdnjs.cloudflare.com'
    ];
    
    if (!allowedHosts.includes(parsedUrl.hostname)) {
      return '#';
    }
    
    return url;
  } catch {
    return '#';
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/;
  return phoneRegex.test(phone);
}

export function escapeJavascript(value: string): string {
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\x00/g, '\\x00')
    .replace(/\x08/g, '\\x08')
    .replace(/\x09/g, '\\x09');
  
  return escaped;
}

export function generateCSRFToken(): string {
  const array = new Uint32Array(8);
  crypto.getRandomValues(array);
  return Array.from(array, dec => dec.toString(16).padStart(8, '0')).join('');
}

export function truncateAndSanitize(text: string, maxLength: number = 500): string {
  const sanitized = sanitizeHtml(text);
  if (sanitized.length <= maxLength) {
    return sanitized;
  }
  return sanitized.substring(0, maxLength - 3) + '...';
}
