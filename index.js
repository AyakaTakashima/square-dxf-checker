#!/usr/bin/env node

const fs = require('fs')

const Argv = process.argv.slice(2)

const indexOfXCoordinate = 0
const indexOfYCoordinate = 1

function Main () {
  const fileText = fs.readFileSync(Argv[0])
  const lines = fileText.toString().split('\r\n')
  Coordinates.find(lines)
}

class Coordinates {
  static find (lines) {
    const verticalLineCoordinateInSideView = []
    const horizontalLineCoordinateInSideView = []
    const verticalLineCoordinateInFrontView = []
    const horizontalLineCoordinateInFrontView = []
    const otherLines = []

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === 'AcDbLine' && lines[i - 6] !== 'Dimensions') {
        const startPoint = [lines[i + 2], lines[i + 4]]
        const endPoint = [lines[i + 8], lines[i + 10]]
        const bothEndsOfSide = { startPoint, endPoint }
        const differenceOfxCoordinate = (Math.round(lines[i + 2] * 10) - Math.round(lines[i + 8] * 10)) / 10
        const differenceOfyCoordinate = (Math.round(lines[i + 4] * 10) - Math.round(lines[i + 10] * 10)) / 10

        if (differenceOfxCoordinate === 0 && lines[i + 13] === '210') {
          verticalLineCoordinateInSideView.push(bothEndsOfSide)
        } else if (lines[i + 13] === '210') {
          horizontalLineCoordinateInSideView.push(bothEndsOfSide)
        } else if (differenceOfxCoordinate === 0) {
          verticalLineCoordinateInFrontView.push(bothEndsOfSide)
        } else if (differenceOfyCoordinate === 0) {
          horizontalLineCoordinateInFrontView.push(bothEndsOfSide)
        } else {
          otherLines.push(bothEndsOfSide)
        }
      }
    }

    if (otherLines.length) {
      console.log('ModelError: This model is not square or rectangle.\n')
    }

    SideViewInfo.displayLineInfo(verticalLineCoordinateInSideView, horizontalLineCoordinateInSideView)
    FrontViewInfo.displayLineInfo(verticalLineCoordinateInFrontView, horizontalLineCoordinateInFrontView)
  }

  static getAllPoints (allPoints, pareOfCoordinatesOfLine) {
    try {
      const line1 = pareOfCoordinatesOfLine[0]
      const line2 = pareOfCoordinatesOfLine[1]
      allPoints.push(line1.startPoint[0], line1.startPoint[1], line1.endPoint[0], line1.endPoint[1])
      allPoints.push(line2.startPoint[0], line2.startPoint[1], line2.endPoint[0], line2.endPoint[1])
      return Array.from(new Set(allPoints)).sort()
    } catch (e) {
      console.log('')
    }
  }

  static matchPointWithOtherDirectionLine (pareOfCoordinatesOfVerticalLine, pareOfCoordinatesOfHorizontalLine) {
    const allPointsInVerticalLine = []
    const allPointsInHorizontalLine = []
    const fourPointsInVerticalLine = Coordinates.getAllPoints(allPointsInVerticalLine, pareOfCoordinatesOfVerticalLine)
    const fourPointsInHorizontalLine = Coordinates.getAllPoints(allPointsInHorizontalLine, pareOfCoordinatesOfHorizontalLine)

    console.log('Main points in vertical line:', fourPointsInVerticalLine)
    console.log('Main points in horizontal line:', fourPointsInHorizontalLine)
    if (typeof fourPointsInVerticalLine === 'undefined' || typeof fourPointsInHorizontalLine === 'undefined') {
      console.log('PointsError: There is no points for vertical or horizontal line.')
    } else if (JSON.stringify(fourPointsInVerticalLine) === JSON.stringify(fourPointsInHorizontalLine)) {
      console.log('Coordinates in horizontal lines and vertical lines are matching each other.\n')
    } else {
      console.log('PointsError: Coordinates in horizontal and vertical lines are not matching each other.\n')
    }
  }
}

class SideViewInfo {
  static async displayLineInfo (verticalLineCoordinateInSideView, horizontalLineCoordinateInSideView) {
    const heightAndWidth = []
    console.log('【Side View】')
    console.log('Vertical line in side view:\n', verticalLineCoordinateInSideView)
    console.log(Line.verifyLine(verticalLineCoordinateInSideView, indexOfYCoordinate, heightAndWidth))
    console.log('Horizontal line in side view:\n', horizontalLineCoordinateInSideView)
    console.log(Line.verifyLine(horizontalLineCoordinateInSideView, indexOfXCoordinate, heightAndWidth))
    Coordinates.matchPointWithOtherDirectionLine(verticalLineCoordinateInSideView, horizontalLineCoordinateInSideView)

    if (heightAndWidth.length === 2) {
      const Thickness = SolidInfo.GetThickness(heightAndWidth)
      console.log('Thickness:', Thickness, '\n')
    } else {
      return ''
    }
  }
}

class FrontViewInfo {
  static displayLineInfo (verticalLineCoordinateInFrontView, horizontalLineCoordinateInFrontView) {
    const heightAndWidth = []
    console.log('【Front View】')
    console.log('Vertical line in front view:\n', verticalLineCoordinateInFrontView)
    console.log(Line.verifyLine(verticalLineCoordinateInFrontView, indexOfYCoordinate, heightAndWidth))
    console.log('Horizontal line in front view:\n', horizontalLineCoordinateInFrontView)
    console.log(Line.verifyLine(horizontalLineCoordinateInFrontView, indexOfXCoordinate, heightAndWidth))
    Coordinates.matchPointWithOtherDirectionLine(verticalLineCoordinateInFrontView, horizontalLineCoordinateInFrontView)

    if (heightAndWidth.length === 2) {
      const areaInFrontView = SolidInfo.calculateAreaPerSide(heightAndWidth)
      console.log('Area in front view:', `${heightAndWidth[0]} * ${heightAndWidth[1]} = ${areaInFrontView}`)
    } else {
      return ''
    }
  }
}

class Line {
  static verifyLine (lineCoordinate, index, heightAndWidth) {
    try {
      const lengthOfLine1 = (Math.round(lineCoordinate[0].startPoint[index] * 10) - Math.round(lineCoordinate[0].endPoint[index] * 10)) / 10
      const lengthOfLine2 = (Math.round(lineCoordinate[1].startPoint[index] * 10) - Math.round(lineCoordinate[1].endPoint[index] * 10)) / 10
      console.log('Length of first line:', Math.abs(lengthOfLine1))
      console.log('Length of second line:', Math.abs(lengthOfLine1))
      if (Math.abs(lengthOfLine1) === Math.abs(lengthOfLine2)) {
        console.log('These lines are same length.')
        heightAndWidth.push(Math.abs(lengthOfLine1))
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
  static calculateAreaPerSide (heightAndWidth) {
    return Math.abs(heightAndWidth[0]) * Math.abs(heightAndWidth[1])
  }

  static GetThickness (heightAndWidth) {
    return heightAndWidth[1]
  }
}

Main()
