export function buildOrdersHTML(data: any) {
  let html = `
  <html>
  <head>
    <style>
      body { font-family: Arial; padding: 16px; }
      h1 { text-align: center; }
      .order { margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 8px; border-bottom: 1px solid #ddd; }
      th { background: #f3f3f3; }
      .total { font-weight: bold; text-align: right; }
    </style>
  </head>
  <body>
    <h1>Restaurant Orders Backup</h1>
    <p><b>Generated:</b> ${new Date().toLocaleString("en-IN")}</p>
  `;

  data.orders.forEach((o: any) => {
    html += `
      <div class="order">
        <h3>Order #${o.id}</h3>
        <p>Date: ${new Date(o.created_at).toLocaleString("en-IN")}</p>
        <table>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Amount</th>
          </tr>
    `;

    o.items.forEach((i: any) => {
      html += `
        <tr>
          <td>${i.name}</td>
          <td>${i.qty}</td>
          <td>₹${i.qty * i.price}</td>
        </tr>
      `;
    });

    html += `
        <tr>
          <td colspan="2" class="total">Total</td>
          <td class="total">₹${o.total}</td>
        </tr>
        </table>
      </div>
    `;
  });

  html += `</body></html>`;
  return html;
}
