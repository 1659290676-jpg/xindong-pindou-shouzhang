Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "assets\levels"
$outFile = Join-Path $outDir "fixed-levels.js"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$levels = @(
  @{ id = "1"; src = "assets/level-1.png"; maxColors = 3;  brightness = -2;  contrast = 54; saturation = 106 },
  @{ id = "2"; src = "assets/level-2.png"; maxColors = 4;  brightness = -13; contrast = 14; saturation = 46 },
  @{ id = "3"; src = "assets/level-3.png"; maxColors = 5;  brightness = -13; contrast = 14; saturation = 46 },
  @{ id = "4"; src = "assets/level-4.png"; maxColors = 6;  brightness = -13; contrast = 14; saturation = 55 },
  @{ id = "5"; src = "assets/level-5.png"; maxColors = 6;  brightness = -13; contrast = 14; saturation = 55 },
  @{ id = "6"; src = "assets/level-6.png"; maxColors = 4;  brightness = -13; contrast = 14; saturation = 55 },
  @{ id = "7"; src = "assets/level-7.png"; maxColors = 5;  brightness = -13; contrast = 14; saturation = 55 },
  @{ id = "8"; src = "assets/level-8.png"; maxColors = 6;  brightness = -13; contrast = 14; saturation = 55 },
  @{ id = "9"; src = "assets/level-9.png"; maxColors = 5;  brightness = -13; contrast = 14; saturation = 55 },
  @{ id = "10"; src = "assets/level-10.png"; maxColors = 8; brightness = -13; contrast = 14; saturation = 55 }
)

function Clamp-Number($value, $min, $max) {
  return [Math]::Max($min, [Math]::Min($max, $value))
}

function Adjust-Color($r, $g, $b, $settings) {
  $brightness = $settings.brightness * 2.2
  $contrast = 1 + $settings.contrast / 100
  $saturation = 1 + $settings.saturation / 100

  $r = ($r - 128) * $contrast + 128 + $brightness
  $g = ($g - 128) * $contrast + 128 + $brightness
  $b = ($b - 128) * $contrast + 128 + $brightness

  $gray = $r * 0.299 + $g * 0.587 + $b * 0.114
  $r = $gray + ($r - $gray) * $saturation
  $g = $gray + ($g - $gray) * $saturation
  $b = $gray + ($b - $gray) * $saturation

  return @{
    r = [int][Math]::Round((Clamp-Number $r 0 255))
    g = [int][Math]::Round((Clamp-Number $g 0 255))
    b = [int][Math]::Round((Clamp-Number $b 0 255))
  }
}

function Quantize-Color($rgb) {
  $step = 17
  return @{
    r = [int]([Math]::Round($rgb.r / $step) * $step)
    g = [int]([Math]::Round($rgb.g / $step) * $step)
    b = [int]([Math]::Round($rgb.b / $step) * $step)
  }
}

function Rgb-ToHex($rgb) {
  return ("#{0:X2}{1:X2}{2:X2}" -f (Clamp-Number $rgb.r 0 255), (Clamp-Number $rgb.g 0 255), (Clamp-Number $rgb.b 0 255)).ToLower()
}

function Color-Distance($a, $b) {
  return [Math]::Abs($a.r - $b.r) * 1.1 + [Math]::Abs($a.g - $b.g) + [Math]::Abs($a.b - $b.b) * 0.9
}

function Build-Palette($colors, $maxColors) {
  $unique = @{}
  foreach ($color in $colors) {
    $unique[(Rgb-ToHex $color)] = $color
  }
  $uniqueColors = @($unique.Values)
  if ($maxColors -eq 0 -or $uniqueColors.Count -le $maxColors) {
    return $uniqueColors
  }

  $centers = @()
  for ($i = 0; $i -lt $maxColors; $i++) {
    $c = $uniqueColors[$i]
    $centers += @{ r = $c.r; g = $c.g; b = $c.b }
  }

  for ($iteration = 0; $iteration -lt 8; $iteration++) {
    $buckets = @()
    for ($i = 0; $i -lt $centers.Count; $i++) { $buckets += ,@() }

    foreach ($color in $uniqueColors) {
      $bestIndex = 0
      $bestDistance = [double]::PositiveInfinity
      for ($i = 0; $i -lt $centers.Count; $i++) {
        $distance = Color-Distance $color $centers[$i]
        if ($distance -lt $bestDistance) {
          $bestIndex = $i
          $bestDistance = $distance
        }
      }
      $buckets[$bestIndex] += $color
    }

    for ($i = 0; $i -lt $buckets.Count; $i++) {
      if ($buckets[$i].Count -eq 0) { continue }
      $sumR = 0
      $sumG = 0
      $sumB = 0
      foreach ($bucketColor in $buckets[$i]) {
        $sumR += $bucketColor.r
        $sumG += $bucketColor.g
        $sumB += $bucketColor.b
      }
      $centers[$i] = @{
        r = [int][Math]::Round($sumR / $buckets[$i].Count)
        g = [int][Math]::Round($sumG / $buckets[$i].Count)
        b = [int][Math]::Round($sumB / $buckets[$i].Count)
      }
    }
  }

  $deduped = @{}
  foreach ($center in $centers) {
    $q = Quantize-Color $center
    $deduped[(Rgb-ToHex $q)] = $q
  }
  return @($deduped.Values)
}

