"""Compress large WebP images and convert PNG logos to WebP."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PICS = ROOT / "asset" / "pics"
ASSET = ROOT / "asset"

TARGET_FILES = [
    "Orthomedix Final Design 1_0.webp",
    "Orthomedix Final Design 2_0.webp",
    "Orthomedix Final Design 3_0.webp",
    "Hako-10_0.webp",
    "Hako-12_0.webp",
    "HAKO64541_0.webp",
    "Brand Guidelines 1.0_0_png.webp",
]

LOGOS = [
    "creatrex logo-01_0.png",
    "creatrex logo-02_0.png",
]

MAX_WIDTH = 1200
TARGET_BYTES = 280_000


def compress_webp(path: Path) -> None:
    img = Image.open(path)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.getbands() else "RGB")

    w, h = img.size
    if w > MAX_WIDTH:
        ratio = MAX_WIDTH / w
        img = img.resize((MAX_WIDTH, max(1, round(h * ratio))), Image.Resampling.LANCZOS)

    for quality in (82, 75, 68, 60, 52, 45):
        img.save(path, "WEBP", quality=quality, method=6)
        size = path.stat().st_size
        if size <= TARGET_BYTES:
            print(f"  {path.name}: {size // 1024}KB (q={quality})")
            return

    print(f"  {path.name}: {path.stat().st_size // 1024}KB (min quality)")


def convert_logo(png_path: Path) -> Path:
    webp_path = png_path.with_suffix(".webp")
    img = Image.open(png_path)
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    img.save(webp_path, "WEBP", quality=90, method=6)
    print(f"  {png_path.name} -> {webp_path.name} ({webp_path.stat().st_size // 1024}KB)")
    return webp_path


def main():
    print("Compressing large images...")
    for name in TARGET_FILES:
        path = PICS / name
        if path.exists():
            before = path.stat().st_size // 1024
            compress_webp(path)
            after = path.stat().st_size // 1024
            print(f"    {before}KB -> {after}KB")
        else:
            print(f"  MISSING: {name}")

    print("\nConverting logos to WebP...")
    for name in LOGOS:
        path = ASSET / name
        if path.exists():
            convert_logo(path)
        else:
            print(f"  MISSING: {name}")


if __name__ == "__main__":
    main()
