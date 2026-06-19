import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Collapse,
} from '@mui/material'

import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

type ScoreThreshold = {
  color: string
  threshold: number
  label: string
  legendLabel: string
  description: string
}

type Props = {
  open: boolean
  onClose: () => void
  scoreThresholds: ScoreThreshold[]
}

export default function TrendConfidenceDialog({
  open,
  onClose,
  scoreThresholds,
}: Props) {
  const [techOpen, setTechOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Trend Confidence</DialogTitle>

      <DialogContent>
        <Typography variant="body2">
          Trend confidence estimates how reliable a reported rate of change is.
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Confidence increases when:
        </Typography>

        <Typography
          variant="body2"
          component="div"
          sx={{ pl: 2 }}
        >
          • Measurements span a longer period of time
          <br />
          • More measurements are included in the compared windows
        </Typography>

        {/* LEVELS */}
        <Box sx={{ mt: 2 }}>
          {scoreThresholds.map((x) => (
            <Box
              key={x.legendLabel}
              sx={{
                display: 'flex',
                gap: 1.5,
                mb: 1.5,
                alignItems: 'flex-start',
              }}
            >
              <Box>•</Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {x.label}
                </Typography>

                <Typography variant="body2">
                  {x.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* TECH HEADER (CLICKABLE) */}
        <Box
          onClick={() => setTechOpen(v => !v)}
          sx={{
            mt: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Technical details
          </Typography>

          <ExpandMoreIcon
            sx={{
              transform: techOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: '0.2s',
              color: 'text.secondary',
            }}
          />
        </Box>

        {/* TECH CONTENT (COLLAPSIBLE) */}
        <Collapse in={techOpen}>
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontFamily: 'monospace' }}
            >
            {/* <span style={{marginRight: 4}}></span>  */}
            score = durationMonths / √(1/n₁ + 1/n₂)
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              where durationMonths is the time between the two window centers and n₁/n₂ are the sample counts in each window.
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Higher scores generally correspond to smaller uncertainty and more stable trend estimates.
            </Typography>

            <Typography variant="body2" sx={{ mt: 2, fontWeight: 600 }}>
              Interpreting the score
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Example values:
            </Typography>

            <Typography variant="body2" component="div" sx={{ pl: 2, mt: 1 }}>
              ×0.3 — Weak support
              <br />
              ×1.5 — Moderate support
              <br />
              ×7.2 — Strong support
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              The score is relative rather than absolute. A score of ×2 is roughly twice as reliable as ×1, corresponding to the standard deviation of the error being halved.
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Absolute error still varies by metric. Simpler measures (e.g. weight) are typically more precise than derived estimates (e.g. Lean@15) at the same score.
            </Typography>
            </Box>
        </Collapse>
      </DialogContent>
    </Dialog>
  )
}