function Nearest-Color($rgb, $palette) {
  $best = $palette[0]
  $bestDistance = [double]::PositiveInfinity
  foreach ($color in $palette) {
    $distance = Color-Distance $rgb $color
    if ($distance -lt $bestDistance) {
      $best = $color
      $bestDistance = $distance
    }
  }
  return $best
}

function Build-Level($level) {
  $cols = 30
  $rows = 30
  $backgroundCutoff = 250
  $minInkRatio = 0.008
  $canvasWidth = $cols * 12
  $canvasHeight = $rows * 12
  $imagePath = Join-Path $root $level.src

  $sourceImage = [System.Drawing.Image]::FromFile($imagePath)
  $source = [System.Drawing.Bitmap]::new($sourceImage)
  $canvas = [System.Drawing.Bitmap]::new($canvasWidth, $canvasHeight)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $graphics.Clear([System.Drawing.Color]::White)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

  $fitScale = [Math]::Min($canvasWidth / $source.Width, $canvasHeight / $source.Height)
  $drawScale = $fitScale
  $drawWidth = $source.Width * $drawScale
  $drawHeight = $source.Height * $drawScale
  $drawX = ($canvasWidth - $drawWidth) / 2
  $drawY = ($canvasHeight - $drawHeight) / 2
  $graphics.DrawImage($source, [float]$drawX, [float]$drawY, [float]$drawWidth, [float]$drawHeight)

  $cells = @()
  $colors = @()
  $sampleW = $canvasWidth / $cols
  $sampleH = $canvasHeight / $rows

  for ($row = 0; $row -lt $rows; $row++) {
    $rowCells = @()
    for ($col = 0; $col -lt $cols; $col++) {
      $startX = [int][Math]::Floor($col * $sampleW)
      $startY = [int][Math]::Floor($row * $sampleH)
      $width = [Math]::Max(1, [int][Math]::Floor($sampleW))
      $height = [Math]::Max(1, [int][Math]::Floor($sampleH))
      $count = 0
      $r = 0
      $g = 0
      $b = 0

      for ($y = $startY; $y -lt $startY + $height; $y++) {
        for ($x = $startX; $x -lt $startX + $width; $x++) {
          $pixel = $canvas.GetPixel($x, $y)
          $isBackground = $pixel.A -lt 8 -or ($pixel.R -gt $backgroundCutoff -and $pixel.G -gt $backgroundCutoff -and $pixel.B -gt $backgroundCutoff)
          if ($isBackground) { continue }
          $adjusted = Adjust-Color $pixel.R $pixel.G $pixel.B $level
          $count += 1
          $r += $adjusted.r
          $g += $adjusted.g
          $b += $adjusted.b
        }
      }

      if ($count -eq 0 -or ($count / ($width * $height)) -lt $minInkRatio) {
        $rowCells += $null
        continue
      }

      $sampled = Quantize-Color @{
        r = [int][Math]::Round($r / $count)
        g = [int][Math]::Round($g / $count)
        b = [int][Math]::Round($b / $count)
      }
      $colors += $sampled
      $rowCells += ,@($sampled)
    }
    $cells += ,@($rowCells)
  }

  $paletteRgb = @(Build-Palette $colors $level.maxColors)
  if ($paletteRgb.Count -eq 0) {
    throw "Level $($level.id) did not produce any active cells."
  }

  $palette = @()
  $paletteByHex = @{}
  for ($i = 0; $i -lt $paletteRgb.Count; $i++) {
    $key = "C{0:D2}" -f ($i + 1)
    $hex = Rgb-ToHex $paletteRgb[$i]
    $palette += @{ key = $key; color = $hex }
    $paletteByHex[$hex] = $key
  }

  $matrix = @()
  foreach ($rowCells in $cells) {
    $matrixRow = @()
    foreach ($cell in $rowCells) {
      if ($null -eq $cell) {
        $matrixRow += $null
        continue
      }
      $matched = Nearest-Color $cell $paletteRgb
      $matrixRow += $paletteByHex[(Rgb-ToHex $matched)]
    }
    $matrix += ,@($matrixRow)
  }

  $source.Dispose()
  $sourceImage.Dispose()
  $graphics.Dispose()
  $canvas.Dispose()

  return @{
    id = "level-$($level.id)"
    name = "关卡 $($level.id)"
    sourceName = "level-$($level.id).png"
    sourceImage = "./$($level.src)"
    rows = $rows
    cols = $cols
    settings = @{
      cols = 30
      rows = 30
      maxColors = $level.maxColors
      offsetX = 0
      offsetY = 0
      imageScale = 100
      brightness = $level.brightness
      contrast = $level.contrast
      saturation = $level.saturation
    }
    palette = $palette
    matrix = $matrix
    createdAt = (Get-Date).ToUniversalTime().ToString("o")
  }
}

$fixed = @{}
foreach ($level in $levels) {
  Write-Host "Building level $($level.id)..."
  $fixed[$level.id] = Build-Level $level
}

$json = $fixed | ConvertTo-Json -Depth 100 -Compress
$content = "window.NEKO_FIXED_LEVELS = $json;`n"
Set-Content -LiteralPath $outFile -Value $content -Encoding UTF8
Write-Host "Wrote $outFile"
