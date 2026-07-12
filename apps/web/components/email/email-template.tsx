import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Heading,
  Row,
  Column,
} from "@react-email/components";

interface InvoiceEmailProps {
  clientName: string;
  senderName: string;
  senderEmail: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  total: string;
  payUrl: string;
}

export function EmailTemplate({
  clientName,
  senderName,
  senderEmail,
  invoiceNumber,
  issueDate,
  dueDate,
  total,
  payUrl,
}: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#f4f4f5",
          fontFamily: "Arial, sans-serif",
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            maxWidth: "560px",
            margin: "0 auto",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Section
            style={{
              backgroundColor: "#111111",
              padding: "24px 32px",
            }}
          >
            <Row>
              <Column>
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: "18px",
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  InvoiceX
                </Text>
              </Column>

              <Column align="right">
                <Text
                  style={{
                    color: "#888",
                    fontSize: "12px",
                    margin: 0,
                  }}
                >
                  {invoiceNumber}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ padding: "32px" }}>
            <Heading
              as="h2"
              style={{
                margin: "0 0 12px",
                fontSize: "22px",
              }}
            >
              Hi {clientName},
            </Heading>

            <Text
              style={{
                color: "#555",
                lineHeight: 1.6,
                marginBottom: "28px",
              }}
            >
              {senderName} has sent you an invoice for recent work.
              Please review the details below and use the button
              to pay securely online.
            </Text>

            <Section
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "28px",
              }}
            >
              <Text>
                <strong>Invoice:</strong> {invoiceNumber}
              </Text>

              <Text>
                <strong>From:</strong> {senderName}
              </Text>

              <Text>
                <strong>Issue Date:</strong> {issueDate}
              </Text>

              <Text>
                <strong>Due Date:</strong> {dueDate}
              </Text>

              <Hr />

              <Text
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                }}
              >
                Amount Due: {total}
              </Text>
            </Section>

            <Section style={{ textAlign: "center" }}>
              <Button
                href={payUrl}
                style={{
                  backgroundColor: "#111111",
                  color: "#ffffff",
                  padding: "14px 32px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Pay Invoice
              </Button>
            </Section>

            <Hr
              style={{
                marginTop: "32px",
                marginBottom: "24px",
              }}
            />

            <Text
              style={{
                color: "#666",
                fontSize: "13px",
              }}
            >
              If the button doesn't work, copy and paste
              this URL into your browser:
            </Text>

            <Text
              style={{
                fontSize: "12px",
                wordBreak: "break-all",
              }}
            >
              {payUrl}
            </Text>

            <Hr />

            <Text
              style={{
                color: "#666",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              The invoice PDF is attached to this email.
              If you have any questions, contact{" "}
              <strong>{senderEmail}</strong>.
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#fafafa",
              borderTop: "1px solid #e5e5e5",
              padding: "20px 32px",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#999",
                margin: 0,
              }}
            >
              Sent via InvoiceX
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}