import PageHeader from '../components/ui/PageHeader'
import PageContainer from '../components/ui/PageContainer'

import { Button, Paper, Stack, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import sampleDataRaw from '../data/mock/measurements.csv?raw'
import { parseSampleCSV } from '../data/storage'
import { getMeasurements, saveMeasurements } from '../data/measurements'
import { buildSmoothedBodyCompTable } from '../calculations/bodyCompSeries'
import { getBodyCompTrendSummary } from '../calculations/bodyCompTrendSummary'
import { CompositionInsight, LeanNormalizedInsight } from '../components/plots/TrendInsight'
import PlotRegistry from '../components/plots/PlotRegistry'

export default function Trends() {
  const data = getMeasurements()
  const smoothed = buildSmoothedBodyCompTable(data)
  const trend = getBodyCompTrendSummary(smoothed)

  const hasData = data.length > 0
  const navigate = useNavigate()

  const handleSampleData = () => {
    saveMeasurements(parseSampleCSV(sampleDataRaw))
    window.location.reload()
  }

  if (!hasData) {
    return (
      <>
        <PageHeader title="Trends" />

        <PageContainer>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              No measurement data yet
            </Typography>

            <Typography variant="body2" sx={{ mb: 3, opacity: 0.7 }}>
              Trends require measurement history to visualize progress.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
              <Button variant="outlined" onClick={handleSampleData}>
                Try sample dataset
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate({ to: '/measurements' })}
              >
                Start tracking
              </Button>
            </Stack>
          </Paper>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Trends" />

      <PageContainer>
        <PlotRegistry
          type="weight-bodyfat"
          data={data}
          smoothed={smoothed}
        />
        {trend && (
          <CompositionInsight trend={trend} />
        )}
        <PlotRegistry
          type="normalized-muscularity"
          data={data}
          smoothed={smoothed}
        />
        {trend && (
          <LeanNormalizedInsight trend={trend} />
        )}
      </PageContainer>
    </>
  )
}