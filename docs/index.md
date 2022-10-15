
Vollständige Doku auf [mkdocs.org](https://www.mkdocs.org) und [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

## Installation
Um MkDocs zu installieren muss Python 3.8 oder neuer einschließlich pip installiert sein. MkDocs und MaterialTheme dann einfach wie folgt installieren:
```Bash
pip install mkdocs
pip install mkdocs-material
```

## Commands
!!! warning "Windows"
    Auf Windows kann es unter Umständen notwendig sein, vor allen mkdocs-Befehlen `python -m` zu schreiben, also z.b. `python -m mkdocs serve`.

* `mkdocs serve` - Start the live-reloading docs server.
* `mkdocs build` - Build the documentation site.
* `mkdocs -h` - Print help message and exit.
* `mkdocs gh-deploy` - Pusht die Doku auf unsere Github-Pages.

## Project layout
Für den Anfang Doku-spezifische Markdown-Files in den `/docs`-Ordner, die zugehörigen Bilder in den `/docs/imgs`. Weitere Strukturierung gerne nach Bedarf.

    mkdocs.yml    # The configuration file.
    docs/
        index.md  # The documentation homepage.
        ...       # Other markdown pages, images and other files.
        imgs/
            ...   

!!! note "Pfade"
    Pfade z.b. zu Bildern starten immer ausgehend von den md-files, in die sie eingefügt werden sollen. Editor/IDE mag ggf. von project-source vorschlagen, was in der Editor-Preview dann auch klappt, aber in der Webseitendarstellung dann halt nicht mehr.

Zusätzliche Seiten müssen in der `mkdocs.yml` unter `nav:` eingetragen werden, genauso wie evtl. gewünschte Plugins. Tendenziell bringt das  Material-Theme schon ordentlich Plugins mit, die dann nicht zusätzlich installiert werden müssen, daher im Idealfall erst mal da in der Doku schauen.
