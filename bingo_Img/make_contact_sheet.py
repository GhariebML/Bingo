import os
from PIL import Image, ImageDraw, ImageFont
import glob

def create_contact_sheet(image_files, output_filename="contact_sheet.jpg"):
    # Target thumbnail size
    thumb_width, thumb_height = 320, 180
    cols = 5
    rows = (len(image_files) + cols - 1) // cols

    sheet_width = cols * thumb_width
    sheet_height = rows * (thumb_height + 30) # +30 for text

    contact_sheet = Image.new('RGB', (sheet_width, sheet_height), color='white')
    draw = ImageDraw.Draw(contact_sheet)
    
    # Try to load a font, otherwise default
    try:
        font = ImageFont.truetype("arial.ttf", 20)
    except:
        font = ImageFont.load_default()

    for idx, filepath in enumerate(image_files):
        try:
            img = Image.open(filepath)
            img.thumbnail((thumb_width, thumb_height))
            
            # Center thumbnail
            x = (idx % cols) * thumb_width + (thumb_width - img.width) // 2
            y = (idx // cols) * (thumb_height + 30) + (thumb_height - img.height) // 2
            
            contact_sheet.paste(img, (x, y))
            
            # Add filename text below
            filename = os.path.basename(filepath)
            text_x = (idx % cols) * thumb_width + 10
            text_y = (idx // cols) * (thumb_height + 30) + thumb_height + 5
            draw.text((text_x, text_y), filename[:25], fill="black", font=font)
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

    contact_sheet.save(output_filename)
    print(f"Saved {output_filename}")

if __name__ == "__main__":
    pngs = glob.glob("*.png")
    # Sort files naturally
    import re
    def tryint(s):
        try: return int(s)
        except ValueError: return s
    def alphanum_key(s):
        return [tryint(c) for c in re.split('([0-9]+)', s)]
    
    pngs.sort(key=alphanum_key)
    create_contact_sheet(pngs)
