import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { formatCurrency, formatDate } from  "./helper/helper"
import { fileURLToPath } from "url";
type InvoiceData = {
  invoiceNumber: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE";
  issueDate: Date;
  dueDate: Date;
  subTotal: number;
  taxRate: number;
  tax: number;
  total: number;
  notes: string | null;

  user: {
    name: string;
    email: string;
  };

  client: {
    name: string;
    email: string;
    address: string | null;
  };

  invoiceItems: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
};

export  async function generatePDF(invoice: InvoiceData) {
  try {
    console.log("at pdf");
  
  
    console.log("at generate invoice",invoice);
    
  
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const templatePath = path.join(
      __dirname,
      'templates',
      'invoice.html'
    )

    console.log("template path:", templatePath);

    let html = fs.readFileSync(templatePath, "utf-8");
  

    const statusClassMap = {
      DRAFT: "status-draft",
      SENT: "status-sent",
      PAID: "status-paid",
      OVERDUE: "status-overdue",
    };
  
    console.log(invoice.invoiceItems);
  
  
      const itemsHTML = invoice.invoiceItems
      .map(
          (item) => `
      <tr>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.unitPrice)}</td>
      <td>${formatCurrency(item.quantity * item.unitPrice)}</td>
      </tr>
      `
      )
      .join("");
  
  
  
  const notesSection = invoice.notes
    ? `
  <div class="inv-notes">
    <div class="label">Notes</div>
    <div class="inv-notes-text">${invoice.notes}</div>
  </div>
  ` : "";
  
  
  
  html = html
    .replaceAll("{{invoiceNumber}}", invoice?.invoiceNumber ?? "")
    .replaceAll("{{status}}", invoice?.status ?? "")
    .replaceAll(
      "{{statusClass}}",
      statusClassMap[invoice?.status as keyof typeof statusClassMap] ?? ""
    )
    .replaceAll("{{issueDate}}", invoice?.issueDate ? formatDate(invoice.issueDate) : "")
    .replaceAll("{{dueDate}}", invoice?.dueDate ? formatDate(invoice.dueDate) : "")
    .replaceAll("{{senderName}}", invoice?.user?.name ?? "")    
    .replaceAll("{{senderEmail}}", invoice?.user?.email ?? "")

    .replaceAll("{{clientName}}", invoice?.client?.name ?? "")
    .replaceAll("{{clientEmail}}", invoice?.client?.email ?? "")
    .replaceAll("{{clientAddress}}", invoice?.client?.address ?? "")
    .replaceAll("{{subTotal}}", formatCurrency(invoice?.subTotal ?? 0))
    .replaceAll("{{taxRate}}", invoice?.taxRate?.toString() ?? "0")
    .replaceAll("{{tax}}", formatCurrency(invoice?.tax ?? 0))
    .replaceAll("{{total}}", formatCurrency(invoice?.total ?? 0))
    .replaceAll("{{notesSection}}", notesSection)
    .replace("{{items}}", itemsHTML);
  
  console.log(html.includes("{{invoiceNumber}}"));
  console.log(html.includes("{{senderName}}"));
  console.log(html.includes('invoiceItems'));
  
  
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });
  
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });
  
    await browser.close();
  
    console.log("PDF generated");
  
    return pdf;

    
  } catch (error) {
    console.log('Generate pdf error', error);
    throw error
  }
}
