import os
import re

def add_og_tags_to_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip index.html or if og:image is already present
    if 'index.html' in file_path or 'og:image' in content:
        print(f"Skipping {os.path.basename(file_path)} (already has OG tags or index.html)")
        return

    # Extract title
    title_match = re.search(r'<title>(.*?)</title>', content)
    title = title_match.group(1) if title_match else ""

    # Extract description
    desc_match = re.search(r'<meta name="description" content="(.*?)">', content)
    desc = desc_match.group(1) if desc_match else ""

    # Extract canonical URL
    canonical_match = re.search(r'<link rel="canonical" href="(.*?)">', content)
    canonical = canonical_match.group(1) if canonical_match else ""

    # Determine image based on file name
    file_name = os.path.basename(file_path)
    base_name = file_name.replace('.html', '')
    
    # Custom mappings if name doesn't match baseline
    image_map = {
        'altit': 'altit1-thumb.webp',
        'bnk48': 'bnk48-thumb.webp',
        'cda2558': 'cda2558-thumb.webp',
        'cirrhosis': 'cirrhosis-thumb.webp',
        'countries-tiny': 'countries-tiny-thumb.webp',
        'ddschatbot': 'ddschatbot-thumb.webp',
        'hajjmens': 'hajjmens-thumb.webp',
        'hospcode': 'hospcode-thumb.webp',
        'pm2-5': 'pm2-5-thumb.webp',
        'sichuan-yunnan': 'sichuan-yunnan-thumb.webp',
        'th-numeral': 'th-numeral-thumb.webp',
        'yfmalaria': 'yfmalaria-thumb.webp'
    }
    
    image_name = image_map.get(base_name, f"{base_name}-thumb.webp")
    image_url = f"https://vitchakorn.com/project/{image_name}"

    # Construct OG and Twitter card tags
    og_tags = f"""  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="{image_url}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="{image_url}">"""

    # Insert tags before </head> or after canonical
    if '<link rel="canonical"' in content:
        # Find where the canonical link tag ends and insert after it
        new_content = re.sub(
            r'(<link rel="canonical"[^>]*>)',
            r'\1\n' + og_tags,
            content,
            count=1
        )
    else:
        # Fallback to inserting before </head>
        new_content = content.replace('</head>', og_tags + '\n</head>')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Added OG tags to {os.path.basename(file_path)} with image {image_name}")

def main():
    project_dir = 'public/project'
    if not os.path.exists(project_dir):
        print(f"Directory {project_dir} not found.")
        return

    for file_name in os.listdir(project_dir):
        if file_name.endswith('.html'):
            file_path = os.path.join(project_dir, file_name)
            add_og_tags_to_file(file_path)

if __name__ == '__main__':
    main()
