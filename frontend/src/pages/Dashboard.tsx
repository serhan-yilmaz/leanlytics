import PageHeader from '../components/ui/PageHeader'
import PageContainer from '../components/ui/PageContainer'

import ChartCard from '../components/ui/ChartCard'

import TimeSeriesChart from '../components/charts/TimeSeriesChart.tsx'

import { getMeasurements, saveMeasurements, sortMeasurements } from '../data/measurements'

import { useNavigate } from '@tanstack/react-router'

import {
  charts,
} from '../calculations/chartSeries'
import XYTimeSeriesChart from '../components/charts/XYTimeSeriesChart.tsx'
import { buildSmoothedBodyCompTable } from '../calculations/bodyCompSeries.ts'
import { parseSampleCSV } from '../data/storage.ts'

import { Button, Paper, Stack, Typography } from '@mui/material'
import sampleDataRaw from '../data/mock/measurements.csv?raw'
import { findSlopeWindows } from '../calculations/windowSolver.ts'
import { buildWindowBodyCompEstimateTable, buildWindowBodyCompTable, solveEstimateWindows } from '../calculations/windowBodyComp.ts'
import TrendWindowsSection from '../components/plots/TrendWindowsSection.tsx'
import { useState } from 'react'
import BodyCompositionSection from '../components/plots/BodyCompositionSection.tsx'

export default function Dashboard() {
  const navigate = useNavigate()
  
  const data = sortMeasurements(getMeasurements())
  const hasData = data.length > 0

  const [analysisMeasurementIndex, setAnalysisMeasurementIndex] = useState(0);
  const [customComparisonIndex, onCustomComparisonIndexChange] =
    useState<number | undefined>(undefined)

  const smoothed = buildSmoothedBodyCompTable(data)

  const slopeSolutionResults = findSlopeWindows(data, analysisMeasurementIndex)

  const validWindowTarget = (
    customComparisonIndex != undefined && 
    customComparisonIndex<slopeSolutionResults.targets.length
  )? slopeSolutionResults.targets[customComparisonIndex] : undefined

  const slopeWindows = buildWindowBodyCompTable(
    data, 
    findSlopeWindows(data, analysisMeasurementIndex, validWindowTarget)
  )

  const pointEstimateResults = buildWindowBodyCompEstimateTable(
    data, 
    solveEstimateWindows(data, analysisMeasurementIndex)
  )
  console.log(pointEstimateResults)

  // console.log(validWindowTarget);
  // console.log(slopeSolutionResults.targets);
  // console.log(slopeWindows);
  
  const handleSampleData = () => {
    saveMeasurements(parseSampleCSV(sampleDataRaw)) 
    window.location.reload() 
  }

  if (!hasData) {
    return (
      <>
        <PageHeader title="Dashboard" />

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
              Start tracking your body composition or try a sample dataset.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleSampleData}
              >
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
      <PageHeader title="Dashboard" />

      <PageContainer>
      <TrendWindowsSection
          slopeWindows={slopeWindows}
          windowSolutionResults={slopeSolutionResults}
          measurements={data}
          analysisMeasurementIndex={analysisMeasurementIndex}
          onAnalysisMeasurementIndexChange={setAnalysisMeasurementIndex} 
          customComparisonIndex={customComparisonIndex} 
          onCustomComparisonIndexChange={onCustomComparisonIndexChange}
      />
      <BodyCompositionSection
        estimateResults={pointEstimateResults}
        measurements={data}
        analysisMeasurementIndex={analysisMeasurementIndex}
        onAnalysisMeasurementIndexChange={setAnalysisMeasurementIndex}
      />
        {/* <TrendWindowsSection slopeWindows={slopeWindows}/> */}

        <ChartCard title="Body Weight (kg)">
          <TimeSeriesChart 
            data={charts.weight(data)} 
            label = "Weight (kg)"
            valueLabel = "Weight (kg)"
          />
        </ChartCard>
        <ChartCard title="Waist (cm)">
          <TimeSeriesChart 
            data={charts.waist(data)} 
            label = "Waist (cm)"
            valueLabel = "Waist (cm)"
          />
        </ChartCard>
        <ChartCard title="Body fat %">
          <TimeSeriesChart 
            data={charts.bodyFat(data)} 
            label = "Bodyfat %"
            valueLabel = "Bodyfat %"
            yDomainPadding = {1}
          />
        </ChartCard>
        <ChartCard title="Lean and Fat Mass (kg)">
          <TimeSeriesChart 
            data={charts.leanFatMass(data)} 
            label="Lean Mass (kg)"
            labelRight = "Fat Mass (kg)"
            series={[
              {
                key: 'leanMass',
                label: 'Lean Mass',
                color: '#14b8a6',
                yAxisId: 'left'
              },
              {
                key: 'fatMass',
                label: 'Fat Mass',
                color: '#ef4444',
                yAxisId: 'right'
              },
            ]}
          />
        </ChartCard>
        <ChartCard title="Fat free mass index (FFMI)">
          <TimeSeriesChart 
            data={charts.FFMI(data)} 
            label = "FFMI"
            valueLabel = "FFMI"
            yDomainPadding = {0.2}
            yDomainRounding = {1}
          />
        </ChartCard>
        <ChartCard title="Fat free mass index (FFMI) @ Body fat 15%">
          <TimeSeriesChart 
            data={charts.FFMIatBF15(data)} 
            label = "FFMI"
            valueLabel = "FFMI @BF15%"
            yDomainPadding = {0.1}
            yDomainRounding = {1}
          />
        </ChartCard>
      <div
        style={{
          display: 'grid',
          // gridTemplateColumns: '1fr 1fr',
          gridTemplateColumns: '1fr',
          gap: 16,
        }}
      >
        <ChartCard 
          title="Weight (kg) vs Waist (cm)"
        >
          <XYTimeSeriesChart 
            series={[
              {
                id: 'raw', 
                label: 'Raw Measurements',
                color: "#b33", 
                type: "scatter", 
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
          />
        </ChartCard>

        <ChartCard title="Lean mass (kg) vs Bodyfat %">
          <XYTimeSeriesChart 
            series={[
              {
                id: 'raw', 
                label: 'Raw Measurements',
                color: "#b33", 
                type: "scatter", 
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
            displaySeriesLabel = {true}
          />
        </ChartCard>
      </div>
      </PageContainer>
    </>
  )
}