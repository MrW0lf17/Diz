import { Container, Typography, Paper, Box } from '@mui/material';

const TermsOfService = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms of Service
        </Typography>
        
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography paragraph>
            By accessing and using DIToolz Pro, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            2. Use of Service
          </Typography>
          <Typography paragraph>
            Our services are provided for your personal and non-commercial use. You agree not to misuse our services or help anyone else do so.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            3. User Accounts
          </Typography>
          <Typography paragraph>
            You are responsible for safeguarding your account and ensuring that all account information is accurate and up-to-date.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            4. Content and Conduct
          </Typography>
          <Typography paragraph>
            You retain ownership of any intellectual property rights that you hold in content you submit to DIToolz Pro.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            5. Privacy
          </Typography>
          <Typography paragraph>
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            6. Changes to Terms
          </Typography>
          <Typography paragraph>
            We reserve the right to modify these terms at any time. We'll notify you of any material changes via email or through the service.
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Last updated: February 18, 2024
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsOfService; 