param(
    [string]$SourcePath
)

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies 'System.Drawing' -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class LevelEntryElementExtractor
{
    private static double Distance(Color a, Color b)
    {
        int dr = a.R - b.R;
        int dg = a.G - b.G;
        int db = a.B - b.B;
        return Math.Sqrt((dr * dr) + (dg * dg) + (db * db));
    }

    private static bool IsEdgeBackground(Color color, Color[] samples, int tolerance)
    {
        foreach (Color sample in samples)
        {
            if (Distance(color, sample) <= tolerance) return true;
        }
        return false;
    }

    private static Color Pixel(byte[] data, int width, int x, int y)
    {
        int i = ((y * width) + x) * 4;
        return Color.FromArgb(data[i + 3], data[i + 2], data[i + 1], data[i]);
    }

    public static string Export(Bitmap source, Rectangle rect, int tolerance, string outputPath)
    {
        using (Bitmap crop = source.Clone(rect, PixelFormat.Format32bppArgb))
        {
            int width = crop.Width;
            int height = crop.Height;
            Rectangle full = new Rectangle(0, 0, width, height);
            BitmapData bits = crop.LockBits(full, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            int stride = bits.Stride;
            byte[] raw = new byte[stride * height];
            Marshal.Copy(bits.Scan0, raw, 0, raw.Length);

            Color[] samples = new Color[] {
                Pixel(raw, width, 0, 0),
                Pixel(raw, width, width - 1, 0),
                Pixel(raw, width, 0, height - 1),
                Pixel(raw, width, width - 1, height - 1)
            };

            bool[,] visited = new bool[width, height];
            Queue<Point> queue = new Queue<Point>();
            for (int x = 0; x < width; x++)
            {
                queue.Enqueue(new Point(x, 0));
                queue.Enqueue(new Point(x, height - 1));
            }
            for (int y = 0; y < height; y++)
            {
                queue.Enqueue(new Point(0, y));
                queue.Enqueue(new Point(width - 1, y));
            }

            while (queue.Count > 0)
            {
                Point p = queue.Dequeue();
                if (p.X < 0 || p.X >= width || p.Y < 0 || p.Y >= height || visited[p.X, p.Y]) continue;
                visited[p.X, p.Y] = true;
                int i = (p.Y * stride) + (p.X * 4);
                Color color = Color.FromArgb(raw[i + 3], raw[i + 2], raw[i + 1], raw[i]);
                if (!IsEdgeBackground(color, samples, tolerance)) continue;

                raw[i + 3] = 0;
                queue.Enqueue(new Point(p.X + 1, p.Y));
                queue.Enqueue(new Point(p.X - 1, p.Y));
                queue.Enqueue(new Point(p.X, p.Y + 1));
                queue.Enqueue(new Point(p.X, p.Y - 1));
            }

            Marshal.Copy(raw, 0, bits.Scan0, raw.Length);
            crop.UnlockBits(bits);

            int minX = width, minY = height, maxX = -1, maxY = -1;
            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    int i = (y * stride) + (x * 4);
                    if (raw[i + 3] > 45)
                    {
                        if (x < minX) minX = x;
                        if (y < minY) minY = y;
                        if (x > maxX) maxX = x;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            if (maxX < 0) return outputPath + ": empty";
            minX = Math.Max(0, minX - 2);
            minY = Math.Max(0, minY - 2);
            maxX = Math.Min(width - 1, maxX + 2);
            maxY = Math.Min(height - 1, maxY + 2);

            Rectangle tightRect = new Rectangle(minX, minY, maxX - minX + 1, maxY - minY + 1);
            using (Bitmap tight = crop.Clone(tightRect, PixelFormat.Format32bppArgb))
            {
                tight.SetResolution(300, 300);
                tight.Save(outputPath, ImageFormat.Png);
                return System.IO.Path.GetFileNameWithoutExtension(outputPath) + ": " + tight.Width + "x" + tight.Height;
            }
        }
    }
}
'@

if (-not $SourcePath) {
    $SourcePath = (Get-ChildItem 'C:\Users\Administrator\Desktop' -Filter '*.png' |
        Where-Object { $_.Name -like '*入口界面.png' } |
        Select-Object -First 1 -ExpandProperty FullName)
}

if (-not $SourcePath -or -not (Test-Path $SourcePath)) {
    throw 'Source PNG was not found. Pass -SourcePath with the original image path.'
}

$outputDir = Join-Path (Resolve-Path '.').Path 'assets\design\level-entry-elements'

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Force $outputDir | Out-Null
}

$items = @(
    @{ Name = '01-title-neko-can-shop-logo'; X = 290; Y = 290; W = 920; H = 320; Tol = 25 },
    @{ Name = '02-level-1-black-bean-can-complete'; X = 295; Y = 625; W = 640; H = 390; Tol = 25 },
    @{ Name = '03-level-2-tuna-cat-can'; X = 305; Y = 1000; W = 450; H = 440; Tol = 25 },
    @{ Name = '04-level-3-lunch-meat-can'; X = 305; Y = 1435; W = 490; H = 350; Tol = 25 },
    @{ Name = '05-level-4-cat-can-locked'; X = 305; Y = 1755; W = 460; H = 460; Tol = 25 },
    @{ Name = '06-right-black-cat-mascot'; X = 975; Y = 1190; W = 390; H = 500; Tol = 25 },
    @{ Name = '07-side-gift-icon'; X = 1195; Y = 630; W = 245; H = 230; Tol = 25 },
    @{ Name = '08-side-shop-cart-icon'; X = 1190; Y = 910; W = 255; H = 230; Tol = 25 },
    @{ Name = '09-top-coin-counter'; X = 545; Y = 100; W = 400; H = 140; Tol = 25 },
    @{ Name = '10-top-settings-button'; X = 1255; Y = 50; W = 240; H = 235; Tol = 25 }
)

function New-TransparentBitmap($width, $height) {
    $bitmap = New-Object System.Drawing.Bitmap -ArgumentList @($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $bitmap.SetResolution(300, 300)
    return $bitmap
}

function Color-Distance($a, $b) {
    $dr = [int]$a.R - [int]$b.R
    $dg = [int]$a.G - [int]$b.G
    $db = [int]$a.B - [int]$b.B
    return [Math]::Sqrt(($dr * $dr) + ($dg * $dg) + ($db * $db))
}

function Is-EdgeBackground($color, $samples, $tolerance) {
    foreach ($sample in $samples) {
        if ((Color-Distance $color $sample) -le $tolerance) {
            return $true
        }
    }
    return $false
}

function Push-Point($queue, $x, $y) {
    $queue.Enqueue([object[]]@([int]$x, [int]$y))
}

function Export-Element($source, $item) {
    $rect = New-Object System.Drawing.Rectangle -ArgumentList @($item.X, $item.Y, $item.W, $item.H)
    $path = Join-Path $outputDir ($item.Name + '.png')
    Write-Output ([LevelEntryElementExtractor]::Export($source, $rect, $item.Tol, $path))
}

$source = New-Object System.Drawing.Bitmap -ArgumentList $SourcePath
try {
    foreach ($item in $items) {
        Export-Element $source $item
    }
}
finally {
    $source.Dispose()
}
