import { Box, Typography, Divider, useTheme, type SxProps, type Theme } from '@mui/material'
import { getMetricColors } from './metricColors'
import { combineSxProps } from '../ui/Util'

type WindowStats = {
  range: string
  center: string
  sampleCount: number
  weight: number | undefined
  bf: number | undefined
  lean: number | undefined
  lean15: number | undefined
}

type Props = {
  first: WindowStats
  last: WindowStats
  diff: {
    center: string
    duration: string
    range: string
    weight: number
    bf: number
    lean: number
    lean15: number
    confidenceScore?: number
  }
}

export default function TrendWindowTooltip({
  first,
  last,
  diff,
}: Props) {

  const theme = useTheme()

  const metricColors = getMetricColors(
    theme.palette.mode === 'dark',
  )
  
  function CenteredSeparator({ left, right, separator = '—', style }: any) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          columnGap: '8px',
          ...style,
        }}
      >
        <div style={{ justifySelf: 'end' }}>{left}</div>
        <span style={{ textAlign: 'center' }}>{separator}</span>
        <div style={{ justifySelf: 'start' }}>{right}</div>
      </div>
    );
  }

  const MetricRow = ({
    label,
    value,
    color,
    sxProps
  }: {
    label: string
    value?: React.ReactNode
    color?: string
    sxProps?: SxProps<Theme>;
  }) => (
    <Box
      component="span"
      sx={combineSxProps({
          display: 'block',
          color,
          fontSize: color ? 13.5 : 12,
          lineHeight: color ? 1.35 : 'inherit',
          // fontWeight: color ? 500 : 'inherit',
          whiteSpace: 'pre'
        }, sxProps)
      }
    >
      {label}

      {value && (
        <>
          {': '}
          {value}
        </>
      )}
    </Box>
  )

  const Section = ({
    title,
    data,
  }: {
    title: string
    data: WindowStats
  }) => (
    <Box
      sx={{
        textAlign: 'center',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {title}
      </Typography>

      <MetricRow
        label={data.range}
      />

      <MetricRow
        label={`Center: ${data.center}`}
      />

      <MetricRow
        label={`Sample Count: ${data.sampleCount}`}
      />

      <MetricRow
        label="Weight"
        color={metricColors.weight}
        value={`${data.weight?.toFixed(1) ?? '-'} kg`}
      />

      <MetricRow
        label="BF"
        color={metricColors.bf}
        value={`${data.bf?.toFixed(1) ?? '-'}%`}
      />

      <MetricRow
        label="Lean"
        color={metricColors.lean}
        value={`${data.lean?.toFixed(1) ?? '-'} kg`}
      />

      <MetricRow
        label="Lean@15"
        color={metricColors.lean15}
        value={`${data.lean15?.toFixed(1) ?? '-'} kg`}
      />
    </Box>
  )

  return (
    <Box sx={{ p: 0 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
        }}
      >
        <Section
          title="First Window"
          data={first}
        />

        <Divider orientation="vertical" flexItem sx={{ mx: 0.7, borderColor: '#ffffff1f' }} />

        <Section
          title="Last Window"
          data={last}
        />
      </Box>

      <Divider sx={{ my: 0.7, borderColor: '#ffffff1f' }} />

      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Difference
        </Typography>

        <MetricRow
          label={`Center: ${diff.center}`}
        />

        {/* <MetricRow
          label={`Duration: ${diff.duration}${' - '}Range: ${diff.range}`}
        /> */}

        <CenteredSeparator
          left={
            <MetricRow
              label={`Duration: ${diff.duration}`}
              sxProps={{ display: 'inline-block' }}
            />
          }
          right={
            <MetricRow
              label={`Range: ${diff.range}`}
              sxProps={{ display: 'inline-block' }}
            />
          }
          separator={"-"}
        />

        {/* <MetricRow
          label={`Range: ${diff.range}`}
        /> */}

        <CenteredSeparator
          left={
            <MetricRow
              label="Weight"
              color={metricColors.weight}
              value={`${diff.weight > 0 ? '+' : ''}${diff.weight.toFixed(1)} kg`}
              sxProps={{ display: 'inline-block', fontWeight: 500 }}
            />
          }
          right={
            <MetricRow
              label="BF"
              color={metricColors.bf}
              value={`${diff.bf > 0 ? '+' : ''}${diff.bf.toFixed(1)}%`}
              sxProps={{ display: 'inline-block', fontWeight: 500 }}
            />
          }
          separator={"•"}
        />

        {/* <MetricRow
          label="Weight"
          color={metricColors.weight}
          value={`${diff.weight > 0 ? '+' : ''}${diff.weight.toFixed(1)} kg`}
          sxProps={{ display: 'inline-block' }}
        />
        {' — '}
        <MetricRow
          label="BF"
          color={metricColors.bf}
          value={`${diff.bf > 0 ? '+' : ''}${diff.bf.toFixed(1)}%`}
          sxProps={{ display: 'inline-block' }}
        /> */}
        {/* <br></br> */}

        <CenteredSeparator
          left={
            <MetricRow
              label="Lean"
              color={metricColors.lean}
              value={`${diff.lean > 0 ? '+' : ''}${diff.lean.toFixed(1)} kg`}
              sxProps={{ display: 'inline-block', fontWeight: 500 }}
            />
          }
          right={
            <MetricRow
              label="Lean@15"
              color={metricColors.lean15}
              value={`${diff.lean15 > 0 ? '+' : ''}${diff.lean15.toFixed(1)} kg`}
              sxProps={{ display: 'inline-block', fontWeight: 500 }}
            />
          }
          separator={"•"}
        />

        {/* <MetricRow
          label="Lean"
          color={metricColors.lean}
          value={`${diff.lean > 0 ? '+' : ''}${diff.lean.toFixed(1)} kg`}
          sxProps={{ display: 'inline-block' }}
        />
        {' — '}
        <MetricRow
          label="Lean@15"
          color={metricColors.lean15}
          value={`${diff.lean15 > 0 ? '+' : ''}${diff.lean15.toFixed(1)} kg`}
          sxProps={{ display: 'inline-block' }}
        /> */}

        {diff.confidenceScore && (
          <MetricRow
            label={`Trend Confidence: ×${diff.confidenceScore.toFixed(1)}`}
            // label={`Confidence Score: ×${diff.confidenceScore.toFixed(1)}`}
            sxProps={{ fontSize: 13.5 }}
          />
        )}
      </Box>
    </Box>
  )
}

export function BodyCompEstimateTooltip({
  first
}: { first: WindowStats }) {

  const theme = useTheme()

  const metricColors = getMetricColors(
    theme.palette.mode === 'dark',
  )
  
  function CenteredSeparator({ left, right, separator = '—', style }: any) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          columnGap: '8px',
          ...style,
        }}
      >
        <div style={{ justifySelf: 'end' }}>{left}</div>
        <span style={{ textAlign: 'center' }}>{separator}</span>
        <div style={{ justifySelf: 'start' }}>{right}</div>
      </div>
    );
  }

  const MetricRow = ({
    label,
    value,
    color,
    sxProps
  }: {
    label: string
    value?: React.ReactNode
    color?: string
    sxProps?: SxProps<Theme>;
  }) => (
    <Box
      component="span"
      sx={combineSxProps({
          display: 'block',
          color,
          fontSize: color ? 13.5 : 12,
          lineHeight: color ? 1.35 : 'inherit',
          // fontWeight: color ? 500 : 'inherit',
          whiteSpace: 'pre'
        }, sxProps)
      }
    >
      {label}

      {value && (
        <>
          {': '}
          {value}
        </>
      )}
    </Box>
  )

  const Section = ({
    title,
    data,
  }: {
    title: string
    data: WindowStats
  }) => (
    <Box
      sx={{
        textAlign: 'center',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {title}
      </Typography>

      <MetricRow
        label={data.range}
      />

      <MetricRow
        label={`Center: ${data.center}`}
      />

      <MetricRow
        label={`Sample Count: ${data.sampleCount}`}
      />

      <MetricRow
        label="Weight"
        color={metricColors.weight}
        value={`${data.weight?.toFixed(1) ?? '-'} kg`}
      />

      <MetricRow
        label="BF"
        color={metricColors.bf}
        value={`${data.bf?.toFixed(1) ?? '-'}%`}
      />

      <MetricRow
        label="Lean"
        color={metricColors.lean}
        value={`${data.lean?.toFixed(1) ?? '-'} kg`}
      />

      <MetricRow
        label="Lean@15"
        color={metricColors.lean15}
        value={`${data.lean15?.toFixed(1) ?? '-'} kg`}
      />

        {/* <CenteredSeparator
          left={
            <MetricRow
              label="Weight"
              color={metricColors.weight}
              value={`${first.weight?.toFixed(1)} kg`}
              sxProps={{ display: 'inline-block', fontWeight: 500 }}
            />
          }
          right={
            <MetricRow
              label="BF"
              color={metricColors.bf}
              value={`${first.bf?.toFixed(1)}%`}
              sxProps={{ display: 'inline-block', fontWeight: 500 }}
            />
          }
          separator={"•"}
        />

        <CenteredSeparator
          left={
            <MetricRow
              label="Lean"
              color={metricColors.lean}
              value={`${first.lean?.toFixed(1)} kg`}
              sxProps={{ display: 'inline-block', fontWeight: 500 }}
            />
          }
          right={
            <MetricRow
              label="Lean@15"
              color={metricColors.lean15}
              value={`${first.lean15?.toFixed(1)} kg`}
              sxProps={{ display: 'inline-block', fontWeight: 500 }}
            />
          }
          separator={"•"}
        /> */}
    </Box>
  )

  return (
    <Box sx={{ p: 0 }}>


      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <Section
          title="Window Details"
          data={first}
        />

        {/* <MetricRow
          label={`Center: ${first.center}`}
        />

        <CenteredSeparator
          left={
            <MetricRow
              label={`Sample Count: ${first.sampleCount}`}
              sxProps={{ display: 'inline-block' }}
            />
          }
          right={
            <MetricRow
              label={`Range: ${first.range}`}
              sxProps={{ display: 'inline-block' }}
            />
          }
          separator={"-"}
        /> */}
      </Box>
    </Box>
  )
}