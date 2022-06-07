# square-dxf-checker
Square-dxf-checker can check a model written in a dxf file to define that it is square or rectangle plate.
If the model is square or rectangle plate, this npm would show you the dxf file information, which is the coordinates, lines, area about front view.
For side view information, square-dxf-checker will display thickness other than the coordinates, lines.

This npm would be able to scan a dxf file created with Windows PC.

example below:

![0q2nkepabq2xf5uup2o8r0fy66dt](https://user-images.githubusercontent.com/76944527/171401619-c0e031ef-9c68-4225-80fd-75d60cd80a98.png)

```shell
【Side View】
Vertical line in side view:
 [
  {
    StartPoint: [ '324.126701', '199.219757' ],
    EndPoint: [ '324.126701', '99.219757' ]
  },
  {
    StartPoint: [ '334.126701', '199.219757' ],
    EndPoint: [ '334.126701', '99.219757' ]
  }
]
Length of first line: 100
Length of second line: 100
These lines are same length.

Horizontal line in side view:
 [
  {
    StartPoint: [ '324.126701', '99.219757' ],
    EndPoint: [ '334.126701', '99.219757' ]
  },
  {
    StartPoint: [ '324.126701', '199.219757' ],
    EndPoint: [ '334.126701', '199.219757' ]
  }
]
Length of first line: 10
Length of second line: 10
These lines are same length.

Main points in vertical line: [ '199.219757', '324.126701', '334.126701', '99.219757' ]
Main points in horizontal line: [ '199.219757', '324.126701', '334.126701', '99.219757' ]
Coordinates in horizontal lines and vertical lines are matching each other.

Thickness: 10 

【Front View】
Vertical line in front view:
 [
  {
    StartPoint: [ '293.924544', '199.219757' ],
    EndPoint: [ '293.924544', '99.219757' ]
  },
  {
    StartPoint: [ '93.924544', '99.219757' ],
    EndPoint: [ '93.924544', '199.219757' ]
  }
]
Length of first line: 100
Length of second line: 100
These lines are same length.

Horizontal line in front view:
 [
  {
    StartPoint: [ '93.924544', '199.219757' ],
    EndPoint: [ '293.924544', '199.219757' ]
  },
  {
    StartPoint: [ '293.924544', '99.219757' ],
    EndPoint: [ '93.924544', '99.219757' ]
  }
]
Length of first line: 200
Length of second line: 200
These lines are same length.

Main points in vertical line: [ '199.219757', '293.924544', '93.924544', '99.219757' ]
Main points in horizontal line: [ '199.219757', '293.924544', '93.924544', '99.219757' ]
Coordinates in horizontal lines and vertical lines are matching each other.

Area in front view: 100 * 200 = 20000
```

## Installation

```
$ npm i -g square-dxf-checker
```

## Usage
1. Prepare a dxf file you want scan.
2. Run square-dxf-checker as below.
```shell
$ square-dxf-checker example.dxf
```
3. It will display the result.
