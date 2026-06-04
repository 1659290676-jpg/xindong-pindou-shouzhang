$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

function ClampValue([double] $value, [double] $min, [double] $max) {
  [Math]::Max($min, [Math]::Min($max, $value))
}

function RgbToHex($rgb) {
  "#{0:x2}{1:x2}{2:x2}" -f [int] $rgb.r, [int] $rgb.g, [int] $rgb.b
}

function AdjustColor($rgb, $settings) {
  $r = [double] $rgb.r
  $g = [double] $rgb.g
  $b = [double] $rgb.b
  $brightness = [double] $settings.brightness * 2.2
  $contrast = 1 + ([double] $settings.contrast / 100)
  $saturation = 1 + ([double] $settings.saturation / 100)

  $r = ($r - 128) * $contrast + 128 + $brightness
  $g = ($g - 128) * $contrast + 128 + $brightness
  $b = ($b - 128) * $contrast + 128 + $brightness

  $gray = $r * 0.299 + $g * 0.587 + $b * 0.114
  $r = $gray + ($r - $gray) * $saturation
  $g = $gray + ($g - $gray) * $saturation
  $b = $gray + ($b - $gray) * $saturation

  [pscustomobject]@{
    r = [int] [Math]::Round((ClampValue $r 0 255))
    g = [int] [Math]::Round((ClampValue $g 0 255))
    b = [int] [Math]::Round((ClampValue $b 0 255))
  }
}

function QuantizeColor($rgb) {
  $step = 17
  [pscustomobject]@{
    r = [int] ([Math]::Floor(([double] $rgb.r / $step) + 0.5) * $step)
    g = [int] ([Math]::Floor(([double] $rgb.g / $step) + 0.5) * $step)
    b = [int] ([Math]::Floor(([double] $rgb.b / $step) + 0.5) * $step)
  }
}

function ColorDistance($a, $b) {
  $dr = [double] $a.r - [double] $b.r
  $dg = [double] $a.g - [double] $b.g
  $db = [double] $a.b - [double] $b.b
  $dr * $dr + $dg * $dg + $db * $db
}

function BuildPalette($colors, [int] $maxColors) {
  $seen = [System.Collections.Generic.HashSet[string]]::new()
  $unique = [System.Collections.Generic.List[object]]::new()
  foreach ($rgb in $colors) {
    $hex = RgbToHex $rgb
    if ($seen.Add($hex)) { $unique.Add($rgb) }
  }
  if ($maxColors -eq 0 -or $unique.Count -le $maxColors) { return @($unique.ToArray()) }

  $centers = [System.Collections.Generic.List[object]]::new()
  for ($i = 0; $i -lt $maxColors; $i += 1) {
    $c = $unique[$i]
    $centers.Add([pscustomobject]@{ r = $c.r; g = $c.g; b = $c.b })
  }

  for ($iteration = 0; $iteration -lt 8; $iteration += 1) {
    $buckets = @()
    for ($i = 0; $i -lt $centers.Count; $i += 1) {
      $buckets += ,([System.Collections.Generic.List[object]]::new())
    }
    foreach ($color in $unique) {
      $bestIndex = 0
      $bestDistance = [double]::PositiveInfinity
      for ($i = 0; $i -lt $centers.Count; $i += 1) {
        $distance = ColorDistance $color $centers[$i]
        if ($distance -lt $bestDistance) {
          $bestIndex = $i
          $bestDistance = $distance
        }
      }
      $buckets[$bestIndex].Add($color)
    }
    for ($i = 0; $i -lt $buckets.Count; $i += 1) {
      if ($buckets[$i].Count -eq 0) { continue }
      $sr = 0
      $sg = 0
      $sb = 0
      foreach ($c in $buckets[$i]) {
        $sr += $c.r
        $sg += $c.g
        $sb += $c.b
      }
      $centers[$i] = [pscustomobject]@{
        r = [int] [Math]::Round($sr / $buckets[$i].Count)
        g = [int] [Math]::Round($sg / $buckets[$i].Count)
        b = [int] [Math]::Round($sb / $buckets[$i].Count)
      }
    }
  }

  $deduped = [System.Collections.Generic.HashSet[string]]::new()
  $result = [System.Collections.Generic.List[object]]::new()
  foreach ($center in $centers) {
    $quantized = QuantizeColor $center
    $hex = RgbToHex $quantized
    if ($deduped.Add($hex)) { $result.Add($quantized) }
  }
  @($result.ToArray())
}

function NearestColor($rgb, $palette) {
  $best = $palette[0]
  $bestDistance = [double]::PositiveInfinity
  foreach ($color in $palette) {
    $distance = ColorDistance $rgb $color
    if ($distance -lt $bestDistance) {
      $best = $color
      $bestDistance = $distance
    }
  }
  $best
}

$settings = [pscustomobject]@{
  cols = 15
  rows = 15
  maxColors = 3
  offsetX = 0
  offsetY = 0
  imageScale = 93
  brightness = -9
  contrast = 59
  saturation = 106
}

