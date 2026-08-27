#!/usr/bin/env python3
"""
Переводить PDF з public/media у WebP, щоб матеріали відкривалися просто
в браузері, без завантаження файлів і сторонніх переглядачів.

Оригінали переносяться в ~/Archives/slobidka/print-originals/ як майстри
для друку (шлях можна змінити змінною ORIGINALS_DIR).
Потребує: poppler (pdftoppm) і Pillow.

Запуск: python3 scripts/convert-pdfs.py
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "public" / "media"
# майстри для друку тримаємо поза репозиторієм, щоб не роздувати git
ORIGINALS = Path(
    os.environ.get("ORIGINALS_DIR", Path.home() / "Archives" / "slobidka" / "print-originals")
)
MAP_FILE = ROOT / "archive" / "wordpress-json" / "pdf-map.json"

# Афіші друкують — беремо роздільність друку. Скани документів зернисті,
# у 300 dpi вони важать більше за самі PDF, тож для них 200 dpi.
PROFILES = {
    "banners": {"dpi": 300, "quality": 88},
    "default": {"dpi": 200, "quality": 82},
}
THUMB_WIDTH = 1000
THUMB_QUALITY = 78


def profile_for(rel: Path) -> dict:
    return PROFILES["banners"] if rel.parts[0] == "banners" else PROFILES["default"]


def convert(pdf: Path, tmp: Path) -> list[str]:
    rel = pdf.relative_to(MEDIA)
    prof = profile_for(rel)
    stem = pdf.with_suffix("")

    prefix = tmp / rel.stem
    subprocess.run(
        ["pdftoppm", "-r", str(prof["dpi"]), "-png", str(pdf), str(prefix)],
        check=True, capture_output=True,
    )
    pages = sorted(tmp.glob(f"{rel.stem}-*.png"))
    if not pages:
        raise RuntimeError(f"не вдалося розкласти на сторінки: {pdf}")

    out = []
    for i, page in enumerate(pages, start=1):
        im = Image.open(page).convert("RGB")
        name = f"{stem.name}.webp" if len(pages) == 1 else f"{stem.name}-{i}.webp"
        dest = pdf.parent / name
        im.save(dest, "WEBP", quality=prof["quality"], method=6)
        out.append("/" + str(dest.relative_to(ROOT / "public")))

        # прев'ю для галереї — лише для першої сторінки
        if i == 1 and im.width > THUMB_WIDTH:
            th = im.copy()
            th.thumbnail((THUMB_WIDTH, THUMB_WIDTH * 4), Image.LANCZOS)
            th.save(pdf.parent / f"{stem.name}-thumb.webp", "WEBP",
                    quality=THUMB_QUALITY, method=6)
        page.unlink()
    return out


def main() -> int:
    if shutil.which("pdftoppm") is None:
        print("потрібен pdftoppm (poppler)", file=sys.stderr)
        return 1

    ORIGINALS.mkdir(parents=True, exist_ok=True)
    tmp = ROOT / ".pdf-tmp"
    tmp.mkdir(exist_ok=True)

    mapping: dict[str, list[str]] = {}
    before = after = 0

    for pdf in sorted(MEDIA.rglob("*.pdf")):
        rel = pdf.relative_to(MEDIA)
        src_size = pdf.stat().st_size
        images = convert(pdf, tmp)
        out_size = sum((ROOT / "public" / p.lstrip("/")).stat().st_size for p in images)

        mapping["/media/" + str(rel)] = images
        before += src_size
        after += out_size

        # оригінал -> в архів, з публікації прибираємо
        dest = ORIGINALS / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(pdf), dest)

        print(f"{src_size/1048576:7.2f} -> {out_size/1048576:6.2f} МБ  "
              f"{len(images):2} стор.  {rel}")

    shutil.rmtree(tmp, ignore_errors=True)
    MAP_FILE.parent.mkdir(parents=True, exist_ok=True)
    MAP_FILE.write_text(json.dumps(mapping, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"\nразом: {before/1048576:.1f} -> {after/1048576:.1f} МБ")
    print(f"мапу збережено: {MAP_FILE.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
