// Manager/Admin email addresses
// Only these users can access the manager dashboard
const ADMIN_EMAILS = [
  "bhavyasrijuturu31@gmail.com",
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
