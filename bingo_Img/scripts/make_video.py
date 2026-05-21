from __future__ import annotations

import json
import math
from pathlib import Path

import cv2
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

try:
    import arabic_reshaper
    from bidi.algorithm import get_display
except ImportError as exc:
    raise SystemExit(
        "Missing Arabic subtitle dependencies. Run: "
        "python -m pip install arabic-reshaper python-bidi"
    ) from exc


ROOT = Path(__file__).resolve().parents[1]
PACKAGE = ROOT / "right_ocean_animation_video_package"
EXPORTS = ROOT / "exports"
OUTPUT = EXPORTS / "bingo_right_ocean_leadership.mp4"
INTERMEDIATE_OUTPUT = EXPORTS / "bingo_right_ocean_leadership_intermediate.mp4"
FINAL_OUTPUT = EXPORTS / "Bingo_Right_Ocean_Leadership_FINAL.mp4"

WIDTH = 1280
HEIGHT = 720
FPS = 24
SCENE_SECONDS = 10
TRANSITION_FRAMES = 18


SCENE_IMAGES = {
    1: "1.png",
    2: "2.png",
    3: "3.png",
    4: "4.png",
    5: "5.png",
    6: "6.png",
    7: "8f14172d-d2e3-45a7-a559-9ae85064dca8.png",
    8: "8.png",
    9: "666.png",
    10: "10.png",
    11: "11.png",
    12: "13.png",
    13: "14.png",
    14: "15.png",
    15: "333.png",
    16: "489d2f39-a660-4280-b98c-cb484488ba27.png",
    17: "111.png",
    18: "14.png",
}