$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$imagePath = Join-Path $root "src\assets\level-1.png"
$fixedPath = Join-Path $root "src\assets\levels\fixed-levels.js"

$source = [System.Drawing.Bitmap]::FromFile($imagePath)
$canvasWidth = $settings.cols * 12
$canvasHeight = $settings.rows * 12
$canvas = [System.Drawing.Bitmap]::new($canvasWidth, $canvasHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.Clear([System.Drawing.Color]::White)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$fitScale = [Math]::Min($canvasWidth / $source.Width, $canvasHeight / $source.Height)
$drawScale = $fitScale * ($settings.imageScale / 100)
$drawWidth = $source.Width * $drawScale
$drawHeight = $source.Height * $drawScale
$drawX = ($canvasWidth - $drawWidth) / 2 + ($settings.offsetX / 100) * $canvasWidth * 0.5
$drawY = ($canvasHeight - $drawHeight) / 2 + ($settings.offsetY / 100) * $canvasHeight * 0.5
$graphics.DrawImage($source, [float] $drawX, [float] $drawY, [float] $drawWidth, [float] $drawHeight)

$cells = @()
$colors = [System.Collections.Generic.List[object]]::new()
$backgroundCutoff = 250
$minInkRatio = 0.008
$sampleSize = 12

for ($row = 0; $row -lt $settings.rows; $row += 1) {
  $rowCells = @()
  for ($col = 0; $col -lt $settings.cols; $col += 1) {
    $startX = $col * $sampleSize
    $startY = $row * $sampleSize
    $count = 0
    $r = 0
    $g = 0
    $b = 0

    for ($py = $startY; $py -lt $startY + $sampleSize; $py += 1) {
      for ($px = $startX; $px -lt $startX + $sampleSize; $px += 1) {
        $pixel = $canvas.GetPixel($px, $py)
        $isBackground = $pixel.A -lt 8 -or ($pixel.R -gt $backgroundCutoff -and $pixel.G -gt $backgroundCutoff -and $pixel.B -gt $backgroundCutoff)
        if ($isBackground) { continue }
        $adjusted = AdjustColor ([pscustomobject]@{ r = $pixel.R; g = $pixel.G; b = $pixel.B }) $settings
        $count += 1
        $r += $adjusted.r
        $g += $adjusted.g
        $b += $adjusted.b
      }
    }

    if ($count -eq 0 -or ($count / ($sampleSize * $sampleSize)) -lt $minInkRatio) {
      $rowCells += $null
      continue
    }

    $sampled = QuantizeColor ([pscustomobject]@{
      r = [int] [Math]::Round($r / $count)
      g = [int] [Math]::Round($g / $count)
      b = [int] [Math]::Round($b / $count)
    })
    $colors.Add($sampled)
    $rowCells += [pscustomobject]@{ rgb = $sampled }
  }
  $cells += ,$rowCells
}

$paletteRgb = BuildPalette $colors $settings.maxColors
$palette = @()
$paletteByHex = @{}
for ($i = 0; $i -lt $paletteRgb.Count; $i += 1) {
  $hex = RgbToHex $paletteRgb[$i]
  $key = "C{0:d2}" -f ($i + 1)
  $palette += [pscustomobject]@{ key = $key; color = $hex }
  $paletteByHex[$hex] = $key
}

$matrix = @()
foreach ($rowCells in $cells) {
  $outRow = @()
  foreach ($cell in $rowCells) {
    if ($null -eq $cell) {
      $outRow += $null
    } else {
      $matched = NearestColor $cell.rgb $paletteRgb
      $outRow += $paletteByHex[(RgbToHex $matched)]
    }
  }
  $matrix += ,$outRow
}

$level = [pscustomobject]@{
  id = "level-1"
  name = "关卡 1"
  sourceName = "level-1.png"
  sourceImage = "./assets/level-1.png"
  rows = 15
  cols = 15
  settings = $settings
  palette = $palette
  matrix = $matrix
  createdAt = (Get-Date).ToUniversalTime().ToString("o")
}

$content = Get-Content -Path $fixedPath -Raw -Encoding UTF8
$json = $content -replace "^window\.NEKO_FIXED_LEVELS\s*=\s*", "" -replace ";\s*$", ""
$data = $json | ConvertFrom-Json
$data.PSObject.Properties.Remove("1")
$data | Add-Member -MemberType NoteProperty -Name "1" -Value $level

$ordered = [ordered]@{}
1..10 | ForEach-Object {
  $key = [string] $_
  if ($data.PSObject.Properties.Name -contains $key) {
    $ordered[$key] = $data.$key
  }
}

$newJson = $ordered | ConvertTo-Json -Depth 100 -Compress
[System.IO.File]::WriteAllText($fixedPath, "window.NEKO_FIXED_LEVELS = " + $newJson + ";", [System.Text.UTF8Encoding]::new($false))

$graphics.Dispose()
$canvas.Dispose()
$source.Dispose()

$active = ($matrix | ForEach-Object { $_ } | Where-Object { $_ -ne $null }).Count
Write-Output "Regenerated level 1: palette=$($palette.Count), active=$active"
