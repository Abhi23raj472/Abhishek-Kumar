import base64
import os

FONT_DIR = '/home/user/fonts'
TPL = '/home/user/portfolio/index.template.html'
OUT = '/home/user/portfolio/index.html'
PDF = '/home/user/portfolio/Abhishek_Kumar_Resume.pdf'

FONTS = [
    ('Space Grotesk', 400, 'SpaceGrotesk-400.ttf'),
    ('Space Grotesk', 500, 'SpaceGrotesk-500.ttf'),
    ('Space Grotesk', 700, 'SpaceGrotesk-700.ttf'),
    ('Inter', 400, 'Inter-400.ttf'),
    ('Inter', 600, 'Inter-600.ttf'),
    ('Inter', 700, 'Inter-700.ttf'),
]

rules = []
for family, weight, filename in FONTS:
    path = os.path.join(FONT_DIR, filename)
    with open(path, 'rb') as f:
        data = base64.b64encode(f.read()).decode('ascii')
    rules.append(
        "@font-face{{font-family:'{family}';font-style:normal;font-weight:{weight};"
        "font-display:swap;src:url(data:font/ttf;base64,{data}) format('truetype');}}".format(
            family=family, weight=weight, data=data
        )
    )

fonts_css = '\n'.join(rules)

with open(PDF, 'rb') as f:
    pdf_b64 = base64.b64encode(f.read()).decode('ascii')

with open(TPL) as f:
    html = f.read()

assert '/*__FONTS__*/' in html, 'font token not found in template'
html = html.replace('/*__FONTS__*/', fonts_css)

assert "/*__PDF__*/" in html, 'pdf token not found in template'
html = html.replace("/*__PDF__*/", pdf_b64)

with open(OUT, 'w') as f:
    f.write(html)

print('built', OUT, '->', round(len(html) / 1024, 1), 'KB (PDF embedded:', round(len(pdf_b64)/1024,1), 'KB)')
