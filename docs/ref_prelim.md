---
icon: lucide/sparkles
title: Zensical tips
---

#  Zensical tips and learnings

## Icon + Headers

It's nice to have an icon next to a title. So usually I try to use the default - [libraries](https://zensical.org/docs/authoring/icons-emojis/#included-icon-sets) - included by default and then search according to what you try to achieve with your section. What you want is the name of the icon. Then you can simply add this to the heading of our markdown file.

``` md title="Example to put into front matter section of .md file"
# You need to combine name of the library / name of the icon
---
icon: lucide/sparkles
title: Zensical tips
---

```


## Where is my title text defined

Titles can be adjusted in different ways - and some are ruling out others. 

1. The default is the first header in your .md file (#).
2. You can modify it through front matter (like shown above)
2. Explicit nav naming within the zensical.toml config file is authoritative



Perfect! Here's a concise, clear description of how the Zensical TOML configuration works—ready for your documentation:

***

## Understand TOML

Zensical moved from YAML to TOML as its configuration format. Understanding the basics of TOML's structure helps navigate the multitude of options and capabilities, which keep expanding.

**Tables** are the foundation of TOML structure. The entire Zensical configuration describes one large `[project]` table that contains all project settings.

```toml
[project]
name = "My Project"
description = "A showcase site"
```

**Declarations**: Key-value pairs that define settings within tables. Declarations use simple `key = value` syntax with explicit typing—strings require quotes, numbers don't:

```toml
[project]
site_name = "SWIYU Demo"    # String (quoted)
strict = true               # Boolean
```

**Nesting**: TOML supports multiple nesting approaches to organize hierarchical data:
```toml title="Dotted keys create subtables inline"
[project]
features.navigation_sections = true
features.toc_integrate = false
```

*Explicit subtables* use header notation for deeper structures (complex nesting):
```toml
[project.features]
navigation_sections = true
toc_integrate = false
```

*Arrays of tables* use double brackets for repeating structures like navigation items and plugin definitions:
```toml
[[project.plugins]]
name = "search"

[[project.plugins]]
name = "tags"
```


## Customisation

### Forced reload

!!! warning "zensical build / zensical serve"
    
    If you start working with overrides, extra.css and javascripts, ensure they are :
    1. In the right folders (overrides is at the same level than your zensical.toml ; I personally put all others into /docs/assets)
    2. More importantly : you need to force a clean re-build of zensical for the changes to be fully considered
    
``` zsh title="force clean zensical build"
# The default zensical serve is not enough
zensical build --clean        <--- this will force a reload
zensical serve
``` 
    
For troubleshooting purposes, don't hesitate to look into your browser ^^console/page source^^ to check if you desired changes are even taken into account. 

### Global env variables

I spent some time to find out how to handle this : I wanted to have a sort of .env logic on my site - therefore tried different ways to declare my own variables in the toml file. To cut it short : you have to put your declarations within `project.extra` at the very end of your toml file.

```toml title="These are my params/env/declarations"
# At the end of the toml file to avoid any conflicts
[project.extra]
variable_1= "string"
variable_2= "string"
variable_3= "string"
```

### html block override

It was tricky for me to get sorted with my overrides. One of the pitfalls you may want to avoid is how to fetch your above-mentioned global variables.

``` html title="main.html sitting in overrides folder"

{% extends "base.html" %}
{% block extrahead %}
  <script>
    window.YOUR_BLOCK = {
      variable_1: "{{ config.extra.variable_1 | default('') }}",
      variable_2: "{{ config.extra.variable_2 | default('') }}",
      variable_3: "{{ config.extra.variable_3 | default('') }}"   <-- no comma!
    };
  </script>
  {{ super() }}
{% endblock %}

```


The Zensical documentation is ususally very clear. But when you're designing your own site esp. with customisation and custom javascript/CSS/html code, it rarely works out of the box...

Eventually it is all good - you can really achieve this without breaking the theme. But for a low code developer like me - I definitely needed help of an AI (used Perlexity/Claude).
