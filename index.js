#!/usr/bin/env node

const fs = require('fs')

const Argv = process.argv.slice(2)

const IndexOfXCoordinate = 0
const IndexOfYCoordinate = 1

function Main () {
  const fileText = fs.readFileSync(Argv[0])
  const lines = fileText.toString().split('\r\n')
  Coordinates.Find(lines)
}

class Coordinates {
  static Find (lines) {
    const VerticalLineCoordinateInSideView = []
    const HorizontalLineCoordinateInSideView = []
    const VerticalLineCoordinateInFrontView = []
    const HorizontalLineCoordinateInFrontView = []
    const OtherLines = []

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === 'AcDbLine' && lines[i - 6] !== 'Dimensions') {
        const StartPoint = [lines[i + 2], lines[i + 4]]
        const EndPoint = [lines[i + 8], lines[i + 10]]
        const BothEndsOfSide = { StartPoint, EndPoint }
        const DifferenceOfxCoordinate = (Math.round(lines[i + 2] * 10) - Math.round(lines[i + 8] * 10)) / 10
        const DifferenceOfyCoordinate = (Math.round(lines[i + 4] * 10) - Math.round(lines[i + 10] * 10)) / 10

        if (DifferenceOfxCoordinate === 0 && lines[i + 13] === '210') {
          VerticalLineCoordinateInSideView.push(BothEndsOfSide)
        } else if (lines[i + 13] === '210') {
          HorizontalLineCoordinateInSideView.push(BothEndsOfSide)
        } else if (DifferenceOfxCoordinate === 0) {
          VerticalLineCoordinateInFrontView.push(BothEndsOfSide)
        } else if (DifferenceOfyCoordinate === 0) {
          HorizontalLineCoordinateInFrontView.push(BothEndsOfSide)
        } else {
          OtherLines.push(BothEndsOfSide)
        }
      }
    }

    if (OtherLines.length) {
      console.log('ModelError: This model is not square or rectangle.\n')
    }

    SideViewInfo.DisplayLineInfo(VerticalLineCoordinateInSideView, HorizontalLineCoordinateInSideView)
    FrontViewInfo.DisplayLineInfo(VerticalLineCoordinateInFrontView, HorizontalLineCoordinateInFrontView)
  }

  static GetAllPoints (AllPoints, PareOfCoordinatesOfLine) {
    try {
      const Line1 = PareOfCoordinatesOfLine[0]
      const Line2 = PareOfCoordinatesOfLine[1]
      AllPoints.push(Line1.StartPoint[0], Line1.StartPoint[1], Line1.EndPoint[0], Line1.EndPoint[1])
      AllPoints.push(Line2.StartPoint[0], Line2.StartPoint[1], Line2.EndPoint[0], Line2.EndPoint[1])
      return Array.from(new Set(AllPoints)).sort()
    } catch (e) {
      console.log('')
    }
  }

  static MatchPointWithOtherDirectionLine (PareOfCoordinatesOfVerticalLine, PareOfCoordinatesOfHorizontalLine) {
    const AllPointsInVerticalLine = []
    const AllPointsInHorizontalLine = []
    const FourPointsInVerticalLine = Coordinates.GetAllPoints(AllPointsInVerticalLine, PareOfCoordinatesOfVerticalLine)
    const FourPointsInHorizontalLine = Coordinates.GetAllPoints(AllPointsInHorizontalLine, PareOfCoordinatesOfHorizontalLine)

    console.log('Main points in vertical line:', FourPointsInVerticalLine)
    console.log('Main points in horizontal line:', FourPointsInHorizontalLine)
    if (typeof FourPointsInVerticalLine === 'undefined' || typeof FourPointsInHorizontalLine === 'undefined') {
      console.log('PointsError: There is no points for vertical or horizontal line.')
    } else if (JSON.stringify(FourPointsInVerticalLine) === JSON.stringify(FourPointsInHorizontalLine)) {
      console.log('Coordinates in horizontal lines and vertical lines are matching each other.\n')
    } else {
      console.log('PointsError: Coordinates in horizontal and vertical lines are not matching each other.\n')
    }
  }
}

class SideViewInfo {
  static async DisplayLineInfo (VerticalLineCoordinateInSideView, HorizontalLineCoordinateInSideView) {
    const HeightAndWidth = []
    console.log('【Side View】')
    console.log('Vertical line in side view:\n', VerticalLineCoordinateInSideView)
    console.log(Line.VerifyLine(VerticalLineCoordinateInSideView, IndexOfYCoordinate, HeightAndWidth))
    console.log('Horizontal line in side view:\n', HorizontalLineCoordinateInSideView)
    console.log(Line.VerifyLine(HorizontalLineCoordinateInSideView, IndexOfXCoordinate, HeightAndWidth))
    Coordinates.MatchPointWithOtherDirectionLine(VerticalLineCoordinateInSideView, HorizontalLineCoordinateInSideView)

    if (HeightAndWidth.length === 2) {
      const Thickness = SolidInfo.GetThickness(HeightAndWidth)
      console.log('Thickness:', Thickness, '\n')
    } else {
      return ''
    }
  }
}

class FrontViewInfo {
  static DisplayLineInfo (VerticalLineCoordinateInFrontView, HorizontalLineCoordinateInFrontView) {
    const HeightAndWidth = []
    console.log('【Front View】')
    console.log('Vertical line in front view:\n', VerticalLineCoordinateInFrontView)
    console.log(Line.VerifyLine(VerticalLineCoordinateInFrontView, IndexOfYCoordinate, HeightAndWidth))
    console.log('Horizontal line in front view:\n', HorizontalLineCoordinateInFrontView)
    console.log(Line.VerifyLine(HorizontalLineCoordinateInFrontView, IndexOfXCoordinate, HeightAndWidth))
    Coordinates.MatchPointWithOtherDirectionLine(VerticalLineCoordinateInFrontView, HorizontalLineCoordinateInFrontView)

    if (HeightAndWidth.length === 2) {
      const AreaInFrontView = SolidInfo.CalculateAreaPerSide(HeightAndWidth)
      console.log('Area in front view:', `${HeightAndWidth[0]} * ${HeightAndWidth[1]} = ${AreaInFrontView}`)
    } else {
      return ''
    }
  }
}

class Line {
  static VerifyLine (LineCoordinate, index, HeightAndWidth) {
    try {
      const LengthOfLine1 = (Math.round(LineCoordinate[0].StartPoint[index] * 10) - Math.round(LineCoordinate[0].EndPoint[index] * 10)) / 10
      const LengthOfLine2 = (Math.round(LineCoordinate[1].StartPoint[index] * 10) - Math.round(LineCoordinate[1].EndPoint[index] * 10)) / 10
      console.log('Length of first line:', Math.abs(LengthOfLine1))
      console.log('Length of second line:', Math.abs(LengthOfLine1))
      if (Math.abs(LengthOfLine1) === Math.abs(LengthOfLine2)) {
        console.log('These lines are same length.')
        HeightAndWidth.push(Math.abs(LengthOfLine1))
      } else {
        console.log('These lines are different length.')
      }
      return ''
    } catch (e) {
      return 'LineError: There is no vertical or horizontal line.\n'
    }
  }
}

class SolidInfo {
  static CalculateAreaPerSide (HeightAndWidth) {
    return Math.abs(HeightAndWidth[0]) * Math.abs(HeightAndWidth[1])
  }

  static GetThickness (HeightAndWidth) {
    return HeightAndWidth[1]
  }
}

Main()
