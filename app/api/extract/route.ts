export async function POST() {
  return Response.json({
    result: `{
      "merchant_name": "Lotus's",
      "date": "2026-05-12",
      "total_amount": "45.90",
      "currency": "MYR"
    }`,
  });
}