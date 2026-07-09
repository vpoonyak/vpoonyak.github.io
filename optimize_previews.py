import os
from PIL import Image

def optimize_image(src_path, dest_path, max_width=1200, quality=75):
    try:
        with Image.open(src_path) as img:
            # Check size and resize if width > max_width
            w, h = img.size
            if w > max_width:
                ratio = max_width / float(w)
                new_h = int(float(h) * ratio)
                img = img.resize((max_width, new_h), Image.Resampling.LANCZOS)
                print(f"Resized {os.path.basename(src_path)} from {w}x{h} to {max_width}x{new_h}")
            
            # Save as webp
            img.save(dest_path, 'WEBP', quality=quality)
            
            old_size = os.path.getsize(src_path) / 1024
            new_size = os.path.getsize(dest_path) / 1024
            reduction = ((old_size - new_size) / old_size) * 100
            print(f"Optimized: {os.path.basename(src_path)} ({old_size:.1f} KB) -> {os.path.basename(dest_path)} ({new_size:.1f} KB) | Reduction: {reduction:.1f}%")
    except Exception as e:
        print(f"Error optimizing {src_path}: {e}")

def main():
    project_dir = 'public/project'
    if not os.path.exists(project_dir):
        print(f"Directory {project_dir} not found.")
        return

    # List of mappings: source screenshot -> output thumb webp
    # We locate original screenshots and convert them to optimized thumbs
    targets = [
        # (original, output_thumb)
        ('ddschatbot.png', 'ddschatbot-thumb.webp'),
        ('altit1.jpeg', 'altit1-thumb.webp'),
        ('bnk48.png', 'bnk48-thumb.webp'),
        ('cirrhosis.png', 'cirrhosis-thumb.webp'),
        ('hajjmens.png', 'hajjmens-thumb.webp'),
        ('hospcode.jpeg', 'hospcode-thumb.webp'),
        ('pm2-5.png', 'pm2-5-thumb.webp'),
        ('th-numeral.png', 'th-numeral-thumb.webp'),
        ('yfmalaria.png', 'yfmalaria-thumb.webp'),
        ('sichuan-yunnan.png', 'sichuan-yunnan-thumb.webp'),
        ('cda2558.png', 'cda2558-thumb.webp'),
        ('countries-tiny.png', 'countries-tiny-thumb.webp')
    ]

    for src_name, dest_name in targets:
        src_path = os.path.join(project_dir, src_name)
        dest_path = os.path.join(project_dir, dest_name)
        
        if os.path.exists(src_path):
            optimize_image(src_path, dest_path)
        else:
            print(f"Source file {src_path} does not exist, skipping.")

if __name__ == '__main__':
    main()
