import { Box, Typography } from '@mui/material'
import PageContainer from '../components/ui/PageContainer'

export default function Privacy() {
  return (
    <PageContainer>
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
        py: 6,
        px: 2,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 700 }}
      >
        Privacy Policy
      </Typography>

      <Typography sx={{ mb: 3, color: '#555' }}>
        Leanlytics stores data either locally in your browser or in your account, depending on how you use the app.
      </Typography>

      <Typography sx={{ mb: 2, fontWeight: 600 }}>
        When using the app without an account:
      </Typography>

      <Typography component="div" sx={{ mb: 3, color: '#555' }}>
        - All data stays in your browser (localStorage)<br />
        - No personal measurement data is sent to a server
      </Typography>

      <Typography sx={{ mb: 2, fontWeight: 600 }}>
        When using an account:
      </Typography>

      <Typography component="div" sx={{ mb: 3, color: '#555' }}>
        - Your measurement data is stored securely on a server<br />
        - Data is linked only to your account for syncing
      </Typography>

      <Typography sx={{ mb: 3, color: '#555' }}>
        We may collect minimal anonymous usage and error data to improve reliability. This does not include your health or measurement data. We do not sell or share personal data with third parties.
      </Typography>

      <Typography sx={{ mb: 3, color: '#555' }}>
        You can delete your account and all associated data at any time.
      </Typography>
    </Box>
    </PageContainer>
  )
}