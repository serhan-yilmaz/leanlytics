import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  Tooltip
} from '@mui/material'
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import PageContainer from '../components/ui/PageContainer'
import HoverCard from '../components/ui/HoverCard'
import ChartCard from '../components/ui/ChartCard'
import XYTimeSeriesChart from '../components/charts/XYTimeSeriesChart'
import { buildSmoothedBodyCompTable } from '../calculations/bodyCompSeries'
import { charts } from '../calculations/chartSeries'
import { getMeasurements, saveMeasurements } from '../data/measurements'

import { Link, useNavigate } from '@tanstack/react-router'
import TimeSeriesChart from '../components/charts/TimeSeriesChart'
import { getBodyCompTrendSummary } from '../calculations/bodyCompTrendSummary'
import { parseSampleCSV } from '../data/storage'
import { useState } from 'react'

import sampleDataRaw from '../data/mock/measurements.csv?raw'
// import sampleDataRaw from '../data/mock/extra/sample_data5.csv?raw'
// import sampleDataRaw from '../data/mock/extra/sample_data_combined.csv?raw'
// import sampleDataRaw from '../data/mock/sample_data_few.csv?raw'
import sampleData2Raw from '../data/mock/sample_data2.csv?raw'
import sampleData3Raw from '../data/mock/sample_data3.csv?raw'
import MetricValue from '../components/ui/MetricValue'
// import TimeSeriesChart from '../components/charts/TimeSeriesChart'

import { useTheme } from '@mui/material/styles'
import { CompositionInsight, LeanNormalizedInsight } from '../components/plots/TrendInsight'
import PlotRegistry from '../components/plots/PlotRegistry'
import { findSlopeWindows } from '../calculations/windowSolver'
import { buildWindowBodyCompTable } from '../calculations/windowBodyComp'
// import { LeanVsBodyFatPlot, NormalizedMuscularityPlot, WeightBodyFatPlot, WeightVsWaistPlot } from '../components/trends/TrendPlot'