def load_font(size: int) -> ImageFont.FreeTypeFont:
    candidates = [
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/tahoma.ttf"),
        Path("C:/Windows/Fonts/segoeui.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


FONT_DIALOGUE = load_font(36)
FONT_SPEAKER = load_font(28)
FONT_TITLE = load_font(56)
FONT_SUBTITLE = load_font(34)


def rtl(text: str) -> str:
    return get_display(arabic_reshaper.reshape(text))


def draw_centered_text(
    draw: ImageDraw.ImageDraw,
    y: int,
    text: str,
    font: ImageFont.ImageFont,
    fill: tuple[int, int, int, int],
    stroke_fill: tuple[int, int, int, int] | None = None,
    stroke_width: int = 0,
) -> int:
    bbox = draw.textbbox((0, 0), text, font=font, stroke_width=stroke_width)
    x = (WIDTH - (bbox[2] - bbox[0])) // 2
    draw.text(
        (x, y),
        text,
        font=font,
        fill=fill,
        stroke_fill=stroke_fill,
        stroke_width=stroke_width,
    )
    return y + (bbox[3] - bbox[1])


def wrap_visual_line(text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    probe = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    for word in words:
        candidate = f"{current} {word}".strip()
        visual = rtl(candidate)
        width = probe.textbbox((0, 0), visual, font=font)[2]
        if width <= max_width or not current:
            current = candidate
        else:
            lines.append(rtl(current))
            current = word
    if current:
        lines.append(rtl(current))
    return lines


def make_base_frame(
    image_path: Path,
    scene_index: int,
    frame_index: int,
    total_frames: int,
    zoom_boost: float = 0.0,
) -> Image.Image:
    source = Image.open(image_path).convert("RGB")
    source_ratio = source.width / source.height
    target_ratio = WIDTH / HEIGHT

    if source_ratio > target_ratio:
        resized_height = HEIGHT
        resized_width = int(HEIGHT * source_ratio)
    else:
        resized_width = WIDTH
        resized_height = int(WIDTH / source_ratio)

    source = source.resize((resized_width, resized_height), Image.Resampling.LANCZOS)

    progress = frame_index / max(total_frames - 1, 1)
    ease = 0.5 - 0.5 * math.cos(progress * math.pi)
    zoom = 1.0 + 0.065 * ease + zoom_boost
    crop_w = int(WIDTH / zoom)
    crop_h = int(HEIGHT / zoom)

    max_x = max(resized_width - crop_w, 0)
    max_y = max(resized_height - crop_h, 0)
    direction = -1 if scene_index % 2 else 1
    pan_x = 0.5 + direction * 0.08 * math.sin(progress * math.pi)
    pan_y = 0.5 + 0.04 * math.sin((progress + 0.15) * math.pi)

    left = int(max_x * min(max(pan_x, 0), 1))
    top = int(max_y * min(max(pan_y, 0), 1))
    frame = source.crop((left, top, left + crop_w, top + crop_h))
    frame = frame.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    return frame


def add_motion_effects(frame: Image.Image, scene_no: int, frame_index: int, total_frames: int) -> Image.Image:
    progress = frame_index / max(total_frames - 1, 1)
    t = progress * SCENE_SECONDS
    frame = frame.convert("RGBA")
    overlay = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    if scene_no in {1, 2, 3, 6, 16, 17}:
        # Small animated bird silhouettes to keep the sky alive.
        for i in range(6):
            x = int((WIDTH + 160 - ((t * (42 + i * 7)) + i * 210) % (WIDTH + 320)) - 160)
            y = 58 + ((i * 37 + int(t * 11)) % 150)
            scale = 8 + (i % 3) * 3
            alpha = 65 + i * 16
            draw.arc((x - scale, y - scale // 2, x, y + scale // 2), 190, 350, fill=(24, 31, 37, alpha), width=2)
            draw.arc((x, y - scale // 2, x + scale, y + scale // 2), 190, 350, fill=(24, 31, 37, alpha), width=2)

    if scene_no in {4, 7, 10, 13}:
        # Motion streaks sell the jump/swim energy.
        for i in range(10):
            x = int((i * 157 + t * 220) % (WIDTH + 260)) - 180
            y = 120 + (i * 53) % 440
            draw.line((x, y, x + 115, y - 18), fill=(255, 255, 255, 42), width=3)

    if scene_no in {5, 7}:
        # Ground impact dust.
        for i in range(18):
            phase = (progress * 1.4 + i * 0.037) % 1
            x = int(WIDTH * 0.32 + math.cos(i) * 210 * phase)
            y = int(HEIGHT * 0.70 + math.sin(i * 1.7) * 38 * phase)
            r = int(14 + 34 * phase)
            alpha = int(96 * (1 - phase))
            draw.ellipse((x - r, y - r // 2, x + r, y + r // 2), fill=(196, 163, 119, alpha))

    if scene_no == 10:
        # Falling scene: a soft vignette and diagonal speed imply movement.
        for i in range(12):
            x = int((i * 145 - t * 320) % (WIDTH + 280)) - 120
            draw.line((x, 60, x + 180, HEIGHT - 60), fill=(255, 226, 176, 35), width=4)

    if scene_no >= 11:
        # Underwater atmosphere: bubbles, light rays, blue wash.
        draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 80, 130, 34))
        for i in range(42):
            x = int((i * 97 + math.sin(t * 0.7 + i) * 28) % WIDTH)
            y = int((HEIGHT + 50 - ((t * (42 + i % 7 * 8)) + i * 61) % (HEIGHT + 120)))
            r = 3 + (i % 5) * 2
            alpha = 52 + (i % 4) * 18
            draw.ellipse((x - r, y - r, x + r, y + r), outline=(210, 245, 255, alpha), width=2)
        for i in range(7):
            x = -120 + i * 240 + int(math.sin(t * 0.35 + i) * 35)
            draw.polygon(
                [(x, 0), (x + 78, 0), (x + 260, HEIGHT), (x + 120, HEIGHT)],
                fill=(185, 236, 255, 18),
            )

    if scene_no == 13:
        # Hero swim spiral.
        cx, cy = int(WIDTH * 0.43), int(HEIGHT * 0.52)
        for i in range(7):
            radius = int(95 + i * 24 + math.sin(t * 2 + i) * 10)
            box = (cx - radius, cy - radius // 2, cx + radius, cy + radius // 2)
            start = int((t * 75 + i * 24) % 360)
            draw.arc(box, start, start + 80, fill=(255, 255, 255, 72), width=4)

    if scene_no == 18:
        # Final scene glow builds gradually.
        alpha = int(115 * min(max((progress - 0.12) / 0.45, 0), 1))
        draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 88, 130, alpha // 3))
        for i in range(18):
            y = int(80 + i * 34 + math.sin(t * 0.8 + i) * 8)
            draw.line((0, y, WIDTH, y + 18), fill=(128, 226, 255, 18), width=2)

    frame = Image.alpha_composite(frame, overlay)

    if scene_no in {5, 7, 10}:
        # Controlled camera shake on failure/fall beats.
        strength = 6 if scene_no != 10 else 9
        dx = int(math.sin(t * 31) * strength * (1 - min(progress, 0.75)))
        dy = int(math.cos(t * 27) * strength * (1 - min(progress, 0.75)))
        shifted = Image.new("RGBA", frame.size, (0, 0, 0, 255))
        shifted.alpha_composite(frame, (dx, dy))
        frame = shifted

    return frame.convert("RGB")


def add_overlays(frame: Image.Image, scene: dict, is_final_scene: bool, progress: float) -> Image.Image:
    overlay = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Subtitle plate.
    plate_top = HEIGHT - 168
    draw.rounded_rectangle(
        (112, plate_top, WIDTH - 112, HEIGHT - 38),
        radius=18,
        fill=(0, 0, 0, 148),
    )

    speaker = rtl(str(scene.get("speaker", "")).replace("/", " / "))
    dialogue = str(scene.get("dialogue", "")).replace("\r\n", "\n")
    draw_centered_text(draw, plate_top + 16, speaker, FONT_SPEAKER, (255, 217, 105, 255))

    y = plate_top + 54
    for raw_line in dialogue.split("\n"):
        for line in wrap_visual_line(raw_line, FONT_DIALOGUE, WIDTH - 300):
            y = draw_centered_text(
                draw,
                y,
                line,
                FONT_DIALOGUE,
                (255, 255, 255, 255),
                stroke_fill=(0, 0, 0, 230),
                stroke_width=2,
            ) + 4

    # Small scene counter.
    badge = f"{scene['scene']:02d}/18"
    draw.rounded_rectangle((32, 26, 128, 68), radius=12, fill=(0, 0, 0, 120))
    draw.text((54, 34), badge, font=FONT_SPEAKER, fill=(255, 255, 255, 230))

    if is_final_scene:
        title_alpha = int(255 * min(max((progress - 0.16) / 0.32, 0), 1))
        top_glow = Image.new("RGBA", frame.size, (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(top_glow)
        glow_draw.rectangle((0, 0, WIDTH, 260), fill=(0, 48, 82, int(118 * title_alpha / 255)))
        top_glow = top_glow.filter(ImageFilter.GaussianBlur(12))
        overlay.alpha_composite(top_glow)
        draw = ImageDraw.Draw(overlay)
        draw_centered_text(
            draw,
            58,
            "The Right Ocean Leadership",
            FONT_TITLE,
            (255, 255, 255, title_alpha),
            stroke_fill=(0, 37, 63, title_alpha),
            stroke_width=2,
        )
        draw_centered_text(
            draw,
            132,
            "Find Your Ocean, Then Lead From It",
            FONT_SUBTITLE,
            (176, 233, 255, title_alpha),
            stroke_fill=(0, 37, 63, title_alpha),
            stroke_width=1,
        )

    return Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")


def rendered_scene_frame(scene: dict, frame_index: int, total_frames: int) -> Image.Image:
    scene_no = int(scene["scene"])
    image_path = ROOT / SCENE_IMAGES[scene_no]
    progress = frame_index / max(total_frames - 1, 1)
    frame = make_base_frame(image_path, scene_no, frame_index, total_frames)
    frame = add_motion_effects(frame, scene_no, frame_index, total_frames)
    return add_overlays(frame, scene, scene_no == 18, progress)


def transcode_to_compatible_mp4(source: Path, destination: Path) -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    command = [
        ffmpeg,
        "-y",
        "-i",
        str(source),
        "-f",
        "lavfi",
        "-i",
        "anullsrc=channel_layout=stereo:sample_rate=48000",
        "-shortest",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-profile:v",
        "baseline",
        "-level",
        "3.1",
        "-preset",
        "medium",
        "-crf",
        "20",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        str(destination),
    ]
    import subprocess

    subprocess.run(command, check=True)


def main() -> None:
    EXPORTS.mkdir(exist_ok=True)
    scenes = json.loads((PACKAGE / "video_scenes.json").read_text(encoding="utf-8"))
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(str(INTERMEDIATE_OUTPUT), fourcc, FPS, (WIDTH, HEIGHT))
    if not writer.isOpened():
        raise SystemExit("OpenCV could not create the MP4 writer.")

    frames_per_scene = FPS * SCENE_SECONDS
    try:
        for scene_index, scene in enumerate(scenes):
            scene_no = int(scene["scene"])
            image_name = SCENE_IMAGES[scene_no]
            image_path = ROOT / image_name
            if not image_path.exists():
                raise FileNotFoundError(image_path)

            for i in range(frames_per_scene):
                frame = rendered_scene_frame(scene, i, frames_per_scene)
                if scene_index > 0 and i < TRANSITION_FRAMES:
                    previous = scenes[scene_index - 1]
                    prev_frame_index = frames_per_scene - TRANSITION_FRAMES + i
                    prev_frame = rendered_scene_frame(previous, prev_frame_index, frames_per_scene)
                    alpha = (i + 1) / TRANSITION_FRAMES
                    frame = Image.blend(prev_frame, frame, alpha)
                writer.write(cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR))
            print(f"Rendered scene {scene_no:02d}: {image_name}")
    finally:
        writer.release()

    transcode_to_compatible_mp4(INTERMEDIATE_OUTPUT, FINAL_OUTPUT)
    OUTPUT.write_bytes(FINAL_OUTPUT.read_bytes())
    print(f"Saved {FINAL_OUTPUT}")
    print(f"Updated {OUTPUT}")


if __name__ == "__main__":
    main()
