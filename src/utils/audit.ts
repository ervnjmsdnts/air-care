export async function addAudit({
  label,
  userId,
}: {
  label: string;
  userId: number;
}) {
  const res = await fetch('/api/audit', {
    method: 'POST',
    body: JSON.stringify({ label, userId }),
  });
}