export default function Landing() {
  const [data, setData] = useState(() => parseSampleCSV(sampleDataRaw))
  // const data = getMeasurements()
  const smoothed = buildSmoothedBodyCompTable(data)
  const trend = getBodyCompTrendSummary(smoothed)
  const navigate = useNavigate()
  const slope_windows = buildWindowBodyCompTable(data, findSlopeWindows(data))
  // console.log(slope_windows);

  const [, forceRefresh] = useState(0)
  const refresh = () => forceRefresh(k => k + 1) 
  
  const handleSampleData = (path: string) => {
    setData(parseSampleCSV(path))
    forceRefresh((v) => v + 1)
    
  }

  return (
    <PageContainer>
      <Box sx={{ maxWidth: 1100, mx: 'auto', py: 6 }}>

        <Stack spacing={6}>

          {/* HEADER */}
          <Box>

            <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
            >
              Leanlytics - Body Composition Trends
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                mt: 0.5,
              }}
            >
              Understand your body changes — not just your weight
            </Typography>

            <Typography
              sx={{
                mt: 2,
                color: 'text.secondary',
                maxWidth: 850,
              }}
            >
            A system for tracking and reconstructing long term changes in body composition using weekly measurements. 
            Transforms noisy weight and circumference data into smoothed trends and normalized muscularity metrics.
            {/* Leanlytics reconstructs long-term body composition trends using simple weekly measurements, 
            filtering out daily noise from hydration, food, stress, and inconsistent weigh-ins.  */}
              {/* A system for tracking and reconstructing long term changes
              in body composition using weekly measurements. Transforms noisy weight and circumference data into smoothed trends and normalized muscularity metrics.  */}
            </Typography>

            {/* <Typography
              sx={{
                mt: 2,
                color: 'text.secondary',
                maxWidth: 850,
              }}
            >
              Track real physique progress beyond fluctuating scale weight
            </Typography> */}

          </Box>

          {/* TOP CARDS */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
          >

            <HoverCard sx={{ flex: 1 }}>
              <CardContent>

                <Typography sx={{ fontWeight: 600 }}>
                  Weekly Tracking
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary' }}
                >
                  One measurement per week. Minimal effort required.
                </Typography>

              </CardContent>
            </HoverCard>

            <HoverCard sx={{ flex: 1 }}>
              <CardContent>

                <Typography sx={{ fontWeight: 600 }}>
                  Body Fat Estimation
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary' }}
                >
                  Using waist and height measurements
                  {/* Navy method with lean mass and fat mass estimation. */}
                </Typography>

              </CardContent>
            </HoverCard>

            <HoverCard sx={{ flex: 1 }}>
              <CardContent>

                <Typography sx={{ fontWeight: 600 }}>
                  Time Trend Analysis
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary' }}
                >
                  Smoothed trends designed to reveal long term progress.
                </Typography>

              </CardContent>
            </HoverCard>

          </Stack>

          {/* HOW IT WORKS */}
          <Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              How Leanlytics works
            </Typography>

            <Card>
              <CardContent>

                <Stack spacing={3}>

                  <Box>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      What you input
                    </Typography>

                    <Box
                      component="ul"
                      sx={{
                        m: 0,
                        pl: 3,
                        color: 'text.secondary',
                      }}
                    >
                      <li>
                        Weight measurements
                      </li>

                      <li>
                        Waist circumference measurements
                      </li>

                      {/* <li>
                        Neck circumference measurements
                      </li> */}

                      <li>
                        Fixed profile values such as height and sex
                      </li>
                    </Box>

                  </Box>

                  <Box>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Computation
                    </Typography>

                    <Box
                      component="ul"
                      sx={{
                        m: 0,
                        pl: 3,
                        color: 'text.secondary',
                      }}
                    >
                      <li>
                        Estimates body fat percentage using a <a href="https://en.wikipedia.org/wiki/Waist-to-height_ratio" target='blank'>waist-to-height ratio</a> based model
                        {/* Calculates body fat percentage using the US Navy method */}
                      </li>

                      <li>
                        Decomposes body weight into estimated lean and fat mass
                        {/* Estimates how much of your weight change comes from lean vs fat mass */}
                        {/* Decomposes weight changes into estimated lean and fat mass */}
                        {/* Estimate whether weight changes came from fat or lean mass */}
                      </li>

                      <li>
                        Builds smoothed long term trends from weekly measurements
                      </li>

                      <li>
                        Reduces misleading fluctuations from hydration and day-to-day variance
                      </li>
                    </Box>

                  </Box>

                  <Box>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Trend Analysis
                      {/* Tracking over time */}
                    </Typography>

                    <Box
                      component="ul"
                      sx={{
                        m: 0,
                        pl: 3,
                        color: 'text.secondary',
                      }}
                    >
                      <li>
                        Tracks long term changes in body fat percentage
                      </li>

                      {/* <li>
                        Quantifies lean mass and fat mass progression over time
                      </li> */}

                      <li>
                        Evaluates the efficiency of weight gain and weight loss
                      </li>

                      <li>
                        Estimates how much of your weight change comes from muscle vs fat
                      </li>

                      <li>
                        Highlights long term direction rather than short term fluctuations
                        {/* Highlights long term direction rather than individual fluctuations */}
                      </li>
                    </Box>

                  </Box>

                  <Box>

                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      Normalized Muscularity
                    </Typography>

                    <Box
                      component="ul"
                      sx={{
                        m: 0,
                        pl: 3,
                        color: 'text.secondary',
                      }}
                    >
                      {/* <li>
                        Computes FFMI (Fat Free Mass Index)
                      </li> */}

                      <li>
                        {/* Provides body fat normalized metrics such as Lean mass @ BF15% */}
                        Provides body fat normalized metrics (e.g., Lean mass @ BF15%)
                        {/* Provides body fat normalized metrics such as FFMI @ BF15% */}
                      </li>

                      <li>
                        Tracks muscularity progression independent of body fat level
                        {/* Converts composition trends into body fat independent muscularity change */}
                      </li>

                      <li>
                        Enables comparison across cut, bulk, and maintenance phases
                        {/* Makes muscularity progression comparable across cut,
                        bulk, and maintenance phases */}
                      </li>

                      <li>
                        Quantifies monthly net muscularity gain or loss rate
                        {/* Quantifies net muscularity gain or loss rate on a monthly basis */}
                      </li>

                      {/* <li>
                        Enables comparison against reference physique and fitness categories
                      </li> */}
                    </Box>

                  </Box>

                </Stack>

              </CardContent>
            </Card>

          </Box>

          {/* DEMO */}
          <Card 
            // onClick={() => navigate({ to: '/dashboard' })}
          >

            <CardContent>

              <Typography sx={{ fontWeight: 600 }}>
                Live Example
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mb: 1}}
              >
                Try the full app instantly with sample data.
              </Typography>

              {/* <Box
                sx={{
                  mt: 2,
                  height: 140,
                  borderRadius: 2,
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888',
                }}
              > */}

        <HoverCard>
        <PlotRegistry
          type="weight-bodyfat"
          data={data}
          smoothed={smoothed}
        />
        {/* <WeightBodyFatPlot
          data={data}
          smoothed={smoothed}
        /> */}
        {/* <ChartCard title="Weight (kg) and Body Fat %">
          <TimeSeriesChart 
            data={charts.weightBodyfat(smoothed)} 
            label="Weight (kg)"
            labelRight = "Body Fat %"
            yDomainPadding = {2}
            yDomainRounding = {2}
            seriesColor = "#1976d2" 
            seriesLabel = "Smoothed Series"
            // seriesColor = "#333"
            // seriesLabel = "Raw Measurements"
            height = {190}
            series={[
              {
                key: 'weight',
                label: 'Weight (kg)',
                // color: "blue", 
                color: isDark ? '#dfdfdf' : '#333',
                // color: "#2222dd", 
                // color: '#1976d2',
                yAxisId: 'left'
              },
              {
                key: 'bodyFat',
                label: 'Body Fat %',
                color: '#ef4444',
                yAxisId: 'right'
              },
            ]}
          />
        </ChartCard> */}
        </HoverCard>

        {trend && (
          <CompositionInsight trend={trend} />
        )}

        {/* {trend && (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginTop: 1.5
            }}
        >
            <Typography variant="body2">
            Current Trend:{' '}
            <MetricValue tooltip={trend.weightPerMonthTooltip}>
                {Math.abs(trend.weightPerMonth).toFixed(2)}
                {' '}kg/month
            </MetricValue>
            {' '}
            weight {trend.weightPerMonth > 0? "gain": "loss"}, with estimated{' '}
            <MetricValue tooltip={trend.leanFatCompositionTooltip}>
                {
                    trend.weightPerMonth > 0? 
                        Math.abs(trend.leanPerMonth).toFixed(2):
                        Math.abs(trend.fatPerMonth).toFixed(2)
                }
                {' '}kg/month
            </MetricValue>
            {' '}
            {trend.weightPerMonth > 0? "lean": "fat"} mass {(trend.weightPerMonth > 0? trend.leanPerMonth: trend.fatPerMonth) > 0? "contribution": "reduction"} 
            {' '}
            <MetricValue tooltip={trend.leanContributionTooltip} bold = {false}>
            ({trend.weightPerMonth > 0? trend.leanContribution.toFixed(0) : trend.fatContribution.toFixed(0)}
            %)
            </MetricValue>
            .
            </Typography>
        </Box>
        )} */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
          backgroundColor: 'background.default', 
        }}
      >
        <HoverCard>
        <PlotRegistry
          type="weight-waist"
          data={data}
          smoothed={smoothed}
        />
        {/* <WeightVsWaistPlot
          data={data}
          smoothed={smoothed}
        /> */}
        {/* <ChartCard 
            title="Weight (kg) vs Waist (cm)"
            paperSx = {{
              backgroundColor: 'background.paper'
                // backgroundColor: '#fdfdfd'
            }}
        >
          <XYTimeSeriesChart 
            series={[
              {
                id: 'raw', 
                label: 'Raw Measurements',
                color: "#b33", 
                seriesColor: "#333", 
                type: "scatter", 
                dots: 2, 
                data: charts.weightVsWaist(data)
              }, 
              {
                id: 'smoothed', 
                label: 'Smoothed Series',
                dots: 0, 
                data: charts.weightVsWaist(smoothed)
              }
            ]} 
            xLabel = "Waist (cm)"
            yLabel = "Weight (kg)"
            displaySeriesLabel = {true}
            height = {180}
          />
        </ChartCard> */}
        </HoverCard>

        <HoverCard>
        <PlotRegistry
          type="lean-bodyfat"
          data={data}
          smoothed={smoothed}
        />
        {/* <LeanVsBodyFatPlot
          data={data}
          smoothed={smoothed}
        /> */}
        {/* <ChartCard 
            title="Lean mass (kg) vs Bodyfat %"
            paperSx = {{
                backgroundColor: 'background.paper'
            }}
        >
          <XYTimeSeriesChart 
            series={[
              {
                id: 'raw', 
                label: 'Raw Measurements',
                color: "#b33", 
                seriesColor: "#333", 
                type: "scatter", 
                dots: 2, 
                data: charts.leanMassVsBodyfat(data)
              }, 
              {
                id: 'smoothed', 
                label: 'Smoothed Series',
                dots: 0,
                data: charts.leanMassVsBodyfat(smoothed)
              }
            ]}  
            yLabel = "Lean mass (kg)"
            xLabel = "Bodyfat %"
            xDomainPadding={0.2}
            xDomainRounding={1}
            yDomainPadding={0.2}
            yDomainRounding={1}
            displaySeriesLabel = {true}
            height = {180}
          />
        </ChartCard> */}
        </HoverCard>

        <HoverCard>
        <PlotRegistry
          type="normalized-muscularity"
          data={data}
          smoothed={smoothed}
        />
        {/* <NormalizedMuscularityPlot
          data={data}
          smoothed={smoothed}
        >
        </NormalizedMuscularityPlot> */}
        {/* <ChartCard 
            title = "Normalized Muscularity (Lean @ 15%)"
            // title="Lean mass (kg) @ Body fat 15%"
            paperSx = {{
                backgroundColor: 'background.paper'
            }}
        >
          <XYTimeSeriesChart 
            series={[
            //   {
            //     id: 'raw', 
            //     label: 'Raw Measurements',
            //     color: "#b33", 
            //     type: "scatter", 
            //     dots: 2, 
            //     data: charts.LeanMassatBF15(data)
            //   }, 
              {
                id: 'smoothed', 
                label: 'Smoothed Series',
                dots: 0,
                data: charts.LeanMassatBF15(smoothed)
              }
            ]}  
            yLabel = "Lean mass (kg)"
            yValueLabel = "Lean@15%"
            xLabel = "Time"
            xAxisIsDate = {true}
            displaySeriesLabel = {true}
            height = {180}
          />
        </ChartCard> */}
        </HoverCard>

        {/* <ChartCard title="Lean mass (kg) @ Body fat 15%">
          <TimeSeriesChart 
            data={charts.LeanMassatBF15(smoothed)} 
            label = "Lean Mass (kg)"
            valueLabel = "Lean@BF15%"
            yDomainPadding = {0.1}
            yDomainRounding = {1}
          />
        </ChartCard> */}
        </div>

        {trend && (
          <LeanNormalizedInsight trend={trend} />
        )}

        {/* {trend && (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginTop: 1
            }}
        >
            <Typography
            variant="body2"
            sx={{ mt: 1, maxWidth: (trend.lean15PerMonth<-0.1? 730: 750)}}
            >
            {trend.lean15PerMonth<-0.1 && '⚠️ ' }           
            After body fat normalization,
            the trend suggests {
                trend.lean15PerMonth<-0.1 && 
                (trend.weightPerMonth>0? 
                'a disproportionate fat gain relative to lean gain, resulting in ':
                'a disproportionate lean loss relative to fat loss, resulting in ')
            }
            approximately{' '}
            <MetricValue tooltip={trend.lean15PerMonthTooltip}>
                {trend.lean15PerMonth?.toFixed(2)}
                {' '}kg/month
            </MetricValue>
            {' '}net muscularity {trend.lean15PerMonth>0? "gain" : "change"}{' '}
            (Lean @ 15%). 

            <Tooltip
              title={
                <span style={{ whiteSpace: 'pre-line' }}>
                  {trend.test_output}
                </span>
              }
            >
              <InfoOutlinedIcon
                sx={{
                  ml: 0.5,
                  fontSize: 16,
                  verticalAlign: 'middle',
                  color: 'text.secondary',
                  cursor: 'help',
                }}
              />
            </Tooltip>
            </Typography>
        </Box>
        )} */}

                {/* Dashboard preview */}
              {/* </Box> */}

            </CardContent>

          </Card>

          {/* ACTIONS */}
          <Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
            >

              <Button
                variant="contained"
                size="large"
                onClick= {() => handleSampleData(sampleDataRaw)}
                // onClick={() => navigate({ to: '/dashboard' })}
              >
                Try sample dataset
              </Button>

              <Button
                variant="contained"
                size="large"
                onClick= {() => handleSampleData(sampleData2Raw)}
                // onClick={() => navigate({ to: '/dashboard' })}
              >
                Try sample dataset 2
              </Button>

              <Button
                variant="contained"
                size="large"
                onClick= {() => handleSampleData(sampleData3Raw)}
                // onClick={() => navigate({ to: '/dashboard' })}
              >
                Try sample dataset 3
              </Button>

              <Button
                component={Link}
                to="/measurements"
                variant="outlined"
                size="large"
              >
                Start tracking
              </Button>
              {/* <Button
                variant="outlined"
                size="large"
              >
                Start tracking
              </Button> */}

            </Stack>

          </Box>

        </Stack>

      </Box>
    </PageContainer>
  )
}