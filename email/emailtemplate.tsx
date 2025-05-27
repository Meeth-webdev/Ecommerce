import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function EmailTemplate({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Section style={{ backgroundColor: '#f7f7f7', padding: '40px 20px' }}>
        <Row style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Heading as="h2" style={{ fontSize: '24px', color: '#333', fontWeight: '600' }}>
            Hello {username},
          </Heading>
        </Row>
        <Row style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Text style={{ fontSize: '16px', color: '#555', lineHeight: '1.5' }}>
            Thank you for registering with us! Please use the following verification code to complete your registration.
          </Text>
        </Row>
        <Row style={{ marginBottom: '30px', textAlign: 'center' }}>
          <Text
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2a9d8f',
              letterSpacing: '2px',
              padding: '10px 20px',
              borderRadius: '5px',
              backgroundColor: '#e9f5f0',
              display: 'inline-block',
            }}
          >
            {otp}
          </Text>
        </Row>
        <Row style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Text style={{ fontSize: '16px', color: '#555', lineHeight: '1.5' }}>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
        <Row style={{ textAlign: 'center' }}>
          <Button
            href={`http://localhost:3000/verify/${username}`}
            style={{
              backgroundColor: '#2a9d8f',
              color: '#fff',
              padding: '12px 25px',
              textDecoration: 'none',
              fontSize: '16px',
              borderRadius: '5px',
              fontWeight: '600',
            }}
          >
            Verify Now
          </Button>
        </Row>
      </Section>
    </Html>
  );
}